export const errors = {
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
};

