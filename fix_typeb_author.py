#!/usr/bin/env python3
"""Add na-author block to the 13 TYPE_B course pages that are missing it."""
import os, re
from bs4 import BeautifulSoup

COURSE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'course')

TYPE_B = [
    'ai-across-industries.html','ai-adoption-journey.html','build-vs-buy.html',
    'business-case-for-ai.html','cicd-for-ml.html','cnns-with-keras.html',
    'generative-ai-models.html','intro-to-mlops.html','model-deployment.html',
    'monitoring-drift.html','prompt-engineering-ai-agents.html',
    'rag-finetuning-enterprise-ai.html','rnns-transformers-autoencoders.html'
]

AUTHOR_TEMPLATE = '''\
<div class="na-author">
<a aria-label="About John Bowman" href="/about"><img alt="John Bowman" class="na-author-img" src="/images/JohnB.webp"/></a>
<div class="na-author-details">
<a href="https://www.linkedin.com/in/john-bowman/" rel="noopener" target="_blank">John Bowman</a>
<span class="na-author-role">AI Strategist &amp; Developer</span>
</div>
<div class="na-header-meta">
<span class="{badge_class}">{badge_text}</span>
<span class="na-date">5 April 2026</span>
<span class="na-read">{read_time}</span>
</div>
</div>'''


def process(fname):
    fpath = os.path.join(COURSE_DIR, fname)
    with open(fpath, encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Already has author? Skip
    if soup.find(class_='na-author'):
        print(f'  SKIP {fname}: already has na-author')
        return False

    # Extract badge info and read time from existing markup
    badge = soup.find(class_=re.compile(r'lp-unit-badge'))
    meta  = soup.find(class_='na-meta')

    badge_class = ' '.join(badge.get('class', [])) if badge else 'lp-unit-badge'
    badge_text  = badge.get_text(strip=True) if badge else 'Unit'

    spans = meta.find_all('span') if meta else []
    read_time = spans[0].get_text(strip=True) if spans else '10 min read'

    # Build author HTML
    author_html = AUTHOR_TEMPLATE.format(
        badge_class=badge_class,
        badge_text=badge_text,
        read_time=read_time
    )
    author_tag = BeautifulSoup(author_html, 'html.parser')

    # Insert before the na-audio div
    audio_div = soup.find('div', class_='na-audio')
    if not audio_div:
        print(f'  WARNING {fname}: na-audio not found')
        return False

    audio_div.insert_before(author_tag)

    # Also remove the old standalone badge div and meta row (now in author block)
    for old_badge in soup.find_all(class_=re.compile(r'^lp-unit-badge')):
        # Only remove the standalone one (not inside na-author)
        if not old_badge.find_parent(class_='na-author'):
            old_badge.decompose()
    old_meta = soup.find(class_='na-meta')
    if old_meta and not old_meta.find_parent(class_='na-author'):
        old_meta.decompose()

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

    print(f'  FIXED {fname}: added author block ({badge_text}, {read_time})')
    return True


def main():
    changed = 0
    for fname in TYPE_B:
        if process(fname):
            changed += 1
    print(f'\nDone. Fixed {changed} files.')


if __name__ == '__main__':
    main()
