import Image from 'next/image';
import { BookOpen } from 'lucide-react';

export function RecipesHeader() {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-4">
        <Image
          src="/images/prepflow-logo.png"
          alt="PrepFlow Logo"
          width={40}
          height={40}
          className="rounded-lg"
          priority
        />
        <h1 className="flex items-center gap-2 text-4xl font-bold text-white">
          <BookOpen className="h-8 w-8" />
          Recipe Book
        </h1>
      </div>
      <p className="text-gray-400">Manage your saved recipes and create new ones</p>
    </div>
  );
}
