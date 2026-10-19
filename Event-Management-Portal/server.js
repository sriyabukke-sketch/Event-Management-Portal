
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

const db = new sqlite3.Database(
  path.join(__dirname, "events.db")
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      event_date TEXT NOT NULL,
      venue TEXT NOT NULL,
      capacity INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      UNIQUE(event_id, email),
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM events", (err, row) => {
    if (err) return console.error(err.message);

    if (row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO events
        (title, description, event_date, venue, capacity)
        VALUES (?, ?, ?, ?, ?)
      `);

      stmt.run(
        "Tech Innovation Summit",
        "Explore technology and innovation.",
        "2027-02-15",
        "Chennai Trade Centre",
        120
      );

      stmt.run(
        "Creative Design Workshop",
        "Learn modern UI and UX design.",
        "2027-03-08",
        "Chennai Innovation Hub",
        45
      );

      stmt.run(
        "Startup Networking Meetup",
        "Meet founders and share ideas.",
        "2027-04-12",
        "Tidel Park, Chennai",
        80
      );

      stmt.finalize();
    }
  });
});

// GET: display all events and their available seats
app.get("/api/events", (req, res) => {
  const sql = `
    SELECT e.*,
      COUNT(r.id) AS registered,
      MAX(e.capacity - COUNT(r.id), 0) AS seats_left
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    GROUP BY e.id
    ORDER BY e.event_date
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST: create a new event
app.post("/api/events", (req, res) => {
  const { title, description, event_date, venue, capacity } = req.body;
  const cap = Number(capacity);

  if (
    typeof title !== "string" || !title.trim() || title.length > 100 ||
    typeof description !== "string" || !description.trim() ||
    description.length > 1000 ||
    typeof event_date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(event_date) ||
    typeof venue !== "string" || !venue.trim() || venue.length > 160 ||
    !Number.isInteger(cap) || cap < 1 || cap > 100000
  ) {
    return res.status(400).json({ error: "Invalid event details." });
  }

  db.run(
    `INSERT INTO events
     (title, description, event_date, venue, capacity)
     VALUES (?, ?, ?, ?, ?)`,
    [title.trim(), description.trim(), event_date, venue.trim(), cap],
    function (err) {
      if (err) return res.status(500).json({ error: "Could not create event." });
      res.status(201).json({
        message: "Event created successfully.",
        id: this.lastID
      });
    }
  );
});

// POST: register an attendee
app.post("/api/registrations", (req, res) => {
  const { event_id, name, email } = req.body;
  const id = Number(event_id);
  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (
    !Number.isInteger(id) || id < 1 ||
    !cleanName || cleanName.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    cleanEmail.length > 254
  ) {
    return res.status(400).json({ error: "Enter a valid name and email." });
  }

  db.get(
    "SELECT * FROM events WHERE id = ?",
    [id],
    (err, event) => {
      if (err) return res.status(500).json({ error: "Database error." });
      if (!event) return res.status(404).json({ error: "Event not found." });

      db.get(
        "SELECT COUNT(*) AS count FROM registrations WHERE event_id = ?",
        [id],
        (countErr, row) => {
          if (countErr) return res.status(500).json({ error: "Database error." });

          if (row.count >= event.capacity) {
            return res.status(409).json({ error: "Event is full." });
          }

          db.run(
            `INSERT INTO registrations (event_id, name, email)
             VALUES (?, ?, ?)`,
            [id, cleanName, cleanEmail],
            function (insertErr) {
              if (insertErr) {
                if (insertErr.message.includes("UNIQUE")) {
                  return res.status(409).json({
                    error: "This email is already registered for this event."
                  });
                }
                return res.status(500).json({ error: "Registration failed." });
              }

              res.status(201).json({
                message: "Registration successful!"
              });
            }
          );
        }
      );
    }
  );
});

// GET: view all attendee registrations
app.get("/api/registrations", (req, res) => {
  db.all(
    `SELECT r.id, r.name, r.email, e.title AS event_title,
            e.event_date
     FROM registrations r
     JOIN events e ON e.id = r.event_id
     ORDER BY r.id DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// DELETE: remove an event and its registrations
app.delete("/api/events/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid event ID." });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run(
      "DELETE FROM registrations WHERE event_id = ?",
      [id],
      err => {
        if (err) {
          return db.run("ROLLBACK", () =>
            res.status(500).json({ error: "Could not delete registrations." })
          );
        }

        db.run("DELETE FROM events WHERE id = ?", [id], function (deleteErr) {
          if (deleteErr || this.changes === 0) {
            return db.run("ROLLBACK", () => {
              res.status(deleteErr ? 500 : 404).json({
                error: deleteErr ? "Could not delete event." : "Event not found."
              });
            });
          }

          db.run("COMMIT", commitErr => {
            if (commitErr) {
              return db.run("ROLLBACK", () =>
                res.status(500).json({ error: "Could not complete deletion." })
              );
            }
            res.json({ message: "Event deleted successfully." });
          });
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Event Management Portal running at http://localhost:${PORT}`);
});
