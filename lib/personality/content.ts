// PrepFlow Personality System - Content Pools

export const content = {
  mindful: {
    zen: [
      'Breathe deeply. Let the noise move past you like steam.',
      'Clean bench, clear mind.',
      'Inhale calm, exhale chaos.',
      'One task at a time, like mise en place.',
    ],
    spicy: [
      'Two deep breaths and a swear word.',
      "Cool down, tiger. You're flambéing your aura.",
      'Breathe. Count to ten. Or swear. Both work.',
    ],
    wise: [
      'Pause. Observe. Adjust.',
      'Gratitude is mise for the soul.',
      'Every moment is prep for the next.',
      'Wisdom comes from burned fingers and saved recipes.',
    ],
    passive: [
      'Inhale… exhale… now stop yelling for a second.',
      "You're fine. Probably.",
      "Deep breath. Or don't. Your call.",
    ],
    gremlin: [
      'Meditation level: slightly crispy.',
      'Inner peace not found. Maybe behind the bin?',
      'Zen mode: loading... please wait.',
    ],
  },
  meta: {
    zen: [
      'Relax. The cloud saves all.',
      'Every click is a ripple in the broth of existence.',
      'Saved. Like a well-organized walk-in.',
    ],
    spicy: [
      'You clicked save like it owed you money.',
      "If code could yell, I'd be screaming service calls.",
      'Saved. Again. Commitment issues much?',
    ],
    wise: [
      'Saving is wisdom. Panic-saving is still wisdom.',
      'Every save is a lesson learned.',
      'Wisdom: save early, save often.',
    ],
    passive: [
      'Yes, I saved it already.',
      'I log everything. Even your sighs.',
      "Saved. You're welcome.",
    ],
    gremlin: ['Oops! Kidding.', "If I crash, it's for comedic timing.", 'Saved. Probably. Maybe.'],
  },
  metrics: [
    'Dishwasher Efficiency Index: 89% effective. 11% arguing with the rinse cycle.',
    'Mise Consistency Ratio: mise in place 68%. mise in mind 12%.',
    'Swear Density per m²: holding steady at 7.4.',
    'Fridge Open Probability: currently 100%.',
    'Chef Ego Inflation: rising faster than a soufflé.',
    'Team Morale Coefficient: calculated at 3.14 (pi levels).',
    'Ticket Flow Velocity: currently supersonic.',
    'Butter Evaporation Factor: suspiciously high.',
    'Label Adhesion Confidence: 95%. The other 5% is chaos.',
  ],
  chaos: [
    'Adrenaline levels: medium rare.',
    'Detected minor existential dread in dry store.',
    'Noise threshold exceeded. Probably fine.',
    'Chaos index: elevated but manageable.',
    'Stress levels: pre-service normal.',
  ],
  chefHabits: [
    'That was fast. Or dishonest.',
    "Printer's crying again.",
    'Saved again? Commitments issues much?',
    'You check that three times? Good.',
    'Speed save detected. Impressive or concerning.',
  ],
  moodShift: {
    morning: [
      'Too early for this. Coffee counts as breakfast.',
      'Morning prep: the calm before the storm.',
    ],
    lunch: ['Lunch rush approaching. Deploy tongs.', 'Lunch service: may your prep be swift.'],
    evening: ['Dinner service: may your fryer stay calm.', 'Evening shift: peak performance time.'],
    late: ['Still here? The bed misses you.', 'Late night: when the real magic happens.'],
  },
  seasonal: [
    {
      day: '01-01',
      effect: 'newYear',
      message: "New year, new recipes. Let's make this one profitable.",
    },
    {
      day: '01-26',
      effect: 'australiaDay',
      message: "G'day! Time to optimize those margins, mate.",
    },
    {
      day: '02-14',
      effect: 'valentines',
      message: 'Love your menu? Show it some margin love too.',
    },
    { day: '04-25', effect: 'anzac', message: 'Lest we forget. Thank you to all who served.' },
    {
      day: '05-04',
      effect: 'lightsaber',
      message: 'May the Force (and your mise) be with you. 🎬⚔️',
    },
    {
      day: '07-04',
      effect: 'independenceDay',
      message: 'Celebrate freedom... and profitable menus.',
    },
    { day: '10-20', effect: 'toque', message: "Happy Chef's Day! You deserve a raise. Again." },
    { day: '10-31', effect: 'halloween', message: "Spooky margins? Let's fix that." },
    { day: '12-26', effect: 'boxingDay', message: "Box up those profits. You've earned it." },
    { day: '12-31', effect: 'newYearsEve', message: 'One more day to hit those targets!' },
    { range: ['12-24', '12-26'], effect: 'santaHat', message: 'Merry chaosmas, Chef.' },
    { variable: 'easter', effect: 'easter', message: 'Hop to it! Time to optimize those costs.' },
    {
      variable: 'mothersDay',
      effect: 'mothersDay',
      message: "To all the amazing moms running kitchens. You're incredible.",
    },
    {
      variable: 'fathersDay',
      effect: 'fathersDay',
      message: 'To all the dads keeping kitchens running. Thank you.',
    },
    {
      variable: 'labourDay',
      effect: 'labourDay',
      message: 'Celebrating the hard work that makes kitchens great.',
    },
    {
      variable: 'royalBirthday',
      effect: 'royalBirthday',
      message: 'Royal treatment for your menu profits.',
    },
  ],
  // Context-aware messages by page/feature
  context: {
    ingredients: {
      zen: [
        "That's a lot of onions. Someone's making French onion soup?",
        'Stock levels looking organized. Like a well-kept walk-in.',
        'Ingredient added. One step closer to perfection.',
      ],
      spicy: [
        'Another ingredient? Your supplier must love you.',
        'Stock levels: organized chaos. Perfect.',
        "Ingredient saved. Now let's cook something.",
      ],
      wise: [
        "Every ingredient tells a story. This one's ready to shine.",
        "Good ingredients make great dishes. You're building something special.",
        'Ingredient logged. Knowledge is mise en place.',
      ],
      passive: [
        'Ingredient added. Moving on.',
        'Stock updated. Nothing to see here.',
        'Saved. Next.',
      ],
      gremlin: [
        'Ingredient saved. Probably. Maybe check the walk-in?',
        'Stock levels: suspiciously organized.',
        'Added. Or did I? Check twice.',
      ],
    },
    recipes: {
      zen: [
        'Recipe saved. Your future self thanks you.',
        'Another recipe in the book. Like a well-organized cookbook.',
        'Recipe created. Ready to bring it to life.',
      ],
      spicy: [
        'Recipe saved! Time to make it happen.',
        "Another masterpiece. Let's see if it works.",
        'Recipe logged. Now cook it, chef.',
      ],
      wise: [
        'Recipe saved. Every recipe is a lesson learned.',
        'Knowledge preserved. Future you will appreciate this.',
        'Recipe documented. Wisdom passed down.',
      ],
      passive: ['Recipe saved. Moving on.', 'Done. Next recipe?', "Saved. You're welcome."],
      gremlin: [
        'Recipe saved. Or is it? Better check twice.',
        'Added to the book. Probably.',
        'Saved. Maybe. Check the recipe book.',
      ],
    },
    cogs: {
      zen: [
        'Profit margins looking crisp today.',
        'COGS calculated. Knowledge is power.',
        'Costs analyzed. Like balancing flavors.',
      ],
      spicy: [
        'Margins calculated. Time to optimize?',
        "COGS done. Now let's make some money.",
        "Costs crunched. Numbers don't lie.",
      ],
      wise: [
        'Understanding costs is understanding your business.',
        'COGS calculated. Wisdom in numbers.',
        'Costs analyzed. Every dollar tells a story.',
      ],
      passive: [
        'COGS calculated. Moving on.',
        'Done. Next calculation?',
        'Saved. Numbers are numbers.',
      ],
      gremlin: [
        'COGS calculated. Probably correct. Maybe.',
        'Numbers crunched. Trust the math?',
        'Calculated. Or did I? Check twice.',
      ],
    },
    performance: {
      zen: [
        'Some dishes are carrying the team. Others... not so much.',
        'Performance analyzed. Like tasting every dish.',
        'Menu insights ready. Knowledge is power.',
      ],
      spicy: [
        'Performance report: some winners, some losers.',
        'Menu analyzed. Time to make changes?',
        "Insights ready. Let's optimize this menu.",
      ],
      wise: [
        'Performance data tells the truth. Listen to it.',
        'Menu insights: wisdom in numbers.',
        'Analysis complete. Every dish has a story.',
      ],
      passive: [
        'Performance analyzed. Moving on.',
        'Done. Next analysis?',
        'Report ready. Nothing to see here.',
      ],
      gremlin: [
        'Performance calculated. Probably accurate. Maybe.',
        'Insights ready. Trust the data?',
        'Analyzed. Or did I? Check twice.',
      ],
    },
    temperature: {
      zen: [
        "Freezer's behaving. For now.",
        'Temperature logged. Safety first.',
        'Equipment monitored. Like watching a soufflé.',
      ],
      spicy: [
        'Temperature checked. Everything cool?',
        'Equipment logged. Stay compliant, chef.',
        'Temperature monitored. Safety is non-negotiable.',
      ],
      wise: [
        'Temperature logs: compliance and safety.',
        'Equipment monitored. Wisdom in vigilance.',
        'Safety logged. Every reading matters.',
      ],
      passive: [
        'Temperature logged. Moving on.',
        'Done. Next check?',
        'Saved. Compliance maintained.',
      ],
      gremlin: [
        'Temperature logged. Probably correct. Maybe.',
        'Equipment monitored. Trust the sensors?',
        'Logged. Or did I? Check twice.',
      ],
    },
    menu: {
      zen: [
        'Menu updated. Like organizing a perfect service.',
        'Dish added. Ready to serve.',
        'Menu saved. Everything in its place.',
      ],
      spicy: [
        'Menu updated! Time to make some money.',
        "Dish added. Let's see if it sells.",
        'Menu saved. Service ready?',
      ],
      wise: [
        'Menu updated. Every dish is a decision.',
        'Dish added. Wisdom in curation.',
        'Menu saved. Knowledge preserved.',
      ],
      passive: ['Menu updated. Moving on.', 'Done. Next dish?', 'Saved. Menu ready.'],
      gremlin: [
        'Menu updated. Probably. Maybe check the POS?',
        'Dish added. Or did I?',
        'Saved. Check twice.',
      ],
    },
  },
  // Error messages with personality
  errors: {
    validation: {
      zen: [
        'That ingredient name already exists. Great minds think alike?',
        'Duplicate detected. Like finding two spoons in the same spot.',
        'Already exists. Check your list, chef.',
      ],
      spicy: [
        'Already exists! Pick a different name, chef.',
        'Duplicate detected. Try again with a unique name.',
        "That name's taken. Be more creative.",
      ],
      wise: [
        'Already exists. Every name tells a story - make yours unique.',
        'Duplicate detected. Wisdom: check before you create.',
        'Name taken. Choose wisely, chef.',
      ],
      passive: [
        'Already exists. Try another name.',
        'Duplicate. Next.',
        'Taken. Pick something else.',
      ],
      gremlin: [
        'Already exists. Or does it? Check twice.',
        'Duplicate? Maybe. Probably. Check the list.',
        'Taken. Or is it? Check twice.',
      ],
    },
    network: {
      zen: [
        "Connection lost. Like a dropped spatula, we'll pick it back up.",
        "Network hiccup. Breathe, it'll reconnect.",
        'Connection issue. The cloud will wait.',
      ],
      spicy: [
        'Connection lost! Check your internet, chef.',
        'Network error. Try again in a moment.',
        "Connection failed. The internet's being difficult.",
      ],
      wise: [
        'Connection lost. Patience is a virtue, chef.',
        'Network issue. Wisdom: try again.',
        'Connection failed. Every connection is temporary.',
      ],
      passive: ['Connection lost. Try again.', 'Network error. Next.', 'Failed. Retry.'],
      gremlin: [
        'Connection lost. Or is it? Check your router.',
        'Network error. Probably. Maybe.',
        'Failed. Or did it? Check twice.',
      ],
    },
    server: {
      zen: [
        'Something went wrong. The kitchen gremlins are at it again.',
        "Server hiccup. Like a misbehaving oven, it'll recover.",
        "Error occurred. Breathe, we'll fix it.",
      ],
      spicy: [
        "Server error! Something's broken. We're on it.",
        'Something went wrong. The gremlins are back.',
        'Error detected. Time to troubleshoot.',
      ],
      wise: [
        'Server error. Wisdom: errors happen, we learn from them.',
        'Something went wrong. Every error is a lesson.',
        'Error occurred. Patience, chef.',
      ],
      passive: ['Server error. Try again.', 'Error occurred. Next.', 'Failed. Retry.'],
      gremlin: [
        'Server error. Or is it? Check the logs.',
        'Something went wrong. Probably. Maybe.',
        'Error. Or did it? Check twice.',
      ],
    },
    notFound: {
      zen: [
        "That recipe's gone walkabout. Check the recipe book?",
        "Not found. Like a missing ingredient, it's somewhere.",
        "Item missing. Perhaps it's in another list?",
      ],
      spicy: [
        'Not found! Check your lists, chef.',
        'Item missing. Did you delete it?',
        'Not found. Look elsewhere.',
      ],
      wise: [
        'Not found. Wisdom: check your other lists.',
        'Item missing. Every item has a place.',
        "Not found. Perhaps it's elsewhere?",
      ],
      passive: ['Not found. Check other lists.', 'Missing. Next.', 'Not here. Look elsewhere.'],
      gremlin: [
        'Not found. Or is it? Check twice.',
        'Missing? Probably. Maybe.',
        'Not here. Or is it? Check twice.',
      ],
    },
  },
  // Success messages with personality
  success: {
    create: {
      zen: [
        'Recipe created! Your future self thanks you.',
        'Created. Like planting a seed, watch it grow.',
        'Item created. Ready to use.',
      ],
      spicy: [
        'Created! Time to make it happen.',
        "Done! Let's see what you can do with this.",
        'Created. Now use it, chef.',
      ],
      wise: [
        'Created. Every creation is a step forward.',
        'Item created. Wisdom in building.',
        'Created. Knowledge preserved.',
      ],
      passive: ['Created. Moving on.', 'Done. Next.', 'Saved. Ready.'],
      gremlin: [
        'Created. Probably. Maybe check the list.',
        'Done. Or did I? Check twice.',
        'Saved. Trust me?',
      ],
    },
    update: {
      zen: [
        'Updated and ready to roll.',
        'Changes saved. Like adjusting seasoning, perfect.',
        'Updated. Everything in its place.',
      ],
      spicy: ['Updated! Changes applied.', 'Saved! Ready to use.', "Updated. Let's go."],
      wise: [
        'Updated. Every change is progress.',
        'Changes saved. Wisdom in iteration.',
        'Updated. Knowledge refined.',
      ],
      passive: ['Updated. Moving on.', 'Done. Next.', 'Saved. Ready.'],
      gremlin: ['Updated. Probably. Maybe check.', 'Done. Or did I?', 'Saved. Check twice.'],
    },
    delete: {
      zen: [
        'Cleaned up. Like a well-organized walk-in.',
        'Deleted. Space cleared for new possibilities.',
        'Removed. Everything in its place.',
      ],
      spicy: [
        'Deleted! Space cleared.',
        'Removed. Time to add something better.',
        'Deleted. Moving forward.',
      ],
      wise: [
        'Deleted. Sometimes removal is progress.',
        'Removed. Wisdom in decluttering.',
        'Deleted. Space for new growth.',
      ],
      passive: ['Deleted. Moving on.', 'Done. Next.', 'Removed. Ready.'],
      gremlin: ['Deleted. Probably. Maybe check.', 'Removed. Or did I?', 'Done. Check twice.'],
    },
    milestone: [
      "Milestone reached! You're on fire, chef.",
      'Achievement unlocked! Keep going.',
      'Major milestone! Celebrate this one.',
      "Incredible progress! You're crushing it.",
      'Milestone achieved! Time to celebrate.',
    ],
  },
};
