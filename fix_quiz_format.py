#!/usr/bin/env python3
"""
Convert old quiz formats to new lp-quiz-option/lp-quiz-check format.

TYPE_A: section.lp-quiz-section with div.lp-quiz[id] + quizzes array in JS
TYPE_B: section.lp-quiz with div.lp-quiz-q + lp-quiz-correct class on button
NEW:    div.lp-quiz[aria-label] with lp-quiz-option / lp-quiz-check  (skip)

Also removes inline quiz JS from ALL course pages (now in news-article.js).
"""
import os, re
from bs4 import BeautifulSoup, NavigableString

COURSE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'course')
LETTERS = ['A', 'B', 'C', 'D', 'E']

# ── Helpers ────────────────────────────────────────────────────────────────

def strip_letter_prefix(text):
    """Strip 'A) ', 'B) ' etc from TYPE_B option text."""
    return re.sub(r'^[A-E]\)\s*', '', text.strip())

def build_new_quiz(questions, soup):
    """
    questions: list of dicts with keys:
        text        - question text string
        options     - list of strings (option text, no letter prefix)
        correct_idx - 0-based correct option index
    Returns a new div.lp-quiz tag.
    """
    n = len(questions)
    wrap = soup.new_tag('div', attrs={
        'class': 'lp-quiz',
        'aria-label': 'Lesson quiz'
    })

    # Header
    header = BeautifulSoup(
        '<div class="lp-quiz-header">'
        '<div class="lp-quiz-icon"><span class="material-symbols-outlined" aria-hidden="true">quiz</span></div>'
        '<div>'
        '<p class="lp-quiz-title">Check your understanding</p>'
        f'<p class="lp-quiz-sub">{n} question{"s" if n != 1 else ""} \u2014 select an answer then check it</p>'
        '</div></div>',
        'html.parser'
    )
    wrap.append(header)

    for qi, q in enumerate(questions):
        qn = qi + 1
        correct_letter = LETTERS[q['correct_idx']]

        q_div = soup.new_tag('div', attrs={'class': 'lp-quiz-q', 'id': f'q{qn}'})

        num_p = soup.new_tag('p', attrs={'class': 'lp-quiz-q-num'})
        num_p.string = f'Question {qn} of {n}'
        q_div.append(num_p)

        text_p = soup.new_tag('p', attrs={'class': 'lp-quiz-q-text'})
        text_p.string = q['text']
        q_div.append(text_p)

        opts_div = soup.new_tag('div', attrs={
            'class': 'lp-quiz-options',
            'role': 'group',
            'aria-label': f'Question {qn} options'
        })
        for oi, opt_text in enumerate(q['options']):
            letter = LETTERS[oi]
            btn = soup.new_tag('button', attrs={
                'class': 'lp-quiz-option',
                'data-q': str(qn),
                'data-v': letter
            })
            span = soup.new_tag('span', attrs={'class': 'lp-quiz-letter'})
            span.string = letter
            btn.append(span)
            btn.append(NavigableString(opt_text))
            opts_div.append(btn)
        q_div.append(opts_div)

        check_btn = soup.new_tag('button', attrs={
            'class': 'lp-quiz-check',
            'data-q': str(qn),
            'data-answer': correct_letter,
            'disabled': ''
        })
        check_btn.string = 'Check answer'
        q_div.append(check_btn)

        fb_p = soup.new_tag('p', attrs={'class': 'lp-quiz-feedback', 'id': f'q{qn}-fb'})
        q_div.append(fb_p)

        wrap.append(q_div)

    return wrap


# ── TYPE_A extraction ──────────────────────────────────────────────────────

def extract_type_a(soup, js_content):
    """Extract quiz data from TYPE_A format. Returns list of question dicts."""
    # Parse correct indices from JS: correct: N
    correct_indices = [int(m) for m in re.findall(r'correct\s*:\s*(\d+)', js_content)]

    quiz_divs = soup.find_all('div', id=re.compile(r'^quiz-\d+$'))
    if not quiz_divs or len(correct_indices) < len(quiz_divs):
        return None

    questions = []
    for i, div in enumerate(quiz_divs):
        q_p = div.find(class_='lp-quiz-q')
        q_text = q_p.get_text(strip=True) if q_p else ''
        # Strip "Question N: " prefix
        q_text = re.sub(r'^Question\s+\d+\s*:\s*', '', q_text)

        buttons = div.find_all(class_='lp-quiz-btn')
        options = [b.get_text(strip=True) for b in buttons]

        questions.append({
            'text': q_text,
            'options': options,
            'correct_idx': correct_indices[i]
        })
    return questions


# ── TYPE_B extraction ──────────────────────────────────────────────────────

def extract_type_b(soup):
    """Extract quiz data from TYPE_B format. Returns list of question dicts."""
    q_divs = soup.find_all('div', class_='lp-quiz-q')
    if not q_divs:
        return None

    questions = []
    for div in q_divs:
        q_p = div.find(class_='lp-quiz-question')
        q_text = q_p.get_text(strip=True) if q_p else ''

        buttons = div.find_all('button', class_='lp-quiz-btn')
        options = [strip_letter_prefix(b.get_text(strip=True)) for b in buttons]

        correct_btn = div.find('button', class_='lp-quiz-correct')
        correct_idx = int(correct_btn.get('data-i', 0)) if correct_btn else 0

        questions.append({
            'text': q_text,
            'options': options,
            'correct_idx': correct_idx
        })
    return questions


# ── JS block removal ───────────────────────────────────────────────────────

QUIZ_JS_PATTERNS = [
    r'lp-quiz-option',        # new format quiz JS (inline, moving to news-article.js)
    r'lp-quiz-check',
    r'lp-quiz-btn',           # old format TYPE_A and TYPE_B
    r'var quizzes\s*=',       # old format TYPE_A array
]

def is_quiz_script(script_tag):
    text = script_tag.string or ''
    return any(re.search(p, text) for p in QUIZ_JS_PATTERNS)


# ── Main file processor ────────────────────────────────────────────────────

def process_file(filepath):
    fname = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    # Detect format
    has_new    = bool(soup.find(class_='lp-quiz-option'))
    has_type_a = bool(soup.find('div', id=re.compile(r'^quiz-\d+$')))
    has_type_b = bool(soup.find(class_='lp-quiz-correct'))

    if has_new and not has_type_a and not has_type_b:
        # Already new format — only remove inline quiz JS
        changed = False
        for script in soup.find_all('script'):
            if is_quiz_script(script):
                script.decompose()
                changed = True
        if changed:
            print(f'  {fname}: removed inline quiz JS (new format)')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
        else:
            print(f'  SKIP {fname}: already correct, no inline quiz JS found')
        return changed

    # Extract quiz data
    questions = None
    if has_type_a:
        questions = extract_type_a(soup, content)
        fmt = 'TYPE_A'
    elif has_type_b:
        questions = extract_type_b(soup)
        fmt = 'TYPE_B'

    if not questions:
        print(f'  WARNING {fname}: could not extract quiz data')
        return False

    # Build new quiz HTML
    new_quiz = build_new_quiz(questions, soup)

    # Find container to replace
    if has_type_a:
        container = soup.find(class_='lp-quiz-section')
    else:
        container = soup.find('section', class_='lp-quiz') or soup.find(class_='lp-quiz')

    if not container:
        print(f'  WARNING {fname}: quiz container not found')
        return False

    container.replace_with(new_quiz)

    # Remove all inline quiz JS blocks
    for script in soup.find_all('script'):
        if is_quiz_script(script):
            script.decompose()

    print(f'  {fname}: converted {fmt} to new format ({len(questions)} questions)')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    return True


def main():
    files = sorted(f for f in os.listdir(COURSE_DIR) if f.endswith('.html'))
    changed = 0
    for fname in files:
        if process_file(os.path.join(COURSE_DIR, fname)):
            changed += 1
    print(f'\nDone. Processed {changed} files.')


if __name__ == '__main__':
    main()
