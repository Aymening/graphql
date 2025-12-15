# GraphQL Profile Page
🌐 Live Preview

Check out the live project here: tranquil-clafoutis-b5df33.netlify.app (only for 01 Talents).

## 📌 Project Overview

This project consists of building a **personal profile page** using the **GraphQL query language**.
The goal is to fetch and display my own school data from the Zone01 Oujda GraphQL API and visualize it in a clear and meaningful way.

The project includes:

* A **login system** to authenticate the user
* A **profile page** populated with real data from GraphQL
* A **statistics section** using **SVG graphs**
* Hosting the final result online

---

## 🎯 Objectives

The main objectives of this project are to:

* Learn how **GraphQL** works
* Understand how to **query, filter, and nest data**
* Work with **JWT authentication**
* Build a clean and usable **UI**
* Generate **statistics graphs using SVG**
* Deploy and **host a web project**

---

## 🔐 Authentication (Login Page)

To access the GraphQL API, authentication is required.

* The JWT is obtained from:
  `https://learn.zone01oujda.ma/api/auth/signin`
* Authentication is done using **Basic Auth** (base64 encoded)

### Login requirements:

* Login must work with:

  * `username:password`
  * `email:password`
* Display an error message if credentials are invalid
* Provide a **logout** functionality
* Use the JWT as **Bearer Token** in all GraphQL requests

Only the authenticated user’s data can be accessed.

---

## 👤 Profile Page Content

The profile page displays personal school-related information fetched from GraphQL.

Examples of displayed data:

* Basic user information (login / ID)
* XP amount
* Grades and progress
* Audits or skills

At least **three different pieces of information** are displayed.

---

## 📊 Statistics & Graphs (SVG)

A **mandatory statistics section** is included.

Requirements:

* Graphs must be created using **SVG**
* At least **two different graphs**
* Data must come from the GraphQL API
* UI should follow basic **UI/UX principles**

Examples of graphs:

* XP progress over time
* XP per project
* PASS / FAIL ratio
* Audit ratio
* Piscine statistics
* Attempts per exercise

Graphs can be static or interactive.

---

## 🧠 GraphQL Usage

The project uses different types of GraphQL queries:

* Simple queries
* Queries with arguments
* Nested queries

Examples include querying:

* `user`
* `transaction` (XP)
* `progress`
* `result`
* `object`

GraphiQL was used to explore the schema and understand relations between tables.

---

## 🌍 Hosting

The project is hosted online using a static hosting service such as:

* GitHub Pages
* Netlify
  (or any other hosting solution)

---

## 🚧 Difficulties I Faced

During this project, I faced several challenges:

* **Understanding GraphQL at first**
  Thinking differently compared to REST was not easy, especially nested queries.

* **Handling JWT authentication**
  Managing tokens, headers, login, and logout correctly required careful attention.

* **Data relations**
  Understanding how tables like `user`, `result`, `progress`, and `transaction` are linked took time.

* **SVG graphs**
  Creating graphs manually with SVG was challenging, especially positioning, scaling, and readability.

* **UI decisions**
  Choosing what data to show and how to present it clearly was harder than expected.

---

## 📚 What I Learned

This project helped me learn and improve a lot:

* How **GraphQL queries work** (normal, nested, arguments)
* How to explore an API using **GraphiQL**
* How **JWT authentication and authorization** work
* How to securely fetch protected data
* How to transform raw data into **useful statistics**
* How to build **SVG-based graphs**
* Basics of **UI/UX design**
* How to **deploy and host** a web project

---

## ✅ Conclusion

This project was a great introduction to GraphQL and real-world data handling.
It pushed me to think more about **data structure, security, and user experience**, not just making things work.
