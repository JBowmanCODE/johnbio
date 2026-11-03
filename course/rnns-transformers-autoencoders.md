# RNNs, Transformers and Autoencoders

> Sequence modelling from recurrent neural networks and LSTMs to self-attention transformers and autoencoders.

- **Canonical URL**: https://johnb.io/course/rnns-transformers-autoencoders
- **Markdown URL**: https://johnb.io/course/rnns-transformers-autoencoders.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 6 · Deep Learning & Neural Networks
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 13 min read

These three architectures solve different problems, but they matter for different reasons. RNNs are why we got here. Transformers are where most AI is now. Autoencoders are useful if you understand when to reach for them.

These three architectures solve different problems, but they matter for different reasons. RNNs are why we got here. Transformers are where most AI is now. Autoencoders are useful if you understand when to reach for them. All of these build on the foundations in the [backpropagation](https://johnb.io/course/backpropagation) lesson.

## Recurrent Neural Networks - what they were designed for

An RNN is a neural network with loops. Instead of data flowing one direction from input to output, a neuron can send its output back to itself as input on the next time step.

This matters for sequences. If you're predicting the next word in a sentence, the word matters, but so does context - the words before it. An RNN's hidden state acts like memory. As it processes word after word, the hidden state updates, carrying information forward.

Mathematically, the hidden state at time t depends on the input at time t and the hidden state at time t-1. Process a sequence one element at a time, and the network can theoretically learn dependencies - what came before shapes what comes next.

This makes RNNs useful for language models, machine translation, speech recognition, and time series prediction. Anything where order matters. These sequential computations build on the [forward propagation](https://johnb.io/course/neural-networks-forward-propagation) mechanics covered earlier.

## Why they struggled with long sequences

RNNs have a fundamental problem: they backpropagate through time, and gradients get tiny as sequences get long. That's the vanishing gradient problem again - explained in more depth in the [activation functions lesson](https://johnb.io/course/activation-functions-vanishing-gradient) - this time across time steps instead of layers.

In practice, RNNs struggle to remember things more than about 10 to 20 time steps back. For long sentences or documents, that's a real limitation.

Variants like LSTMs (Long Short-Term Memory) and GRUs (Gated Recurrent Units) tried to fix this by adding gates that control how much information flows forward. They work better than vanilla RNNs, but they're not elegant fixes - they're patches on a flawed architecture.

And they're slow. RNNs process sequences one element at a time. You can't parallelise easily. Training is expensive.

## Transformers - the attention mechanism explained plainly

A Transformer doesn't process sequences sequentially. It looks at the entire sequence at once and uses attention to figure out which parts matter to which other parts.

Attention is the key idea. For each word in a sentence, compute how much that word should pay attention to every other word (including itself). Words that matter more get higher attention.

Technically, attention uses queries, keys, and values. The query from one word asks: what parts of the sequence are relevant to me? The keys answer: I have this kind of information. The values say: here's that information. The attention mechanism multiplies queries and keys to measure how well they match, and uses that score to weight the values.

Do this calculation for every position in the sequence, and you get a new representation where each position incorporates relevant information from the whole sequence.

You don't have to understand the maths. The intuition is: each part of the sequence attends to the parts that matter and ignores the rest. In a language model, a word can learn to pay attention to subject-verb pairs, pronouns, contextual clues - whatever is relevant. It happens automatically during training.

## Why Transformers changed NLP

Before Transformers, NLP relied on RNNs. They were okay but had the gradient and speed problems.

Transformers, introduced in 2017 in the ["Attention Is All You Need" paper](https://arxiv.org/abs/1706.03762), solved both. They process entire sequences in parallel, so they're fast on GPUs. Attention doesn't suffer from vanishing gradients the same way RNNs do. You can train much deeper models on much more data.

The result was dramatic. Within a few years, Transformer-based models - BERT, GPT, and others - outperformed RNNs on basically every NLP task. [Wikipedia's transformer article](https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)) traces how the architecture evolved after that initial paper.

This wasn't just an incremental improvement. RNNs are still taught in courses for historical context, but in 2026, most language AI is Transformers.

## Autoencoders - what they compress and why that's useful

An autoencoder is a network that compresses data and then reconstructs it.

The structure is encoder, bottleneck, decoder. The encoder takes high-dimensional input (say, an image) and compresses it to a smaller representation - the bottleneck. The decoder takes that small representation and tries to reconstruct the original image. The loss is how different the reconstruction is from the original. You train to minimise reconstruction error.

Why would you do this? The compressed representation is useful. It's a learned summary of the data. You can use it for dimensionality reduction, for finding patterns, for denoising (feed in noisy data, the autoencoder forces it through the bottleneck and cleans it up).

Variational Autoencoders (VAEs) add a statistical layer: the bottleneck is a probability distribution, and you can sample from it to generate new data. Denoising Autoencoders specifically train on corrupted inputs to learn robust representations.

They're less flashy than Transformers, but they're practical tools. Image generation, anomaly detection, data compression - if you need learned representations without labelled data, autoencoders are still relevant.

## Why Transformers largely replaced RNNs

Speed, scalability, and performance. Transformers win on all three.

RNNs require sequential processing. Training is slow. Attention heads learn long-range dependencies better. Transformers scale to much larger models and datasets.

For basically any sequence task, Transformers perform better than RNNs if you have the resources. The only reason to use RNNs now is if you're deploying on edge devices with limited memory, or if you have a real-time streaming requirement where you can't wait for the full sequence.

## Do you need to understand RNNs before Transformers?

No, honestly.

RNNs are interesting historically. They teach you about recurrence, about memory in networks, about the challenge of long-term dependencies. That's valuable context.

But Transformers are simpler conceptually. "Each element attends to all others based on relevance" is easier to grasp than "recurrent hidden state carries information forward and sometimes forgets."

Understanding what RNNs tried to do and why they failed is useful - you see why the architectural innovation matters. But you don't need to become fluent in LSTM implementations. You need to know they exist, what they were for, and that Transformers superseded them.

Spend your mental energy on Transformers. That's where the field is now. For how these architectures get used in practice, the [generative AI models](https://johnb.io/course/generative-ai-models) lesson covers the products built on top of them. And the [CNNs lesson](https://johnb.io/course/cnns-with-keras) covers the parallel story in computer vision.

## How It Works

1. **RNNs:.** At each time step, the network takes the current input and the previous hidden state, combines them, and produces a new hidden state. That state carries information forward to the next step. The catch is backpropagating through time: gradients must flow through every time step backward, and they shrink at each one.
2. **Transformers:.** All positions in the sequence are processed in parallel. For each position, three vectors are computed (query, key, value). Attention scores between positions are calculated via query-key dot products, normalised via softmax, then used to weight the values. This produces a context-aware representation for each position. Multiple attention heads run in parallel, each learning different relevance patterns. Position encoding adds sequence order information (since there's no inherent order in parallel processing).
3. **Autoencoders:.** An encoder compresses input to a bottleneck representation. A decoder reconstructs the input from that bottleneck. The reconstruction loss trains the network to find a useful compressed representation. VAEs add a probabilistic bottleneck, enabling generation of new samples.

## Key Points

- RNNs process sequences step by step, carrying a hidden state as memory
- The vanishing gradient problem limits RNNs to about 10-20 steps of effective memory
- LSTMs and GRUs partially addressed this but are still sequential and slow
- Transformers process entire sequences in parallel using attention
- Attention computes relevance between every pair of positions, enabling long-range dependency learning
- Transformers introduced in 2017 quickly outperformed RNNs on almost all NLP tasks
- Autoencoders compress then reconstruct data; the bottleneck representation is what's valuable
- Variational Autoencoders extend this to data generation by making the bottleneck a probability distribution
- For most sequence tasks in 2026, Transformers are the correct starting point

## Frequently Asked Questions

### What is a Recurrent Neural Network (RNN)?

An RNN is a neural network with loops that let it process sequences one element at a time, carrying a hidden state that acts as memory. This makes it useful for tasks where order matters: language, time series, speech. The problem is that gradients shrink as they backpropagate through many time steps, so RNNs struggle to remember information from more than about 20 steps back.

### How does attention work in a Transformer?

Attention lets each position in a sequence compute how much it should focus on every other position. For each element, you compute a query (what am I looking for?), keys (what does each position offer?), and values (what information does each position carry?). Query-key similarity determines attention weights, which then weight the values. Each position ends up with a rich representation incorporating relevant context from the whole sequence.

### What is an autoencoder used for?

An autoencoder compresses data to a smaller representation (the bottleneck) then reconstructs it. The compressed representation is useful for dimensionality reduction, anomaly detection, denoising, and in Variational Autoencoders, generating new data. They're trained without labels - the reconstruction error is the signal.

### Do you need to understand RNNs before learning Transformers?

No. Transformers are conceptually simpler than RNNs in many ways. Understanding RNNs gives historical context for why Transformers were an improvement, but you can learn Transformers first. Spend most of your time on Transformers - that's where most modern AI lives.

## Sources & Primary References

1. Vaswani, A. et al. (2017). Attention Is All You Need. *NeurIPS*.
2. Hochreiter, S. & Schmidhuber, J. (1997). Long Short-Term Memory. *Neural Computation*.
3. Kingma, D. & Welling, M. (2013). Auto-Encoding Variational Bayes. *arXiv*.
4. Devlin, J. et al. (2018). BERT: Pre-training of Deep Bidirectional Transformers. *arXiv*.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
