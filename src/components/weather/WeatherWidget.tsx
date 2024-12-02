import React from 'react';
import { Cloud, Wind } from 'lucide-react';
import type { WeatherInfo } from '../../types/habit';

interface WeatherWidgetProps {
  weather: WeatherInfo;
}

const WeatherWidget = ({ weather }: WeatherWidgetProps) => {
  return (
    <div className="bg-[#FFF8E7] rounded-xl p-6 relative overflow-hidden">
      <h3 className="text-lg font-semibold mb-4">Weather</h3>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-6 h-6 text-gray-600" />
            <span className="text-3xl font-bold">{weather.temperature}°C</span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4" />
              <span>Wind: {weather.wind}</span>
            </div>
            <div>Pressure: {weather.pressure}</div>
            <div>Humidity: {weather.humidity}%</div>
          </div>
        </div>
        <img
          src="/umbrella-illustration.svg"
          alt="Weather illustration"
          className="absolute bottom-0 right-0 w-32 h-32"
        />
      </div>
    </div>
  );
}

export default WeatherWidget;