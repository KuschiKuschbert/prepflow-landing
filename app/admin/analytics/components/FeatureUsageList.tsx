interface FeatureUsage {
  feature: string;
  usage: number;
}

interface AnalyticsData {
  totalUsers: number;
  featureUsage: FeatureUsage[];
}

interface FeatureUsageListProps {
  data: AnalyticsData | null;
}

export function FeatureUsageList({ data }: FeatureUsageListProps) {
  if (!data?.featureUsage || data.featureUsage.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Feature Usage</h2>
      <div className="space-y-3">
        {data.featureUsage.map(feature => (
          <div key={feature.feature} className="flex items-center justify-between">
            <span className="text-gray-300">{feature.feature}</span>
            <div className="flex items-center gap-4">
              <div className="h-2 w-48 rounded-full bg-[#2a2a2a]">
                <div
                  className="h-2 rounded-full bg-[#29E7CD]"
                  style={{
                    width: `${Math.min((feature.usage / (data.totalUsers || 1)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <span className="w-16 text-right text-white">{feature.usage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
