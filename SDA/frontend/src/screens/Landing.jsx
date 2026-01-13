import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import TechStack from "../components/landing/TechStack";
import { Testimonials } from "../components/landing/Testimonials";
import { Pricing } from "../components/landing/Pricing";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import Chatbot from "../components/landing/Chatbot";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <LandingNavbar />
      <Hero />
      <Features />
      <TechStack />
      <CTA />
      <Testimonials />
      <Pricing />      
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Landing;
