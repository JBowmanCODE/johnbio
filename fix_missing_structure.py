#!/usr/bin/env python3
"""
Bring all 35 course pages to identical structure as what-is-ai.html.

Fixes:
1. na-lede: extract from first body <p> if missing
2. na-lede-row: wrap na-lede + na-lede-img around the lede paragraph
3. na-mobile-toc: generate from h2[id] headings if missing
"""
import os, re
from bs4 import BeautifulSoup, NavigableString

COURSE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'course')


def get_slug(fname):
    return fname.replace('.html', '')


def fix_lede_row(soup, slug):
    """Ensure lede is inside na-lede-row with na-lede-img sibling."""
    lede = soup.find(class_='na-lede')
    na_body = soup.find(class_='na-body')

    # If no lede at all, create one from first body paragraph
    if not lede:
        first_p = na_body.find('p') if na_body else None
        if not first_p:
            return False
        lede = soup.new_tag('p', attrs={'class': 'na-lede'})
        for content in list(first_p.contents):
            lede.append(content.__copy__() if hasattr(content, '__copy__') else type(content)(content))
        # Insert it — will be wrapped below

    # Check if already in na-lede-row
    if lede.parent and 'na-lede-row' in lede.parent.get('class', []):
        # Check if na-lede-img already present
        if lede.parent.find(class_='na-lede-img'):
            return False  # Already complete
        # Just add the img div
        img_div = BeautifulSoup(
            f'<div class="na-lede-img"><img src="/images/course/{slug}.webp" '
            f'alt="" loading="lazy"/></div>',
            'html.parser'
        )
        lede.parent.append(img_div)
        return True

    # Build na-lede-row wrapping the lede
    h1 = soup.find(class_='na-title')
    if not h1:
        return False

    row_html = (
        f'<div class="na-lede-row">'
        f'<p class="na-lede">{lede.decode_contents()}</p>'
        f'<div class="na-lede-img"><img src="/images/course/{slug}.webp" '
        f'alt="" loading="lazy"/></div>'
        f'</div>'
    )
    row_tag = BeautifulSoup(row_html, 'html.parser')

    # If lede already exists in DOM, replace it with the row
    if lede.parent:
        lede.replace_with(row_tag)
    else:
        # Insert after h1
        h1.insert_after(row_tag)

    return True


def slugify(text):
    """Convert heading text to a URL-safe id."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text[:60]


def fix_mobile_toc(soup):
    """Add na-mobile-toc generated from h2 headings if missing."""
    if soup.find(class_='na-mobile-toc'):
        return False

    na_body = soup.find(class_='na-body')
    if not na_body:
        return False

    headings = na_body.find_all('h2')
    if not headings:
        return False

    # Ensure all h2s have ids
    used_ids = set()
    for h in headings:
        if not h.get('id'):
            base = slugify(h.get_text())
            uid = base
            n = 2
            while uid in used_ids:
                uid = f'{base}-{n}'
                n += 1
            h['id'] = uid
            used_ids.add(uid)
        else:
            used_ids.add(h['id'])

    items = ''.join(
        f'<li><a href="#{h["id"]}">{h.get_text(strip=True)}</a></li>'
        for h in headings
    )

    toc_html = (
        '<details class="na-mobile-toc">'
        '<summary class="na-mobile-toc-trigger">'
        '<span class="material-symbols-outlined">menu_book</span>'
        ' In this lesson '
        '<span class="material-symbols-outlined na-mobile-toc-chevron">expand_more</span>'
        '</summary>'
        f'<ol class="na-mobile-toc-list">{items}</ol>'
        '</details>'
    )
    toc_tag = BeautifulSoup(toc_html, 'html.parser')

    # Insert before na-divider or before na-audio
    divider = soup.find(class_='na-divider')
    if divider:
        divider.insert_before(toc_tag)
    else:
        audio = soup.find(class_='na-audio')
        if audio:
            audio.insert_before(toc_tag)
        else:
            return False

    return True


def process(fname):
    fpath = os.path.join(COURSE_DIR, fname)
    slug = get_slug(fname)

    with open(fpath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    changed = False

    r1 = fix_lede_row(soup, slug)
    if r1:
        print(f'  {fname}: fixed lede-row + lede-img')
        changed = True

    r2 = fix_mobile_toc(soup)
    if r2:
        print(f'  {fname}: added mobile-toc')
        changed = True

    if not changed:
        print(f'  SKIP {fname}: already complete')
        return False

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    return True


def main():
    files = sorted(f for f in os.listdir(COURSE_DIR) if f.endswith('.html'))
    changed = 0
    for fname in files:
        if process(fname):
            changed += 1
    print(f'\nDone. Fixed {changed} files.')


if __name__ == '__main__':
    main()
