import React, { useState } from 'react';
import { Link2 } from 'lucide-react';
import { PersonalInfoStep } from '@/components/onboarding/onboarding-steps';
import { EmailProviderStep } from '@/components/onboarding/email-provider-step';

export const OnboardingPage = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link2 className="h-12 w-12 text-blue-600" />
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-8">
          {step === 1 ? (
            <PersonalInfoStep onNext={() => setStep(2)} />
          ) : (
            <EmailProviderStep />
          )}
        </div>

        <div className="mt-6 flex items-center justify-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`h-2 w-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        </div>
      </div>
    </div>
  );
};