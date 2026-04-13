#!/usr/bin/env python3
"""
Generate TTS audio for a news article using OpenAI's TTS API.
Voice: Shimmer (Female Soft)

Usage:
    python generate-article-audio.py news/article-slug.html

Requirements:
    pip install openai beautifulsoup4

Set your API key:
    Windows: set OPENAI_API_KEY=sk-...
    Mac/Linux: export OPENAI_API_KEY=sk-...

Output:
    Saves an MP3 file next to the HTML file (same name, .mp3 extension).
    Then upload it to public_html/news/ via Namecheap cPanel File Manager.
"""

import sys
import os
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed. Run: pip install openai")
    sys.exit(1)

VOICE        = "shimmer"
MODEL        = "tts-1"
CHUNK_SIZE   = 3800  # safely under OpenAI's 4096 hard limit


# ── Text extraction ────────────────────────────────────────────────────────────

def extract_article_text(html_path: Path) -> str:
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    parts = []

    # Article headline (h1)
    headline = soup.find("h1", class_="na-headline") or soup.find("h1")
    if headline:
        parts.append(headline.get_text(strip=True) + ".")

    # Main article body
    body = soup.find(class_="na-body")
    if not body:
        raise ValueError("Could not find .na-body element in article. Is this a news article?")

    # Strip elements we don't want read aloud
    for el in body.find_all(["script", "style", "figure", "figcaption", "table"]):
        el.decompose()

    # Walk through body collecting text, preserving paragraph flow
    for el in body.children:
        if isinstance(el, NavigableString):
            text = str(el).strip()
            if text:
                parts.append(text)
        elif el.name in ("h2", "h3", "h4"):
            parts.append(el.get_text(strip=True) + ".")
        elif el.name in ("p", "li"):
            parts.append(el.get_text(separator=" ", strip=True))
        elif el.name in ("ul", "ol"):
            for li in el.find_all("li"):
                parts.append(li.get_text(separator=" ", strip=True))
        else:
            text = el.get_text(separator=" ", strip=True)
            if text:
                parts.append(text)

    return " ".join(p for p in parts if p)


# ── Chunking ───────────────────────────────────────────────────────────────────

def split_into_chunks(text: str) -> list[str]:
    if len(text) <= CHUNK_SIZE:
        return [text]

    chunks = []
    remaining = text

    while remaining:
        if len(remaining) <= CHUNK_SIZE:
            chunks.append(remaining)
            break

        slice_text = remaining[:CHUNK_SIZE]
        last_boundary = max(
            slice_text.rfind(". "),
            slice_text.rfind("! "),
            slice_text.rfind("? "),
            slice_text.rfind(".\n"),
            slice_text.rfind("!\n"),
            slice_text.rfind("?\n"),
        )

        cut_at = last_boundary + 1 if last_boundary > CHUNK_SIZE // 2 else CHUNK_SIZE
        chunks.append(remaining[:cut_at].strip())
        remaining = remaining[cut_at:].strip()

    return [c for c in chunks if c]


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate-article-audio.py news/article-slug.html")
        sys.exit(1)

    html_path = Path(sys.argv[1])
    if not html_path.exists():
        print(f"Error: File not found: {html_path}")
        sys.exit(1)

    output_path = html_path.with_suffix(".mp3")

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable is not set.")
        print("  Windows: set OPENAI_API_KEY=sk-...")
        sys.exit(1)

    print(f"Extracting text from {html_path}...")
    text = extract_article_text(html_path)
    print(f"Total characters: {len(text):,}")

    chunks = split_into_chunks(text)
    print(f"Chunks: {len(chunks)}")
    print(f"Voice: {VOICE} | Model: {MODEL}")

    client = OpenAI(api_key=api_key)
    audio_chunks = []

    for i, chunk in enumerate(chunks, 1):
        print(f"Generating chunk {i}/{len(chunks)} ({len(chunk):,} chars)...")
        response = client.audio.speech.create(
            model=MODEL,
            voice=VOICE,
            input=chunk,
            response_format="mp3",
        )
        audio_chunks.append(response.content)

    print(f"Saving to {output_path}...")
    with open(output_path, "wb") as f:
        for chunk in audio_chunks:
            f.write(chunk)

    size_kb = output_path.stat().st_size / 1024
    print(f"\nDone! {output_path.name} ({size_kb:.0f} KB)")
    print(f"\nNext steps:")
    print(f"  1. Upload {output_path.name} to public_html/news/ via Namecheap cPanel File Manager")
    print(f"  2. Add the na-audio block to {html_path.name} (see below)\n")
    slug = html_path.stem
    print(f"""--- na-audio block to paste into {html_path.name} ---
(paste it just before the <div class="na-body"> opening tag)

<div aria-label="Listen to this article" class="na-audio">
  <span aria-hidden="true" class="na-audio-icon material-symbols-outlined">headphones</span>
  <div class="na-audio-info">
    <div class="na-audio-top">
      <span class="na-audio-label">Listen to this article</span>
      <div class="na-volume">
        <button aria-label="Mute" class="na-mute-btn" id="na-mute-btn">
          <span class="material-symbols-outlined">volume_up</span>
        </button>
        <input aria-label="Volume" class="na-volume-slider" id="na-volume-slider" max="1" min="0" step="0.02" type="range" value="1"/>
      </div>
    </div>
    <audio id="na-player" preload="none" src="/news/{slug}.mp3"></audio>
    <div class="na-audio-controls">
      <button aria-label="Skip back 10 seconds" class="na-skip-btn" id="na-skip-back">
        <span class="material-symbols-outlined">replay_10</span>
      </button>
      <button aria-label="Play article audio" class="na-audio-btn" id="na-play-btn">
        <span class="material-symbols-outlined">play_arrow</span>
      </button>
      <button aria-label="Skip forward 10 seconds" class="na-skip-btn" id="na-skip-fwd">
        <span class="material-symbols-outlined">forward_10</span>
      </button>
      <div aria-label="Playback speed" class="na-speed-btns" role="group">
        <button class="na-speed-btn active" data-speed="1">1x</button>
        <button class="na-speed-btn" data-speed="1.5">1.5x</button>
        <button class="na-speed-btn" data-speed="2">2x</button>
      </div>
      <canvas aria-hidden="true" class="na-waveform" height="52" id="na-waveform" width="200"></canvas>
    </div>
    <div class="na-audio-progress-wrap">
      <span class="na-audio-time" id="na-current-time">0:00</span>
      <div aria-label="Audio progress" aria-valuemax="100" aria-valuemin="0" aria-valuenow="0" class="na-progress" id="na-progress" role="slider">
        <div class="na-progress-fill" id="na-progress-fill"></div>
        <div class="na-progress-thumb" id="na-progress-thumb"></div>
      </div>
      <span class="na-audio-time na-audio-duration" id="na-duration">0:00</span>
    </div>
  </div>
</div>""")


if __name__ == "__main__":
    main()
