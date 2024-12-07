import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCompanyFromEmail(email: string): string {
  try {
    const domain = email.split('@')[1];
    return domain.split('.')[0];
  } catch {
    return '';
  }
}

export function formatLinkedInSearchQuery(firstName: string, lastName: string, company: string): string {
  const searchParams = new URLSearchParams({
    keywords: `${firstName} ${lastName} ${company}`,
    origin: 'GLOBAL_SEARCH_HEADER'
  });
  return `https://www.linkedin.com/search/results/all/?${searchParams.toString()}`;
}