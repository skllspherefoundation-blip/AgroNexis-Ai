import { CloudRain, CloudSun, Droplets, Wind } from "lucide-react";
import { forecast } from "@/lib/dashboard-data";

export function WeatherWidget() {
  return (
    <div>
      <div className="rounded-lg border border-sky-300/20 bg-sky-400/10 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-sky-100">Today at Greenridge Estate</p>
            <p className="mt-2 text-4xl font-semibold text-white">27°C</p>
            <p className="mt-1 text-sm text-slate-400">Cloud cover with moderate humidity</p>
          </div>
          <CloudSun className="h-10 w-10 text-sky-200" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-sky-300" />
            Wind 12 km/h
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-emerald-300" />
            Humidity 68%
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {forecast.map((day) => (
          <div key={day.day} className="rounded-lg border border-white/10 bg-white/7 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">{day.day}</p>
              <CloudRain className="h-4 w-4 text-sky-300" />
            </div>
            <p className="mt-2 text-lg font-semibold text-white">{day.temp}</p>
            <p className="text-xs text-slate-400">{day.condition}</p>
            <p className="mt-2 text-xs text-emerald-200">Rain {day.rain}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
