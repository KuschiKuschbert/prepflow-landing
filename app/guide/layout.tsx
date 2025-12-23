import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/webapp/guide',
  },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}




