# Air Strings — Hand-Tracking Beat Maker

> Free browser-based computer vision instrument studio and beat looper powered by MediaPipe Hand Landmarker and the Web Audio API. Track both hands locally on your webcam to strum glowing guitar strings, piano beams, laser harps, drum kits and bongos, layer quantised loops and download WAV audio.

- **Canonical URL**: https://johnb.io/air-strings
- **Markdown URL**: https://johnb.io/air-strings.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: November 2026

## Turn Your Webcam Into a Spatial Beat Studio

Air Strings pairs real-time computer vision hand tracking with a zero-latency Web Audio synthesiser. Your camera tracks 21 landmarks on each hand locally in your browser, turning any empty space in front of your screen into glowing laser strings and holographic drum pads.

Every instrument is synthesised live in code — including Karplus-Strong physical-modelled guitar strings, multi-harmonic piano voices, 808 sub-bass, TR-808 style drums and woody Latin bongos. Because melodic strings snap to your chosen musical key and scale, you can jam, draw custom rigs in mid-air and overdub full multi-instrument loops without ever hitting a clashing note.

## How It Works

1. **Enable your webcam (or jump into Mouse Mode).** MediaPipe Hand Landmarker loads once into browser memory and tracks both hands at up to 30+ FPS completely on-device.
2. **Pick a preset or draw your own rig.** Start with Beat Studio, 6-String Air Guitar, Laser Harp, Bongos & Drum Rig or Lo-Fi Chord Jam — or switch to Draw mode and pinch in mid-air to place custom strings and pads.
3. **Strum with velocity.** Exact 2D line-segment intersection detects the moment each fingertip crosses a string, translating swipe speed into volume, filter brightness, standing-wave string vibration and spark particles.
4. **Layer a beat with the live looper.** Pick a tempo, enable a backing drum groove or click track, hit Rec Loop and stack drums, bongos, basslines, chords and leads over 2 or 4 bars.
5. **Save your rig or download WAV.** Store your custom layout locally in your browser with Save Rig, and use Record WAV to capture your live jam as a stereo 16-bit WAV file.

## Key Points

- **Headphones make a huge difference.** Built-in stereo hall reverb, ping-pong echo and 808 sub-bass sound dramatically fuller on headphones than on laptop speakers.
- **Good front lighting improves hand tracking.** Face a window or desk lamp and sit roughly an arm's length from the webcam so both hands stay clearly inside the frame.
- **Use Index Only for fast melodies.** All 5 Fingers is great for raking guitar chords and two-hand drumming; switching to Index Only gives pinpoint control on crowded layouts.
- **Try Fretboard Mode on long strings.** Turning on Frets divides each melodic string into five consecutive scale notes along its tick marks, letting you play full riffs on a single beam.
- **Zero audio files or server calls.** Everything — computer vision, guitar string physics, drum synthesis and WAV encoding — executes privately inside your browser tab.

## Frequently Asked Questions

### Does my webcam video ever leave my device?

No. Hand tracking runs 100% locally inside your browser using MediaPipe WebAssembly and WebGL. No video frames, images or audio recordings are uploaded to any server.

### What instruments can I create and play?

You can place glowing laser strings or circular air pads for eight synthesised instruments: Guitar, Piano, Laser Harp, Neon Synth, 808 Bass, Lo-Fi Chords, a full Drum Kit (kick, snare, hi-hats, clap, toms, crash) and Bongos & Percussion (high/low bongos, congas, cowbell and wood clave).

### How do I draw new strings in mid-air?

Switch to Draw mode (or press 2), pick an instrument, then pinch your thumb and index finger together to anchor the start of a string, pull your hand across the frame and open your fingers to lock it in place. You can also pinch with both hands at once to stretch a beam between them, or click and drag with your mouse.

### Can I use Air Strings without a webcam?

Yes. Click Play With Mouse / Touch to use the studio stage without enabling a camera. Swiping your mouse cursor or finger across strings plucks them with the same velocity response, spark physics and live looper.

### How does the beat looper and WAV export work?

Click Rec Loop for a 4-beat count-in, play your rhythm or melody over 2 or 4 bars, and the looper automatically wraps into overdub so you can layer guitars, chords and bongos on top. Quantisation snaps hand hits to the beat grid, and Record WAV captures your live mix straight to a downloadable .wav file.

### Why does string length change the pitch?

When you draw a melodic string, its length automatically maps to a note in your chosen musical key and scale, just like real acoustics: longer strings produce deeper bass and low guitar notes, while shorter strings play higher melodies. You can also fine-tune any string manually in the Active Strings & Pads rack.

## Sources & Primary References

1. [Google AI Edge - MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) - documentation for the 21-point real-time on-device hand tracking model.
2. [MDN Web Docs - Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - browser audio synthesis, dynamics processing and convolution reverb specification.
3. [Stanford CCRMA - Karplus-Strong Plucked String Synthesis](https://ccrma.stanford.edu/~jos/pasp/Karplus_Strong_Algorithm.html) - the physical modelling technique used for the Air Strings guitar engine.
4. [AI Meditation Generator](https://johnb.io/meditation) - another live Web Audio synthesis tool on JohnB.io.
