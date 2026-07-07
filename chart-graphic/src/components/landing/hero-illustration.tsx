"use client";

import React from "react";

export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto drop-shadow-xl">
      <defs>
        <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2ff" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
        <linearGradient id="card-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
        <filter id="shadow-sm">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.06" />
        </filter>
        <filter id="shadow-md">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.08" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="520" height="400" rx="24" fill="url(#bg-grad)" />

      {/* Top-right floating badge */}
      <g filter="url(#shadow-sm)">
        <rect x="340" y="28" width="150" height="32" rx="16" fill="#2563eb" />
        <circle cx="354" cy="44" r="4" fill="#60a5fa" />
        <text x="365" y="48" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">IA Matching Actif</text>
      </g>

      {/* Main dashboard card */}
      <g filter="url(#shadow-md)">
        <rect x="36" y="80" width="280" height="230" rx="16" fill="url(#card-grad)" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="36" y="80" width="280" height="44" rx="16" fill="#f1f5f9" />
        <rect x="36" y="106" width="280" height="18" fill="#f1f5f9" />
        <circle cx="60" cy="102" r="10" fill="#dbeafe" />
        <rect x="78" y="94" width="60" height="6" rx="3" fill="#94a3b8" opacity="0.3" />
        <rect x="78" y="104" width="90" height="4" rx="2" fill="#cbd5e1" opacity="0.3" />
        <circle cx="290" cy="102" r="4" fill="#2563eb" />

        {/* Bar chart inside card */}
        <rect x="56" y="136" width="24" height="48" rx="4" fill="#dbeafe" />
        <rect x="56" y="136" width="24" height="48" rx="4" fill="#3b82f6" opacity="0.3" />
        <rect x="88" y="120" width="24" height="64" rx="4" fill="#bfdbfe" />
        <rect x="88" y="120" width="24" height="64" rx="4" fill="#2563eb" opacity="0.4" />
        <rect x="120" y="108" width="24" height="76" rx="4" fill="#93c5fd" />
        <rect x="120" y="108" width="24" height="76" rx="4" fill="#2563eb" opacity="0.6" />
        <rect x="152" y="96" width="24" height="88" rx="4" fill="#60a5fa" />
        <rect x="152" y="96" width="24" height="88" rx="4" fill="#2563eb" opacity="0.8" />
        <rect x="184" y="80" width="24" height="104" rx="4" fill="#3b82f6" />
        <rect x="216" y="90" width="24" height="94" rx="4" fill="#93c5fd" />
        <rect x="216" y="90" width="24" height="94" rx="4" fill="#2563eb" opacity="0.5" />
        <rect x="248" y="110" width="24" height="74" rx="4" fill="#bfdbfe" />
        <rect x="248" y="110" width="24" height="74" rx="4" fill="#2563eb" opacity="0.35" />

        {/* Legend */}
        <rect x="56" y="240" width="8" height="8" rx="2" fill="#3b82f6" />
        <text x="70" y="248" fill="#64748b" fontSize="8" fontWeight="600" fontFamily="system-ui">Candidatures</text>
        <rect x="140" y="240" width="8" height="8" rx="2" fill="#93c5fd" />
        <text x="154" y="248" fill="#64748b" fontSize="8" fontWeight="600" fontFamily="system-ui">Offres</text>
      </g>

      {/* Small card 1 - profile preview */}
      <g filter="url(#shadow-sm)">
        <rect x="336" y="80" width="160" height="80" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="358" cy="104" r="12" fill="#2563eb" />
        <text x="350" y="108" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui" textAnchor="middle">SE</text>
        <text x="378" y="100" fill="#0f172a" fontSize="11" fontWeight="700" fontFamily="system-ui">Sara El Moudden</text>
        <text x="378" y="114" fill="#64748b" fontSize="9" fontFamily="system-ui">Backend Engineer</text>
        <rect x="340" y="132" width="30" height="16" rx="6" fill="#dbeafe" />
        <text x="346" y="144" fill="#2563eb" fontSize="8" fontWeight="700" fontFamily="system-ui">Python</text>
        <rect x="374" y="132" width="30" height="16" rx="6" fill="#dbeafe" />
        <text x="380" y="144" fill="#2563eb" fontSize="8" fontWeight="700" fontFamily="system-ui">Django</text>
        <rect x="408" y="132" width="40" height="16" rx="6" fill="#dbeafe" />
        <text x="413" y="144" fill="#2563eb" fontSize="8" fontWeight="700" fontFamily="system-ui">+4 ans</text>
      </g>

      {/* Small card 2 - match badge */}
      <g filter="url(#shadow-sm)">
        <rect x="336" y="172" width="160" height="60" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="1" />
        <rect x="344" y="184" width="28" height="28" rx="8" fill="#2563eb" />
        <text x="351" y="202" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui" textAnchor="middle">97%</text>
        <text x="380" y="194" fill="#0f172a" fontSize="11" fontWeight="700" fontFamily="system-ui">Score de matching</text>
        <text x="380" y="210" fill="#64748b" fontSize="9" fontFamily="system-ui">Excellent fit avec l'offre</text>
      </g>

      {/* Connection lines */}
      <circle cx="316" cy="200" r="5" fill="#2563eb" opacity="0.2" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="316" y1="200" x2="336" y2="202" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      <line x1="316" y1="200" x2="336" y2="120" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

      {/* Bottom CTA badge */}
      <g filter="url(#glow)">
        <rect x="140" y="330" width="240" height="38" rx="19" fill="#2563eb" />
        <text x="260" y="354" fill="white" fontSize="13" fontWeight="800" fontFamily="system-ui" textAnchor="middle">+ Postulez en 1 clic</text>
      </g>

      {/* Bottom dots */}
      <circle cx="260" cy="386" r="3" fill="#3b82f6" opacity="0.3" />
      <circle cx="270" cy="386" r="3" fill="#3b82f6" opacity="0.5" />
      <circle cx="280" cy="386" r="3" fill="#3b82f6" />
    </svg>
  );
}
