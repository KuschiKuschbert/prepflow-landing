import { Metadata } from 'next';

export function generateMetadata(locale: string = 'en'): Metadata {
  // This would normally load from translation files, but for now we'll use static data
  const metadataByLocale: Record<string, Metadata> = {
    en: {
      title: "PrepFlow – COGS & Menu Profit Tool | Get Menu Clarity & Profit Insights",
      description: "Your menu profitability tool built from 20 years of real kitchen experience. PrepFlow helps identify profit opportunities with contributing margin analysis, COGS tracking, and profit insights. Built for global hospitality with multi-currency support. Start your profit journey now.",
      keywords: [
        "restaurant COGS",
        "menu profitability", 
        "contributing margin",
        "gross profit optimization",
        "global hospitality",
        "international restaurants",
        "multi-currency support",
        "restaurant management",
        "menu costing",
        "profit analysis",
        "worldwide restaurant software"
      ],
    },
    es: {
      title: "PrepFlow – Herramienta de COGS y Rentabilidad del Menú | Obtén Claridad y Perspectivas de Beneficios",
      description: "Tu herramienta de rentabilidad del menú construida con 20 años de experiencia real en cocina. PrepFlow ayuda a identificar oportunidades de beneficio con análisis de margen contributivo, seguimiento de COGS y perspectivas de beneficio. Construido para hospitalidad global con soporte multi-moneda. Comienza tu viaje de beneficios ahora.",
      keywords: [
        "COGS restaurante",
        "rentabilidad menú",
        "margen contributivo",
        "optimización beneficio bruto",
        "hospitalidad global",
        "restaurantes internacionales",
        "soporte multi-moneda",
        "gestión restaurante",
        "costeo menú",
        "análisis beneficio",
        "software restaurante mundial"
      ],
    },
    fr: {
      title: "PrepFlow – Outil COGS et Rentabilité Menu | Obtenez Clarté et Insights de Profit",
      description: "Votre outil de rentabilité de menu construit avec 20 ans d'expérience réelle en cuisine. PrepFlow aide à identifier les opportunités de profit avec l'analyse de marge contributive, le suivi COGS et les insights de profit. Construit pour l'hospitalité mondiale avec support multi-devises. Commencez votre parcours de profit maintenant.",
      keywords: [
        "COGS restaurant",
        "rentabilité menu",
        "marge contributive",
        "optimisation profit brut",
        "hospitalité mondiale",
        "restaurants internationaux",
        "support multi-devises",
        "gestion restaurant",
        "coûts menu",
        "analyse profit",
        "logiciel restaurant mondial"
      ],
    },
    de: {
      title: "PrepFlow – COGS & Menü-Profit-Tool | Erhalten Sie Menü-Klarheit & Profit-Einblicke",
      description: "Ihr Menü-Profitabilitäts-Tool, gebaut mit 20 Jahren echter Küchenerfahrung. PrepFlow hilft dabei, Profit-Chancen mit Contributing-Margin-Analyse, COGS-Tracking und Profit-Einblicken zu identifizieren. Gebaut für globale Gastronomie mit Multi-Währungs-Support. Starten Sie jetzt Ihre Profit-Reise.",
      keywords: [
        "Restaurant COGS",
        "Menü-Profitabilität",
        "Contributing Margin",
        "Bruttoprofit-Optimierung",
        "globale Gastronomie",
        "internationale Restaurants",
        "Multi-Währungs-Support",
        "Restaurant-Management",
        "Menü-Kostenrechnung",
        "Profit-Analyse",
        "weltweite Restaurant-Software"
      ],
    },
    it: {
      title: "PrepFlow – Strumento COGS e Profittabilità Menu | Ottieni Chiarezza e Insights sui Profitti",
      description: "Il tuo strumento di profittabilità del menu costruito con 20 anni di esperienza reale in cucina. PrepFlow aiuta a identificare opportunità di profitto con analisi del margine contributivo, tracciamento COGS e insights sui profitti. Costruito per l'ospitalità globale con supporto multi-valuta. Inizia il tuo viaggio di profitto ora.",
      keywords: [
        "COGS ristorante",
        "profittabilità menu",
        "margine contributivo",
        "ottimizzazione profitto lordo",
        "ospitalità globale",
        "ristoranti internazionali",
        "supporto multi-valuta",
        "gestione ristorante",
        "costi menu",
        "analisi profitto",
        "software ristorante mondiale"
      ],
    },
    pt: {
      title: "PrepFlow – Ferramenta COGS e Lucratividade do Menu | Obtenha Clareza e Insights de Lucro",
      description: "Sua ferramenta de lucratividade de menu construída com 20 anos de experiência real em cozinha. PrepFlow ajuda a identificar oportunidades de lucro com análise de margem contributiva, rastreamento COGS e insights de lucro. Construído para hospitalidade global com suporte multi-moeda. Comece sua jornada de lucro agora.",
      keywords: [
        "COGS restaurante",
        "lucratividade menu",
        "margem contributiva",
        "otimização lucro bruto",
        "hospitalidade global",
        "restaurantes internacionais",
        "suporte multi-moeda",
        "gestão restaurante",
        "custeio menu",
        "análise lucro",
        "software restaurante mundial"
      ],
    },
    ja: {
      title: "PrepFlow – COGS & メニュー利益ツール | メニューの明確性と利益インサイトを取得",
      description: "20年の実際のキッチン経験から構築されたメニュー収益性ツール。PrepFlowは、貢献マージン分析、COGS追跡、利益インサイトで利益機会を特定するのに役立ちます。マルチ通貨サポートでグローバルホスピタリティ向けに構築。今すぐ利益の旅を始めましょう。",
      keywords: [
        "レストランCOGS",
        "メニュー収益性",
        "貢献マージン",
        "粗利益最適化",
        "グローバルホスピタリティ",
        "国際レストラン",
        "マルチ通貨サポート",
        "レストラン管理",
        "メニュー原価計算",
        "利益分析",
        "世界レストランソフトウェア"
      ],
    },
    zh: {
      title: "PrepFlow – COGS和菜单利润工具 | 获取菜单清晰度和利润洞察",
      description: "基于20年真实厨房经验构建的菜单盈利能力工具。PrepFlow通过贡献利润率分析、COGS跟踪和利润洞察帮助识别利润机会。为全球酒店业构建，支持多货币。立即开始您的利润之旅。",
      keywords: [
        "餐厅COGS",
        "菜单盈利能力",
        "贡献利润率",
        "毛利润优化",
        "全球酒店业",
        "国际餐厅",
        "多货币支持",
        "餐厅管理",
        "菜单成本核算",
        "利润分析",
        "全球餐厅软件"
      ],
    },
  };

  const metadata = metadataByLocale[locale] || metadataByLocale.en;

  return {
    ...metadata,
    authors: [{ name: "PrepFlow Team" }],
    creator: "PrepFlow",
    publisher: "PrepFlow",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://www.prepflow.org'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: 'https://www.prepflow.org',
      siteName: 'PrepFlow',
      images: [
        {
          url: '/images/dashboard-screenshot.png',
          width: 1200,
          height: 630,
          alt: 'PrepFlow Dashboard showing COGS metrics and profit analysis',
        },
      ],
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['/images/dashboard-screenshot.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
  };
}