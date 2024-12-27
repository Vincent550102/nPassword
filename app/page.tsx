"use client";
import DomainManager from "@/components/DomainManager";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen p-8 pb-20 sm:p-20">
        <DomainManager />
      </div>
    </div>
  );
}
