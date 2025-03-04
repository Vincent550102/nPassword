"use client";
import DomainManager from "@/components/DomainManager";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen pt-16">
        {" "}
        <DomainManager />
      </div>
    </div>
  );
}
