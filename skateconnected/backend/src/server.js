console.log("RUNNING FILE:", __filename);


const express = require("express");

const app = express();
app.use(express.json());

// root route (so http://localhost:5000 works)
app.get("/", (req, res) => {
    res.send("Backend is running ✅");
});

// health route (so /health works)
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
