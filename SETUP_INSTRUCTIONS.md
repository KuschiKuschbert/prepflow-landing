# Setup Instructions

## Node.js Installation Required

Node.js 22+ is required but not currently installed. Please install it using one of these methods:

### Option 1: Using NVM (Recommended)

```bash
# Install nvm (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your shell
source ~/.bashrc  # or ~/.zshrc

# Install Node.js 22
nvm install 22
nvm use 22

# Verify installation
node --version  # Should show v22.x.x or higher
```

### Option 2: Direct Download

1. Visit https://nodejs.org/
2. Download Node.js 22 LTS
3. Install the package
4. Verify: `node --version`

### Option 3: Using Homebrew (macOS)

```bash
brew install node@22
```

After installing Node.js, return to the setup process.




