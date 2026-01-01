# Recipe Database Scraper

A comprehensive recipe scraping system that crawls multiple recipe websites, extracts structured recipe data (ingredients, methods, metadata), and stores them as JSON files for the AI specials feature to reference when generating menu suggestions.

## Features

- **Multiple Source Support**: Scrapes from AllRecipes, BBC Good Food, Food Network, and more
- **Structured Data Extraction**: Parses JSON-LD structured data and HTML fallbacks
- **Rate Limiting**: Respects robots.txt and implements delays between requests
- **Deduplication**: Prevents duplicate recipes in the database
- **JSON Storage**: Stores recipes in organized JSON files with index management
- **AI Integration**: Automatically provides recipe context to AI specials feature
- **Scheduled Scraping**: Supports cron-based scheduled scraping

## Installation

Dependencies are already installed. The scraper uses:

- `cheerio` - HTML parsing
- `puppeteer` - Browser automation (optional, for JS-heavy sites)
- `node-cron` - Scheduled task execution
- `robots-parser` - robots.txt parsing
- `axios` - HTTP requests
- `zod` - Schema validation
- `uuid` - Unique ID generation

## Usage

### Basic Scraping

Scrape a single recipe URL:

```bash
npm run scrape:recipes -- --source allrecipes --urls "https://www.allrecipes.com/recipe/12345"
```

Scrape multiple recipes:

```bash
npm run scrape:recipes -- --source bbc-good-food --urls "https://www.bbcgoodfood.com/recipes/recipe1,https://www.bbcgoodfood.com/recipes/recipe2"
```

### Dry Run

Test scraping without saving:

```bash
npm run scrape:recipes -- --source allrecipes --urls "https://www.allrecipes.com/recipe/12345" --dry-run
```

### View Statistics

View recipe database statistics:

```bash
npm run scrape:recipes:stats
```

### Search Recipes

Search recipes by ingredients:

```bash
npm run scrape:recipes:search "tomato,onion,garlic" --limit 10
```

## Supported Sources

- **allrecipes** - AllRecipes.com (JSON-LD structured data)
- **bbc-good-food** - BBC Good Food (HTML parsing with JSON-LD fallback)
- **food-network** - Food Network (Puppeteer support for JS-heavy pages)

## Storage Structure

Recipes are stored in `data/recipe-database/`:

```
data/recipe-database/
├── index.json                    # Recipe index with metadata
├── allrecipes/
│   ├── recipe-name-abc123.json
│   └── ...
├── bbc-good-food/
│   ├── recipe-name-def456.json
│   └── ...
└── food-network/
    ├── recipe-name-ghi789.json
    └── ...
```

## Recipe Schema

Each recipe JSON file contains:

```typescript
{
  id: string;
  source: string;
  source_url: string;
  recipe_name: string;
  description?: string;
  instructions: string[];
  ingredients: RecipeIngredient[];
  yield?: number;
  yield_unit?: string;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  total_time_minutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
  cuisine?: string;
  dietary_tags?: string[];
  image_url?: string;
  author?: string;
  rating?: number;
  scraped_at: string;
  updated_at?: string;
}
```

## AI Integration

The recipe database is automatically integrated with the AI specials feature:

1. When an image is analyzed, ingredients are detected
2. Similar recipes are searched from the database
3. Recipe context is added to the AI prompt
4. AI generates specials suggestions inspired by similar recipes

## Scheduled Scraping

To set up scheduled scraping, configure jobs in `scripts/recipe-scraper/scheduler/cron-scheduler.ts`:

```typescript
jobs.push({
  source: SOURCES.ALLRECIPES,
  urls: ['https://www.allrecipes.com/recipe/...'],
  schedule: '0 2 * * *', // Daily at 2 AM UTC
  enabled: true,
});
```

## Legal & Ethical Considerations

- **Respects robots.txt**: Automatically checks and respects robots.txt files
- **Rate Limiting**: Implements delays between requests (default: 2 seconds)
- **User-Agent**: Includes contact information in User-Agent header
- **Attribution**: Stores source URL and author information
- **Terms of Service**: Review each website's terms before scraping

## Error Handling

- Failed requests are retried up to 3 times with exponential backoff
- Invalid recipes are skipped with error logging
- Scraping continues even if individual recipes fail
- All errors are logged to `logs/recipe-scraper.log`

## Future Enhancements

- Recipe deduplication across sources
- Recipe quality scoring
- Ingredient matching with PrepFlow ingredient database
- Recipe cost calculation integration
- Recipe image downloading and storage
- Recipe search API endpoint
