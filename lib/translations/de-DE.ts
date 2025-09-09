// German (Germany) translations
export const translations = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    ingredients: 'Zutaten',
    recipes: 'Rezeptbuch',
    cogs: 'COGS',
    setup: 'Setup',
    backToLanding: 'Zurück zur Startseite',
    features: 'Funktionen',
    howItWorks: 'So funktioniert es',
    pricing: 'Preise',
    faq: 'FAQ'
  },

  // WebApp Dashboard
  dashboard: {
    title: 'Küchen-Management Dashboard',
    subtitle: 'Willkommen zurück! Hier ist Ihr Küchen-Überblick',
    totalIngredients: 'Zutaten gesamt',
    totalRecipes: 'Rezepte gesamt',
    menuDishes: 'Menügerichte',
    avgDishPrice: 'Ø Gerichtspreis',
    quickActions: 'Schnellaktionen',
    quickActionsSubtitle: 'Springen Sie zu Ihren am häufigsten verwendeten Funktionen',
    live: 'Live',
    manageIngredients: 'Zutaten verwalten',
    manageIngredientsDesc: 'Hinzufügen, bearbeiten und organisieren',
    manageIngredientsSubtitle: 'Erstellen Sie Ihr Kücheninventar mit detaillierter Zutatenverfolgung',
    recipeBook: 'Rezeptbuch',
    recipeBookDesc: 'Gespeicherte Rezepte anzeigen',
    recipeBookSubtitle: 'Zugriff auf Ihre gespeicherten Rezepte aus COGS-Berechnungen',
    calculateCOGS: 'COGS berechnen',
    calculateCOGSDesc: 'Kosten & Margen analysieren',
    calculateCOGSSubtitle: 'Berechnen Sie die Kosten der verkauften Waren und Gewinnmargen',
    gettingStarted: 'Erste Schritte mit PrepFlow',
    gettingStartedDesc: 'Willkommen in Ihrem Küchenmanagement-Hub! Beginnen Sie mit dem Hinzufügen Ihrer Zutaten, um Ihr Inventar aufzubauen, und erstellen Sie dann Rezepte, um Ihre Kosten der verkauften Waren (COGS) zu berechnen und Ihre Gewinnmargen zu optimieren.',
    realTimeAnalytics: 'Echtzeit-Analysen',
    profitOptimization: 'Gewinnoptimierung',
    smartInsights: 'Intelligente Einblicke'
  },

  // WebApp Ingredients
  ingredients: {
    title: 'Zutatenverwaltung',
    subtitle: 'Verwalten Sie Ihre Küchenzutaten und Ihr Inventar',
    displayCostsIn: 'Kosten anzeigen in',
    addIngredient: 'Zutat hinzufügen',
    cancel: 'Abbrechen',
    importCSV: 'CSV importieren',
    exportCSV: 'CSV exportieren',
    search: 'Suchen',
    searchPlaceholder: 'Zutaten suchen...',
    supplier: 'Lieferant',
    allSuppliers: 'Alle Lieferanten',
    storage: 'Lagerung',
    allLocations: 'Alle Standorte',
    sortBy: 'Sortieren nach',
    name: 'Name',
    costLowToHigh: 'Kosten (niedrig zu hoch)',
    costHighToLow: 'Kosten (hoch zu niedrig)',
    supplierName: 'Lieferant',
    ingredients: 'Zutaten',
    liveData: 'Live-Daten',
    noIngredientsFound: 'Keine Zutaten gefunden',
    noIngredientsDesc: 'Fügen Sie Ihre erste Zutat hinzu, um Ihr Kücheninventar aufzubauen',
    noIngredientsFilterDesc: 'Versuchen Sie, Ihre Suchfilter anzupassen, um zu finden, wonach Sie suchen',
    addFirstIngredient: 'Ihre erste Zutat hinzufügen',
    ingredient: 'Zutat',
    packSize: 'Packungsgröße',
    unit: 'Einheit',
    cost: 'Kosten',
    wastePercent: 'Abfall %',
    yieldPercent: 'Ausbeute %',
    actions: 'Aktionen',
    editIngredient: 'Zutat bearbeiten',
    deleteIngredient: 'Zutat löschen',
    editIngredientTitle: 'Zutat bearbeiten',
    ingredientName: 'Zutatenname',
    brand: 'Marke',
    unitRequired: 'Einheit *',
    selectUnit: 'Einheit auswählen',
    costPerUnit: 'Kosten pro Einheit (€)',
    trimWastePercent: 'Zuschnitt/Abfall-Prozentsatz (%)',
    storageLocation: 'Lagerort',
    productCode: 'Produktcode',
    minStockLevel: 'Mindestbestand',
    updateIngredient: 'Zutat aktualisieren',
    // Add Ingredient Wizard
    addNewIngredient: 'Neue Zutat hinzufügen',
    guidedSetup: 'Geführtes Setup',
    basicInformation: 'Grundinformationen',
    basicInformationDesc: 'Beginnen wir mit den wesentlichen Details',
    packagingInformation: 'Verpackungsinformationen',
    packSizeRequired: 'Packungsgröße *',
    packUnitRequired: 'Packungseinheit *',
    individualUnitRequired: 'Einzelne Einheit *',
    packPriceRequired: 'Packungspreis (€) *',
    selectPackUnit: 'Packungseinheit auswählen',
    selectIndividualUnit: 'Einzelne Einheit auswählen',
    grams: 'Gramm (g)',
    kilograms: 'Kilogramm (kg)',
    milliliters: 'Milliliter (ml)',
    liters: 'Liter (L)',
    pieces: 'Stück',
    box: 'Karton',
    pack: 'Packung',
    bag: 'Beutel',
    bottle: 'Flasche',
    can: 'Dose',
    packPriceHelper: 'Geben Sie den Gesamtpackungspreis ein (z.B. 13,54€ für einen 5L Joghurt-Behälter). Das System berechnet automatisch den Preis pro Einheit.',
    pricePerUnit: 'Preis pro {unit}: {cost}€',
    nextStep: 'Nächster Schritt →',
    advancedSettings: 'Erweiterte Einstellungen',
    advancedSettingsDesc: 'Konfigurieren Sie Abfall, Ausbeute und Lieferanteninformationen',
    wastageYieldManagement: 'Abfall- & Ausbeuteverwaltung',
    trimWastePercentage: 'Zuschnitt/Abfall-Prozentsatz',
    yieldPercentage: 'Ausbeute-Prozentsatz',
    aiSuggests: 'KI schlägt vor: {percentage}% basierend auf "{name}"',
    supplierInformation: 'Lieferanteninformationen',
    selectSupplier: 'Lieferant auswählen',
    addNewSupplier: '+ Neuen Lieferanten hinzufügen',
    enterNewSupplier: 'Neuen Lieferantennamen eingeben',
    add: 'Hinzufügen',
    additionalInformation: 'Zusätzliche Informationen',
    productCodeOptional: 'Produktcode (Optional)',
    previousStep: '← Vorheriger Schritt',
    reviewSave: 'Überprüfen & Speichern',
    reviewSaveDesc: 'Überprüfen Sie Ihre Zutatenangaben vor dem Speichern',
    ingredientSummary: 'Zutatenzusammenfassung',
    additionalDetails: 'Zusätzliche Details',
    startOver: 'Neu beginnen',
    saveIngredient: 'Zutat speichern',
    // CSV Import
    importFromCSV: 'Zutaten aus CSV importieren',
    previewFound: 'Vorschau ({count} Zutaten gefunden)',
    selectAll: 'Alle auswählen',
    clearAll: 'Alle löschen',
    importing: 'Importiere...',
    importSelected: 'Ausgewählte importieren ({count})',
    // Units
    weight: 'Gewicht',
    volume: 'Volumen',
    teaspoons: 'Teelöffel (TL)',
    tablespoons: 'Esslöffel (EL)',
    cups: 'Tassen'
  },
  
  // Hero Section
  hero: {
    title: 'Hören Sie auf, den Gewinn Ihrer Speisekarte zu erraten',
    subtitle: 'Sehen Sie genau, welche Gerichte Geld verdienen und welche Ihren Gewinn auffressen. Entwickelt aus 20 Jahren echter Küchenerfahrung.',
    ctaPrimary: 'Jetzt PrepFlow holen - 29€',
    ctaSecondary: 'Kostenlose Probe holen',
    dashboardAlt: 'PrepFlow Dashboard zeigt COGS-Analyse und Gewinneinblicke'
  },
  
  // Pricing
  pricing: {
    title: 'Einfache, ehrliche Preise',
    subtitle: 'Einmaliger Kauf. Lebenslanger Zugang. Keine Abonnements, keine versteckten Gebühren.',
    price: '29€',
    currency: 'EUR',
    guarantee: '7-Tage-Geld-zurück-Garantie',
    features: {
      completeTemplate: 'Vollständige Google Sheets-Vorlage',
      preloadedIngredients: '300+ vorinstallierte Zutaten',
      multiCurrency: 'Multi-Währungsunterstützung',
      gstVat: 'GST/VAT-Berechnungen',
      lifetimeUpdates: 'Lebenslange Updates',
      moneyBack: '7-Tage-Geld-zurück-Garantie'
    },
    cta: 'Jetzt PrepFlow holen',
    instantAccess: 'Sofortiger Zugang über Gumroad'
  },
  
  // Features
  features: {
    stockList: {
      title: 'Bestandsliste (unendlich)',
      description: 'Zentralisieren Sie Zutaten mit Packungsgröße, Einheit, Lieferant, Lagerung, Produktcode. Erfassen Sie Zuschnitt/Abfall und Ausbeuten, um die echten Kosten pro Einheit zu erhalten.'
    },
    cogsRecipes: {
      title: 'COGS-Rezepte',
      description: 'Erstellen Sie Rezepte, die automatisch Zutatenkosten (inkl. Ausbeute/Zuschnitt) abrufen. Sehen Sie Gerichtskosten, COGS%, GP€ und GP% sofort.'
    },
    itemPerformance: {
      title: 'Artikel-Performance',
      description: 'Fügen Sie Verkäufe ein. Wir berechnen Popularität, Gewinnmarge, Gesamtgewinn ex-MwSt und klassifizieren Artikel als Chef\'s Kiss, Hidden Gem oder Bargain Bucket.'
    },
    dashboardKpis: {
      title: 'Dashboard-KPIs',
      description: 'Auf einen Blick: durchschnittlicher GP%, Lebensmittelkosten %, durchschnittlicher Artikelgewinn und Verkaufspreis, plus Top-Performer nach Popularität und Marge.'
    },
    globalTax: {
      title: 'Globale Steuern & Währung',
      description: 'Legen Sie Land, Steuersystem (GST/VAT/Umsatzsteuer) und Währung in den Einstellungen fest. Alle Ausgaben passen sich an Ihre lokalen Marktanforderungen an.'
    },
    fastOnboarding: {
      title: 'Schnelles Onboarding',
      description: 'Start-Tab mit Schritt-für-Schritt-Anleitung. Vorinstallierte Beispieldaten und umfassende Ressourcen, um den Ablauf in Minuten zu lernen.'
    },
    aiMethodGenerator: {
      title: 'KI-Methodengenerator',
      description: 'Entdecken Sie neue Kochmethoden, die Ihre Margen verbessern und Abfall reduzieren könnten. Erhalten Sie KI-gestützte Vorschläge zur Optimierung Ihrer Küchenprozesse.'
    }
  },
  
  // Landing Page Sections
  problemOutcome: {
    problem: {
      title: 'Das Problem',
      points: [
        'Sie wissen nicht, welche Menüpunkte tatsächlich Geld verdienen',
        'COGS-Kosten und Abfälle fressen Ihren Gewinn auf',
        'Preisgestaltung ist Raten; GST erschwert alles',
        'Berichte sind langsam, kompliziert oder sitzen in jemand anderem Tool'
      ]
    },
    outcome: {
      title: 'Das Ergebnis',
      points: [
        'Sehen Sie Artikel-Margen und Gewinn sofort',
        'Erkennen Sie "Gewinner" und "Gewinnlecks" auf einen Blick',
        'Preise mit Vertrauen anpassen (GST-bewusst)',
        'Alles in Google Sheets ausführen — keine neue Software zu lernen'
      ]
    }
  },

  contributingMargin: {
    title: 'Beitragsmarge — Die wahre Gewinnstory',
    subtitle: 'Sehen Sie über den Bruttogewinn hinaus, um zu verstehen, was jedes Gericht wirklich zu Ihrem Unternehmen beiträgt',
    grossProfit: {
      title: 'Bruttogewinn',
      description: 'Was Sie denken, dass Sie verdienen'
    },
    contributingMargin: {
      title: 'Beitragsmarge',
      description: 'Was Sie tatsächlich beitragen'
    },
    actionPlan: {
      title: 'Aktionsplan',
      description: 'Was Sie dagegen tun können'
    },
    explanation: 'PrepFlow hilft Ihnen zu sehen: Dieser 15$ Burger könnte eine 60% GP haben, aber nach Vorbereitungszeit, Abfall und Komplexität trägt er vielleicht nur 2,50$ zu Ihrer Gewinnmarge bei. Währenddessen könnte dieses einfache 8$ Beilagengericht 4,00$ beitragen.',
    disclaimer: '*Beispiel zur Veranschaulichung - tatsächliche Ergebnisse hängen von Ihrer spezifischen Menüstruktur und Kosten ab'
  },

  journey: {
    title: 'Meine Reise bei der Erstellung von PrepFlow',
    subtitle: 'Das ist nicht nur ein weiteres Tool - es ist meine persönliche Lösung für echte Küchenprobleme, verfeinert über 20 Jahre Arbeit in Restaurants in ganz Europa und Australien.',
    earlyExperience: {
      title: '2008-2012 - Frühe Erfahrung',
      description: 'Began als Sous Chef bei Krautwells GmbH, verwaltete vegane Küche und trainierte Nachwuchsköche'
    },
    europeanLeadership: {
      title: '2012-2018 - Europäische Führung',
      description: 'Gründete KSK-Küchenspezialkräfte veganes Catering, leitete Teams von 21 Mitarbeitern, bediente 1.200+ täglich'
    },
    australianExcellence: {
      title: '2018-2024 - Australische Exzellenz',
      description: 'Executive Chef Rollen, Head Chef bei ALH Hotels, leitete Teams von 9 Köchen mit KI-Integration'
    },
    readyToShare: {
      title: '2024 - Bereit zum Teilen',
      description: 'Teile jetzt das perfektionierte Tool mit Kollegen und Gastronomen, die vor den gleichen Herausforderungen stehen wie ich'
    },
    whyCreated: {
      title: 'Warum ich PrepFlow erstellt habe',
      paragraphs: [
        'Über 20 Jahre als Koch habe ich alles von kleinen Cafés bis hin zu groß angelegten Catering-Betrieben mit 1.200+ Gästen täglich geleitet. Ich stand vor den gleichen Herausforderungen wie Sie: Menükosten, Abfallmanagement, Gewinnanalyse und Teameffizienz.',
        'Als Head Chef bei ALH Hotels suchte ich ständig nach besseren Wegen, Kosten zu verwalten, Vorbereitungssysteme zu optimieren und unsere Menüauswahl zu verbessern. Bestehende Lösungen waren entweder zu komplex, zu teuer oder verstanden echte Küchenoperationen nicht.',
        'Also baute ich meine eigene Lösung - eine einfache Google Sheets Vorlage, die COGS-Berechnungen handhaben, Zutatenkosten verfolgen und mir genau zeigen konnte, welche Menüpunkte profitabel waren und welche Geld verloren.',
        'Nach der Arbeit in ganz Europa und Australien habe ich es perfekt für Veranstaltungsorte weltweit verfeinert - mit GST-Unterstützung für australische Märkte, Multi-Währungsoptionen und der Flexibilität, sich an die Bedürfnisse jeder Küche anzupassen. Es ist das Tool, das ich mir gewünscht hätte, als ich anfing, und jetzt teile ich es mit Ihnen.'
      ]
    }
  },

  globalFeatures: {
    title: 'Versteckte Gewinne aufdecken — Ein Blatt, jede Antwort',
    subtitle: 'Während andere Tausende für komplizierte Restaurantsoftware verlangen, bietet PrepFlow ähnliche Gewinneinblicke in einer einfachen Google Sheet für einen einmaligen Kauf.',
    multiCurrency: {
      title: 'Multi-Währung',
      description: 'USD, EUR, GBP, AUD, SGD und mehr. Währungen sofort wechseln.'
    },
    taxSystems: {
      title: 'Steuersysteme',
      description: 'GST, MwSt, Umsatzsteuer, HST. Konfigurieren Sie für Ihre lokalen Anforderungen.'
    },
    access24_7: {
      title: '24/7 Zugang',
      description: 'Cloud-basierte Google Sheets. Von überall, jederzeit zugreifen.'
    },
    noConsultants: {
      title: 'Keine Berater',
      description: 'Richten Sie sich selbst in unter einer Stunde ein. Keine teuren Implementierungsgebühren.'
    },
    conclusion: 'Ein Blatt. Schlüsseleinsichten, die Ihre Küche braucht. Identifizieren Sie Gewinnmöglichkeiten in Ihrem Menü mit Einblicken ähnlich teurer Software — aber in einer einfachen Google Sheet, die Sie selbst einrichten können.'
  },

  howItWorks: {
    title: 'Ergebnisse in 3 einfachen Schritten',
    step1: {
      title: 'Einrichtung (5–10 Min)',
      description: 'GST aktivieren, Zutaten, Ausbeuten und Lieferantenkosten hinzufügen.'
    },
    step2: {
      title: 'Verkäufe importieren',
      description: 'Fügen Sie Ihren POS-Export in den Verkaufs-Tab ein.'
    },
    step3: {
      title: 'Entscheiden & handeln',
      description: 'Dashboard sortiert Artikel nach Gewinn und Beliebtheit; Preise, Portionierung oder Menüauswahl korrigieren.'
    },
    checklist: {
      title: '60-Sekunden-Checkliste',
      items: [
        'GST-Toggle gesetzt?',
        'Zutatenausbeuten/Abfall eingegeben?',
        'Verkäufe eingefügt?',
        'Top 5 Niedrigmargen-Artikel überprüft?',
        'Dashboard morgen erneut prüfen'
      ]
    }
  },

  leadMagnet: {
    title: 'Sehen Sie PrepFlow vor dem Kauf',
    subtitle: 'Holen Sie sich ein Beispiel-Dashboard — wir senden es Ihnen per E-Mail.',
    form: {
      nameLabel: 'Ihr Name *',
      namePlaceholder: 'Ihr Name',
      emailLabel: 'Ihre E-Mail *',
      emailPlaceholder: 'ihre@email.com',
      sampleLabel: 'Holen Sie sich Ihr Beispiel-Dashboard',
      sampleDescription: 'Beispiel-Dashboard',
      submitButton: 'Beispiel-Dashboard senden',
      disclaimer: 'Kein Spam. Keine Bindung. Ihre Daten bleiben privat.\nWir senden Ihnen nur E-Mails über PrepFlow-Updates.'
    }
  },

  howItWorksPractice: {
    title: 'Wie PrepFlow in der Praxis funktioniert',
    subtitle: 'Von Raten zu datengesteuerter Klarheit - hier ist, was Sie erwarten können',
    before: {
      title: 'Vor PrepFlow',
      status: 'Unklare Margen',
      description: 'Blinde Preisgestaltung, Bauchgefühl, unklare Margen überall'
    },
    after: {
      title: 'Nach PrepFlow',
      status: 'Klare Einblicke',
      description: 'Datengesteuerte Entscheidungen, Margeneinblicke enthüllt, Klarheit erreicht'
    },
    explanation: 'PrepFlow hilft Ihnen zu identifizieren, wo Ihr Menü Gewinnpotenzial hat und wo Kosten in Ihre Margen fressen könnten',
    disclaimer: '*Ergebnisse hängen von Ihrer aktuellen Menüstruktur und wie Sie die Einblicke umsetzen ab'
  },

  benefits: {
    title: 'Was PrepFlow Ihnen hilft zu erreichen',
    betterPricing: {
      title: 'Bessere Preisentscheidungen',
      description: 'Sehen Sie genau, wie Zutatenkosten, Ausbeuten und Abfall Ihre Margen beeinflussen. Treffen Sie informierte Preisentscheidungen anstatt zu raten.'
    },
    identifyOpportunities: {
      title: 'Gewinnmöglichkeiten identifizieren',
      description: 'Erkennen Sie, welche Menüpunkte unterperformen und welche verstecktes Potenzial haben. Konzentrieren Sie Ihre Bemühungen dort, wo sie die größte Wirkung haben.'
    },
    streamlineOperations: {
      title: 'Operationen optimieren',
      description: 'Verstehen Sie Ihre wahren Kosten und optimieren Sie Ihre Menüauswahl. Reduzieren Sie Abfall, verbessern Sie die Effizienz und steigern Sie Ihre Gewinnmarge.'
    },
    cta: {
      text: 'Sehen Sie PrepFlow in Aktion',
      button: 'Beispiel holen'
    }
  },

  faq: {
    title: 'FAQ',
    questions: [
      {
        question: 'Brauche ich technische Fähigkeiten?',
        answer: 'Keine Tabellenkalkulationsformeln erforderlich. Wenn Sie Google Sheets verwenden können, sind Sie bereit.'
      },
      {
        question: 'Funktioniert es weltweit?',
        answer: 'Gebaut für globale Veranstaltungsorte — enthält GST, MwSt, Umsatzsteuer-Toggles, Multi-Währungsunterstützung und exportbereite Berichte für jeden Markt.'
      },
      {
        question: 'Was ist, wenn es für mich nicht funktioniert?',
        answer: 'Wenn Sie mit den Einblicken und der Klarheit, die PrepFlow in 7 Tagen bietet, nicht zufrieden sind, erhalten Sie jeden Cent zurück. Kein Ärger.'
      },
      {
        question: 'Wird mich das verlangsamen?',
        answer: 'Die Einrichtung dauert typischerweise 1-2 Stunden. Danach sparen Sie Zeit bei der Menüplanung und Kostenanalyse.'
      }
    ]
  },

  builtFor: {
    title: 'Gebaut für unabhängige Veranstaltungsorte & kleine Küchen',
    features: [
      'Funktioniert mit Google Sheets',
      '7-Tage-Rückerstattungsrichtlinie',
      'Für AU-Markt gemacht'
    ]
  },

  trustBar: {
    text: 'Hören Sie auf zu raten. Beginnen Sie zu wissen. PrepFlow ist nicht nur eine Tabelle — es ist das Röntgengerät für die Rentabilität Ihres Menüs.'
  },

  // Common
  common: {
    loading: 'Lädt...',
    error: 'Fehler',
    success: 'Erfolg',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    actions: 'Aktionen',
    name: 'Name',
    description: 'Beschreibung',
    price: 'Preis',
    cost: 'Kosten',
    quantity: 'Menge',
    unit: 'Einheit',
    total: 'Gesamt',
    subtotal: 'Zwischensumme',
    tax: 'Steuer',
    gst: 'GST',
    profit: 'Gewinn',
    margin: 'Marge',
    percentage: 'Prozentsatz',
    currency: 'Währung',
    date: 'Datum',
    time: 'Zeit',
    created: 'Erstellt',
    updated: 'Aktualisiert',
    status: 'Status',
    active: 'Aktiv',
    inactive: 'Inaktiv',
    pending: 'Ausstehend',
    completed: 'Abgeschlossen',
    failed: 'Fehlgeschlagen',
    yes: 'Ja',
    no: 'Nein',
    ok: 'OK',
    close: 'Schließen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherige',
    finish: 'Beenden',
    continue: 'Fortfahren',
    skip: 'Überspringen',
    retry: 'Wiederholen',
    refresh: 'Aktualisieren',
    reset: 'Zurücksetzen',
    clear: 'Löschen',
    select: 'Auswählen',
    selectAll: 'Alle auswählen',
    deselectAll: 'Alle abwählen',
    export: 'Exportieren',
    import: 'Importieren',
    download: 'Herunterladen',
    upload: 'Hochladen',
    print: 'Drucken',
    share: 'Teilen',
    copy: 'Kopieren',
    paste: 'Einfügen',
    cut: 'Ausschneiden',
    undo: 'Rückgängig',
    redo: 'Wiederholen',
    help: 'Hilfe',
    about: 'Über',
    settings: 'Einstellungen',
    preferences: 'Einstellungen',
    profile: 'Profil',
    account: 'Konto',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    signup: 'Registrieren',
    signin: 'Anmelden',
    forgotPassword: 'Passwort vergessen?',
    rememberMe: 'Angemeldet bleiben',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutzrichtlinie',
    cookies: 'Cookie-Richtlinie',
    contact: 'Kontakt',
    support: 'Support',
    faq: 'FAQ',
    documentation: 'Dokumentation',
    tutorial: 'Tutorial',
    guide: 'Anleitung',
    tips: 'Tipps',
    tricks: 'Tricks',
    bestPractices: 'Best Practices',
    examples: 'Beispiele',
    samples: 'Proben',
    templates: 'Vorlagen',
    themes: 'Themen',
    languages: 'Sprachen',
    regions: 'Regionen',
    timezones: 'Zeitzonen',
    currencies: 'Währungen',
    units: 'Einheiten',
    measurements: 'Maße',
    formats: 'Formate',
    styles: 'Stile',
    colors: 'Farben',
    fonts: 'Schriftarten',
    sizes: 'Größen',
    weights: 'Gewichte',
    alignments: 'Ausrichtungen',
    spacings: 'Abstände',
    margins: 'Ränder',
    paddings: 'Polster',
    borders: 'Rahmen',
    radiuses: 'Radien',
    shadows: 'Schatten',
    gradients: 'Gradienten',
    animations: 'Animationen',
    transitions: 'Übergänge',
    effects: 'Effekte',
    filters: 'Filter',
    blurs: 'Unschärfen',
    opacities: 'Deckkraft',
    rotations: 'Rotationen',
    scales: 'Skalen',
    translations: 'Übersetzungen',
    positions: 'Positionen',
    dimensions: 'Dimensionen',
    widths: 'Breiten',
    heights: 'Höhen',
    depths: 'Tiefen',
    layers: 'Ebenen',
    levels: 'Ebenen',
    orders: 'Bestellungen',
    priorities: 'Prioritäten',
    importances: 'Wichtigkeiten',
    urgencies: 'Dringlichkeiten',
    categories: 'Kategorien',
    types: 'Typen',
    kinds: 'Arten',
    sorts: 'Sorten',
    varieties: 'Varianten',
    versions: 'Versionen',
    editions: 'Editionen',
    releases: 'Releases',
    builds: 'Builds',
    patches: 'Patches',
    updates: 'Updates',
    upgrades: 'Upgrades',
    downgrades: 'Downgrades',
    migrations: 'Migrationen',
    conversions: 'Konvertierungen',
    transformations: 'Transformationen',
    modifications: 'Modifikationen',
    alterations: 'Änderungen',
    changes: 'Änderungen',
    adjustments: 'Anpassungen',
    corrections: 'Korrekturen',
    fixes: 'Fixes',
    improvements: 'Verbesserungen',
    enhancements: 'Verbesserungen',
    optimizations: 'Optimierungen',
    performance: 'Leistung',
    speed: 'Geschwindigkeit',
    efficiency: 'Effizienz',
    productivity: 'Produktivität',
    quality: 'Qualität',
    reliability: 'Zuverlässigkeit',
    stability: 'Stabilität',
    security: 'Sicherheit',
    safety: 'Sicherheit',
    confidentiality: 'Vertraulichkeit',
    anonymity: 'Anonymität',
    encryption: 'Verschlüsselung',
    authentication: 'Authentifizierung',
    authorization: 'Autorisierung',
    permissions: 'Berechtigungen',
    access: 'Zugang',
    control: 'Kontrolle',
    management: 'Management',
    administration: 'Administration',
    governance: 'Governance',
    oversight: 'Aufsicht',
    supervision: 'Supervision',
    monitoring: 'Überwachung',
    tracking: 'Verfolgung',
    logging: 'Protokollierung',
    auditing: 'Auditierung',
    reporting: 'Berichterstattung',
    analytics: 'Analytik',
    metrics: 'Metriken',
    statistics: 'Statistiken',
    data: 'Daten',
    information: 'Informationen',
    knowledge: 'Wissen',
    wisdom: 'Weisheit',
    insights: 'Einblicke',
    intelligence: 'Intelligenz',
    smart: 'Smart',
    intelligent: 'Intelligent',
    clever: 'Clever',
    bright: 'Hell',
    brilliant: 'Brillant',
    genius: 'Genie',
    expert: 'Experte',
    professional: 'Professionell',
    specialist: 'Spezialist',
    consultant: 'Berater',
    advisor: 'Berater',
    mentor: 'Mentor',
    coach: 'Coach',
    trainer: 'Trainer',
    teacher: 'Lehrer',
    instructor: 'Instruktor',
    educator: 'Pädagoge',
    leader: 'Führer',
    manager: 'Manager',
    director: 'Direktor',
    executive: 'Executive',
    administrator: 'Administrator',
    supervisor: 'Supervisor',
    coordinator: 'Koordinator',
    facilitator: 'Facilitator',
    organizer: 'Organisator',
    planner: 'Planer',
    strategist: 'Strategist',
    analyst: 'Analyst',
    researcher: 'Forscher',
    investigator: 'Untersucher',
    explorer: 'Entdecker',
    discoverer: 'Entdecker',
    innovator: 'Innovator',
    creator: 'Schöpfer',
    builder: 'Builder',
    developer: 'Entwickler',
    designer: 'Designer',
    architect: 'Architekt',
    engineer: 'Ingenieur',
    technician: 'Techniker',
    master: 'Meister',
    guru: 'Guru',
    wizard: 'Zauberer',
    magician: 'Magier',
    artist: 'Künstler',
    craftsman: 'Handwerker',
    artisan: 'Handwerker',
    skilled: 'Geschickt',
    talented: 'Talentiert',
    gifted: 'Begabt',
    able: 'Fähig',
    capable: 'Fähig',
    competent: 'Kompetent',
    proficient: 'Proficient',
    experienced: 'Erfahren',
    qualified: 'Qualifiziert',
    certified: 'Zertifiziert',
    licensed: 'Lizenziert',
    accredited: 'Akkreditiert',
    approved: 'Genehmigt',
    validated: 'Validiert',
    verified: 'Verifiziert',
    confirmed: 'Bestätigt',
    authenticated: 'Authentifiziert',
    authorized: 'Autorisiert',
    permitted: 'Erlaubt',
    allowed: 'Erlaubt',
    enabled: 'Aktiviert',
    activated: 'Aktiviert',
    working: 'Arbeitend',
    functional: 'Funktional',
    operational: 'Operativ',
    running: 'Laufend',
    operating: 'Betrieb',
    functioning: 'Funktionierend'
  }
};