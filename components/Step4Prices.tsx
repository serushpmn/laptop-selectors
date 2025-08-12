import React from 'react';
import Card from './Card';
import { priceRanges } from '@/lib/staticData';

interface Step4PricesProps {
  selectedPrice: string | null;
  onSelectionChange: (id: string) => void;
}

export default function Step4Prices({ selectedPrice, onSelectionChange }: Step4PricesProps) {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-2">
        ۴. بودجه خود را مشخص کنید.
      </h2>
      <p className="text-center text-gray-500 mb-6">
        محدوده قیمتی مورد نظر خود را انتخاب کنید.
      </p>
      
      <div id="price-cards" className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto">
        {priceRanges.map(item => (
          <Card
            key={item.id}
            id={item.id}
            name={item.name}
            type="radio"
            isSelected={selectedPrice === item.id}
            onClick={onSelectionChange}
          />
        ))}
      </div>
    </>
  );
}
