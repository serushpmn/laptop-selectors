import React from 'react';

interface CardProps {
  id: string;
  icon?: string;
  name: string;
  desc?: string;
  type: 'radio' | 'checkbox';
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function Card({ id, icon, name, desc, type, isSelected, onClick }: CardProps) {
  return (
    <div 
      data-id={id} 
      className={`card ${type === 'checkbox' ? 'checkbox-card' : ''} bg-white p-4 rounded-lg border-2 flex items-start gap-4 ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(id)}
    >
      {type === 'checkbox' && (
        <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-emerald-500 rounded mt-1 pointer-events-none" 
          checked={isSelected}
          readOnly
        />
      )}
      <div className="flex-1">
        <div className="font-semibold text-gray-800">
          {icon && <span className="ml-2">{icon}</span>}
          {name}
        </div>
        {desc && <p className="text-sm text-gray-500 mt-1">{desc}</p>}
      </div>
    </div>
  );
}
