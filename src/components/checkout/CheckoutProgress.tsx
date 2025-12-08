'use client';

import { Check } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';

type Step = 'shipping' | 'payment' | 'confirmation';

interface CheckoutProgressProps {
  currentStep: Step;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps = [
    { id: 'shipping', label: 'Shipping', number: 1 },
    { id: 'payment', label: 'Payment', number: 2 },
    { id: 'confirmation', label: 'Confirmation', number: 3 },
  ] as const;

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className={`${`max-w-3xl mx-auto my-4 border-b-2 pb-4`} ${(currentIndex === 0 || currentIndex === 1) ? 'mb-6' : ''}`}>
      <div className="flex pb-3">
        <div className="flex-1"></div>

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <Fragment key={step.id}>
              {index > 0 && (
                <div className="w-1/6 flex items-center">
                  <div className="w-full bg-gray-200 rounded h-1">
                    <div 
                      className="bg-[#8bc34a] h-1 rounded transition-all duration-300"
                      style={{ 
                        width: (isCompleted || (isActive && step.number === 3)) ? '100%' : isActive ? '50%' : '0%' 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col items-center">
                <div 
                  className={`
                    w-10 h-10 mx-auto rounded-full text-lg flex items-center justify-center
                    ${isCompleted || (isActive && step.number === 3) ? 'bg-[#8bc34a]' : 'bg-white border-2 border-gray-300'}
                    ${isActive ? 'border-2 border-[#8bc34a]' : ''}
                  `}
                >
                  {isCompleted || (isActive && step.number === 3) ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`${isActive ? 'text-[#8bc34a]' : 'text-gray-500'}`}>
                      {step.number}
                    </span>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}

        <div className="flex-1"></div>
      </div>

      <div className="flex text-xs text-center mx-28 -mt-2">
        {steps.map((step, index) => (
          <div 
            key={`label-${step.id}`} 
            className={`flex-1 tracking-wider ${index === 0 ? 'text-left pl-4' : index === steps.length - 1 ? 'text-right pr-4' : 'text-center'}`}
          >
            <span className={`${index <= currentIndex ? 'text-[#8bc34a]' : 'text-gray-500'} ${index === currentIndex && 'font-bold'} ${index === steps.length - 1 && 'relative left-2'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}