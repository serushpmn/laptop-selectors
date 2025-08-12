import React from 'react';
import Card from './Card';

export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  desc?: string;
}

interface Step1CategoriesProps {
  categories: CategoryItem[];
  selectedCategory: string | null;
  onSelectionChange: (id: string) => void;
}

export default function Step1Categories({ categories, selectedCategory, onSelectionChange }: Step1CategoriesProps) {
  const selected = categories.find(c => c.id === selectedCategory);

  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-2">
        ۱. لپ‌تاپ را برای چه کاری می‌خواهید؟
      </h2>
      <p className="text-center text-gray-500 mb-6">
        دسته اصلی کاربری خود را انتخاب کنید.
      </p>
      
      <div id="category-cards" className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(item => (
          <Card
            key={item.id}
            id={item.id}
            icon={item.icon}
            name={item.name}
            desc={item.desc}
            type="radio"
            isSelected={selectedCategory === item.id}
            onClick={onSelectionChange}
          />
        ))}
      </div>
      
      {selected?.desc && (
        <div id="category-info" className="info-box visible mt-6 p-4 bg-blue-50 border-r-4 border-blue-400 text-blue-800 rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: selected.desc }} />
        </div>
      )}
    </>
  );
}
