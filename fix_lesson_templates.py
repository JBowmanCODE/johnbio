"""
Fix lesson page templates to match what-is-ai.html structure.
Handles TYPE_A (13 pages) and TYPE_B (13 pages) separately.
"""
import os
import re
from bs4 import BeautifulSoup, NavigableString, Tag

COURSE_DIR = r'C:\Users\John\Desktop\johnb2026\course'

# TYPE_A: has na-author-info, na-toc-mobile, na-audio-player
TYPE_A_PAGES = [
    'activation-functions-vanishing-gradient.html',
    'ai-failures-ethics.html',
    'ai-governance-frameworks.html',
    'ai-hallucinations-bias-ip.html',
    'ai-tools-platforms-2026.html',
    'backpropagation.html',
    'key-ai-subfields.html',
    'key-ml-algorithms.html',
    'linear-regression-gradient-descent.html',
    'logistic-regression-classification.html',
    'model-evaluation.html',
    'neural-networks-forward-propagation.html',
    'numpy-pandas.html',
]

# TYPE_B: different template, garbled encoding, SVG nav icons, full sidebar
TYPE_B_PAGES = [
    'ai-across-industries.html',
    'ai-adoption-journey.html',
    'build-vs-buy.html',
    'business-case-for-ai.html',
    'cicd-for-ml.html',
    'cnns-with-keras.html',
    'generative-ai-models.html',
    'intro-to-mlops.html',
    'model-deployment.html',
    'monitoring-drift.html',
    'prompt-engineering-ai-agents.html',
    'rag-finetuning-enterprise-ai.html',
    'rnns-transformers-autoencoders.html',
]


def fix_accordion_summaries(content):
    """Add tool-accordion-summary class and icon span to plain <summary> tags."""
    def replace_summary(m):
        title = m.group(1).strip()
        return (f'<summary class="tool-accordion-summary">'
                f'<span class="tool-accordion-title">{title}</span>'
                f'<span class="tool-accordion-icon" aria-hidden="true"></span>'
                f'</summary>')
    # Only match summaries without a class attribute
    content = re.sub(r'<summary>([^<]+)</summary>', replace_summary, content)
    return content


def fix_encoding(content):
    """Fix common UTF-8 double-encoding issues in TYPE_B pages."""
    replacements = [
        ('â€º', '\u203a'),
        ('â€™', '\u2019'),
        ('â€œ', '\u201c'),
        ('â€\x9d', '\u201d'),
        ('â€"', '\u2013'),
        ('â€"', '\u2014'),
        ('\xc2\xb7', '\u00b7'),
        ('Â·', '\u00b7'),
        ('Â£', '\u00a3'),
        ('Â©', '\u00a9'),
        ('Ã©', '\u00e9'),
        ('â"€', '\u2500'),
        ('â"œ', '\u251c'),
        ('\xe2\x94\x94', '\u2514'),
        ('â"‚', '\u2502'),
    ]
    for bad, good in replacements:
        content = content.replace(bad, good)
    return content


def add_style_block(soup):
    """Add inline style block to head if not already present."""
    head = soup.find('head')
    if not head:
        return
    style_text = 'main.na-wrap{max-width:1120px;margin:0 auto;padding-top:120px;padding-left:1.5rem;padding-right:1.5rem;box-sizing:border-box;width:100%;}'
    # Check if style block already exists
    existing = head.find('style')
    if existing and 'na-wrap' in existing.string:
        return
    style_tag = soup.new_tag('style')
    style_tag.string = style_text
    # Insert after last link tag
    last_link = None
    for tag in head.find_all('link'):
        last_link = tag
    if last_link:
        last_link.insert_after(style_tag)
    else:
        head.append(style_tag)


def fix_main_style(soup):
    """Remove inline max-width style from main.na-wrap."""
    main = soup.find('main', class_='na-wrap')
    if main and main.get('style'):
        del main['style']


def fix_breadcrumb_separators(soup):
    """Convert text/HTML separators to material icon spans."""
    for nav in soup.find_all('nav', class_='na-breadcrumb'):
        # Unwrap any spans that already wrap a na-bc-sep span (from previous runs)
        for span in list(nav.find_all('span')):
            if span.find('span', class_='na-bc-sep'):
                inner = span.find('span', class_='na-bc-sep')
                span.replace_with(inner)
                continue
        # Replace span elements that contain only separator chars
        for span in list(nav.find_all('span')):
            classes = span.get('class', [])
            if 'na-bc-sep' in classes:
                continue  # already correct
            text = span.get_text(strip=True)
            if text in ['\u203a', '>', '/', '\u00b7']:
                new_span = soup.new_tag('span')
                new_span['class'] = ['na-bc-sep', 'material-symbols-outlined']
                new_span['aria-hidden'] = 'true'
                new_span.string = 'chevron_right'
                span.replace_with(new_span)
        # Handle bare text nodes with separator chars
        for elem in list(nav.find_all(string=True)):
            text = str(elem).strip()
            if text in ['\u203a', '>', '/']:
                new_span = soup.new_tag('span')
                new_span['class'] = ['na-bc-sep', 'material-symbols-outlined']
                new_span['aria-hidden'] = 'true'
                new_span.string = 'chevron_right'
                elem.replace_with(new_span)


def fix_author_section_type_a(soup):
    """Fix TYPE_A author section: wrap img in link, change na-author-info to na-author-details."""
    author_div = soup.find('div', class_='na-author')
    if not author_div:
        return

    # Fix image path and wrap in link
    img = author_div.find('img', class_='na-author-img')
    if img:
        img['src'] = '/images/JohnB.webp'
        img['alt'] = 'John Bowman'
        for attr in ['width', 'height']:
            if attr in img.attrs:
                del img.attrs[attr]
        # Wrap in link if not already wrapped
        if img.parent.name != 'a':
            link = soup.new_tag('a', href='/about')
            link['aria-label'] = 'About John Bowman'
            img.wrap(link)

    # Change na-author-info → na-author-details
    info_div = author_div.find('div', class_='na-author-info')
    if info_div:
        info_div['class'] = ['na-author-details']
        # Replace na-author-name span with a link
        name_span = info_div.find(class_='na-author-name')
        if name_span:
            link = soup.new_tag('a')
            link['href'] = 'https://www.linkedin.com/in/john-bowman/'
            link['target'] = '_blank'
            link['rel'] = 'noopener'
            link.string = name_span.get_text(strip=True)
            name_span.replace_with(link)
        # Replace na-author-date with na-author-role
        date_elem = info_div.find(class_='na-author-date')
        if date_elem:
            role_span = soup.new_tag('span')
            role_span['class'] = ['na-author-role']
            role_span.string = 'Owner / AI Developer'
            date_elem.replace_with(role_span)

    # Move na-meta contents into na-author as na-header-meta
    na_header = author_div.find_parent('div', class_='na-header')
    if na_header:
        na_meta = na_header.find('div', class_='na-meta')
        if na_meta:
            # Extract unit badge and read time
            unit_badge = na_meta.find('span', class_=lambda c: c and 'lp-unit-badge' in c)
            read_time_elem = na_meta.find('span', class_='na-read-time')

            # Create na-header-meta
            header_meta = soup.new_tag('div')
            header_meta['class'] = ['na-header-meta']

            if unit_badge:
                unit_badge.extract()
                header_meta.append(unit_badge)

            # Add date span
            date_span = soup.new_tag('span')
            date_span['class'] = ['na-date']
            date_span.string = '5 April 2026'
            header_meta.append(date_span)

            if read_time_elem:
                read_time_elem.extract()
                read_time_elem['class'] = ['na-read']
                header_meta.append(read_time_elem)

            # Remove na-meta
            na_meta.decompose()

            # Append header_meta to author div
            author_div.append(header_meta)


def convert_mobile_toc_type_a(soup):
    """Convert na-toc-mobile nav to na-mobile-toc details."""
    toc_nav = soup.find('nav', class_='na-toc-mobile')
    if not toc_nav:
        return

    # Extract links from existing structure
    links = toc_nav.find_all('a')
    link_data = [(a.get('href', '#'), a.get_text(strip=True)) for a in links]

    # Build new na-mobile-toc details element
    new_details = soup.new_tag('details')
    new_details['class'] = ['na-mobile-toc']

    summary = soup.new_tag('summary')
    summary['class'] = ['na-mobile-toc-trigger']

    icon1 = soup.new_tag('span')
    icon1['class'] = ['material-symbols-outlined']
    icon1.string = 'menu_book'
    summary.append(icon1)
    summary.append(NavigableString(' In this lesson '))

    icon2 = soup.new_tag('span')
    icon2['class'] = ['material-symbols-outlined', 'na-mobile-toc-chevron']
    icon2.string = 'expand_more'
    summary.append(icon2)
    new_details.append(summary)

    ol = soup.new_tag('ol')
    ol['class'] = ['na-mobile-toc-list']
    for href, text in link_data:
        li = soup.new_tag('li')
        a = soup.new_tag('a', href=href)
        a.string = text
        li.append(a)
        ol.append(li)
    new_details.append(ol)

    # Add hr.na-divider after the new details
    hr = soup.new_tag('hr')
    hr['class'] = ['na-divider']

    toc_nav.replace_with(new_details)
    new_details.insert_after(hr)


def convert_audio_player_type_a(soup):
    """Convert na-audio-player to na-audio structure."""
    audio_div = soup.find('div', class_='na-audio-player')
    if not audio_div:
        return

    # Get the existing audio element
    audio_elem = audio_div.find('audio')

    # Build new na-audio div
    new_div = soup.new_tag('div')
    new_div['class'] = ['na-audio']
    new_div['aria-label'] = 'Listen to this lesson'

    icon = soup.new_tag('span')
    icon['class'] = ['na-audio-icon', 'material-symbols-outlined']
    icon['aria-hidden'] = 'true'
    icon.string = 'headphones'
    new_div.append(icon)

    info_div = soup.new_tag('div')
    info_div['class'] = ['na-audio-info']

    top_div = soup.new_tag('div')
    top_div['class'] = ['na-audio-top']

    label = soup.new_tag('span')
    label['class'] = ['na-audio-label']
    label.string = 'Listen to this lesson'
    top_div.append(label)
    info_div.append(top_div)

    if audio_elem:
        audio_elem.extract()
        audio_elem['style'] = 'width:100%;margin-top:0.5rem;'
        # Ensure it has controls (boolean attribute)
        if 'controls' not in audio_elem.attrs:
            audio_elem.attrs['controls'] = ''
        # Remove preload="none" aria-label if they exist or keep them
        if not audio_elem.get('aria-label'):
            audio_elem['aria-label'] = 'Audio version of this lesson'
        info_div.append(audio_elem)

    new_div.append(info_div)
    audio_div.replace_with(new_div)


def fix_podcast_section_type_a(soup):
    """Convert simple na-podcast section to complex podcast structure."""
    podcast = soup.find('section', class_='na-podcast')
    if not podcast:
        return

    # Get title text from na-podcast-title
    title_elem = podcast.find(class_='na-podcast-title')
    title_text = 'Podcast Version'
    if title_elem:
        # Get text without the icon
        for icon in title_elem.find_all('span', class_='material-symbols-outlined'):
            icon.extract()
        title_text = title_elem.get_text(strip=True)

    # Get audio element if any
    audio_elem = podcast.find('audio')

    # Build new structure
    new_div = soup.new_tag('div')
    new_div['class'] = ['na-podcast']
    new_div['role'] = 'region'
    new_div['aria-label'] = 'Deep Dive Podcast'

    badge = soup.new_tag('div')
    badge['class'] = ['na-podcast-badge']
    badge_icon = soup.new_tag('span')
    badge_icon['class'] = ['material-symbols-outlined']
    badge_icon['aria-hidden'] = 'true'
    badge_icon.string = 'podcasts'
    badge.append(badge_icon)
    badge.append(NavigableString('Deep Dive Podcast'))
    new_div.append(badge)

    inner = soup.new_tag('div')
    inner['class'] = ['na-podcast-inner']

    left = soup.new_tag('div')
    left['class'] = ['na-podcast-left']

    icon_div = soup.new_tag('div')
    icon_div['class'] = ['na-podcast-icon']
    icon_div['aria-hidden'] = 'true'
    icon_span = soup.new_tag('span')
    icon_span['class'] = ['material-symbols-outlined']
    icon_span.string = 'graphic_eq'
    icon_div.append(icon_span)
    left.append(icon_div)

    meta_div = soup.new_tag('div')
    meta_div['class'] = ['na-podcast-meta']
    title_p = soup.new_tag('p')
    title_p['class'] = ['na-podcast-title']
    title_p.string = title_text
    sub_p = soup.new_tag('p')
    sub_p['class'] = ['na-podcast-sub']
    sub_p.string = 'AI-generated audio overview of this lesson'
    meta_div.append(title_p)
    meta_div.append(sub_p)
    left.append(meta_div)
    inner.append(left)

    if audio_elem:
        audio_elem.extract()
        audio_elem['controls'] = True
        audio_elem['style'] = 'width:100%;margin-top:0.75rem;'
        inner.append(audio_elem)

    new_div.append(inner)
    podcast.replace_with(new_div)


def fix_nav_buttons(soup):
    """Convert lp-nav-prev/lp-nav-next to no class / .next, fix internal structure."""
    lp_nav = soup.find('nav', class_='lp-nav')
    if not lp_nav:
        return

    for btn in lp_nav.find_all('a', class_='lp-nav-btn'):
        classes = btn.get('class', [])

        # Determine if prev or next
        is_prev = 'lp-nav-prev' in classes
        is_next = 'lp-nav-next' in classes

        # Set new classes
        if is_next:
            btn['class'] = ['lp-nav-btn', 'next']
        else:
            btn['class'] = ['lp-nav-btn']

        # Fix internal structure: convert lp-nav-label wrapper with lp-nav-hint/title
        # to simple div with lp-nav-label text + lp-nav-title
        label_span = btn.find('span', class_='lp-nav-label')
        if label_span:
            hint = label_span.find('span', class_='lp-nav-hint')
            title = label_span.find('span', class_='lp-nav-title')

            if hint and title:
                hint_text = hint.get_text(strip=True)
                title_text = title.get_text(strip=True)

                # Build new div structure
                new_div = soup.new_tag('div')

                label = soup.new_tag('span')
                label['class'] = ['lp-nav-label']
                label.string = hint_text
                new_div.append(label)

                title_span = soup.new_tag('span')
                title_span['class'] = ['lp-nav-title']
                title_span.string = title_text
                new_div.append(title_span)

                label_span.replace_with(new_div)

        # Fix material icon: add arrow_back for prev, arrow_forward for next
        # Check if there's already a material icon
        icon = btn.find('span', class_='material-symbols-outlined')
        if not icon:
            icon = soup.new_tag('span')
            icon['class'] = ['material-symbols-outlined']
            icon['aria-hidden'] = 'true'
            icon.string = 'arrow_back' if is_prev else 'arrow_forward'
            if is_next:
                btn.append(icon)
            else:
                btn.insert(0, icon)
        else:
            icon['aria-hidden'] = 'true'
            if is_prev and 'arrow_forward' in (icon.string or ''):
                icon.string = 'arrow_back'
            elif is_next and 'arrow_back' in (icon.string or ''):
                icon.string = 'arrow_forward'


def fix_sidebar_toc_links(soup):
    """Add na-toc-link class to TOC links in sidebar."""
    sidebar = soup.find('aside', class_='na-sidebar')
    if not sidebar:
        return
    toc = sidebar.find('nav', class_='na-toc')
    if not toc:
        toc = sidebar.find('div', class_='na-toc')
    if toc:
        toc_list = toc.find('ol', class_='na-toc-list')
        if toc_list:
            for a in toc_list.find_all('a'):
                classes = a.get('class', [])
                if 'na-toc-link' not in classes:
                    a['class'] = classes + ['na-toc-link']


def add_newsy_ai_div(soup):
    """Ensure sidebar has newsy-ai div."""
    sidebar = soup.find('aside', class_='na-sidebar')
    if not sidebar:
        return
    if not sidebar.find(id='newsy-ai'):
        newsy_div = soup.new_tag('div')
        newsy_div['id'] = 'newsy-ai'
        sidebar.append(newsy_div)


def fix_type_a_page(filename):
    filepath = os.path.join(COURSE_DIR, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Step 1: Regex/string fixes on raw content
        # Fix accordion summaries
        content = fix_accordion_summaries(content)

        # Fix author image path
        content = content.replace('/images/john-avatar.jpg', '/images/JohnB.webp')

        # Step 2: BeautifulSoup structural changes
        soup = BeautifulSoup(content, 'html.parser')

        # Add style block to head
        add_style_block(soup)

        # Remove inline style from main
        fix_main_style(soup)

        # Fix breadcrumb separators
        fix_breadcrumb_separators(soup)

        # Fix author section
        fix_author_section_type_a(soup)

        # Convert mobile TOC
        convert_mobile_toc_type_a(soup)

        # Convert audio player
        convert_audio_player_type_a(soup)

        # Fix podcast section
        fix_podcast_section_type_a(soup)

        # Fix nav buttons
        fix_nav_buttons(soup)

        # Fix sidebar TOC links
        fix_sidebar_toc_links(soup)

        # Add newsy-ai div
        add_newsy_ai_div(soup)

        result = str(soup)

        if result != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(result)
            print(f'FIXED (TYPE_A): {filename}')
        else:
            print(f'NO CHANGE: {filename}')

    except Exception as e:
        print(f'ERROR: {filename} - {e}')
        import traceback
        traceback.print_exc()


def fix_type_b_page(filename):
    filepath = os.path.join(COURSE_DIR, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Step 1: Fix encoding issues
        content = fix_encoding(content)

        # Step 2: Fix accordion summaries
        content = fix_accordion_summaries(content)

        # Step 3: BeautifulSoup changes
        soup = BeautifulSoup(content, 'html.parser')

        # Add style block to head
        add_style_block(soup)

        # Remove inline style from main
        fix_main_style(soup)

        # Fix breadcrumb separators
        fix_breadcrumb_separators(soup)

        # Add lp-ambient div if missing
        body = soup.find('body')
        header_placeholder = soup.find(id='header-placeholder')
        if body and header_placeholder and not soup.find('div', class_='lp-ambient'):
            ambient = soup.new_tag('div')
            ambient['class'] = ['lp-ambient']
            ambient['aria-hidden'] = 'true'
            header_placeholder.insert_after(ambient)

        # Fix nav buttons (SVG → material icons, fix structure)
        lp_nav = soup.find('nav', class_='lp-nav')
        if lp_nav:
            for btn in lp_nav.find_all('a', class_='lp-nav-btn'):
                classes = btn.get('class', [])
                is_prev = 'lp-nav-prev' in classes
                is_next = 'lp-nav-next' in classes

                # Remove SVG icons
                for svg in btn.find_all('svg'):
                    svg.decompose()

                # Get the text content
                span = btn.find('span')
                if span:
                    em = span.find('em')
                    hint_text = em.get_text(strip=True) if em else ('Previous' if is_prev else 'Next')
                    if em:
                        em.extract()
                    title_text = span.get_text(strip=True)

                    # Build new div structure
                    new_div = soup.new_tag('div')
                    label = soup.new_tag('span')
                    label['class'] = ['lp-nav-label']
                    label.string = hint_text + ' lesson'
                    new_div.append(label)
                    title_span = soup.new_tag('span')
                    title_span['class'] = ['lp-nav-title']
                    title_span.string = title_text
                    new_div.append(title_span)
                    span.replace_with(new_div)

                # Add material icon
                icon = soup.new_tag('span')
                icon['class'] = ['material-symbols-outlined']
                icon['aria-hidden'] = 'true'
                icon.string = 'arrow_back' if is_prev else 'arrow_forward'

                if is_next:
                    btn['class'] = ['lp-nav-btn', 'next']
                    btn.append(icon)
                else:
                    btn['class'] = ['lp-nav-btn']
                    btn.insert(0, icon)

        # Fix sidebar TOC (convert ul with onclick to ol with na-toc-link)
        sidebar = soup.find('aside', class_='na-sidebar')
        if sidebar:
            toc_div = sidebar.find('div', class_='na-toc')
            if toc_div:
                # Change h2.na-toc-title to p.na-toc-title
                h2_title = toc_div.find('h2', class_='na-toc-title')
                if h2_title:
                    p_title = soup.new_tag('p')
                    p_title['class'] = ['na-toc-title']
                    p_title.string = h2_title.get_text(strip=True)
                    h2_title.replace_with(p_title)

                # Convert <nav> to <nav class="na-toc">
                toc_div.name = 'nav'
                toc_div['aria-label'] = 'In this lesson'

                # Convert ul.na-toc-list to ol.na-toc-list with na-toc-link class
                ul = toc_div.find('ul', class_='na-toc-list')
                if ul:
                    ul.name = 'ol'
                    for a in ul.find_all('a'):
                        # Remove onclick handlers
                        if 'onclick' in a.attrs:
                            del a.attrs['onclick']
                        # Add na-toc-link class
                        classes = a.get('class', [])
                        if 'na-toc-link' not in classes:
                            a['class'] = classes + ['na-toc-link']

        # Fix sidebar nav: change h2 to p, fix lp-unit-label spans
        if sidebar:
            nav_div = sidebar.find(class_='lp-sidebar-nav')
            if nav_div:
                h2 = nav_div.find('h2', class_='lp-sidebar-nav-title')
                if h2:
                    p = soup.new_tag('p')
                    p['class'] = ['lp-sidebar-nav-title']
                    p.string = h2.get_text(strip=True)
                    h2.replace_with(p)

                # Fix lp-sidebar-unit-label: change div to span
                for label_div in nav_div.find_all('div', class_='lp-sidebar-unit-label'):
                    label_div.name = 'span'

        # Add newsy-ai div
        add_newsy_ai_div(soup)

        result = str(soup)

        if result != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(result)
            print(f'FIXED (TYPE_B): {filename}')
        else:
            print(f'NO CHANGE: {filename}')

    except Exception as e:
        print(f'ERROR: {filename} - {e}')
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    print('=== Fixing TYPE_A pages ===')
    for page in TYPE_A_PAGES:
        fix_type_a_page(page)

    print('\n=== Fixing TYPE_B pages ===')
    for page in TYPE_B_PAGES:
        fix_type_b_page(page)

    print('\nDone.')
