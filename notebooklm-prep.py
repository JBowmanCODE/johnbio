#!/usr/bin/env python3
"""
Prep a news article for NotebookLM podcast generation.

Usage:
    python notebooklm-prep.py news/article-slug.html

What it does:
    1. Extracts clean article text (headline + body, no nav/accordions/scripts)
    2. Copies the text to your clipboard
    3. Opens NotebookLM in your browser
    4. Prints the Deep Dive prompt to paste

Requirements:
    pip install beautifulsoup4 pyperclip
"""

import sys
import webbrowser
import time
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString

try:
    import pyperclip
except ImportError:
    print("Error: pyperclip not installed. Run: pip install pyperclip")
    sys.exit(1)

NOTEBOOKLM_URL = "https://notebooklm.google.com"


# ── Text extraction ────────────────────────────────────────────────────────────

def extract_article_text(html_path: Path) -> tuple[str, str]:
    """Returns (title, body_text)"""
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # Headline
    headline = soup.find("h1", class_="na-headline") or soup.find("h1")
    title = headline.get_text(strip=True) if headline else html_path.stem

    # Author
    author_el = soup.find(class_="na-author-name")
    author = author_el.get_text(strip=True) if author_el else "John Bowman"

    # Main article body only
    body = soup.find(class_="na-body")
    if not body:
        raise ValueError("Could not find .na-body element. Is this a news article?")

    # Strip elements we don't want
    for el in body.find_all(["script", "style", "figure", "figcaption", "table"]):
        el.decompose()

    parts = []
    for el in body.children:
        if isinstance(el, NavigableString):
            text = str(el).strip()
            if text:
                parts.append(text)
        elif el.name in ("h2", "h3", "h4"):
            parts.append("\n\n" + el.get_text(strip=True))
        elif el.name == "p":
            parts.append(el.get_text(separator=" ", strip=True))
        elif el.name in ("ul", "ol"):
            for li in el.find_all("li"):
                parts.append("- " + li.get_text(separator=" ", strip=True))
        else:
            text = el.get_text(separator=" ", strip=True)
            if text:
                parts.append(text)

    body_text = "\n\n".join(p for p in parts if p)

    full_text = f"Title: {title}\nAuthor: {author}\n\n{body_text}"
    return title, full_text


def build_prompt(title: str) -> str:
    return (
        f'Create a Deep Dive podcast episode based on this article: "{title}". '
        f'Explain the core concepts simply for someone new to AI search and marketing. '
        f'Use plain language, real examples, and keep it practical. '
        f'Aimed at beginners - no assumed knowledge.'
    )


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: python notebooklm-prep.py news/article-slug.html")
        sys.exit(1)

    html_path = Path(sys.argv[1])
    if not html_path.exists():
        print(f"Error: File not found: {html_path}")
        sys.exit(1)

    print(f"Extracting article text from {html_path}...")
    title, full_text = extract_article_text(html_path)

    print(f"Copying to clipboard ({len(full_text):,} characters)...")
    pyperclip.copy(full_text)

    prompt = build_prompt(title)

    print(f"\nOpening NotebookLM...")
    webbrowser.open(NOTEBOOKLM_URL)
    time.sleep(1)

    print(f"""
------------------------------------------------------
  Article text copied to clipboard.
------------------------------------------------------

In NotebookLM:
  1. Click "+ New notebook"
  2. Choose "Copied text" and paste (Ctrl+V)
  3. Click "Audio Overview" -> "Deep Dive"
  4. Paste the prompt below and click Generate

------------------------------------------------------
  DEEP DIVE PROMPT (copy and paste into NotebookLM):
------------------------------------------------------

{prompt}

------------------------------------------------------
""")


if __name__ == "__main__":
    main()
