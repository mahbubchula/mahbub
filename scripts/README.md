# GitHub Integration Scripts

This directory contains automation scripts for the website.

## Scripts

### `fetch-github-repos.py`
Automatically fetches your GitHub repositories and updates `data/tools.json`.

**Features:**
- Fetches all public repositories
- Filters by topics (e.g., `transportation-tool`, `ai-tool`)
- Extracts metadata (stars, forks, language, topics)
- Merges with manually created tools
- Updates statistics

**Usage:**
```bash
# Set environment variables
export GITHUB_TOKEN=your_github_token
export GITHUB_USERNAME=mahbubchula

# Run script
python scripts/fetch-github-repos.py
```

**GitHub Action:**
This script runs automatically via GitHub Actions (`.github/workflows/update-repos.yml`):
- Daily at midnight UTC
- On manual trigger
- When the script is updated

## Setup

### 1. Create GitHub Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scope: `public_repo`
4. Copy token

### 2. Add to Repository Secrets
1. Go to repository Settings → Secrets and variables → Actions
2. Add new secret: `GH_TOKEN` = your token

### 3. Tag Your Repositories
Add topics to repos you want featured:
- `transportation-tool`
- `ai-tool`
- `research-tool`
- `tutorial`

## How It Works

1. **Fetch**: Gets all your public repos from GitHub API
2. **Filter**: Selects repos with tool/tutorial topics
3. **Transform**: Converts repo data to tool format
4. **Merge**: Combines with manually created tools
5. **Update**: Writes to `data/tools.json`
6. **Commit**: GitHub Action commits changes
7. **Deploy**: GitHub Pages auto-deploys

## Customization

### Add New Tool Topics
Edit `TOOL_TOPICS` in `fetch-github-repos.py`:
```python
TOOL_TOPICS = [
    'transportation-tool',
    'ai-tool',
    'your-custom-topic'
]
```

### Change Category Mapping
Edit `CATEGORY_MAP`:
```python
CATEGORY_MAP = {
    'ai-tool': 'AI Tool',
    'your-topic': 'Your Category'
}
```

### Change Icons
Edit `ICON_MAP`:
```python
ICON_MAP = {
    'ev': '⚡',
    'your-keyword': '🎯'
}
```
