"use client";
import DomainInitializer from "@/components/DomainInitializer";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen pt-16">
        <DomainInitializer />
      </div>
    </div>
  );
}
