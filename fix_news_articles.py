#!/usr/bin/env python3
"""
Remove inline audio/podcast/TOC/back-to-top JS from news articles.
Add news-article.js script reference.
Move podcast src to data-src attribute on the audio element.
"""
import os
import re
from bs4 import BeautifulSoup

NEWS_DIR = os.path.join(os.path.dirname(__file__), 'news')

FILES = [
    'ai-terms-explained.html',
    'claude-code-vsc.html',
    'test-ai.html',
]

# Patterns that identify script blocks to remove (matched against script text content)
REMOVE_PATTERNS = [
    r'TOC scroll spy',
    r"getElementById\('back-to-top'\)",
    r"getElementById\('na-player'\)",     # lesson audio player block
    r"getElementById\('na-podcast-audio'\)",  # inline podcast player block
]


def should_remove_script(script_tag):
    text = script_tag.string or ''
    for pat in REMOVE_PATTERNS:
        if re.search(pat, text):
            return True
    return False


def extract_podcast_src(script_tag):
    """Pull the podcast audio src from a setTimeout inline script."""
    text = script_tag.string or ''
    m = re.search(r"audio\.src\s*=\s*'([^']+)'", text)
    return m.group(1) if m else None


def process_file(filepath):
    name = os.path.basename(filepath)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    # 1. Extract podcast src from inline script and set as data-src on the audio element
    pod_audio = soup.find('audio', id='na-podcast-audio')
    if pod_audio:
        for script in soup.find_all('script'):
            src = extract_podcast_src(script)
            if src:
                pod_audio['data-src'] = src
                print(f'  {name}: set data-src="{src}" on na-podcast-audio')
                break

    # 2. Remove identified inline script blocks
    removed = 0
    for script in soup.find_all('script'):
        if should_remove_script(script):
            script.decompose()
            removed += 1
    print(f'  {name}: removed {removed} inline script blocks')

    # 3. Add news-article.js after news-data.js (if not already present)
    if not soup.find('script', src='/news-article.js'):
        news_data_script = soup.find('script', src='/news-data.js')
        if news_data_script:
            new_tag = soup.new_tag('script', src='/news-article.js')
            new_tag['defer'] = ''
            news_data_script.insert_after(new_tag)
            print(f'  {name}: added news-article.js')
        else:
            print(f'  WARNING {name}: could not find news-data.js anchor')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))


def main():
    for filename in FILES:
        filepath = os.path.join(NEWS_DIR, filename)
        if not os.path.exists(filepath):
            print(f'SKIP (not found): {filename}')
            continue
        print(f'Processing {filename}...')
        process_file(filepath)
    print('\nDone.')


if __name__ == '__main__':
    main()
