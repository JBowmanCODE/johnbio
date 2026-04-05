#!/usr/bin/env python3
"""
Replace hardcoded lp-sidebar-nav on all 35 course pages with a
shared empty container rendered by JS from course-data.js.

Also:
- Adds data-slug to <body>
- Adds course-data.js script before news-data.js
"""
import os
from bs4 import BeautifulSoup

COURSE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'course')

SIDEBAR_PLACEHOLDER = '<div class="lp-sidebar-nav" id="lp-sidebar-nav"></div>'


def process(fname):
    slug = fname.replace('.html', '')
    fpath = os.path.join(COURSE_DIR, fname)

    with open(fpath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    changed = False

    # 1. Add data-slug to body
    body = soup.find('body')
    if body and body.get('data-slug') != slug:
        body['data-slug'] = slug
        changed = True

    # 2. Add course-data.js before news-data.js if not present
    news_data = soup.find('script', src='/news-data.js')
    if news_data and not soup.find('script', src='/course-data.js'):
        cd_tag = soup.new_tag('script', src='/course-data.js')
        news_data.insert_before(cd_tag)
        changed = True

    # 3. Replace hardcoded lp-sidebar-nav with empty placeholder
    sidebar_nav = soup.find(class_='lp-sidebar-nav')
    if sidebar_nav:
        # Check if already the empty placeholder
        if sidebar_nav.get('id') == 'lp-sidebar-nav' and not list(sidebar_nav.children):
            pass  # already done
        else:
            placeholder = BeautifulSoup(SIDEBAR_PLACEHOLDER, 'html.parser')
            sidebar_nav.replace_with(placeholder)
            changed = True

    if changed:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f'  FIXED {fname}')
    else:
        print(f'  SKIP {fname}')

    return changed


def main():
    files = sorted(f for f in os.listdir(COURSE_DIR) if f.endswith('.html'))
    changed = sum(1 for f in files if process(f))
    print(f'\nDone. Fixed {changed} files.')


if __name__ == '__main__':
    main()
