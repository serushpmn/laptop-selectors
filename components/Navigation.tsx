import React from 'react';

interface NavigationProps {
  currentStep: number;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onReset: () => void;
  onCompare: () => void;
  laptopsToCompare: string[];
}

export default function Navigation({ 
  currentStep, 
  canGoNext, 
  onBack, 
  onNext, 
  onFinish, 
  onReset, 
  onCompare,
  laptopsToCompare 
}: NavigationProps) {
  const TOTAL_STEPS = 4;
  const isQuestionnaire = currentStep <= TOTAL_STEPS;
  
  return (
    <div className="flex justify-between items-center mt-8 pt-5 border-t">
      <button 
        className={`btn btn-secondary font-bold py-2 px-6 rounded-lg ${currentStep === 1 ? 'opacity-0' : ''}`}
        disabled={currentStep === 1}
        onClick={onBack}
      >
        بازگشت
      </button>
      
      <div className={`flex gap-2 ${isQuestionnaire ? '' : 'hidden'}`}>
        {Array.from({length: TOTAL_STEPS}, (_, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${i < currentStep ? 'bg-blue-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
      
      {currentStep <= TOTAL_STEPS && (
        <>
          {currentStep < TOTAL_STEPS ? (
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
          )}
        </>
      )}
      
      {currentStep === 5 && (
        <button 
          className="btn btn-primary font-bold py-2 px-6 rounded-lg"
          onClick={onReset}
        >
          شروع مجدد
        </button>
      )}
      
      {currentStep === 5 && (
        <button 
          className="btn btn-primary font-bold py-2 px-6 rounded-lg"
          disabled={laptopsToCompare.length < 2}
          onClick={onCompare}
        >
          مقایسه انتخاب‌ها
        </button>
      )}
    </div>
  );
}
