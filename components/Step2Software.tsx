import React from "react";
import Card from "./Card";

export interface ProgramItem {
  id: string;
  name: string;
  desc?: string;
}

interface Step2SoftwareProps {
  programs: Record<string, { fa_name: string; items: ProgramItem[] }>;
  selectedSoftware: string[];
  onSelectionChange: (id: string) => void;
}

const Step2Software: React.FC<Step2SoftwareProps> = ({
  programs,
  selectedSoftware,
  onSelectionChange,
}) => {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-semibold text-center mb-2">
        ۲. بیشتر از چه برنامه‌هایی استفاده می‌کنید؟
      </h2>
      <p className="text-center text-gray-500 mb-6">
        این به ما کمک می‌کند قدرت پردازشی مورد نیاز شما را تخمین بزنیم.
      </p>

      <div
        id="software-cards"
        className="flex flex-col md:flex-row gap-6 overflow-x-auto max-w-full px-2 "
        style={{ direction: "rtl" }}
      >
        {Object.entries(programs).map(([catId, group]) => (
          <div
            key={catId}
            className="min-w-[220px] flex-1 bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-200"
          >
            <div className="font-bold text-emerald-700 mb-2 text-center text-base">
              {group.fa_name}
            </div>
            <div className="flex flex-col gap-2">
              {group.items.map((item) => (
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
          </div>
        ))}
      </div>
    </>
  );
};
export default Step2Software;
