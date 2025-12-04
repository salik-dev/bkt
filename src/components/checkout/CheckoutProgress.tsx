'use client';

import { Check } from 'lucide-react';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutProgressProps {
  currentStep: Step;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const steps: { id: Step; label: string }[] = [
    { id: 'cart', label: 'Cart' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'confirmation', label: 'Confirmation' },
  ];

  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-[#8bc34a] transition-all duration-300"
            style={{ 
              width: `${(currentIndex / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                  ${isCompleted ? 'bg-[#8bc34a] border-[#8bc34a]' : ''}
                  ${isActive ? 'border-[#8bc34a] bg-white' : 'border-gray-300'}
                  ${index > currentIndex ? 'bg-white border-gray-300' : ''}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${isActive ? 'text-[#8bc34a]' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span 
                className={`mt-2 text-sm font-medium ${isCompleted || isActive ? 'text-[#8bc34a]' : 'text-gray-500'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
