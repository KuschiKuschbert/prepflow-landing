# Groq API Setup Guide - Recipe Formatting (Fastest Free Option)

This guide helps you set up Groq API for **fast, sub-second AI processing** of recipe formatting. Groq is the fastest free option available (500+ tokens/sec, sub-second responses) compared to Ollama (28-32 tokens/sec, 30-90 seconds).

## Quick Start

### 1. Get Groq API Key

1. Visit [GroqCloud Developer Console](https://console.groq.com/)
2. Sign up or sign in
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy your API key (starts with `gsk_...`)

### 2. Configure Environment Variables

Add to your `.env.local`:

```bash
USE_GROQ=true
GROQ_API_KEY=your-groq-api-key-here
```

**IMPORTANT:**

- Set `USE_GROQ=true` to explicitly enable Groq (strict cost guard)
- If `USE_GROQ=true` but `GROQ_API_KEY` is missing, the system will fail with clear error (no silent fallback)
- If `USE_GROQ=false` or unset, system uses Ollama (free, local fallback)

### 3. Set Spending Limits (CRITICAL)

To prevent unexpected costs:

1. Go to [Groq Console](https://console.groq.com/)
2. Navigate to **Settings** → **Billing** → **Limits**
3. Click **Add Limit**
4. Set your monthly budget (e.g., $10, $50, $100)
5. Add alert thresholds at 50%, 75%, and 90%
6. Click **Save**

This will:

- ✅ Automatically block API access when limit is reached
- ✅ Send email alerts as you approach the limit
- ✅ Prevent accidental cost explosions

**Recommended:** Start with a low limit ($10-20) and adjust based on usage.

### 4. Verify Setup

Check that Groq is configured correctly:

```bash
# Check environment variables (in your terminal)
echo $GROQ_API_KEY
echo $USE_GROQ
```

The system will automatically detect Groq when `USE_GROQ=true` and `GROQ_API_KEY` is set.

## Why Groq API?

### Performance Comparison

| Provider       | Speed            | Response Time          | Cost                         | Setup            |
| -------------- | ---------------- | ---------------------- | ---------------------------- | ---------------- |
| **Groq API**   | 500+ tokens/sec  | **Sub-second to 2-3s** | Free tier available          | API key required |
| Ollama (local) | 28-32 tokens/sec | 30-90 seconds          | Free (local)                 | Install locally  |
| Gemini         | ~100 tokens/sec  | 5-10 seconds           | Paid (~$0.10-0.50/1M tokens) | API key required |

**Groq Advantages:**

- ✅ **Fastest free option** - Sub-second responses vs Ollama's 30-90 seconds
- ✅ **Cloud-based** - No local hardware requirements
- ✅ **Free tier** - Generous free tier available (check current limits)
- ✅ **Reliability** - No local resource limits or hardware dependencies

**Ollama Advantages (Fallback):**

- ✅ **Completely free** - No API key needed, no usage limits
- ✅ **Local processing** - Data never leaves your machine (privacy)
- ✅ **No internet required** - Works offline

### Use Cases

**Use Groq when:**

- ✅ You want fastest processing (sub-second responses)
- ✅ You don't mind cloud API (data sent to Groq servers)
- ✅ You have API key and free tier available
- ✅ You've set up spending limits for cost protection

**Use Ollama when:**

- ✅ You want completely free, unlimited processing
- ✅ You prioritize privacy (local processing)
- ✅ You don't have Groq API key
- ✅ You're offline or prefer local processing

## Free Tier Limits

**Current Groq Free Tier (verify at [console.groq.com](https://console.groq.com/)):**

- Check **Usage** section in Groq Console for current limits
- Limits may vary (requests/day, tokens/month)
- Free tier is generous but has limits

**Important:**

- Monitor usage regularly at [console.groq.com/usage](https://console.groq.com/usage)
- Set spending limits to prevent accidental paid usage
- System will warn if approaching limits (if detectable)

## Configuration

### Default Settings

Our implementation uses optimized settings for recipe formatting:

```typescript
{
  model: 'llama-3.1-8b-instant',  // Fastest free model
  temperature: 0.3,                // Low = deterministic JSON
  max_tokens: 8192,                // Enough for complex recipes
  timeout: 30000,                  // 30 seconds (Groq is fast)
  response_format: 'json_object'   // Structured JSON output
}
```

### Model Selection

**Recommended Model:** `llama-3.1-8b-instant`

- Fastest free model (sub-second responses)
- Excellent JSON structure adherence
- Optimized for Groq's infrastructure

**Alternative Models:**

- `mixtral-8x7b-32768` - More capable, slightly slower
- `llama-3.3-70b-versatile` - Best quality, may have usage limits

### Cost Guard Behavior

**Strict Mode (Default):**

- ✅ Only uses Groq if `USE_GROQ=true` AND `GROQ_API_KEY` is set
- ✅ Fails immediately if API key missing (no silent fallback)
- ✅ Falls back to Ollama if Groq unavailable or disabled
- ✅ Logs warnings for high token usage (approaching limits)

**Safety Features:**

- Never uses Groq without explicit opt-in (`USE_GROQ=true`)
- Never silently falls back to paid tier
- Clear error messages guide users to either set up Groq or use Ollama
- All cost implications clearly documented

## Performance Expectations

### Groq API

- **Response Time:** Sub-second to 2-3 seconds (vs Ollama's 30-90 seconds)
- **Timeout:** 30 seconds (vs Ollama's 90 seconds)
- **Success Rate:** Higher (cloud-based, no local resource limits)
- **Throughput:** 500+ tokens/sec (vs Ollama's 28-32 tokens/sec)

### Ollama Fallback

- **Response Time:** 30-90 seconds (current behavior)
- **Timeout:** 90 seconds (current setting)
- **Usage:** Only when Groq unavailable or disabled
- **Cost:** $0 (completely free, local)

## Troubleshooting

### Issue: "GROQ_API_KEY is required when USE_GROQ=true"

**Solution:**

1. Get API key from [console.groq.com](https://console.groq.com/)
2. Add to `.env.local`: `GROQ_API_KEY=your-key-here`
3. Restart dev server

**OR:**

1. Set `USE_GROQ=false` to use Ollama (free, local)
2. Start Ollama: `ollama serve`

### Issue: "Groq API error: Rate limit exceeded (429)"

**Causes:**

- Free tier limit reached
- Too many requests too quickly

**Solutions:**

1. Check usage at [console.groq.com/usage](https://console.groq.com/usage)
2. Wait for rate limit to reset (typically per-minute or per-day)
3. System automatically falls back to Ollama if available
4. Consider upgrading to paid tier if needed (after setting spending limits)

### Issue: "Groq API error: Billing/quota error (402/403)"

**Causes:**

- Free tier quota exceeded
- Billing issue with account

**Solutions:**

1. Check billing status at [console.groq.com/billing](https://console.groq.com/billing)
2. Verify free tier limits haven't been exceeded
3. System automatically falls back to Ollama if available
4. Consider upgrading to paid tier (with spending limits set)

### Issue: "Groq request timed out after 30000ms"

**Causes:**

- Network connectivity issues
- Groq API temporarily slow/unavailable

**Solutions:**

1. Check network connectivity
2. Verify Groq API status (check [status.groq.com](https://status.groq.com) if available)
3. System automatically falls back to Ollama if available
4. Retry request (timeouts are rare with Groq's fast responses)

### Issue: "Groq processing failed, falling back to Ollama"

This is expected behavior - the system automatically falls back to Ollama if Groq fails.

**Solutions:**

1. Check Groq error message in logs
2. Fix Groq issue (API key, rate limits, etc.)
3. System continues with Ollama fallback
4. Next request will try Groq again if available

## Cost Management

### Set Spending Limits

**CRITICAL:** Always set spending limits to prevent unexpected costs:

1. Go to [Groq Console](https://console.groq.com/)
2. **Settings** → **Billing** → **Limits**
3. Click **Add Limit**
4. Set monthly budget (start with $10-20)
5. Add alerts at 50%, 75%, 90%
6. Save

### Monitor Usage

**Regular Monitoring:**

- Check [console.groq.com/usage](https://console.groq.com/usage) weekly
- Review token usage per recipe
- Adjust spending limits based on actual usage

**Usage Tracking:**

- System logs token usage for each request
- Warnings logged when high usage detected
- Check application logs for usage metrics

### Cost Optimization Tips

1. **Use Free Tier:** Stay within free tier limits if possible
2. **Batch Processing:** Process recipes in batches (already implemented)
3. **Skip Already Formatted:** System automatically skips formatted recipes
4. **Ollama for Testing:** Use Ollama (free) for testing, Groq for production
5. **Monitor First:** Monitor usage for a week before increasing limits

## Comparison: Groq vs Ollama

### When to Use Groq

✅ **Use Groq if:**

- Speed is critical (sub-second responses needed)
- You have API key and free tier available
- You've set spending limits for protection
- You're processing many recipes quickly
- Cloud processing is acceptable

### When to Use Ollama

✅ **Use Ollama if:**

- Cost is primary concern (completely free)
- Privacy is important (local processing)
- You don't have Groq API key
- You're offline or prefer local processing
- Processing speed is not critical

### Hybrid Approach (Recommended)

**Best Practice:**

1. Enable Groq for fast production processing
2. Keep Ollama as fallback for free processing
3. System automatically uses best available option
4. Set Groq spending limits for cost protection
5. Use Ollama for testing/development

## Migration from Ollama-Only

If you're currently using Ollama-only setup:

1. **Get Groq API Key:** [console.groq.com](https://console.groq.com/)
2. **Set Environment Variables:**
   ```bash
   USE_GROQ=true
   GROQ_API_KEY=your-key-here
   ```
3. **Set Spending Limits:** Groq Console → Settings → Billing → Limits
4. **Restart Dev Server:** System will automatically use Groq
5. **Keep Ollama:** System automatically falls back to Ollama if Groq unavailable

**No Code Changes Needed:** The system automatically detects and uses Groq when enabled.

## Performance Testing

### Expected Performance

**Groq (Primary):**

- Recipe processing: <5 seconds per recipe
- Batch of 50 recipes: ~2-3 minutes (vs Ollama's ~30-60 minutes)
- Success rate: >95% (cloud-based reliability)

**Ollama (Fallback):**

- Recipe processing: 30-90 seconds per recipe
- Batch of 50 recipes: ~30-60 minutes
- Success rate: >90% (depends on local hardware)

### Monitoring Performance

Check application logs for:

- `[Groq]` logs - Groq processing times
- `[Ollama]` logs - Ollama processing times
- `[Recipe Processor]` logs - Overall processing stats

Compare performance:

- Groq: Look for sub-second to 2-3 second response times
- Ollama: Look for 30-90 second response times

## References

- **Groq Console:** https://console.groq.com/
- **Groq Documentation:** https://console.groq.com/docs/
- **Groq API Reference:** https://console.groq.com/docs/openai
- **Spending Limits Guide:** https://console.groq.com/docs/spend-limits
- **Ollama Setup Guide:** [docs/OLLAMA_SETUP_GUIDE.md](docs/OLLAMA_SETUP_GUIDE.md)

## Support

- **Groq Support:** Check [console.groq.com](https://console.groq.com/) for support options
- **Issues:** Check application logs for detailed error messages
- **Fallback:** System automatically falls back to Ollama if Groq unavailable
