import { Metadata } from 'next';
import QuestPageContent from './content';

export const metadata: Metadata = {
  title: 'CurbOS Passport',
  description: 'Your digital loyalty passport.',
};

export default async function QuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <QuestPageContent id={id} />;
}
