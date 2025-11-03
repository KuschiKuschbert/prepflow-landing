import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  showLogo?: boolean;
}

export function PageHeader({ title, subtitle, icon, showLogo = false }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-4">
        {showLogo && (
          <Image
            src="/images/prepflow-logo.png"
            alt="PrepFlow Logo"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
        )}
        <h1 className="text-4xl font-bold text-white">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h1>
      </div>
      {subtitle && <p className="text-gray-400">{subtitle}</p>}
    </div>
  );
}
