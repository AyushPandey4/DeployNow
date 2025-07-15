const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const gitrepos = require("./routes/gitrepo")
dotenv.config();

const app = express();
const port = 9000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/github", gitrepos)

// Routes
app.get("/ping", (req, res) => {
  res.json({ message: "pong 🚀" });
});

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
