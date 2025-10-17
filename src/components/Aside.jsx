import React, { useState } from "react";
import useData from "../hooks/UseData";

export default function Aside({ city, setCity }) {
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const [searchInput, setSearchInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric&lang=en`;
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

      <header className="relative z-10 flex flex-row items-center justify-between w-full px-28 py-2">
        <button onClick={() => setShowSearch(true)} className="bg-[#6e707a] text-[#e7e7eb] w-44 h-9 cursor-pointer">
          Search for Places
        </button>
        <button onClick={handleGetLocation} className="rounded-full bg-[#4a4d60] p-2 cursor-pointer">
          <img className="h-6" src="/location.svg" alt="location-img" />
        </button>
      </header>

      {showSearch && (
        <div className="absolute z-20 top-0 left-0 w-full h-full bg-[#1f203b] p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Search for a city</h3>
            <button onClick={() => setShowSearch(false)} className="text-white text-2xl">
              ✕
            </button>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter city"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 p-2 bg-transparent border border-gray-400 text-white rounded"
            />
            <button type="submit" className="bg-[#3C47E9] px-4 text-white rounded">
              Search
            </button>
          </form>
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
              <p className="text-center flex justify-center items-center gap-1 my-8">
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
