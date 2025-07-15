const axios = require("axios");
const supabase = require("../db/supabase");
const { generateToken } = require("../utils/jwt");

async function githubCallback(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    //Exchange code for access_token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    //Fetch user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const { id, login, email } = userRes.data;

    //Store in DB (upsert) using Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert([
        {
          github_id: id.toString(),
          username: login,
          access_token: accessToken,
        },
      ], { onConflict: ['github_id'] })
      .select('id, github_id, username')
      .single();

    if (error) {
      throw error;
    }

    const user = data;

    //Issue JWT
    const token = generateToken({
      userId: user.id,
      githubId: user.github_id,
    });

    return res.json({ token, user });
  } catch (err) {
    console.error("GitHub OAuth Error:", err);
    return res.status(500).json({ error: "OAuth failed" });
  }
}

module.exports = { githubCallback };
