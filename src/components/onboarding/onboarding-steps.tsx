import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';
import { ArrowRight } from 'lucide-react';

const userSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
});

type UserFormData = z.infer<typeof userSchema>;

interface StepProps {
  onNext: () => void;
}

export const PersonalInfoStep: React.FC<StepProps> = ({ onNext }) => {
  const { register: registerUser, isLoading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await registerUser(data);
      onNext();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Create your account</h2>
        <p className="text-gray-600">
          Enter your details to get started with Conektd
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Work Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="Your Company"
            {...register('company')}
            error={errors.company?.message}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            'Creating Account...'
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};