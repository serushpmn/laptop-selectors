import React from 'react';
import { priceRanges } from '@/lib/staticData';

interface SummaryBarProps {
  currentStep: number;
  selections: any;
  categories: { id: string; name: string }[];
}

export default function SummaryBar({ currentStep, selections, categories }: SummaryBarProps) {
  const TOTAL_STEPS = 4;
  if (currentStep > TOTAL_STEPS) return null;

  const cat = categories.find(c => c.id === selections[1])?.name || '...';
  const price = priceRanges.find(p => p.id === selections[4])?.name || '...';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 shadow-2xl">
      <div className="container mx-auto flex justify-center items-center gap-4 text-sm">
        <span className="font-bold">انتخاب شما:</span>
        <span>کاربری: {cat}</span>
        <span>|</span>
        <span>بودجه: {price}</span>
      </div>
    </div>
  );
}
