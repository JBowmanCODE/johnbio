import os
import re

COURSE_DIR = r'C:\Users\John\Desktop\johnb2026\course'

# All 27 pages missing header.css
BROKEN_PAGES = [
    'activation-functions-vanishing-gradient.html',
    'ai-across-industries.html',
    'ai-adoption-journey.html',
    'ai-failures-ethics.html',
    'ai-governance-frameworks.html',
    'ai-hallucinations-bias-ip.html',
    'ai-tools-platforms-2026.html',
    'backpropagation.html',
    'build-vs-buy.html',
    'business-case-for-ai.html',
    'cicd-for-ml.html',
    'cnns-with-keras.html',
    'generative-ai-models.html',
    'intro-to-mlops.html',
    'key-ai-subfields.html',
    'key-ml-algorithms.html',
    'linear-regression-gradient-descent.html',
    'logistic-regression-classification.html',
    'ml-deep-learning-neural-networks.html',
    'model-deployment.html',
    'model-evaluation.html',
    'monitoring-drift.html',
    'neural-networks-forward-propagation.html',
    'numpy-pandas.html',
    'prompt-engineering-ai-agents.html',
    'rag-finetuning-enterprise-ai.html',
    'rnns-transformers-autoencoders.html',
]

# Type A: also missing news-article.js, may have course-data.js, old CSS versions
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
    'ml-deep-learning-neural-networks.html',
    'model-evaluation.html',
    'neural-networks-forward-propagation.html',
    'numpy-pandas.html',
]

FAVICON_AND_HEADER_CSS = '''  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="apple-touch-icon" href="/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/header.css">
  <link rel="stylesheet" href="/footer.css">'''

fixed = 0
skipped = 0
errors = []

for filename in BROKEN_PAGES:
    filepath = os.path.join(COURSE_DIR, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # 1. Fix GA ID placeholder
        content = content.replace('G-XXXXXXXXXX', 'G-0J6PBWMRNY')

        # 2. Add favicons + fonts + header.css + footer.css (replace /styles.css line)
        styles_line = '  <link rel="stylesheet" href="/styles.css">'
        if styles_line in content and '/header.css' not in content:
            content = content.replace(styles_line, FAVICON_AND_HEADER_CSS)

        # 3. Fix news-chat.css to v=7
        content = re.sub(r'news-chat\.css\?v=(?!7)\d+', 'news-chat.css?v=7', content)

        # 4. Fix lesson.css?vN → lesson.css (no version string)
        content = re.sub(r'lesson\.css\?v=\d+', 'lesson.css', content)

        # 5. Add defer to scripts.js
        content = content.replace(
            '<script src="/scripts.js"></script>',
            '<script src="/scripts.js" defer></script>'
        )

        # Type A only: remove course-data.js, add news-article.js
        if filename in TYPE_A_PAGES:
            # Remove course-data.js line
            content = re.sub(
                r'\n?\s*<script src="/course-data\.js"[^>]*></script>',
                '',
                content
            )
            # Add news-article.js before news-chat.js if missing
            if '/news-article.js' not in content:
                content = content.replace(
                    '<script src="/news-chat.js" defer></script>',
                    '<script src="/news-article.js" defer></script>\n  <script src="/news-chat.js" defer></script>'
                )

        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'FIXED: {filename}')
            fixed += 1
        else:
            print(f'NO CHANGE: {filename}')
            skipped += 1

    except Exception as e:
        print(f'ERROR: {filename} — {e}')
        errors.append(filename)

print(f'\nDone: {fixed} fixed, {skipped} unchanged, {len(errors)} errors')
if errors:
    print('Errors:', errors)
