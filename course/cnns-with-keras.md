# CNNs with Keras

> Convolutional layers, pooling, feature maps and building image classification models with Keras.

- **Canonical URL**: https://johnb.io/course/cnns-with-keras
- **Markdown URL**: https://johnb.io/course/cnns-with-keras.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Course Unit**: Unit 6 · Deep Learning & Neural Networks
- **Published**: 2026-04-05
- **Last Updated**: 2026-08-10
- **Read Time**: 12 min read

CNNs were the first architecture that made computer vision actually work. Before them, machines couldn't recognise images reliably. After them, they could outperform humans. That shift mattered.

CNNs were the first architecture that made computer vision actually work. Before them, machines couldn't recognise images reliably. After them, they could outperform humans. That shift mattered.

## What a CNN is trying to do

You have an image - pixels in a grid. You want to know what it contains. Is it a cat? A dog? A car?

A regular neural network would treat each pixel as a separate input. For a 28x28 image, that's 784 inputs. For a 256x256 image, it's 65,536 inputs. And the network has to learn independently whether pixel 5 relates to pixel 6, whether pixel 142 is important, and so on.

A CNN does something smarter. It assumes that nearby pixels relate to each other, and that the same pattern - like a cat's whisker - might appear in different parts of the image. It looks for small patterns first, then combinations of patterns, then more complex shapes.

It builds understanding from simple to complex, which matches how we actually see. We don't recognise a cat by analysing individual pixels. We recognise edges, then fur texture, then cat-shaped silhouettes, then "that's a cat."

## Convolutional layers - what they're detecting

A convolutional layer applies small filters across the image. A filter might be 3x3 or 5x5 pixels. It slides across the image, and at each position it computes a dot product with the image patch beneath it.

What's the filter detecting? Early on, simple patterns: edges, vertical lines, diagonal lines, corners. Later layers take the output from early layers as input and detect more complex patterns - textures, shapes, parts of objects.

You don't hardcode these filters. The network learns them during training, adjusting them so they detect features useful for whatever task you're solving.

The output of a convolutional layer is a set of feature maps - one for each filter. If you have 32 filters, you get 32 feature maps. Each represents where that filter's pattern shows up across the image.

## Pooling layers - why they're there

After a convolutional layer, you often have a pooling layer. The most common is max pooling. It takes small regions - like 2x2 - and outputs only the maximum value.

This does two things. First, it shrinks the feature maps, reducing computation. Second, it makes the network tolerant to small shifts. If a pattern moves one pixel, max pooling usually still catches it.

Pooling says: we detected this feature somewhere in this region - we don't care exactly where. That's useful because a cat's eyes appear in different positions in different photos, but we still want to recognise it as a cat.

You don't always need pooling. Modern networks sometimes skip it. But it's standard because it works and it's efficient.

## Building a simple CNN in Keras

Here's the structure of a basic CNN in [Keras](https://keras.io/) for image classification. Seven layers total: two convolution-pooling pairs, a flatten, a dense layer, and an output.

```
model = Sequential([
    Conv2D(32, 3, activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D(2),
    Conv2D(64, 3, activation='relu'),
    MaxPooling2D(2),
    Flatten(),
    Dense(128, activation='relu'),
    Dense(10, activation='softmax')
])
```

The first convolutional layer uses 32 filters of size 3x3, detecting simple patterns. Max pooling shrinks the feature maps. The second convolutional layer uses 64 filters and detects more complex patterns built on the first. Another round of max pooling. Then Flatten converts the feature maps into a 1D vector, the Dense layer learns combinations of features, and the output layer gives probabilities across 10 categories.

You compile with an optimiser and loss function using the [Keras](https://johnb.io/course/tensorflow-pytorch-keras) API, then fit it to image data. The network learns which filters and weights work best for recognising whatever you're training it on. That's the entire idea: stack convolutions and pooling, then fully connected layers at the end.

## Where CNNs are still the right tool

CNNs are excellent for [computer vision](https://johnb.io/course/key-ai-subfields) tasks including image classification and object detection. They're efficient, they learn good features, and they work well on reasonable-sized datasets.

But they're not the only option any more. [Vision Transformers](https://johnb.io/course/rnns-transformers-autoencoders) (ViTs) apply the transformer architecture to images and are competitive with CNNs - sometimes better, especially with lots of data. For most state-of-the-art vision research in the last few years, Transformers have taken over.

So why still learn CNNs? Because they're more efficient with small datasets, simpler to understand, and the intuition - convolutions detect patterns - is valuable for understanding any vision model. For many practical applications, a CNN works fine. You probably don't need cutting-edge.

If you're building something with massive training data and unlimited compute, maybe reach for a Vision Transformer. If you're learning, or if you have reasonable data and want to train fast, CNNs are still the right choice. [Transfer learning](https://en.wikipedia.org/wiki/Transfer_learning) from models pre-trained on [ImageNet](https://en.wikipedia.org/wiki/ImageNet) makes this even faster. They're not obsolete. They've just been supplemented by approaches that sometimes work better.

## How It Works

1. **Step.** A CNN processes an image through alternating convolutional and pooling layers. Each convolutional layer applies learned filters that slide across the input, computing a dot product at each position to produce feature maps. Early filters detect simple patterns like edges; later filters detect combinations of those patterns.
2. **Step.** Pooling layers reduce spatial dimensions, making the network faster and more robust to small position changes. After several conv-pool pairs, the feature maps are flattened into a vector and fed into fully connected (dense) layers, which learn to combine the detected features into a final prediction.
3. **Step.** Training adjusts all filter weights and dense layer weights via backpropagation, minimising the difference between predictions and true labels. The network discovers what patterns are useful for the task - you don't specify them.

## Key Points

- CNNs exploit the spatial structure of images: nearby pixels are related, and patterns appear in multiple locations
- Convolutional filters detect patterns at different scales and complexities across layers
- Filters are learned during training - not hand-coded
- Max pooling reduces feature map size and provides shift tolerance
- A standard CNN stacks conv-pool pairs, then flattens into dense layers for the final prediction
- Vision Transformers have surpassed CNNs in research but CNNs remain practical for smaller datasets
- Transfer learning lets you reuse pre-trained CNN filters, reducing data and compute requirements significantly

## Frequently Asked Questions

### What is a convolutional neural network?

A CNN is a neural network architecture designed for image data. It assumes nearby pixels relate to each other and applies small filters that slide across the image to detect patterns - edges first, then textures, then complex shapes. This hierarchy of pattern detection is what makes CNNs so effective for vision tasks.

### What does a pooling layer do in a CNN?

A pooling layer reduces the size of feature maps and makes the network tolerant to small shifts in position. Max pooling takes the maximum value from small regions, so if a pattern moved one pixel it still gets detected. This reduces computation and improves generalisation.

### Are CNNs still relevant now that Vision Transformers exist?

Yes. CNNs are more efficient on smaller datasets, faster to train, and easier to understand. Vision Transformers need large amounts of data to outperform CNNs. For most practical applications, CNNs remain a strong choice. They're not obsolete - they've been supplemented.

### What is transfer learning with CNNs?

Transfer learning uses a CNN pre-trained on a large dataset (like ImageNet) as a starting point. You keep the learned filters and fine-tune the final layers on your specific task. This dramatically reduces the data and compute needed to build an effective image classifier.

## Sources & Primary References

1. LeCun, Y. et al. (1998). Gradient-based learning applied to document recognition. *Proceedings of the IEEE*.
2. He, K. et al. (2016). Deep Residual Learning for Image Recognition. *CVPR*.
3. Dosovitskiy, A. et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. *ICLR*.
4. Chollet, F. (2021). *Deep Learning with Python*, 2nd ed. Manning Publications.

## About the Author

**[John Bowman](https://johnb.io/about)** - AI Strategist & Developer

20+ years across iGaming and digital marketing. Builds AI-powered tools at JohnB.io and writes on practical AI strategy, how it actually works, not how it is supposed to work.
