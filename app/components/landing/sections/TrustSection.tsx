import { useTranslation } from '../../../../lib/useTranslation';

export function TrustSection() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-gray-700 py-16">
      <div className="mb-8 text-center">
        <h3 className="text-fluid-2xl mb-4 font-bold tracking-tight">
          {t('trust.title', 'Trusted by Restaurants Worldwide')}
        </h3>
        <p className="text-gray-400">
          {t(
            'trust.subtitle',
            'Join hundreds of restaurants already using PrepFlow to maximize their profits',
          )}
        </p>
      </div>
      <div className="desktop:grid-cols-3 grid gap-8">
        <div className="text-center">
          <div className="text-fluid-3xl mb-2 font-bold text-[#29E7CD]">500+</div>
          <div className="text-gray-400">{t('trust.restaurants', 'Restaurants')}</div>
        </div>
        <div className="text-center">
          <div className="text-fluid-3xl mb-2 font-bold text-[#3B82F6]">$2M+</div>
          <div className="text-gray-400">{t('trust.savings', 'Cost Savings')}</div>
        </div>
        <div className="text-center">
          <div className="text-fluid-3xl mb-2 font-bold text-[#D925C7]">4.8★</div>
          <div className="text-gray-400">{t('trust.rating', 'Customer Rating')}</div>
        </div>
      </div>
    </section>
  );
}
