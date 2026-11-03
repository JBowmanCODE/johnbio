# Key AI Subfields

> Overview of natural language processing (NLP), computer vision, speech recognition, robotics and recommender systems.

- **Canonical URL**: https://johnb.io/course/key-ai-subfields
- **Markdown URL**: https://johnb.io/course/key-ai-subfields.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 2
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 8 min read

AI isn't one thing. Different subfields tackle completely different types of problems. Three of them are everywhere right now: NLP for language, computer vision for images, and edge AI for on-device processing. Each has different strengths, limits, and applications.

## Natural Language Processing (NLP)

NLP is the field that handles human language - text, speech, conversation. Everything that involves words.

It produced ChatGPT, Copilot, and every text-based AI tool you've used. Translation, question answering, summarisation, text generation, spam filtering, information extraction - all NLP. The [Wikipedia article on natural language processing](https://en.wikipedia.org/wiki/Natural_language_processing) gives a good overview of the field's history.

Some real examples. Gmail's Smart Reply suggests email responses by predicting what most people say in reply to common email types. Search engines understand awkward phrasing because NLP parses intent, not just keywords. Medical systems scan research papers and extract relevant findings at scale. Voice assistants work because speech recognition converts audio to text, then NLP understands it.

The important limit: NLP systems are good at pattern matching in language but poor at understanding meaning or truth. ChatGPT can write essays about topics it doesn't comprehend. The [transformers lesson](https://johnb.io/course/rnns-transformers-autoencoders) explains the architecture behind these systems. It confidently produces false information. It can't tell accurate sources from fiction if both appeared in its training data. That's not a bug waiting to be fixed - it's a consequence of how these systems work.

NLP also skews heavily towards English. Systems for other languages exist but are generally less capable because they were trained on less data.

## Computer Vision

Computer vision is the field that handles images and video - the systems that let AI see.

In some ways it's the more mathematically mature field. An image is just a grid of numbers. You can apply operations to those numbers to find patterns, and the mathematics for doing so are well established.

Computer vision systems can identify objects in images, detect and analyse faces, extract text from photos, segment images into regions, estimate 3D structure from 2D images, and track movement in video. The main architecture behind this is [convolutional neural networks](https://johnb.io/course/cnns-with-keras).

Where it shows up: autonomous vehicles use it to see roads, pedestrians, and other cars under varying light and weather. Medical imaging systems flag abnormalities in X-rays and MRI scans for doctors to review. Retailers monitor empty shelves. Amazon's cashier-less stores track what customers pick up. Manufacturing plants inspect products for defects faster and more consistently than humans.

The limits matter. Computer vision is reliable for images that resemble its training data. Unusual angles, poor lighting, or object types it hasn't seen cause failures. It's computationally expensive. And it's brittle in a specific way: adversarial examples - images with tiny deliberate modifications invisible to humans - can completely fool these systems while appearing unchanged to us. This is one of several limitations explored in [ML and deep learning](https://johnb.io/course/ml-deep-learning-neural-networks).

## Edge AI

Edge AI means running AI on devices rather than in the cloud. Instead of sending data to a server, the device handles processing locally. Getting AI onto devices efficiently requires understanding [agent architectures](https://johnb.io/course/prompt-engineering-ai-agents) as well as model compression.

It gets less attention than NLP or computer vision but it's increasingly relevant for real applications.

Cloud processing has real costs and risks. You have to transmit data somewhere. You're dependent on connectivity. You pay for bandwidth. If the internet goes down, the system stops. Edge AI cuts these dependencies.

The face recognition that unlocks your phone is edge AI - your face isn't sent to Apple's servers. Fitness watches that detect walking or running analyse motion data on the device itself. Industrial sensors spot equipment faults locally without uploading all sensor data to the cloud. Hearing aids filter background noise in real-time using on-board processing.

The challenge is hardware constraints. You can't run a model with 100 billion parameters on a phone. Edge AI requires smaller, more specialised models, and smaller models generally perform less well. Researchers are working on efficient architectures, quantisation techniques, and dedicated hardware accelerators because the payoff - AI everywhere, independent of cloud - is substantial.

## Which Subfield Will Have the Most Impact?

NLP gets the most attention. Computer vision is already embedded in real systems at scale. But edge AI is the one worth watching. For a broader picture of what's available today, the [AI tools and platforms](https://johnb.io/course/ai-tools-platforms-2026) lesson covers the major players across all subfields.

NLP's primary impact so far is cultural - writing, chatbots, search. Computer vision is industrial and deployed in healthcare, manufacturing, and retail. Edge AI, once the hardware and efficiency problems are solved, puts AI capabilities into every phone, watch, car, and industrial sensor on earth - without cloud dependency.

That's a different order of magnitude. Right now, edge AI is the bottleneck. The models are improving but still too large for most devices. Once that's cracked, you get persistent, local intelligence everywhere. That matters more than whether the latest chatbot can hold a better conversation.

## How It Works

1. **NLP.** systems are trained on large text datasets. They learn statistical relationships between words - which words appear together, in what contexts, following what patterns. Modern NLP uses transformer architectures with attention mechanisms that let the system weight different parts of the input when generating each output token.
2. **Computer vision.** typically uses convolutional neural networks (CNNs). These apply filters that scan across an image, detecting edges, textures, and shapes at progressively higher levels of abstraction. The final layer classifies what the image contains or localises where objects are.
3. **Edge AI.** requires model compression. Techniques include quantisation (reducing precision from 32-bit floats to 8-bit integers), pruning (removing low-importance connections), and knowledge distillation (training a small model to mimic a large one). Dedicated chips - Apple's Neural Engine, Qualcomm's Hexagon - run these compressed models efficiently on battery-powered devices.

## Key Points

- NLP handles language: translation, summarisation, text generation, speech recognition, question answering.
- NLP systems match language patterns - they don't understand truth or meaning, and can hallucinate confidently.
- Computer vision handles images and video: object detection, facial recognition, medical imaging, quality control.
- Computer vision fails on data differing from training - unusual angles, lighting, or unseen object types.
- Adversarial examples (small pixel modifications) can fool computer vision systems while appearing unchanged to humans.
- Edge AI processes data locally on devices rather than sending it to cloud servers.
- Edge AI benefits: speed, privacy, offline capability, no bandwidth costs.
- Edge AI bottleneck: state-of-the-art models are too large for most edge devices - active research area.

## Frequently Asked Questions

### What is natural language processing (NLP)?

NLP is the AI subfield that handles human language - text, speech, and conversation. It powers systems like ChatGPT, search engines that understand intent, machine translation, spam filters, and voice assistants. NLP systems learn statistical patterns in language, which is why they're good at generating fluent text but poor at distinguishing true from false information.

### What is computer vision in AI?

Computer vision is the AI subfield that handles images and video. It powers autonomous vehicles, medical imaging diagnostics, retail shelf monitoring, and manufacturing quality control. Computer vision systems identify objects, detect faces, read text in images, and track movement - but they can fail on unusual angles or lighting not seen in training.

### What is edge AI?

Edge AI means running AI models on devices rather than sending data to cloud servers. Your phone's face unlock, fitness watches detecting exercise, and industrial sensors spotting equipment faults are all edge AI. The main advantage is speed, privacy, and offline capability. The challenge is that the best AI models are too large for most edge hardware.

### Which AI subfield will have the most impact?

Edge AI may have the most transformative impact over the next decade. NLP gets more attention, but getting efficient AI running on billions of devices - phones, watches, cars, industrial sensors - is a foundational shift. It moves AI from cloud-dependent services to always-on, local intelligence. The bottleneck right now is model size: most state-of-the-art models are too large for edge hardware.

## Sources & Primary References

1. Vaswani, A. et al. (2017). Attention Is All You Need. *NeurIPS 2017*.
2. He, K. et al. (2016). Deep Residual Learning for Image Recognition. *CVPR 2016*.
3. Goodfellow, I. et al. (2014). Explaining and Harnessing Adversarial Examples. *arXiv*:1412.6572.
4. Howard, A. et al. (2017). MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications. *arXiv*:1704.04861.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
