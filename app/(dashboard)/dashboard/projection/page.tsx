"use client";
import React, { useState } from "react";

import ProyeccionGrid from "./ProjectionGrid";
import Resumen from "./Resumen";

const ProjectionPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [allData, setAllData] = useState<import("./ProjectionGrid").DataItem[]>(
    []
  );

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      <div className="p-2">
        <h1 className="text-2xl font-bold">Proyecciones</h1>
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {/* Columna principal */}
        <div className="flex-1 min-w-[60%]">
          <ProyeccionGrid
            onDateSelect={(date, items) => {
              setSelectedDate(date);
              setAllData(items);
            }}
          />
        </div>
        {/* Columna secundaria */}
        <div className="flex-[0.3] min-w-[30%]">
          <Resumen data={allData} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default ProjectionPage;
