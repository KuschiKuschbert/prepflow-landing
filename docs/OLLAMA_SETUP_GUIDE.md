# Ollama Setup Guide - Recipe Formatting (Cost-Free AI)

This guide helps you set up Ollama for **free, local AI processing** of recipe formatting, saving costs compared to paid APIs like Gemini.

## Quick Start

### 1. Install Ollama

**macOS:**

```bash
brew install ollama
# Or download from https://ollama.com/download
```

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download installer from [https://ollama.com/download](https://ollama.com/download)

### 2. Start Ollama

```bash
ollama serve
```

This starts Ollama on `http://localhost:11434` (default port).

### 3. Pull Recommended Model

For recipe formatting (structured JSON output), we recommend:

```bash
# Best for structured JSON output (recommended)
ollama pull llama3.2:3b

# Alternative options (also good for JSON):
ollama pull qwen2.5:3b   # Also excellent for structured output
ollama pull phi3:mini    # Faster but less accurate for structure
```

**Model Comparison:**

| Model         | Size    | RAM Required | Speed  | JSON Quality | Recommended For                   |
| ------------- | ------- | ------------ | ------ | ------------ | --------------------------------- |
| `llama3.2:3b` | ~2.0 GB | ~4 GB        | Medium | ⭐⭐⭐⭐⭐   | **Best for recipe formatting**    |
| `qwen2.5:3b`  | ~2.1 GB | ~4 GB        | Medium | ⭐⭐⭐⭐⭐   | Also excellent for JSON           |
| `phi3:mini`   | ~2.3 GB | ~4 GB        | Fast   | ⭐⭐⭐⭐     | Faster but slightly less accurate |

**Hardware Requirements:**

- **3B models** (recommended): ~4GB RAM, ~2-3GB disk space per model
- **7B models** (if you have resources): ~8GB RAM, better quality but slower

### 4. Verify Installation

```bash
# Check if Ollama is running
ollama ps

# Test model
ollama run llama3.2:3b "Generate a JSON recipe"
```

## Optimized Configuration

Our implementation is optimized for best capabilities using Ollama best practices:

### ✅ Current Optimizations

1. **Model Selection**: Defaults to `llama3.2:3b` (best for structured JSON output)
2. **Temperature**: Set to `0.3` (low = deterministic, better for JSON)
3. **System Prompt**: Emphasizes JSON-only output requirement
4. **Timeout**: Extended to 90 seconds (local processing needs more time)
5. **Sampling Parameters**: `top_p: 0.9`, `top_k: 40` for consistency
6. **Cost Savings**: Defaults to Ollama (free) instead of Gemini (paid)

### Configuration Details

**API Endpoint:** `http://localhost:11434/api/generate`

**Optimized Parameters:**

```json
{
  "model": "llama3.2:3b",
  "prompt": "...",
  "stream": false,
  "options": {
    "temperature": 0.3,
    "system": "You are a precise recipe formatter. Always respond with valid JSON only...",
    "num_predict": -1,
    "top_p": 0.9,
    "top_k": 40
  }
}
```

**Why These Settings:**

- **Low temperature (0.3)**: Produces deterministic JSON output (less creative, more consistent)
- **System prompt**: Reinforces JSON-only requirement (best practice for structured outputs)
- **Extended timeout (90s)**: Local processing is slower than cloud, complex recipes need time
- **Unlimited output (-1)**: Recipes vary significantly in length

## Best Practices (From Ollama Docs)

Per [Ollama documentation](https://docs.ollama.com/):

### 1. **Model Selection**

- ✅ Use task-specific models (we use `llama3.2:3b` for structured output)
- ✅ Ensure hardware meets requirements (3B models = ~4GB RAM)

### 2. **Performance Optimization**

- ✅ Monitor resources: `ollama ps` (check memory usage)
- ✅ Adjust context window based on available RAM
- ✅ Use GPU acceleration if available (automatic if GPU detected)

### 3. **Structured Output Optimization**

- ✅ Low temperature (0.3-0.5) for deterministic JSON
- ✅ Clear system prompts emphasizing JSON requirement
- ✅ Specific prompt formatting with examples

### 4. **Data Handling**

- ✅ Preprocess data (our prompt includes clear structure)
- ✅ Batch processing (we process 20 recipes per batch for Ollama)
- ✅ Concurrency control (we use 5 concurrent requests for Ollama)

### 5. **Error Handling**

- ✅ Robust error messages (model not found, timeout, connection issues)
- ✅ Automatic fallback to Gemini if Ollama unavailable
- ✅ Clear installation instructions in error messages

## Troubleshooting

### Issue: "Ollama is not running"

**Solution:**

```bash
ollama serve
# Or on macOS/Linux, ensure service is running:
brew services start ollama  # macOS
systemctl start ollama      # Linux
```

### Issue: "Model not found"

**Solution:**

```bash
# Pull the recommended model
ollama pull llama3.2:3b

# Or use an alternative
ollama pull qwen2.5:3b
ollama pull phi3:mini
```

### Issue: "Request timeout"

**Causes:**

- Model too slow for your hardware
- Recipe too complex
- System resources low

**Solutions:**

1. Use faster model: `phi3:mini`
2. Check system resources: `ollama ps`
3. Increase timeout (already optimized to 90s)
4. Close other applications using CPU/RAM

### Issue: "Poor JSON quality"

**Solutions:**

1. Use better model: `llama3.2:3b` or `qwen2.5:3b` (instead of `phi3:mini`)
2. Verify system prompt is working (check logs)
3. Check model is fully loaded: `ollama ps`
4. Ensure sufficient RAM (3B models need ~4GB free)

### Performance Monitoring

```bash
# Check running models and memory usage
ollama ps

# Check system resources
# macOS:
top -pid $(pgrep ollama)
# Linux:
htop -p $(pgrep ollama)
```

## Model Recommendations by Use Case

### For Recipe Formatting (Structured JSON)

**Best:** `llama3.2:3b`

- Excellent JSON structure adherence
- Good balance of speed and quality
- ~4GB RAM required

**Alternative:** `qwen2.5:3b`

- Also excellent for structured output
- Similar performance to llama3.2:3b

**Fast but Less Accurate:** `phi3:mini`

- Faster processing
- Slightly less consistent JSON structure
- Good for testing or simpler recipes

### For Faster Processing (If You Have Resources)

**7B Models** (requires ~8GB RAM):

- `llama3.1:8b` - Better reasoning, slower
- `qwen2.5:7b` - Better JSON, slower
- Only use if you have 8GB+ RAM available

## Cost Comparison

**Before (Gemini default):**

- Gemini 2.5 Flash: ~$0.10-0.50 per 1M tokens
- Cost for 100 recipes: ~$1-5 (depending on recipe complexity)

**After (Ollama default):**

- Ollama: **$0** (completely free, local processing)
- Cost for unlimited recipes: **$0**

**Savings:** 100% cost reduction when using Ollama ✅

## Auto-Detection & Fallback

The system automatically:

1. ✅ Checks if Ollama is available on startup
2. ✅ Uses Ollama if available (free, local)
3. ✅ Falls back to Gemini if Ollama unavailable (graceful degradation)
4. ✅ Provides clear error messages if neither available

## Next Steps

1. ✅ Install Ollama: `brew install ollama` (or download from website)
2. ✅ Start Ollama: `ollama serve`
3. ✅ Pull model: `ollama pull llama3.2:3b`
4. ✅ Start processing recipes - system will automatically use Ollama!

## References

- **Ollama Documentation:** https://docs.ollama.com/
- **Model Library:** https://ollama.com/library
- **Community:** Discord and Reddit (links in Ollama docs)
- **Best Practices:** Based on Ollama official documentation and community best practices
