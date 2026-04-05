#!/usr/bin/env python3
"""
Convert accordion body content in course pages to match what-is-ai.html format.

FAQ:       h3 + p pairs  →  dl.info-faq > div.faq-item > dt + dd
How It Works: p elements →  ol.info-steps > li
Key Points:   ul (no class) → ul.info-points
Sources:      ul (no class) → ol.info-sources
"""
import os
import sys
from bs4 import BeautifulSoup, Tag

COURSE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'course')

# Pages already correct — skip
SKIP = {'what-is-ai.html', 'ml-deep-learning-neural-networks.html'}


def fix_faq(body, soup):
    """Convert alternating h3/p pairs to dl.info-faq > div.faq-item > dt + dd."""
    children = [c for c in body.children if isinstance(c, Tag)]
    # Only process if first child is h3 (old format)
    if not children or children[0].name != 'h3':
        return False

    dl = soup.new_tag('dl', attrs={'class': 'info-faq'})
    i = 0
    while i < len(children):
        tag = children[i]
        if tag.name == 'h3':
            faq_item = soup.new_tag('div', attrs={'class': 'faq-item'})
            dt = soup.new_tag('dt')
            dt.string = tag.get_text(strip=True)
            faq_item.append(dt)
            # Next sibling p is the answer
            if i + 1 < len(children) and children[i + 1].name == 'p':
                dd = soup.new_tag('dd')
                for content in children[i + 1].contents:
                    dd.append(content.__copy__() if hasattr(content, '__copy__') else type(content)(content))
                faq_item.append(dd)
                i += 2
            else:
                i += 1
            dl.append(faq_item)
        else:
            i += 1

    body.clear()
    body.append(dl)
    return True


def fix_how_it_works(body, soup):
    """Convert bare <p> elements to ol.info-steps > li."""
    children = [c for c in body.children if isinstance(c, Tag)]
    # Only process if first child is p (old format)
    if not children or children[0].name != 'p':
        return False

    ol = soup.new_tag('ol', attrs={'class': 'info-steps'})
    for tag in children:
        if tag.name == 'p':
            li = soup.new_tag('li')
            for content in tag.contents:
                li.append(content.__copy__() if hasattr(content, '__copy__') else type(content)(content))
            ol.append(li)

    body.clear()
    body.append(ol)
    return True


def fix_key_points(body, soup):
    """Add class info-points to bare <ul>."""
    ul = body.find('ul')
    if ul and 'info-points' not in ul.get('class', []):
        ul['class'] = ['info-points']
        return True
    return False


def fix_sources(body, soup):
    """Convert bare <ul> to <ol class="info-sources">."""
    ul = body.find('ul')
    if ul and 'info-sources' not in ul.get('class', []):
        ul.name = 'ol'
        ul['class'] = ['info-sources']
        return True
    return False


SECTION_FIXERS = {
    'Frequently Asked Questions': fix_faq,
    'How It Works': fix_how_it_works,
    'Key Points': fix_key_points,
    'Sources': fix_sources,
}


def process_file(filepath):
    fname = os.path.basename(filepath)
    if fname in SKIP:
        print(f'  SKIP {fname}')
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    changed = False

    for acc in soup.find_all('details', class_='tool-accordion'):
        title_el = acc.find(class_='tool-accordion-title')
        if not title_el:
            continue
        title = title_el.get_text(strip=True)
        fixer = SECTION_FIXERS.get(title)
        if not fixer:
            continue
        body = acc.find(class_='tool-accordion-body')
        if not body:
            continue
        result = fixer(body, soup)
        if result:
            print(f'  FIXED {fname}: {title}')
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))

    return changed


def main():
    files = sorted(f for f in os.listdir(COURSE_DIR) if f.endswith('.html'))
    changed = 0
    for fname in files:
        if process_file(os.path.join(COURSE_DIR, fname)):
            changed += 1
    print(f'\nDone. Fixed {changed} files.')


if __name__ == '__main__':
    main()
