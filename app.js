const express = require("express");
const path = require("path");

const authRoutes = require("backend/routes/authRoutes");

const app = express();

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "frontend")));

// Auth routes
app.use(authRoutes);

// Login page
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "frontend", "pages", "login", "login.html")
    );
});

// Billing page (after login)
app.get("/bill", (req, res) => {
    res.sendFile(
        path.join(__dirname, "frontend", "pages", "billing", "pay.html")
    );
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});