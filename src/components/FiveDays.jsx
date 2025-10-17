import React, { useMemo, useState } from "react";
import useData from "../hooks/UseData";

export default function FiveDays({ city }) {
  const [unit, setUnit] = useState("C");
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const five_days_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric&lang=en`;
  const { data, loading, error } = useData(five_days_url);

  const dailyForecast = useMemo(() => {
    if (!data || !data.list) return [];

    const grouped = {};
    data.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    });

    const dates = Object.keys(grouped).slice(1, 6);
    const forecasts = dates.map((date) => {
      const dayData = grouped[date];
      const noon = dayData.find((d) => d.dt_txt.includes("12:00:00"));
      const chosen = noon || dayData[Math.floor(dayData.length / 2)];

      return {
        date,
        temp_max: chosen.main.temp_max,
        temp_min: chosen.main.temp_min,
        icon: chosen.weather[0].icon,
        description: chosen.weather[0].description,
      };
    });

    return forecasts;
  }, [data]);

  // 🔄 Conversión de °C → °F
  const convertTemp = (tempC) => {
    return unit === "C" ? Math.round(tempC) : Math.round((tempC * 9) / 5 + 32);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    return `${weekday}, ${day} ${month}`;
  };

  if (loading) return <p className="text-white">Loading forecast...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <section className="flex flex-col gap-4">
      {/* Botones °C / °F */}
      <div className="flex justify-end items-end h-20 w-64 gap-5 md:max-w-2xl md:w-full cursor-pointer">
        <button
          onClick={() => setUnit("C")}
          className={`w-10 h-10 pr-1 pt-1 text-center text-xl font-bold rounded-full ${
            unit === "C" ? "text-[#110E3C] bg-[#E7E7EB]" : "text-[#E7E7EB] bg-[#585676]"
          }`}
        >
          °C
        </button>
        <button
          onClick={() => setUnit("F")}
          className={`w-10 h-10 pr-1 pt-1 text-center text-xl font-bold rounded-full ${
            unit === "F" ? "text-[#110E3C] bg-[#E7E7EB]" : "text-[#E7E7EB] bg-[#585676]"
          }`}
        >
          °F
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {dailyForecast.map((day, i) => (
          <div key={day.date} className="bg-[#1f203b] flex flex-col items-center p-4 rounded text-white">
            <p className="mb-2">{i === 0 ? "Tomorrow" : formatDate(day.date)}</p>
            <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} className="w-16 my-4" />
            <p>
              {convertTemp(day.temp_max)}°{unit}{" "}
              <span className="text-gray-400">
                {convertTemp(day.temp_min)}°{unit}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
