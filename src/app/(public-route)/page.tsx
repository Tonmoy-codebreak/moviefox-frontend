import HomePageBanner from "@/components/modules/publicComponents/HomePageBanner";
import React from "react";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Banner Section */}
      <HomePageBanner />

      {/* Additional Page Sections Can Go Here */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Welcome to Our Platform
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our curated features and see how we can help you build
            extraordinary digital experiences.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
