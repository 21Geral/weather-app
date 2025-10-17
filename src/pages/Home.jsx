import React, { useState } from "react";
import Aside from "../components/Aside.jsx";
import FiveDays from "../components/FiveDays.jsx";
import Highlights from "../components/Highlights.jsx";
export default function Home() {
  const [city, setCity] = useState("Lima");
  return (
    <main className="flex flex-col lg:flex-row w-screen min-h-screen">
      {/* Aside controla la ciudad */}
      <Aside city={city} setCity={setCity} />

      {/* Contenido principal */}
      <div className="flex-1 bg-[#100E1D] p-6">
        <FiveDays city={city} />
        <Highlights city={city} />
      </div>
    </main>
  );
}
