import React from 'react';
import Card from './Card';

export interface ProgramItem {
  id: string;
  name: string;
  desc?: string;
}

interface Step2SoftwareProps {
  programs: ProgramItem[];
  selectedSoftware: string[];
  onSelectionChange: (id: string) => void;
}

export default function Step2Software({ programs, selectedSoftware, onSelectionChange }: Step2SoftwareProps) {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-2">
        ۲. بیشتر از چه برنامه‌هایی استفاده می‌کنید؟
      </h2>
      <p className="text-center text-gray-500 mb-6">
        این به ما کمک می‌کند قدرت پردازشی مورد نیاز شما را تخمین بزنیم.
      </p>
      
      <div id="software-cards" className="space-y-3">
        {programs.map(item => (
          <Card
            key={item.id}
            id={item.id}
            name={item.name}
            desc={item.desc}
            type="checkbox"
            isSelected={selectedSoftware.includes(item.id)}
            onClick={onSelectionChange}
          />
        ))}
      </div>
    </>
  );
}
