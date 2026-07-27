"use client";

import FeaturesSection from "./Home/FeatureSection";
import Footer from "./Home/FooterSection";
import DemoFormSection from "./Home/GetDemo";
import HeroSection from "./Home/HeroSection";
import HowItWorksSection from "./Home/HowItWork";
import Navbar from "./Home/NavBar";

 

export default function HomePage() {
  
  return (
    <main className="bg-gray-50">

        <Navbar/>

        <HeroSection/>
        
        <FeaturesSection/>

        <HowItWorksSection/>

        <DemoFormSection/>

        <Footer/>

     

      
 
 

    </main>
  );
}