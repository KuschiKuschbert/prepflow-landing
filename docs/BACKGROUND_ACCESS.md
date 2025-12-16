# Background Image Access Guide

The PrepFlow background PNG is stored in a hidden location but accessible via API endpoint.

## File Location

**Hidden Directory:**

```
public/_assets/backgrounds/background.png
```

This directory is excluded from git (see `.gitignore`) to keep it private.

## Online Access

### Public API Endpoint

Access the background image online at:

```
https://www.prepflow.org/api/background
```

Or locally during development:

```
http://localhost:3000/api/background
```

### Usage Examples

**In HTML:**

```html
<img src="/api/background" alt="PrepFlow Background" />
```

**In CSS:**

```css
.background {
  background-image: url('/api/background');
  background-size: cover;
}
```

**In React/Next.js:**

```tsx
<div style={{ backgroundImage: 'url(/api/background)' }} />
```

**Direct URL:**

```
https://www.prepflow.org/api/background
```

## Security

The API endpoint is currently **public** (no authentication required).

### To Add Authentication (Optional)

Edit `app/api/background/route.ts` and add authentication check:

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function GET() {
  // Optional: Add authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ... rest of the code
}
```

## File Management

### Regenerate Background

To regenerate the background PNG:

```bash
npm run generate:background
```

This will update `public/_assets/backgrounds/background.png`.

### Manual Access

The file is located at:

```
public/_assets/backgrounds/background.png
```

You can:

- Copy it to use elsewhere
- Replace it with a new version
- Access it via the API endpoint

## Notes

- The `_assets` directory is hidden (starts with underscore)
- It's excluded from git (won't be committed)
- The API endpoint serves it with proper caching headers
- File size: ~509KB (1920x1080px PNG)




