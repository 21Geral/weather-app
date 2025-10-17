import React from "react";
import useData from "../hooks/UseData";

export default function Highlights({ city }) {
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric&lang=en`;
  const { data, loading, error } = useData(url);

  if (loading) return <p className="text-white">Loading highlights...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return null;

  // 🌬 Wind
  const windSpeed = data.wind?.speed ?? 0;
  const windDeg = data.wind?.deg ?? 0;

  // 💧 Humidity
  const humidity = data.main?.humidity ?? 0;

  // 👁 Visibility (m → km)
  const visibilityKm = data.visibility ? (data.visibility / 1000).toFixed(2) : "0";

  // 🌡 Air pressure
  const pressure = data.main?.pressure ?? 0;

  // 🧭 Dirección cardinal del viento
  const getWindDirection = (deg) => {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return dirs[Math.round(deg / 22.5) % 16];
  };

  return (
    <section className="w-full flex flex-col gap-6 text-white mt-6 md:grid md:grid-cols-2">
      {/* Título */}
      <h2 className="text-xl font-semibold col-span-full">Today's Highlights</h2>

      {/* Wind Status */}
      <div className="bg-[#1E213A] rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-300 mb-2">Wind status</p>
        <h3 className="text-5xl font-bold">
          {windSpeed.toFixed(2)}
          <span className="text-2xl font-light">ms</span>
        </h3>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="bg-gray-600 p-2 rounded-full transform transition-transform" style={{ transform: `rotate(${windDeg}deg)` }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <span className="text-gray-300 text-sm">{getWindDirection(windDeg)}</span>
        </div>
      </div>

      {/* Humidity */}
      <div className="bg-[#1E213A] rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-300 mb-2">Humidity</p>
        <h3 className="text-5xl font-bold">
          {humidity}
          <span className="text-2xl font-light">%</span>
        </h3>
        <div className="w-full mt-4">
          <div className="flex justify-between text-xs text-gray-400">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
          <div className="w-full bg-gray-600 h-2 rounded mt-1">
            <div className="bg-yellow-400 h-2 rounded" style={{ width: `${humidity}%` }}></div>
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-[#1E213A] rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-300 mb-2">Visibility</p>
        <h3 className="text-5xl font-bold">
          {visibilityKm}
          <span className="text-2xl font-light">km</span>
        </h3>
      </div>

      {/* Air Pressure */}
      <div className="bg-[#1E213A] rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-300 mb-2">Air Pressure</p>
        <h3 className="text-5xl font-bold">
          {pressure}
          <span className="text-2xl font-light">mb</span>
        </h3>
      </div>
    </section>
  );
}
