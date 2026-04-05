#!/usr/bin/env python3
"""Fix audio player and podcast sections across all course pages.

TYPE_A pages: have na-audio/na-podcast but with plain <audio controls="True"> instead of full controls
TYPE_B pages: have old lp-audio-section/lp-podcast-section markup
ml-deep: has na-audio/na-podcast but with plain <audio controls> instead of full controls

Replace all with the full player HTML matching what-is-ai.html.
"""

import os
import re
from bs4 import BeautifulSoup, NavigableString

COURSE_DIR = os.path.join(os.path.dirname(__file__), 'course')

FULL_AUDIO_HTML = '''\
<div class="na-audio" aria-label="Listen to this lesson">
  <span class="na-audio-icon material-symbols-outlined" aria-hidden="true">headphones</span>
  <div class="na-audio-info">
    <div class="na-audio-top">
      <span class="na-audio-label">Listen to this lesson</span>
      <div class="na-volume">
        <button class="na-mute-btn" id="na-mute-btn" aria-label="Mute"><span class="material-symbols-outlined">volume_up</span></button>
        <input class="na-volume-slider" id="na-volume-slider" type="range" min="0" max="1" step="0.02" value="1" aria-label="Volume">
      </div>
    </div>
    <audio id="na-player" preload="none"></audio>
    <div class="na-audio-controls">
      <button class="na-skip-btn" id="na-skip-back" aria-label="Skip back 10 seconds"><span class="material-symbols-outlined">replay_10</span></button>
      <button class="na-audio-btn" id="na-play-btn" aria-label="Play lesson audio"><span class="material-symbols-outlined">play_arrow</span></button>
      <button class="na-skip-btn" id="na-skip-fwd" aria-label="Skip forward 10 seconds"><span class="material-symbols-outlined">forward_10</span></button>
      <div class="na-speed-btns" role="group" aria-label="Playback speed">
        <button class="na-speed-btn active" data-speed="1">1x</button>
        <button class="na-speed-btn" data-speed="1.5">1.5x</button>
        <button class="na-speed-btn" data-speed="2">2x</button>
      </div>
      <canvas id="na-waveform" class="na-waveform" width="200" height="52" aria-hidden="true"></canvas>
    </div>
    <div class="na-audio-progress-wrap">
      <span class="na-audio-time" id="na-current-time">0:00</span>
      <div class="na-progress" id="na-progress" role="slider" aria-label="Audio progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div class="na-progress-fill" id="na-progress-fill"></div>
        <div class="na-progress-thumb" id="na-progress-thumb"></div>
      </div>
      <span class="na-audio-time na-audio-duration" id="na-duration">0:00</span>
    </div>
  </div>
</div>'''

FULL_PODCAST_HTML = '''\
<div class="na-podcast" role="region" aria-label="Deep Dive Podcast">
  <div class="na-podcast-badge"><span class="material-symbols-outlined" aria-hidden="true">podcasts</span>Deep Dive Podcast</div>
  <div class="na-podcast-inner">
    <div class="na-podcast-left">
      <div class="na-podcast-icon" aria-hidden="true"><span class="material-symbols-outlined">graphic_eq</span></div>
      <div class="na-podcast-meta">
        <p class="na-podcast-title">Podcast Version</p>
        <p class="na-podcast-sub">Created with <a href="https://notebooklm.google.com/" target="_blank" rel="noopener" class="na-podcast-notebooklm"><strong>Google NotebookLM</strong></a> &middot; AI-generated audio overview</p>
      </div>
    </div>
    <audio id="na-podcast-audio" preload="none" aria-label="Deep Dive Podcast audio"></audio>
    <div class="na-podcast-controls">
      <div class="na-podcast-progress-wrap" role="group" aria-label="Playback progress">
        <span class="na-podcast-time" id="na-pod-current">0:00</span>
        <input type="range" class="na-podcast-progress" id="na-pod-progress" value="0" min="0" step="0.1" aria-label="Seek">
        <span class="na-podcast-time" id="na-pod-duration">0:00</span>
      </div>
      <div class="na-podcast-btns">
        <button class="na-pod-btn na-pod-btn--skip" id="na-pod-back" aria-label="Skip back 15 seconds"><span class="material-symbols-outlined">replay</span><span class="na-pod-skip-label">15s</span></button>
        <button class="na-pod-btn na-pod-btn--play" id="na-pod-play" aria-label="Play podcast"><span class="material-symbols-outlined" id="na-pod-play-icon">play_arrow</span></button>
        <button class="na-pod-btn na-pod-btn--skip" id="na-pod-fwd" aria-label="Skip forward 15 seconds"><span class="material-symbols-outlined">forward</span><span class="na-pod-skip-label">15s</span></button>
        <div class="na-pod-volume">
          <button class="na-pod-btn na-pod-mute" id="na-pod-mute" aria-label="Mute"><span class="material-symbols-outlined" id="na-pod-mute-icon">volume_up</span></button>
          <input type="range" class="na-pod-vol-slider" id="na-pod-vol" min="0" max="1" step="0.05" value="1" aria-label="Volume">
        </div>
      </div>
    </div>
  </div>
</div>'''


def needs_audio_fix(soup):
    """Check if audio section needs fixing (has na-audio but with plain audio element, or has lp-audio-section)."""
    # TYPE_B: old lp-audio-section
    if soup.find('section', class_='lp-audio-section') or soup.find(class_='lp-audio-section'):
        return 'type_b'
    # TYPE_A / ml-deep: na-audio but with plain <audio> (missing na-play-btn)
    na_audio = soup.find('div', class_='na-audio')
    if na_audio and not na_audio.find(id='na-play-btn'):
        return 'type_a'
    return None


def needs_podcast_fix(soup):
    """Check if podcast section needs fixing."""
    # TYPE_B: old lp-podcast-section
    if soup.find('section', class_='lp-podcast-section') or soup.find(class_='lp-podcast-section'):
        return 'type_b'
    # TYPE_A / ml-deep: na-podcast but with plain <audio> (missing na-pod-play)
    na_podcast = soup.find('div', class_='na-podcast')
    if na_podcast and not na_podcast.find(id='na-pod-play'):
        return 'type_a'
    return None


def replace_with_soup(old_tag, new_html):
    """Replace a BeautifulSoup tag with new HTML."""
    new_soup = BeautifulSoup(new_html, 'html.parser')
    new_tag = list(new_soup.children)[0]
    old_tag.replace_with(new_tag)


def fix_audio(soup, fix_type):
    if fix_type == 'type_b':
        # Find lp-audio-section - could be div or section
        old = soup.find(class_='lp-audio-section')
    else:
        # type_a: na-audio div but incomplete
        old = soup.find('div', class_='na-audio')

    if old:
        replace_with_soup(old, FULL_AUDIO_HTML)
        return True
    return False


def fix_podcast(soup, fix_type):
    if fix_type == 'type_b':
        old = soup.find(class_='lp-podcast-section')
    else:
        old = soup.find('div', class_='na-podcast')

    if old:
        replace_with_soup(old, FULL_PODCAST_HTML)
        return True
    return False


def process_file(filepath):
    filename = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    audio_fix = needs_audio_fix(soup)
    podcast_fix = needs_podcast_fix(soup)

    if not audio_fix and not podcast_fix:
        print(f'  SKIP {filename} (already correct)')
        return False

    changed = False
    if audio_fix:
        result = fix_audio(soup, audio_fix)
        if result:
            print(f'  FIXED audio ({audio_fix}) in {filename}')
            changed = True

    if podcast_fix:
        result = fix_podcast(soup, podcast_fix)
        if result:
            print(f'  FIXED podcast ({podcast_fix}) in {filename}')
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(str(soup))

    return changed


def main():
    html_files = [f for f in os.listdir(COURSE_DIR) if f.endswith('.html')]
    html_files.sort()

    changed_count = 0
    for filename in html_files:
        filepath = os.path.join(COURSE_DIR, filename)
        if process_file(filepath):
            changed_count += 1

    print(f'\nDone. Fixed {changed_count} files.')


if __name__ == '__main__':
    main()
