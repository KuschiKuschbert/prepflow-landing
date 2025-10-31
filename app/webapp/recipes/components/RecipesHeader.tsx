import Image from 'next/image';

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
        <h1 className="text-4xl font-bold text-white">📖 Recipe Book</h1>
      </div>
      <p className="text-gray-400">Manage your saved recipes and create new ones</p>
    </div>
  );
}
