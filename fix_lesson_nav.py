#!/usr/bin/env python3
"""Replace hardcoded lp-nav on all 35 course pages with a shared placeholder."""
import os
from bs4 import BeautifulSoup

COURSE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'course')
PLACEHOLDER = '<nav aria-label="Lesson navigation" class="lp-nav" id="lp-lesson-nav"></nav>'


def process(fname):
    fpath = os.path.join(COURSE_DIR, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    nav = soup.find('nav', class_='lp-nav')
    if not nav:
        print(f'  NO NAV: {fname}')
        return False

    if nav.get('id') == 'lp-lesson-nav' and not list(nav.children):
        print(f'  SKIP {fname}: already placeholder')
        return False

    placeholder = BeautifulSoup(PLACEHOLDER, 'html.parser')
    nav.replace_with(placeholder)

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    print(f'  FIXED {fname}')
    return True


def main():
    files = sorted(f for f in os.listdir(COURSE_DIR) if f.endswith('.html'))
    changed = sum(1 for f in files if process(f))
    print(f'\nDone. Fixed {changed} files.')


if __name__ == '__main__':
    main()
