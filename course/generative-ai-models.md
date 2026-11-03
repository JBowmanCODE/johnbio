# Generative AI Models

> How Variational Autoencoders (VAEs), Generative Adversarial Networks (GANs), diffusion models and autoregressive LLMs generate content.

- **Canonical URL**: https://johnb.io/course/generative-ai-models
- **Markdown URL**: https://johnb.io/course/generative-ai-models.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 7 · Generative AI & Practical Applications
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 11 min read

Generative AI doesn't understand anything. It's learning patterns in data and playing them back in new combinations. Everything else is details about how to make that work.

Generative AI doesn't understand anything. It's learning patterns in data and playing them back in new combinations. Everything else is details about how to make that work.

The actual problem is hard though. If you want a machine to create new images, music, or text that doesn't exist in your training data, you need a way to learn what makes those things valid - not memorise the training set.

## What generative models are trying to do

A generative model learns a probability distribution. It's learning P(x) - the probability of seeing something like x. Once it learns that distribution, you can sample from it to create new things.

This matters because you can't just memorise. Your training set might have a million images, but the space of possible images is infinite. The model has to compress what it learns into something that can generate novel examples.

## Variational Autoencoders (VAEs)

[VAEs](https://en.wikipedia.org/wiki/Variational_autoencoder) work in two pieces. The encoder compresses an image down to a small vector of numbers - a latent representation. The decoder reconstructs the image from that vector.

The clever part is what happens in the middle. VAEs don't learn a fixed compression. They learn a distribution over possible latent codes. The encoder outputs a mean and variance, and you sample from that distribution. Then you decode the sample.

This forces the model to learn a smooth latent space. Move slightly in that space, and the decoded image changes smoothly. You can interpolate between two images by interpolating in latent space.

VAEs are mathematically elegant - you can write down and understand why they work. But the images they generate often look blurry. The model is averaging over possibilities rather than committing to sharp details.

## GANs: the generator vs discriminator game

[GANs](https://en.wikipedia.org/wiki/Generative_adversarial_network) are adversarial. Two networks fight each other. The generator creates fake images from random noise. The discriminator tries to tell which images are real and which are fake.

If the discriminator gets too good, the generator has to make more convincing fakes. If the generator gets too good, the discriminator can't tell the difference. In theory they reach a Nash equilibrium where the generator produces indistinguishable samples.

This was genuinely exciting when it came out. GANs could produce sharp, detailed images in ways VAEs couldn't. People built increasingly sophisticated GAN architectures and got impressive results.

But GANs are hard to train. The adversarial dynamic is unstable. Mode collapse happens - the generator learns to produce a few variations really well instead of the full diversity of the training distribution. Training requires careful tuning, careful architecture choices, and often luck. Most practitioners working with images today aren't using GANs. The technology works but it's temperamental.

## Diffusion models: the dominant approach

[Diffusion models](https://en.wikipedia.org/wiki/Diffusion_model) solve image generation differently. They start with random noise and gradually denoise it over many steps.

Take an image and add noise to it repeatedly until it's pure random noise - that's the forward process. Then train a model to reverse it: to predict what the image was before the last noise was added.

If you can predict denoising at every step, you can start from pure noise and iteratively denoise. Each step removes a little noise until you have a generated image.

This is simple. Elegantly simple. The training objective is clear - predict the noise that was added. It's not adversarial, so there's no mode collapse. You get as much diversity as your training data had.

The trade-off is speed. Sampling requires many steps - maybe 50 to 1,000 denoising steps, versus one forward pass for a VAE or GAN. But over the last few years, researchers have developed better sampling algorithms that dramatically reduced the number of steps needed without losing quality.

## Why diffusion won

Diffusion models became dominant for a simple reason: they work reliably and they scale. They're stable to train. Mode collapse isn't a problem. You get good diversity. The maths is clean.

GANs can generate quickly, which matters in some applications. VAEs are mathematically elegant and have a clean probabilistic interpretation. But if you're building an image generation system today, you're probably starting with diffusion.

If you're learning generative models to understand what's happening under the hood, VAEs are worth understanding - the latent space interpretation is genuinely useful. GANs are interesting historically; they opened up adversarial training as a concept that matters beyond just image generation. But diffusion is what's shipping and what's driving progress. For text generation, [transformer-based](https://johnb.io/course/rnns-transformers-autoencoders) models dominate - diffusion applies mainly to images, audio, and video.

The interesting questions now aren't which model type is best. They're how to make diffusion faster and how to control what gets generated - [prompting](https://johnb.io/course/prompt-engineering-ai-agents) and conditioning. Techniques like [RAG and fine-tuning](https://johnb.io/course/rag-finetuning-enterprise-ai) build on top of these generative foundations. The foundation work is largely solved.

## How It Works

1. **VAEs:.** The encoder maps input data to a mean and variance in latent space. A sample is drawn from this distribution and passed to the decoder, which reconstructs the original input. The loss function combines reconstruction error with a regularisation term (KL divergence) that keeps the latent space smooth and continuous.
2. **GANs:.** The generator takes random noise and produces a fake sample. The discriminator takes both real and fake samples and outputs a probability of being real. Both networks train simultaneously: the generator minimises its ability to be detected, the discriminator maximises its detection accuracy. The ideal result is a generator that produces samples indistinguishable from real data.
3. **Diffusion:.** The forward process adds Gaussian noise to data over T steps until the data is pure noise. The model (typically a U-Net) is trained to predict the noise added at each step. At generation time, you sample pure noise and run T denoising steps using the model, each step subtracting the predicted noise to recover the original signal.

## Key Points

- Generative models learn probability distributions over data, not just to classify it
- VAEs learn smooth latent spaces but produce blurry outputs due to averaging
- GANs use adversarial training to produce sharp images but are unstable and prone to mode collapse
- Diffusion models add then remove noise iteratively - stable to train, high-quality outputs
- Diffusion's slow sampling has been largely solved by improved algorithms
- Diffusion models underpin Stable Diffusion, DALL-E 3, Midjourney, and Sora
- VAEs remain useful for understanding latent spaces and as components in larger systems
- GAN training concepts (adversarial objectives) remain relevant beyond image generation

## Frequently Asked Questions

### What is a generative AI model?

A generative model learns a probability distribution from training data, then samples from that distribution to create new examples. It can't memorise all possible images, so it learns the underlying structure of what makes something a valid image, piece of music, or sentence. The three main approaches are VAEs, GANs, and diffusion models.

### What is the difference between a VAE and a GAN?

A VAE (Variational Autoencoder) compresses data to a latent distribution and reconstructs from it. The training is stable and the latent space is smooth, but outputs tend to be blurry. A GAN (Generative Adversarial Network) pits a generator against a discriminator in an adversarial game. GANs produce sharper images but are notoriously unstable to train and prone to mode collapse.

### How does a diffusion model work?

A diffusion model learns to reverse a noise-adding process. During training, noise is added to images step by step until they're pure noise. The model learns to predict what was there before each noise step. At generation time, you start with pure noise and iteratively denoise, producing a new image. The training is stable, there's no mode collapse, and the results are high quality.

### Why did diffusion models win over GANs?

Diffusion models are stable to train, produce diverse outputs, and scale well. GANs produce sharp images but suffer from mode collapse and training instability. Diffusion models' main disadvantage - slow sampling - has been largely addressed by improved sampling algorithms. For most image generation tasks today, diffusion is the default choice.

## Sources & Primary References

1. Kingma, D. & Welling, M. (2013). Auto-Encoding Variational Bayes. *arXiv*.
2. Goodfellow, I. et al. (2014). Generative Adversarial Networks. *NeurIPS*.
3. Ho, J. et al. (2020). Denoising Diffusion Probabilistic Models. *NeurIPS*.
4. Rombach, R. et al. (2022). High-Resolution Image Synthesis with Latent Diffusion Models. *CVPR*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
