import React from "react";

interface CardProps {
  id: string;
  icon?: string;
  name: string;
  desc?: string;
  type: "radio" | "checkbox";
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function Card({
  id,
  icon,
  name,
  desc,
  type,
  isSelected,
  onClick,
}: CardProps) {
  return (
    <div
      data-id={id}
      className={`card ${
        type === "checkbox" ? "checkbox-card" : ""
      } bg-white p-3 rounded-xl border flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isSelected
          ? "selected ring-2 ring-emerald-400 border-emerald-400"
          : "border-gray-200"
      }`}
      onClick={() => onClick(id)}
      style={{ minHeight: 56 }}
    >
      {type === "checkbox" && (
        <span className="flex items-center justify-center w-6 h-6">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-emerald-500 rounded pointer-events-none"
            checked={isSelected}
            readOnly
          />
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">
          {icon && <span className="ml-2">{icon}</span>}
          {name}
        </div>
        {desc && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{desc}</p>
        )}
      </div>
    </div>
  );
}
