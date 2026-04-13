import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface HorizontalStepperProps {
  steps: Step[];
  onStepClick?: (stepId: number) => void;
}

export default function HorizontalStepper({ steps, onStepClick }: HorizontalStepperProps) {
  const activeIndex = steps.findIndex(s => s.isActive);

  return (
    <div className="w-full bg-surface-container-low/50 backdrop-blur-sm border-b border-on-surface-variant/5">
      {/* Desktop Stepper - Minimal Design */}
      <div className="hidden sm:flex items-center justify-center px-6 py-3">
        <div className="flex items-center gap-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Button */}
              <button
                onClick={() => onStepClick?.(step.id)}
                className={`group relative flex items-center gap-3 transition-all duration-200 ${
                  step.isActive ? 'scale-100' : 'scale-95 opacity-70 hover:opacity-100'
                }`}
                aria-label={`Go to ${step.label}`}
                aria-current={step.isActive ? 'step' : undefined}
              >
                {/* Step Indicator */}
                <div className={`relative w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  step.isCompleted 
                    ? 'bg-tertiary text-surface shadow-lg shadow-tertiary/25' 
                    : step.isActive 
                      ? 'bg-tertiary text-surface ring-2 ring-tertiary/30 ring-offset-2 ring-offset-surface-container-low/50' 
                      : 'bg-on-surface-variant/20 text-on-surface-variant border border-on-surface-variant/10'
                }`}>
                  {step.isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={4} />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                  
                  {/* Active Pulse */}
                  {step.isActive && (
                    <div className="absolute inset-0 rounded-full bg-tertiary animate-ping opacity-20" />
                  )}
                </div>

                {/* Step Label */}
                <span className={`text-base font-semibold transition-all duration-200 leading-tight ${
                  step.isActive 
                    ? 'text-on-surface' 
                    : step.isCompleted 
                      ? 'text-tertiary' 
                      : 'text-on-surface-variant'
                }`}>
                  {step.label}
                </span>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-on-surface text-surface text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  {step.isCompleted ? 'Completed' : step.isActive ? 'Current' : 'Click to navigate'}
                </div>
              </button>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className={`w-12 h-px transition-all duration-300 ${
                  index < activeIndex ? 'bg-tertiary' : 'bg-on-surface-variant/20'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Stepper - Ultra Compact */}
      <div className="sm:hidden px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Step Info */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-on-surface">
              {activeIndex + 1}/{steps.length}
            </span>
            <span className="text-sm font-medium text-tertiary">
              {steps[activeIndex]?.label}
            </span>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => onStepClick?.(step.id)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  step.isCompleted 
                    ? 'bg-tertiary' 
                    : step.isActive 
                      ? 'bg-tertiary w-4' 
                      : 'bg-on-surface-variant/30'
                }`}
                aria-label={`Go to step ${step.id}`}
                aria-current={step.isActive ? 'step' : undefined}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-on-surface-variant/10 rounded-full h-0.5">
          <div 
            className="bg-tertiary h-0.5 rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${((activeIndex + 1) / steps.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}
