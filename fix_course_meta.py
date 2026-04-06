"""
Fix metadata, schema, and alt text on 27 course files.

Issues to fix:
1. Add <meta name="author" content="John Bowman">
2. Fix OG/Twitter image URLs from course-og.jpg to course/{slug}.webp
3. Fix OG/Twitter image alt text to be descriptive
4. Fix Article schema: add url, keywords, articleSection; fix author URL; fix image URL
5. Fix empty lede image alt text
"""

import re
import os
import json

# Files to fix (those without meta author = the 27 problem files)
FILES_TO_FIX = [
    "activation-functions-vanishing-gradient",
    "ai-across-industries",
    "ai-adoption-journey",
    "ai-failures-ethics",
    "ai-governance-frameworks",
    "ai-hallucinations-bias-ip",
    "ai-tools-platforms-2026",
    "backpropagation",
    "build-vs-buy",
    "business-case-for-ai",
    "cicd-for-ml",
    "cnns-with-keras",
    "generative-ai-models",
    "intro-to-mlops",
    "key-ai-subfields",
    "key-ml-algorithms",
    "linear-regression-gradient-descent",
    "logistic-regression-classification",
    "ml-deep-learning-neural-networks",
    "model-deployment",
    "model-evaluation",
    "monitoring-drift",
    "neural-networks-forward-propagation",
    "numpy-pandas",
    "prompt-engineering-ai-agents",
    "rag-finetuning-enterprise-ai",
    "rnns-transformers-autoencoders",
]

# Alt text for lede images (based on lesson title / topic)
LEDE_ALT_TEXT = {
    "activation-functions-vanishing-gradient": "Activation functions and the vanishing gradient problem in neural networks",
    "ai-across-industries": "AI applications across healthcare, marketing, finance and other industries",
    "ai-adoption-journey": "AI adoption journey - how organisations move from experimentation to production",
    "ai-failures-ethics": "Real-world AI failures and ethics case studies",
    "ai-governance-frameworks": "AI governance frameworks and enterprise AI policy",
    "ai-hallucinations-bias-ip": "AI hallucinations, bias, and intellectual property risks explained",
    "ai-tools-platforms-2026": "AI tools and platforms in 2026 - LLMs, agents and RAG explained",
    "backpropagation": "Backpropagation algorithm - how neural networks learn from errors",
    "build-vs-buy": "Build vs buy AI decision framework for businesses",
    "business-case-for-ai": "Making the business case for AI - ROI and stakeholder buy-in",
    "cicd-for-ml": "CI/CD for machine learning - automating the ML pipeline",
    "cnns-with-keras": "Convolutional neural networks (CNNs) built with Keras",
    "generative-ai-models": "Generative AI models - VAEs, GANs and diffusion models compared",
    "intro-to-mlops": "Introduction to MLOps - from notebook to production deployment",
    "key-ai-subfields": "NLP, computer vision, and edge AI - key AI subfields explained",
    "key-ml-algorithms": "Key machine learning algorithms - decision trees, SVMs, KNN and more",
    "linear-regression-gradient-descent": "Linear regression and gradient descent - the foundations of machine learning",
    "logistic-regression-classification": "Logistic regression and classification in machine learning",
    "ml-deep-learning-neural-networks": "Machine learning, deep learning and neural networks - how they relate",
    "model-deployment": "Model deployment using APIs, containers and cloud services",
    "model-evaluation": "Model evaluation - validation, overfitting detection and performance metrics",
    "monitoring-drift": "Monitoring and drift detection to keep production ML models healthy",
    "neural-networks-forward-propagation": "Artificial neural networks and forward propagation explained",
    "numpy-pandas": "NumPy and Pandas for AI data analysis in Python",
    "prompt-engineering-ai-agents": "Prompt engineering techniques and AI agents explained",
    "rag-finetuning-enterprise-ai": "RAG, fine-tuning and enterprise AI strategy",
    "rnns-transformers-autoencoders": "RNNs, transformers and autoencoders - key deep learning architectures",
}

def get_meta_value(content, prop_or_name, attr):
    """Extract content from a meta tag by property or name attribute."""
    # Try property="X" content="Y"
    pattern1 = rf'{attr}="{re.escape(prop_or_name)}"[^>]*content="([^"]+)"'
    pattern2 = rf'content="([^"]+)"[^>]*{attr}="{re.escape(prop_or_name)}"'
    m = re.search(pattern1, content) or re.search(pattern2, content)
    return m.group(1) if m else None

def fix_file(slug):
    filepath = f"course/{slug}.html"

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Add <meta name="author"> after robots meta
    if 'name="author"' not in content:
        content = content.replace(
            '<meta content="index, follow" name="robots"/>',
            '<meta content="index, follow" name="robots"/>\n<meta content="John Bowman" name="author"/>'
        )
        # Fallback pattern variant
        if 'name="author"' not in content:
            content = content.replace(
                'name="robots" content="index, follow"',
                'name="robots" content="index, follow"/>\n<meta content="John Bowman" name="author"'
            )

    # 2. Fix OG image URL
    specific_img = f"https://johnb.io/images/course/{slug}.webp"
    content = re.sub(
        r'(property="og:image"\s+content=")[^"]*course-og\.[^"]*(")',
        rf'\g<1>{specific_img}\g<2>',
        content
    )
    content = re.sub(
        r'(content=")[^"]*course-og\.[^"]*("\s+property="og:image")',
        rf'\g<1>{specific_img}\g<2>',
        content
    )

    # 3. Fix Twitter image URL
    content = re.sub(
        r'(name="twitter:image"\s+content=")[^"]*course-og\.[^"]*(")',
        rf'\g<1>{specific_img}\g<2>',
        content
    )
    content = re.sub(
        r'(content=")[^"]*course-og\.[^"]*("\s+name="twitter:image")',
        rf'\g<1>{specific_img}\g<2>',
        content
    )

    # 4. Fix OG image:alt
    og_title = get_meta_value(content, 'og:title', 'property')
    if og_title:
        og_img_alt = f"{og_title} lesson cover"
        twitter_img_alt = f"{og_title} lesson cover - JohnB.io AI Course"

        content = re.sub(
            r'(property="og:image:alt"\s+content=")[^"]*(")',
            rf'\g<1>{og_img_alt}\g<2>',
            content
        )
        content = re.sub(
            r'(content=")[^"]*("\s+property="og:image:alt")',
            rf'\g<1>{og_img_alt}\g<2>',
            content
        )

        # 5. Fix Twitter image:alt
        content = re.sub(
            r'(name="twitter:image:alt"\s+content=")[^"]*(")',
            rf'\g<1>{twitter_img_alt}\g<2>',
            content
        )
        content = re.sub(
            r'(content=")[^"]*("\s+name="twitter:image:alt")',
            rf'\g<1>{twitter_img_alt}\g<2>',
            content
        )

    # 6. Fix Article schema JSON
    # Find the Article schema block and update it
    article_schema_pattern = r'(<script type="application/ld\+json">\s*\{[^<]*"@type":\s*"Article"[^<]*</script>)'
    article_match = re.search(article_schema_pattern, content, re.DOTALL)

    if article_match:
        schema_block = article_match.group(0)

        # Fix image URL in schema
        schema_block = re.sub(
            r'"image":\s*"https://johnb\.io/images/course-og\.[^"]*"',
            f'"image": "{specific_img}"',
            schema_block
        )

        # Fix author URL from https://johnb.io to LinkedIn
        schema_block = re.sub(
            r'"url":\s*"https://johnb\.io"\s*\}\s*,\s*\n\s*"publisher"',
            '"url": "https://www.linkedin.com/in/john-bowman/"\n    },\n    "publisher"',
            schema_block
        )
        # Also handle single-line format
        schema_block = re.sub(
            r'"url":\s*"https://johnb\.io"\s*\}(\s*,\s*)"publisher"',
            r'"url": "https://www.linkedin.com/in/john-bowman/"}\1"publisher"',
            schema_block
        )

        # Add url field after headline if not present
        if f'"url": "https://johnb.io/course/{slug}"' not in schema_block:
            # Add url after description field
            schema_block = re.sub(
                r'("description":\s*"[^"]*")',
                rf'\1,\n    "url": "https://johnb.io/course/{slug}"',
                schema_block,
                count=1
            )

        # Extract keywords from meta tag for schema
        kw = get_meta_value(content, 'keywords', 'name')

        # Add keywords and articleSection before closing brace of schema
        # Find the publisher block closing and add after
        if '"keywords"' not in schema_block and kw:
            schema_block = re.sub(
                r'("publisher":\s*\{[^}]+\})',
                rf'\1,\n    "keywords": "{kw}",\n    "articleSection": "AI Course"',
                schema_block,
                count=1
            )
        elif '"articleSection"' not in schema_block:
            schema_block = re.sub(
                r'("publisher":\s*\{[^}]+\})',
                rf'\1,\n    "articleSection": "AI Course"',
                schema_block,
                count=1
            )

        content = content.replace(article_match.group(0), schema_block)

    # 7. Fix empty lede image alt
    lede_alt = LEDE_ALT_TEXT.get(slug, f"{og_title} lesson cover" if og_title else "AI course lesson cover")
    content = re.sub(
        r'(na-lede-img[^>]*>.*?<img )alt=""( loading="lazy" src="/images/course/' + re.escape(slug) + r'\.webp")',
        rf'\1alt="{lede_alt}"\2',
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"FIXED: {slug}")
    else:
        print(f"NO CHANGE: {slug}")

if __name__ == "__main__":
    for slug in FILES_TO_FIX:
        try:
            fix_file(slug)
        except Exception as e:
            print(f"ERROR {slug}: {e}")

    print("\nDone.")
