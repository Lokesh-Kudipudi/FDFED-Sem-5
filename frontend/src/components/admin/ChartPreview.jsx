import React, { useEffect, useState } from "react";

export default function ChartPreview() {
  const initialHeights = [40, 60, 75, 55, 80, 95];
  const [heights, setHeights] = useState(initialHeights);

  useEffect(() => {
    const id = setInterval(() => {
      setHeights((h) =>
        h.map(() => Math.floor(Math.random() * 80) + 20)
      );
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full h-64 flex items-end gap-3">
      {heights.map((val, i) => (
        <div key={i} className="flex-1">
          <div
            className="bg-blue-500 rounded-t"
            style={{ height: `${val}%`, transition: "height 0.5s ease" }}
          />
          <div className="text-center text-xs text-gray-500 mt-2">
            {["Jan","Feb","Mar","Apr","May","Jun"][i] ?? `M${i+1}`}
          </div>
        </div>
      ))}
    </div>
  );
}