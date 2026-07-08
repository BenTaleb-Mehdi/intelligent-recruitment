import React from "react";
import type { Metadata } from "next";
import LandingNavbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import AboutHero from "@/components/landing/about-hero";
import AboutDetails from "@/components/landing/about-details";
import AboutTeam from "@/components/landing/about-team";

export const metadata: Metadata = {
  title: "À propos · Iksatech",
  description:
    "Découvrez Iksatech, la plateforme marocaine de recrutement tech par IA qui connecte les talents aux meilleures entreprises du Maroc.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen font-sans bg-white">
      <LandingNavbar />
      <AboutHero />
      <AboutDetails />
      <AboutTeam />
      <Footer />
    </main>
  );
}
