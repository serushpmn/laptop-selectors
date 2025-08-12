import React from "react";

export interface CategoryItem {
  id: string;
  name: string; // Original name from DB
  fa_name: string; // Persian name for display
  icon?: string;
  desc?: any;
}

interface Step1CategoriesProps {
  categories: CategoryItem[];
  selectedCategories: string[];
  onSelectionChange: (id: string) => void;
}

const Step1Categories: React.FC<Step1CategoriesProps> = ({
  categories,
  selectedCategories,
  onSelectionChange,
}) => {
  const renderDescList = (desc: any) => {
    if (!desc) return null;
    let items: string[] = [];
    if (Array.isArray(desc)) {
      items = desc.map((v) => String(v));
    } else if (typeof desc === "object") {
      items = Object.values(desc).map((v) => String(v));
    } else if (typeof desc === "string") {
      items = [desc];
    }
    if (items.length === 0) return null;
    return (
      <ul className="list-disc pr-5 space-y-1 text-sm text-gray-600 mt-2 text-right w-full">
        {items.map((t, idx) => (
          <li key={idx}>{t}</li>
        ))}
      </ul>
    );
  };

  // Presentational component only; data and effects live in page.tsx

  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-2">
        ۱. لپ‌تاپ را برای چه کاری می‌خواهید؟
      </h2>
      <p className="text-center text-gray-500 mb-6">
        دسته اصلی کاربری خود را انتخاب کنید.
      </p>

      <div
        id="category-cards"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        {categories.map((item) => {
          const isSelected = selectedCategories.includes(item.id);
          return (
            <div
              key={item.id}
              className={`card bg-white p-4 rounded-lg border-2 flex flex-col items-center text-center gap-2 ${
                isSelected ? "selected" : ""
              }`}
              onClick={() => onSelectionChange(item.id)}
            >
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="mb-1 accent-emerald-500"
                style={{ pointerEvents: "none" }}
              />
              {item.icon && (
                <div className="text-3xl md:text-4xl mb-1 select-none">
                  {item.icon}
                </div>
              )}
              <div className="font-semibold text-gray-800">{item.fa_name}</div>
              {renderDescList(item.desc)}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Step1Categories;
