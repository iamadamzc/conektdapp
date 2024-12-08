import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth-store';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  company: z.string().min(2, 'Company name is too short'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { register, isLoading } = useAuthStore();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...registerField('email')}
            error={errors.email?.message}
          />
        </div>

        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...registerField('firstName')}
            error={errors.firstName?.message}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...registerField('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            {...registerField('company')}
            error={errors.company?.message}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};