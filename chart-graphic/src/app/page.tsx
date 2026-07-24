import React from "react";
import type { Metadata } from "next";
import LandingNavbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import BestOffers from "@/components/landing/best-offers";
import About from "@/components/landing/about";
import BestCandidates from "@/components/landing/best-candidates";
import RecruiterCTA from "@/components/landing/recruiter-cta";
import Footer from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Iksatech · Recrutement Tech IA au Maroc",
  description:
    "Trouvez votre prochain poste tech au Maroc grâce à notre IA de matching. Offres Casablanca, Rabat, Tanger et Remote. Salaires compétitifs, stacks modernes.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen font-sans bg-white">
      <LandingNavbar />
      <Hero />
      <BestOffers />
      <BestCandidates />
      <RecruiterCTA />
      <Footer />
    </main>
  );
}
