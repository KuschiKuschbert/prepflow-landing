# PrepFlow Deployment Troubleshooting Guide

## 🚨 Critical Production Issues & Solutions

### ERR_CONTENT_DECODING_FAILED Error

**Problem:** Browser shows `ERR_CONTENT_DECODING_FAILED` error when accessing production site.

**Symptoms:**

- Site loads but shows blank page
- Browser console shows compression decoding errors
- Content fails to render properly
- Network tab shows 200 OK but content is corrupted

**Root Cause:** Compression conflicts between Next.js and Vercel's automatic compression handling.

**Solution:**

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // Let Vercel handle compression automatically
  compress: false,

  // Remove explicit compression headers from headers() function
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Remove these lines that cause conflicts:
          // {
          //   key: 'Content-Encoding',
          //   value: 'gzip, br',
          // },
        ],
      },
    ];
  },
};
```

**Why This Works:**

- Vercel automatically handles compression with optimal settings
- Manual compression configuration causes conflicts
- Browser can't decode conflicting compression formats
- Letting Vercel handle it ensures proper compression and decoding

**Prevention:**

- Never set `compress: true` for Vercel deployments
- Never add explicit `Content-Encoding` headers
- Always let Vercel handle compression automatically

---

## Other Common Deployment Issues

### Environment Variables Not Loading

**Problem:** Environment variables not available in production.

**Solution:**

- Check Vercel dashboard for environment variable configuration
- Ensure variables are set for Production environment
- Use `NEXT_PUBLIC_` prefix for client-side variables

### Build Failures

**Problem:** Build fails during deployment.

**Common Causes:**

- TypeScript errors
- Missing dependencies
- Import path issues
- Environment variable issues

**Solution:**

- Run `npm run build` locally to test
- Check build logs in Vercel dashboard
- Fix TypeScript errors
- Ensure all imports are correct

### Database Connection Issues

**Problem:** Supabase connection fails in production.

**Solution:**

- Verify Supabase URL and keys in Vercel environment variables
- Check Supabase project settings
- Ensure RLS policies are configured correctly

---

## Quick Deployment Checklist

- [ ] `compress: false` in next.config.ts
- [ ] No explicit Content-Encoding headers
- [ ] Environment variables configured in Vercel
- [ ] Build passes locally (`npm run build`)
- [ ] All TypeScript errors resolved
- [ ] Database connection working
- [ ] All imports and paths correct

---

## Emergency Rollback

If deployment fails:

1. **Revert to previous commit:**

   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Or rollback in Vercel dashboard:**
   - Go to Vercel dashboard
   - Select project
   - Go to Deployments tab
   - Click "Promote to Production" on previous working deployment

---

## Monitoring & Debugging

### Check Deployment Status

- Vercel dashboard shows deployment status
- Check build logs for errors
- Monitor function logs for runtime errors

### Browser Debugging

- Open browser dev tools
- Check Console tab for JavaScript errors
- Check Network tab for failed requests
- Check Application tab for service worker issues

### Performance Monitoring

- Use Vercel Analytics
- Monitor Core Web Vitals
- Check bundle size and loading times

---

**Last Updated:** October 2025
**Status:** ✅ Production deployment working correctly
