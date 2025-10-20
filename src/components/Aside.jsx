import React, { useState } from "react";
import useData from "../hooks/UseData";

export default function Aside({ city, setCity }) {
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;

  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  let url = "";

  if (city.includes(",")) {
    const [lat, lon] = city.split(",");
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric&lang=en`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric&lang=en`;
  }
  const { data, loading, error } = useData(url);
  const temp = data?.main?.temp;
  const weather = data?.weather?.[0];
  const locationName = data?.name ?? city;

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  const today = formatDate(new Date());

  // 📍 Usar geolocalización
  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Cambiamos la ciudad a "lat,lon" (puedes manejarlo luego)
        setCity(`${latitude},${longitude}`);
      },
      (err) => console.error("No se pudo obtener ubicación", err)
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setCity(searchInput.trim());
    setShowSearch(false);
    setSearchInput("");
  };

  return (
    <aside className="relative min-h-screen w-full lg:w-[30%] bg-[#1f203b] flex flex-col items-center pt-4 font-raleway">
      <div className="absolute inset-0 bg-[url('/others/Cloud-background.png')] bg-cover bg-center h-[450px] opacity-5" aria-hidden="true"></div>

      <header className="relative z-10 flex items-center justify-between w-full px-4 py-4 sm:px-8 lg:px-24">
        {/* Botón Search */}
        <button
          onClick={() => setShowSearch(true)}
          className="bg-[#6E707A] text-[#E7E7EB] w-44 h-10 font-medium cursor-pointer hover:bg-[#5a5c68] transition-colors"
        >
          Search for places
        </button>

        {/* Botón ubicación */}
        <button onClick={handleGetLocation} className="rounded-full bg-[#4A4D60] p-2 hover:bg-[#3e404f] transition-colors">
          <img src="/location.svg" alt="location icon" className="h-5 w-5" />
        </button>
      </header>

      {showSearch && (
        <div className="absolute z-20 top-0 left-0 w-full h-full bg-[#1f203b] p-2 flex flex-col gap-4">
          <div className="flex justify-end items-center">
            <button onClick={() => setShowSearch(false)} className="text-white text-lg px-8 py-4 ">
              ✕
            </button>
          </div>
          <div onSubmit={handleSearchSubmit} className="flex justify-around ">
            <div className="flex items-center w-[55%] max-w-[268px] h-9 bg-transparent border  font-medium text-base  border-[#E7E7EB]  text-[#616475] ">
              <img className="size-8 pl-2" src="search.svg" alt="search" />
              <input
                type="text"
                placeholder="search location"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 p-2 bg-transparent outline-none placeholder-gray-400"
              />
            </div>
            <button type="submit" className="bg-[#3C47E9] px-4 text-white font-medium">
              Search
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center text-white pb-8">
        {loading && <p>Loading weather...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <>
            <img
              className="my-12 w-80"
              loading="lazy"
              src={weather ? `https://openweathermap.org/img/wn/${weather.icon}@4x.png` : "/weather/03d.png"}
              alt={weather?.description || "weather"}
            />

            <div className="flex items-center">
              <h2 className="text-[#e7e7eb] text-9xl font-medium my-4">{temp !== null ? Math.round(temp) : "--"}</h2>
              <h3 className="text-[#A09FB1] text-6xl font-medium">°C</h3>
            </div>

            <p className="text-[#A09FB1] font-semibold text-3xl my-6 capitalize">{weather?.description || "No data"}</p>

            <div className="mt-6 text-[#88869D] text-sm font-medium">
              <p>Today &nbsp;&nbsp;. &nbsp;&nbsp;{today}</p>
              <p className="text-center flex justify-center items-center gap-1 my-8 font-mono">
                <img className="h-5" src="/location_on.svg" alt="location_on" />
                {locationName}
              </p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
