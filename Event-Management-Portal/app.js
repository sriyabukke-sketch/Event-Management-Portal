
const $ = id => document.getElementById(id);

let events = [];
let registrations = [];

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function safe(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[ch]));
}

function displayDate(value) {
  return new Date(value + "T12:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function message(id, text) {
  $(id).textContent = text;
}

async function loadData() {
  try {
    const results = await Promise.all([
      api("/api/events"),
      api("/api/registrations")
    ]);

    events = results[0];
    registrations = results[1];

    renderEvents();
    renderDashboard();
  } catch (error) {
    message("eventMessage", error.message + " Check that the server is running.");
  }
}

function renderEvents() {
  const search = $("search").value.trim().toLowerCase();

  const filtered = events.filter(event =>
    [event.title, event.description, event.venue]
      .some(value => value.toLowerCase().includes(search))
  );

  if (filtered.length === 0) {
    $("eventGrid").textContent = "No matching events found.";
    return;
  }

  $("eventGrid").innerHTML = filtered.map(event => `
    <article class="event-card">
      <p class="event-date">${safe(displayDate(event.event_date))}</p>
      <h3>${safe(event.title)}</h3>
      <p>${safe(event.description)}</p>
      <p><strong>Venue:</strong> ${safe(event.venue)}</p>
      <p><strong>Available seats:</strong> ${event.seats_left}</p>
      <button data-register="${event.id}"
        ${event.seats_left <= 0 ? "disabled" : ""}>
        ${event.seats_left <= 0 ? "Fully Booked" : "Register Now"}
      </button>
    </article>
  `).join("");

  $("eventGrid").querySelectorAll("[data-register]").forEach(button => {
    button.addEventListener("click", () => {
      const event = events.find(
        item => item.id === Number(button.dataset.register)
      );

      if (!event) return;

      $("registerForm").reset();
      $("registerEventId").value = event.id;
      $("selectedEvent").textContent =
        event.title + " — " + displayDate(event.event_date);
      message("registerMessage", "");
      $("registerDialog").showModal();
    });
  });
}

function renderDashboard() {
  const seats = events.reduce(
    (sum, event) => sum + event.seats_left, 0
  );

  $("eventCount").textContent = events.length;
  $("registrationCount").textContent = registrations.length;
  $("seatCount").textContent = seats;

  $("adminEvents").innerHTML = events.length
    ? events.map(event => `
      <tr>
        <td>${safe(event.title)}</td>
        <td>${safe(displayDate(event.event_date))}</td>
        <td>${safe(event.venue)}</td>
        <td>${event.registered} / ${event.capacity}</td>
        <td>
          <button class="delete-button" data-delete="${event.id}">
            Delete
          </button>
        </td>
      </tr>
    `).join("")
    : '<tr><td colspan="5">No events available.</td></tr>';

  $("registrations").innerHTML = registrations.length
    ? registrations.map(person => `
      <tr>
        <td>${safe(person.name)}</td>
        <td>${safe(person.email)}</td>
        <td>${safe(person.event_title)}</td>
        <td>${safe(displayDate(person.event_date))}</td>
      </tr>
    `).join("")
    : '<tr><td colspan="4">No registrations yet.</td></tr>';

  $("adminEvents").querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", async () => {
      const event = events.find(
        item => item.id === Number(button.dataset.delete)
      );

      if (!event) return;

      if (!confirm(
        `Delete ${event.title} and all its registrations?`
      )) return;

      try {
        const result = await api(
          `/api/events/${event.id}`,
          { method: "DELETE" }
        );

        message("adminMessage", result.message);
        await loadData();
      } catch (error) {
        message("adminMessage", error.message);
      }
    });
  });
}

// Search events
$("search").addEventListener("input", renderEvents);

// Create an event
$("eventForm").addEventListener("submit", async event => {
  event.preventDefault();

  const payload = {
    title: $("title").value.trim(),
    description: $("description").value.trim(),
    event_date: $("event_date").value,
    venue: $("venue").value.trim(),
    capacity: Number($("capacity").value)
  };

  try {
    const result = await api("/api/events", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    message("createMessage", result.message);
    $("eventForm").reset();
    $("capacity").value = 50;

    await loadData();
  } catch (error) {
    message("createMessage", error.message);
  }
});

// Register an attendee
$("registerForm").addEventListener("submit", async event => {
  event.preventDefault();

  const payload = {
    event_id: Number($("registerEventId").value),
    name: $("attendeeName").value.trim(),
    email: $("attendeeEmail").value.trim()
  };

  try {
    const result = await api("/api/registrations", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    message("registerMessage", result.message);
    await loadData();

    setTimeout(() => $("registerDialog").close(), 700);
  } catch (error) {
    message("registerMessage", error.message);
  }
});

// Close registration form
$("closeDialog").addEventListener("click", () => {
  $("registerDialog").close();
});

$("registerDialog").addEventListener("click", event => {
  if (event.target === $("registerDialog")) {
    $("registerDialog").close();
  }
});

// Load initial data
loadData();
