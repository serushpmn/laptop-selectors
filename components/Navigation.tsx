import React from "react";

interface NavigationProps {
  currentStep: number;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onReset: () => void;
  onCompare: () => void;
  laptopsToCompare: any[];
  summaryText?: string;
}

function Navigation(props: NavigationProps) {
  const {
    currentStep,
    canGoNext,
    onBack,
    onNext,
    onFinish,
    onReset,
    onCompare,
    laptopsToCompare,
    summaryText,
  } = props;
  const TOTAL_STEPS = 4;
  const isQuestionnaire = currentStep <= TOTAL_STEPS;
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-200 shadow-lg px-2 pt-2 pb-3 flex flex-col gap-1"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div className="w-full text-xs text-gray-700 text-center mb-1 whitespace-nowrap overflow-x-auto">
        {summaryText}
      </div>
      <div className="flex flex-row items-center justify-between w-full gap-2">
        {/* Right: small back/reset */}
        <div className="flex flex-col gap-2">
          <button
            className={`btn btn-secondary py-1 px-3 text-sm rounded-lg ${
              currentStep === 1 ? "opacity-0" : ""
            }`}
            disabled={currentStep === 1}
            onClick={onBack}
          >
            بازگشت
          </button>
          <button
            className="btn btn-secondary py-1 px-3 text-sm rounded-lg"
            onClick={onReset}
          >
            شروع مجدد
          </button>
        </div>
        {/* Center: stepper */}
        <div className={`flex gap-2 ${isQuestionnaire ? "" : "hidden"}`}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i < currentStep ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        {/* Left: big next/finish */}
        <div className="flex gap-2">
          {currentStep <= TOTAL_STEPS &&
            (currentStep < TOTAL_STEPS ? (
              <button
                className="btn btn-primary font-bold py-2 px-6 rounded-lg"
                disabled={!canGoNext}
                onClick={onNext}
              >
                بعدی
              </button>
            ) : (
              <button
                className="btn btn-primary font-bold py-2 px-6 rounded-lg"
                disabled={!canGoNext}
                onClick={onFinish}
              >
                نمایش نتایج
              </button>
            ))}
          {currentStep === 5 && (
            <>
              <button
                className="btn btn-primary font-bold py-2 px-6 rounded-lg mr-2"
                onClick={onReset}
              >
                شروع مجدد
              </button>
              <button
                className="btn btn-primary font-bold py-2 px-6 rounded-lg"
                disabled={laptopsToCompare.length < 2}
                onClick={onCompare}
              >
                مقایسه انتخاب‌ها
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
