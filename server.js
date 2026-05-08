const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ status: "AI Career Coach API running 🚀" });
});

const roleSkills = {
  "frontend developer": ["html","css","javascript","react","git"],
  "video editor": ["premiere pro","after effects","color grading","storytelling","sound design"],
  "motion graphics": ["after effects","animation","keyframes","illustrator"],
  "ui ux designer": ["figma","wireframing","prototyping","user research"],
  "content creator": ["editing","script writing","social media","branding"]
};

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9+#. ]/g, " ")
    .trim();
}

function tokenize(text) {
  return new Set(normalize(text).split(" "));
}

app.post("/analyze", (req, res) => {
  let { resume, role } = req.body;

  if (!resume || !role) {
    return res.status(400).json({ error: "Missing data" });
  }

  resume = normalize(resume);
  role = role.toLowerCase().trim();

  const required = roleSkills[role] || [];

  const resumeTokens = tokenize(resume);

  const matched = [];
  const missing = [];

  required.forEach(skill => {
    const s = skill.toLowerCase();

    if (resume.includes(s) || [...resumeTokens].some(t => t.includes(s.replace(" ", "")))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });

  const roadmap = missing.map((skill, i) => ({
    week: i + 1,
    content: `Learn ${skill} + build 1 project`
  }));

  res.json({
    matched,
    missing,
    roadmap,
    total: required.length
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));