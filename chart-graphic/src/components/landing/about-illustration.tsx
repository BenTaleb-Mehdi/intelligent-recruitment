"use client";

import React from "react";

export default function AboutIllustration() {
  return (
    <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto drop-shadow-xl">
      <defs>
        <linearGradient id="abg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2ff" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
        <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <filter id="as1">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.06" />
        </filter>
        <filter id="as2">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.08" />
        </filter>
      </defs>

      <rect width="500" height="420" rx="24" fill="url(#abg)" />

      {/* Title */}
      <text x="250" y="40" fill="#0f172a" fontSize="14" fontWeight="800" fontFamily="system-ui" textAnchor="middle" letterSpacing="2">COMMENT ÇA MARCHE</text>
      <text x="250" y="58" fill="#64748b" fontSize="10" fontFamily="system-ui" textAnchor="middle">Le matching IA en 3 étapes</text>

      {/* Step 1 - Profile */}
      <g filter="url(#as2)">
        <rect x="36" y="80" width="200" height="150" rx="14" fill="url(#ag1)" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="36" y="80" width="200" height="36" rx="14" fill="#2563eb" />
        <rect x="36" y="100" width="200" height="16" fill="#2563eb" />
        <text x="52" y="102" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui">1</text>
        <circle cx="66" cy="98" r="10" fill="white" opacity="0.2" />
        <text x="80" y="102" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">Créez votre profil</text>

        <rect x="52" y="130" width="168" height="28" rx="8" fill="#f1f5f9" />
        <text x="62" y="148" fill="#64748b" fontSize="8" fontFamily="system-ui">Votre nom complet</text>
        <rect x="52" y="164" width="168" height="28" rx="8" fill="#f1f5f9" />
        <text x="62" y="182" fill="#64748b" fontSize="8" fontFamily="system-ui">votre@email.com</text>
        <rect x="52" y="198" width="80" height="22" rx="6" fill="#dbeafe" />
        <text x="60" y="212" fill="#2563eb" fontSize="8" fontWeight="700" fontFamily="system-ui">Développeur</text>
      </g>

      {/* Arrow */}
      <text x="252" y="160" fill="#93c5fd" fontSize="24" fontWeight="300" fontFamily="system-ui" textAnchor="middle">→</text>

      {/* Step 2 - IA Matching */}
      <g filter="url(#as2)">
        <rect x="264" y="80" width="200" height="150" rx="14" fill="url(#ag1)" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="264" y="80" width="200" height="36" rx="14" fill="#2563eb" />
        <rect x="264" y="100" width="200" height="16" fill="#2563eb" />
        <text x="280" y="102" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui">2</text>
        <circle cx="294" cy="98" r="10" fill="white" opacity="0.2" />
        <text x="308" y="102" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">IA analyse &amp; match</text>

        {/* Brain/network icon */}
        <circle cx="312" cy="155" r="22" fill="#dbeafe" />
        <circle cx="312" cy="155" r="22" fill="#3b82f6" opacity="0.1" />
        <text x="302" y="152" fill="#2563eb" fontSize="11" fontFamily="system-ui">⚡</text>
        <text x="305" y="165" fill="#2563eb" fontSize="7" fontWeight="700" fontFamily="system-ui">IA</text>

        {/* Connection dots */}
        <circle cx="360" cy="140" r="6" fill="#93c5fd" />
        <circle cx="380" cy="160" r="6" fill="#60a5fa" />
        <circle cx="355" cy="172" r="6" fill="#bfdbfe" />
        <line x1="334" y1="155" x2="354" y2="140" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="334" y1="155" x2="374" y2="160" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="334" y1="155" x2="350" y2="172" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="2 2" />
      </g>

      {/* Arrow 2 */}
      <text x="252" y="260" fill="#93c5fd" fontSize="24" fontWeight="300" fontFamily="system-ui" textAnchor="middle">→</text>

      {/* Step 3 - Results */}
      <g filter="url(#as2)">
        <rect x="150" y="252" width="200" height="150" rx="14" fill="url(#ag1)" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="150" y="252" width="200" height="36" rx="14" fill="#2563eb" />
        <rect x="150" y="272" width="200" height="16" fill="#2563eb" />
        <text x="166" y="274" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui">3</text>
        <circle cx="180" cy="270" r="10" fill="white" opacity="0.2" />
        <text x="194" y="274" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">Postulez en 1 clic</text>

        {/* Offer cards */}
        <rect x="166" y="300" width="168" height="24" rx="6" fill="#f1f5f9" />
        <circle cx="176" cy="312" r="5" fill="#2563eb" />
        <text x="186" y="315" fill="#0f172a" fontSize="8" fontWeight="600" fontFamily="system-ui">Senior React Dev · Casablanca</text>
        <rect x="310" y="304" width="12" height="16" rx="4" fill="#dbeafe" />
        <text x="315" y="315" fill="#2563eb" fontSize="7" fontWeight="800" fontFamily="system-ui">96%</text>

        <rect x="166" y="330" width="168" height="24" rx="6" fill="#f1f5f9" />
        <circle cx="176" cy="342" r="5" fill="#2563eb" />
        <text x="186" y="345" fill="#0f172a" fontSize="8" fontWeight="600" fontFamily="system-ui">Backend Python · Rabat</text>
        <rect x="310" y="334" width="12" height="16" rx="4" fill="#dbeafe" />
        <text x="315" y="345" fill="#2563eb" fontSize="7" fontWeight="800" fontFamily="system-ui">94%</text>

        <rect x="166" y="360" width="168" height="24" rx="6" fill="#f1f5f9" />
        <circle cx="176" cy="372" r="5" fill="#2563eb" />
        <text x="186" y="375" fill="#0f172a" fontSize="8" fontWeight="600" fontFamily="system-ui">ML Engineer · Remote</text>
        <rect x="310" y="364" width="12" height="16" rx="4" fill="#dbeafe" />
        <text x="315" y="375" fill="#2563eb" fontSize="7" fontWeight="800" fontFamily="system-ui">91%</text>
      </g>

      {/* Decorativ dots */}
      <circle cx="36" cy="40" r="3" fill="#3b82f6" opacity="0.15" />
      <circle cx="464" cy="40" r="3" fill="#3b82f6" opacity="0.15" />
      <circle cx="36" cy="410" r="4" fill="#3b82f6" opacity="0.1" />
      <circle cx="464" cy="410" r="4" fill="#3b82f6" opacity="0.1" />
    </svg>
  );
}
