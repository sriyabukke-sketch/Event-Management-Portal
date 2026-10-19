# 🎉 Event Management Portal

### A Full-Stack Web Application for Managing Events and Registrations

The **Event Management Portal** is a web-based application designed to simplify the process of creating, discovering, managing, and registering for events. It provides a user-friendly interface where users can explore available events and register for them, while organizers can create events and manage event information through a centralized platform.

This project is developed using **HTML, CSS, JavaScript, Node.js, Express.js, and SQLite**, demonstrating the implementation of a full-stack web application with frontend and backend integration.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Project Folder Structure](#-project-folder-structure)
- [Installation and Setup](#-installation-and-setup)
- [How to Run the Project](#-how-to-run-the-project)
- [Testing the Application](#-testing-the-application)
- [Database Design](#-database-design)
- [Future Enhancements](#-future-enhancements)
- [Learning Outcomes](#-learning-outcomes)
- [Author](#-author)
- [License](#-license)

---

## 📖 Project Overview

Managing events manually can be time-consuming and difficult when event information, participant registrations, and event records are maintained separately.

The Event Management Portal addresses this problem by providing a centralized web application for handling essential event management operations.

Users can browse available events, search for relevant events, and submit registrations. Organizers can add new events, review registrations, and manage event records.

The application uses SQLite to store event and registration data, while Node.js and Express.js handle server-side operations and API requests.

### 🎯 Project Objectives

- Develop a responsive and user-friendly event management website.
- Implement event creation and management functionality.
- Allow users to register for available events.
- Store event and registration information in a database.
- Connect frontend components with backend APIs.
- Demonstrate database integration in a full-stack application.

---

## ✨ Key Features

### 1. Event Discovery
- Display available events with relevant information.
- Browse event details, including date, time, venue, and description.
- Search for events using available search functionality.

### 2. Event Registration
- Register for an event through the website.
- Submit participant details through a registration form.
- Store registration information in the database.

### 3. Event Management
- Create and publish new event records.
- Maintain event information in one centralized location.
- Delete event records when required.

### 4. Organizer Dashboard
- View and manage event information.
- Review participant registrations, depending on the implemented dashboard functionality.
- Perform event management operations through the web interface.

### 5. Database Integration
- Use SQLite for persistent data storage.
- Store event and registration records.
- Retrieve and update data through backend API endpoints.

### 6. Responsive User Interface
- Clean and intuitive website layout.
- Structured event cards and forms.
- CSS styling for an improved user experience.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Client-side interaction |
| Node.js | Server-side JavaScript runtime |
| Express.js | Backend server and REST API |
| SQLite | Database for persistent storage |
| npm | Dependency and package management |
| Visual Studio Code | Development environment |
| Git and GitHub | Version control and project hosting |

---

## 🏗️ Project Architecture

The application follows a simple client-server architecture.

```text
                 USER
                   |
                   v
          FRONTEND APPLICATION
            HTML / CSS / JS
                   |
                   v
             HTTP REQUESTS
                   |
                   v
          NODE.JS + EXPRESS.JS
              BACKEND SERVER
                   |
                   v
             SQLITE DATABASE
                   |
                   v
         EVENTS AND REGISTRATIONS
```

### Application Workflow

1. The user opens the Event Management Portal in a web browser.
2. The frontend requests event information from the backend.
3. Express.js processes the incoming API requests.
4. The backend reads or modifies records in the SQLite database.
5. The server returns a response to the frontend.
6. The frontend updates the website to display the relevant information.

---

## 📂 Project Folder Structure

```text
Event-Management-Portal/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── package.json
├── package-lock.json
├── server.js
├── events.db
└── README.md
```

### File Description

- `public/index.html` — Defines the structure of the website.
- `public/style.css` — Contains the website's styles and layout.
- `public/app.js` — Handles frontend interactions and API communication.
- `server.js` — Runs the Express server and handles backend operations.
- `package.json` — Defines the project metadata, dependencies, and scripts.
- `package-lock.json` — Records the resolved npm dependency versions.
- `events.db` — SQLite database file, generated by the application when configured to do so.
- `README.md` — Documents the project, installation, and usage instructions.

*Note: The exact files may vary slightly depending on your project version. Do not manually add `events.db` if the application generates it automatically.*

---

## ⚙️ Installation and Setup

### Prerequisites

Install the following software before running the project:

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- A modern web browser such as Google Chrome
- Basic knowledge of JavaScript and web development

### Step 1: Clone the Repository

Open a terminal and execute:

```bash
git clone https://github.com/YOUR-USERNAME/Event-Management-Portal.git
```

Replace `YOUR-USERNAME` with your GitHub username and use the exact repository URL.

### Step 2: Open the Project

Open Visual Studio Code, select **File → Open Folder**, and choose the project directory.

### Step 3: Install Dependencies

Open the VS Code terminal and run:

```bash
npm install
```

This installs the dependencies listed in `package.json`.

### Step 4: Start the Application

Run the following command:

```bash
npm start
```

Wait for the server to start successfully.

### Step 5: Open the Website

Open your browser and visit:

```text
http://localhost:3000
```

The Event Management Portal should now be accessible locally.

**Important:** Run the application through the Node.js server rather than opening `index.html` directly or using Live Server alone. The backend and database operations require the Express server to be running.

---

## 🧪 Testing the Application

Use the following checklist to verify the main functionality.

- [ ] The website loads successfully.
- [ ] Available events appear on the page.
- [ ] Event search works, if implemented.
- [ ] New event records can be created.
- [ ] Users can submit event registrations.
- [ ] Registration information is saved in the database.
- [ ] Event records can be deleted through the implemented controls.
- [ ] The page displays appropriate messages for successful and unsuccessful operations.
- [ ] Data remains available after restarting the server, provided the same persistent SQLite database is used.

---

## 🗄️ Database Design

The application uses SQLite, a lightweight relational database, to store information persistently.

### Events Table

Typical fields may include:

| Field | Description |
|---|---|
| `id` | Unique event identifier |
| `title` | Name of the event |
| `date` | Scheduled event date |
| `time` | Scheduled event time |
| `venue` | Event location |
| `description` | Details about the event |

### Registrations Table

Typical fields may include:

| Field | Description |
|---|---|
| `id` | Unique registration identifier |
| `event_id` | Associated event identifier |
| `name` | Participant name |
| `email` | Participant email address |

*The actual column names and table structure depend on the SQL schema implemented in `server.js`.*

---

## 🚀 Future Enhancements

The project can be extended with the following features:

- User login and registration with secure password hashing.
- Separate administrator, organizer, and participant roles.
- Email confirmation after event registration.
- Event capacity limits and automatic seat availability tracking.
- Event category filters and advanced search.
- Registration cancellation and participant management.
- Calendar integration and event reminders.
- Image uploads for event posters.
- Deployment to a cloud hosting platform.
- Automated testing and improved input validation.

---

## 📚 Learning Outcomes

Through this project, the following skills can be developed:

- Frontend development using HTML, CSS, and JavaScript.
- Backend application development using Node.js and Express.js.
- Designing and consuming REST API endpoints.
- Connecting a web application to an SQLite database.
- Performing database CRUD operations: Create, Read, Update, and Delete.
- Organizing a full-stack application into separate files and modules.
- Running and debugging applications in Visual Studio Code.
- Using Git and GitHub for version control and project documentation.

---

## 👨‍💻 Author

**Your Name**

Electronics and Communication Engineering Student

**Interests:** Full-Stack Development, Software Engineering, and Technology Projects

GitHub: [Your GitHub Profile](https://github.com/YOUR-USERNAME)

---

## 📄 License

This project is intended for educational and learning purposes. You may add an MIT License if you want to distribute the project under its terms. See the [MIT License](https://opensource.org/license/mit) for details.

---

⭐ **If you find this project useful, consider giving the repository a star on GitHub!**
