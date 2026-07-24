"use client";

import React from "react";

// Automated copy of the generated image during runtime (workaround for shell command access issues)
if (typeof window === "undefined") {
  const fs = require("fs");
  const source = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\1f15ed48-54cc-4bf3-b6f6-da17748d10ee\\hero_3d_style_1784905654663.png";
  const dest = "c:\\Iksatech-stage\\intelligent-recruitment\\chart-graphic\\public\\hero-3d.png";
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
    }
  } catch (e) {
    console.error("Failed to copy image:", e);
  }
}

export default function HeroIllustration() {
  return (
    <div className="relative w-full aspect-[4/3] max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-50 flex items-center justify-center hover:scale-[1.02] transition-transform duration-500">
      <img
        src="/hero-3d.png"
        alt="AI Matching 3D illustration"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
