#!/usr/bin/env python3
"""
GitHub Repository Fetcher
Automatically fetches repositories from GitHub and updates tools.json
"""

import os
import json
import requests
from datetime import datetime
from typing import List, Dict, Optional

# Configuration
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
GITHUB_USERNAME = os.environ.get('GITHUB_USERNAME', 'mahbubchula')
OUTPUT_FILE = 'data/tools.json'

# Topics that identify tool repositories
TOOL_TOPICS = [
    'transportation-tool',
    'ai-tool',
    'research-tool',
    'sumo-tool',
    'transit-tool'
]

# Topics that identify tutorial repositories
TUTORIAL_TOPICS = [
    'tutorial',
    'learning',
    'educational'
]

# Category mapping based on topics
CATEGORY_MAP = {
    'ai-tool': 'AI Tool',
    'machine-learning': 'Machine Learning',
    'transportation-tool': 'Transportation Tool',
    'simulation': 'Simulation',
    'data-analytics': 'Data Analytics',
    'web-app': 'Web Application',
    'cli-tool': 'CLI Tool',
    'research-tool': 'Research Tool'
}

# Icon mapping based on topics/keywords
ICON_MAP = {
    'ev': '⚡',
    'electric-vehicle': '⚡',
    'transit': '🚌',
    'traffic': '🚦',
    'simulation': '🖥️',
    'ai': '🤖',
    'machine-learning': '🧠',
    'data': '📊',
    'web': '🌐',
    'api': '🔌',
    'cli': '💻'
}


def fetch_github_repos() -> List[Dict]:
    """Fetch all public repositories for the user"""
    headers = {}
    if GITHUB_TOKEN:
        headers['Authorization'] = f'token {GITHUB_TOKEN}'
    
    url = f'https://api.github.com/users/{GITHUB_USERNAME}/repos'
    params = {
        'type': 'public',
        'sort': 'updated',
        'per_page': 100
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching repositories: {e}")
        return []


def is_tool_repo(repo: Dict) -> bool:
    """Check if repository should be classified as a tool"""
    topics = repo.get('topics', [])
    
    # Check if any tool topic is present
    return any(topic in TOOL_TOPICS for topic in topics)


def is_tutorial_repo(repo: Dict) -> bool:
    """Check if repository should be classified as a tutorial"""
    topics = repo.get('topics', [])
    return any(topic in TUTORIAL_TOPICS for topic in topics)


def get_category(repo: Dict) -> str:
    """Determine category based on topics"""
    topics = repo.get('topics', [])
    
    for topic in topics:
        if topic in CATEGORY_MAP:
            return CATEGORY_MAP[topic]
    
    # Default category
    return 'Open Source'


def get_icon(repo: Dict) -> str:
    """Determine icon based on topics and keywords"""
    topics = repo.get('topics', [])
    name = repo.get('name', '').lower()
    description = repo.get('description', '').lower()
    
    # Check topics first
    for topic in topics:
        if topic in ICON_MAP:
            return ICON_MAP[topic]
    
    # Check name and description for keywords
    for keyword, icon in ICON_MAP.items():
        if keyword in name or keyword in description:
            return icon
    
    # Default icon
    return '🚀'


def get_tech_stack(repo: Dict) -> List[str]:
    """Extract technology stack from repository"""
    tech_stack = []
    
    # Add primary language
    if repo.get('language'):
        tech_stack.append(repo['language'])
    
    # Add topics that look like technologies
    topics = repo.get('topics', [])
    tech_topics = [
        'python', 'javascript', 'typescript', 'react', 'vue', 'nodejs',
        'tensorflow', 'pytorch', 'pandas', 'numpy', 'flask', 'django',
        'fastapi', 'sumo', 'gtfs', 'docker', 'kubernetes'
    ]
    
    for topic in topics:
        if topic in tech_topics:
            tech_stack.append(topic.capitalize())
    
    return tech_stack


def get_status(repo: Dict) -> str:
    """Determine project status"""
    # Check if recently updated (within 3 months)
    updated_at = datetime.fromisoformat(repo['updated_at'].replace('Z', '+00:00'))
    months_since_update = (datetime.now(updated_at.tzinfo) - updated_at).days / 30
    
    if months_since_update < 3:
        return 'active'
    elif months_since_update < 12:
        return 'maintenance'
    else:
        return 'archived'


def convert_repo_to_tool(repo: Dict, index: int) -> Dict:
    """Convert GitHub repository to tool format"""
    return {
        'id': index + 1,
        'name': repo['name'].replace('-', ' ').replace('_', ' ').title(),
        'category': get_category(repo),
        'description': repo.get('description') or 'No description provided',
        'tech_stack': get_tech_stack(repo),
        'status': get_status(repo),
        'year': datetime.fromisoformat(repo['created_at'].replace('Z', '+00:00')).year,
        'links': {
            'github': repo['html_url'],
            'demo': repo.get('homepage') or '',
            'documentation': ''
        },
        'features': [],
        'icon': get_icon(repo),
        'github_stats': {
            'stars': repo['stargazers_count'],
            'forks': repo['forks_count'],
            'watchers': repo['watchers_count'],
            'open_issues': repo['open_issues_count'],
            'last_updated': repo['updated_at']
        },
        'topics': repo.get('topics', []),
        'language': repo.get('language'),
        'auto_generated': True
    }


def load_existing_tools() -> Dict:
    """Load existing tools.json file"""
    try:
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {'tools': [], 'stats': {}}


def merge_tools(existing_tools: List[Dict], new_tools: List[Dict]) -> List[Dict]:
    """Merge existing manual tools with auto-generated ones"""
    # Keep manually created tools (those without auto_generated flag)
    manual_tools = [t for t in existing_tools if not t.get('auto_generated', False)]
    
    # Merge: manual tools first, then auto-generated
    merged = manual_tools + new_tools
    
    # Re-index
    for i, tool in enumerate(merged):
        tool['id'] = i + 1
    
    return merged


def update_stats(tools: List[Dict]) -> Dict:
    """Calculate statistics"""
    total_stars = sum(t.get('github_stats', {}).get('stars', 0) for t in tools)
    
    return {
        'total_tools': len(tools),
        'active_projects': len([t for t in tools if t.get('status') == 'active']),
        'github_stars': total_stars,
        'contributors': 8  # This could be calculated from all repos
    }


def main():
    """Main function"""
    print(f"Fetching repositories for {GITHUB_USERNAME}...")
    
    # Fetch all repositories
    all_repos = fetch_github_repos()
    print(f"Found {len(all_repos)} total repositories")
    
    # Filter for tool repositories
    tool_repos = [repo for repo in all_repos if is_tool_repo(repo)]
    print(f"Found {len(tool_repos)} tool repositories")
    
    # Convert to tool format
    new_tools = [convert_repo_to_tool(repo, i) for i, repo in enumerate(tool_repos)]
    
    # Load existing tools and merge
    existing_data = load_existing_tools()
    existing_tools = existing_data.get('tools', [])
    
    merged_tools = merge_tools(existing_tools, new_tools)
    
    # Update statistics
    stats = update_stats(merged_tools)
    
    # Create output data
    output_data = {
        'tools': merged_tools,
        'stats': stats,
        'last_updated': datetime.now().isoformat(),
        'auto_sync_enabled': True
    }
    
    # Write to file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Successfully updated {OUTPUT_FILE}")
    print(f"   Total tools: {len(merged_tools)}")
    print(f"   Active projects: {stats['active_projects']}")
    print(f"   Total GitHub stars: {stats['github_stars']}")


if __name__ == '__main__':
    main()
