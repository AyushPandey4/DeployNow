const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const supabase = require("../db/supabase");
const axios = require("axios");

// GET /repos - fetch all repos for the authenticated user
router.get("/repos", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    // Get user's GitHub access token from DB
    const { data, error } = await supabase
      .from("users")
      .select("access_token")
      .eq("id", userId)
      .single();
    if (error || !data || !data.access_token) {
      return res.status(400).json({ error: "GitHub access token not found" });
    }
    const accessToken = data.access_token;
    // Fetch repos from GitHub API
    const ghRes = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `token ${accessToken}` },
      params: { per_page: 100 },
    });
    return res.json({ repos: ghRes.data });
  } catch (err) {
    console.error("Failed to fetch GitHub repos:", err.message);
    return res.status(500).json({ error: "Failed to fetch GitHub repos" });
  }
});

module.exports = router;
