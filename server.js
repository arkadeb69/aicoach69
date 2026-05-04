const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req,res)=>{
  res.json({ status:"AI Career Coach running 🚀" });
});

const skillsDB = {
  "video editor": [
    "premiere pro",
    "after effects",
    "color grading",
    "storytelling",
    "sound design"
  ],
  "frontend developer": [
    "html",
    "css",
    "javascript",
    "react",
    "git"
  ],
  "ui ux designer": [
    "figma",
    "wireframing",
    "prototyping",
    "user research"
  ]
};

/* CLEAN TEXT */
function normalize(text){
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g," ")
    .replace(/\s+/g," ")
    .trim();
}

/* SMART MATCH */
function matchSkill(resume, skill){
  const r = normalize(resume);
  const s = normalize(skill);

  const words = s.split(" ");

  return words.every(w => r.includes(w));
}

app.post("/analyze",(req,res)=>{

  let { resume, role } = req.body;

  if(!resume || !role){
    return res.status(400).json({error:"missing data"});
  }

  resume = normalize(resume);
  role = role.toLowerCase().trim();

  const skills = skillsDB[role] || [];

  const matched = skills.filter(s => matchSkill(resume,s));
  const missing = skills.filter(s => !matchSkill(resume,s));

  const score = Math.round((matched.length / skills.length) * 100);

  const roadmap = missing.map((s,i)=>({
    week:i+1,
    content:`Learn ${s} + build project`
  }));

  res.json({
    matched,
    missing,
    roadmap,
    score
  });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("Running on",PORT));