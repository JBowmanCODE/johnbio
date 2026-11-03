# Text to Voice

> Browser-based text-to-speech reader using the Web Speech API with voice selection, speed control and live word-by-word subtitle highlighting.

- **Canonical URL**: https://johnb.io/text-to-voice
- **Markdown URL**: https://johnb.io/text-to-voice.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: March 2026

Text to Voice converts any pasted text into speech using your browser's built-in [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API). Paste your text, choose a voice from the voices installed on your device, set a playback speed between 0.8× and 1.75×, and hit Start. Word-by-word subtitles highlight each spoken word in real time as the audio plays. The tool also shows an estimated word count, reading time and listen time based on your chosen speed - useful for pacing articles, scripts or presentations.

This tool runs entirely in your browser. No text is sent to any external server and no data leaves your device. It does not use an AI model or any third-party API. All processing is handled locally by your browser's speech synthesis engine, which means voice availability and quality depend on what your operating system has installed. Most modern browsers on Windows, macOS, iOS and Android include a range of voices in multiple languages.

## How It Works

1. **Paste your text.** into the input area. The tool will display the word count and estimated reading and listening times as soon as you type or paste something.
2. **Choose a voice.** The Voice dropdown lists all speech synthesis voices installed on your device. The available voices vary by operating system and browser - Windows typically offers Microsoft voices, macOS offers Siri-based voices, and mobile devices have their own sets.
3. **Set a playback speed.** The Speed selector lets you choose from 0.8× (slower than natural pace) up to 1.75× (fast but still intelligible). 1.25× is the default - a good balance between pace and clarity for most content.
4. **Click Start.** The text begins playing. Each word is highlighted in the subtitle display below the control panel as it is spoken, making it easier to follow along or spot errors.
5. **Use Pause and Stop as needed.** Pause freezes playback at the current position. Stop ends playback entirely. Click Start again to restart from the beginning.

## Key Points

- **No data leaves your device.** Everything runs locally using the Web Speech API. Your text is never transmitted to any server - making this safe for confidential drafts, internal documents or sensitive content.
- **Word-by-word subtitle highlighting.** As the text plays, each word is highlighted in real time. This helps with proofreading - listening while reading often catches errors that reading alone misses.
- **Useful for content creators and accessibility.** Listen back to blog posts, scripts, emails or presentations to check flow and pacing before publishing. The tool also helps users with visual impairments or reading difficulties consume written content.
- **Speed controls help with productivity.** At 1.5× or 1.75×, a 1,000-word article takes around 3 minutes to get through - faster than reading for many people, without losing comprehension.
- **Voice quality depends on your device.** The browser uses your operating system's speech synthesis engine. Premium voices on macOS and iOS tend to sound more natural. If the available voices sound robotic, try a different browser (Chrome on Windows often has a wider selection) or check your OS voice settings.

## Frequently Asked Questions

### Does this tool use AI?

No. The tool uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), which is a standard browser feature - not a generative AI model. Speech synthesis is handled entirely by your browser and operating system. No AI model is called and no data is sent to any external service.

### Why does the Start button appear disabled when I first load the page?

The Start button is disabled until you enter some text. Once you paste or type in the input area, it activates automatically.

### Why are there no voices, or only one voice, in the dropdown?

Voice availability depends on your browser and operating system. Some browsers load voices asynchronously and the dropdown may appear empty on first load - try refreshing the page. On Windows, you can add more voices through Settings > Time & Language > Speech. On macOS, go to System Settings > Accessibility > Spoken Content.

### Does this work on mobile?

Yes. The Web Speech API is supported on iOS Safari and Android Chrome. Voice selection and quality vary by device and OS version. On iOS, the speech synthesis voices are the same ones used by VoiceOver and tend to sound natural.

### Is there a limit on how much text I can convert?

There is no limit set by this tool. In practice, some browsers impose internal limits on speech synthesis queue length. For very long documents, the tool may pause or stop mid-way in certain browsers. If this happens, split the text into smaller sections and play them separately.

## Sources & Primary References

1. [MDN Web Docs - Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Mozilla Developer Network. Accessed March 2026.
2. [Can I Use - SpeechSynthesis API browser support](https://caniuse.com/speech-synthesis) - caniuse.com. Accessed March 2026.
3. [W3C - Speech Synthesis Markup Language 1.1 specification](https://www.w3.org/TR/speech-synthesis11/) - World Wide Web Consortium. Accessed March 2026.
4. [RNIB - Text-to-speech software guidance](https://www.rnib.org.uk/living-with-sight-loss/assistive-aids-and-technology/computer-access/text-to-speech-software/) - Royal National Institute of Blind People. Accessed March 2026.
5. [Microsoft Support - Add voices in Windows](https://support.microsoft.com/en-gb/windows/add-a-language-or-set-language-preferences-in-windows-12345678) - Microsoft.com. Accessed March 2026.
