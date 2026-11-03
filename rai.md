# RAI Governance Framework

> Interactive browser-based responsible AI governance toolkit covering principles, EU AI Act risk tiering, RACI responsibility matrices, pre-deployment checklists, system cards and an AI system registry.

- **Canonical URL**: https://johnb.io/rai
- **Markdown URL**: https://johnb.io/rai.md
- **Author**: [John Bowman](https://johnb.io/about)
- **Last Updated**: March 2026

The RAI Governance Framework is a practical, browser-based toolkit for teams evaluating and managing AI risk. It covers the full governance lifecycle: classifying AI systems by risk tier, assigning accountability through a responsibility matrix, working through a structured pre-deployment checklist, generating system cards for documentation, maintaining a searchable system registry, and mapping your systems against current regulatory requirements. It is built for AI governance leads, risk managers, product teams and compliance functions who need structured documentation without standing up a dedicated platform.

This tool runs entirely in your browser. No data is sent to any external server and nothing is stored outside your current session. It does not use an AI model to generate content - all outputs are driven by the information you enter. This makes it suitable for handling sensitive internal documentation about AI systems without privacy or data residency concerns. The framework references guidance from the [AI Safety Institute](https://www.gov.uk/guidance/the-ai-safety-institute), the [ICO's guidance on AI and data protection](https://ico.org.uk/for-organisations/guide-to-data-protection/key-dp-themes/explaining-decisions-made-with-ai/), and the EU AI Act risk classification approach.

## How It Works

1. **Classify your AI system.** Use the Risk panel to run through the classification questionnaire. Answer questions about your system's domain, autonomy level, data use and potential impact. The tool assigns a risk tier - High, Medium or Low - with an explanation of what that means for your governance obligations.
2. **Assign responsibility.** In the Governance panel, populate the responsibility matrix with your team's roles. Define who is accountable for oversight, development, deployment and monitoring of each AI system.
3. **Work through the checklist.** The Checklist panel provides a structured set of pre-deployment checks covering fairness, explainability, data quality, human oversight and incident response. Mark items complete as you go.
4. **Create a system card.** The System Card panel generates a structured document recording your system's purpose, data sources, model type, identified risks, mitigations and oversight arrangements. Export it as a PDF or plain text file for your records.
5. **Register and track systems.** Add your AI systems to the Registry to maintain a searchable inventory. Use the Regulatory panel to map each system against relevant frameworks including the EU AI Act and UK AI principles.

## Key Points

- **No data leaves your browser.** Everything runs client-side. Your system descriptions, risk assessments and registry entries are not transmitted to any server - making this suitable for handling sensitive commercial or regulated information.
- **Aligned with the EU AI Act risk tiers.** The classification questionnaire maps to the [EU AI Act](https://artificialintelligenceact.eu) categories (Unacceptable Risk, High Risk, Limited Risk, Minimal Risk), giving your assessments regulatory grounding.
- **Generates exportable documentation.** System cards and registry exports can be saved as PDF or plain text - suitable for audits, board reporting or sharing with regulators.
- **Built for teams, not just individuals.** The responsibility matrix and checklist are designed to be completed collaboratively. Print or export sections to share with legal, compliance, engineering or leadership.
- **Free to use with no account required.** There is no login, no subscription and no usage limit - the tool is fully open to use for any organisation or individual.

## Frequently Asked Questions

### Does this tool use AI to generate the governance outputs?

No. All outputs - risk tier classifications, system cards, checklists and registry entries - are generated directly from the information you enter. There is no AI model involved. This is a structured documentation tool, not a generative AI tool.

### Is my data stored anywhere?

No. The tool runs entirely in your browser. Nothing is stored on any server, and nothing persists after you close the tab. If you want to keep your work, export it using the download options in each panel before closing.

### Which regulatory frameworks does the tool reference?

The risk classification aligns with the [EU AI Act](https://artificialintelligenceact.eu). The framework also references the UK government's [AI Safety Institute](https://www.gov.uk/guidance/the-ai-safety-institute) principles, the [ICO's AI and data protection guidance](https://ico.org.uk/for-organisations/guide-to-data-protection/key-dp-themes/explaining-decisions-made-with-ai/), and the NIST AI Risk Management Framework. It is intended as a practical starting point - always verify compliance requirements with qualified legal or regulatory counsel.

### What is a system card?

A system card (sometimes called a model card) is a structured document that records key facts about an AI system - its purpose, data sources, known risks, mitigations and human oversight arrangements. System cards are increasingly expected by regulators and enterprise procurement teams as part of responsible AI deployment. The [original model card paper](https://arxiv.org/abs/1810.03993) was published by Mitchell et al. at Google in 2018.

### Is this suitable for regulated industries?

The framework provides a solid foundation for AI governance in regulated industries including financial services, healthcare and the public sector. However, sector-specific requirements - such as those under the FCA's model risk guidance, NHS AI governance frameworks, or GDPR Article 22 on automated decision-making - may go beyond what this tool covers. Use it as a starting point and engage your compliance or legal team for sector-specific obligations.

## Sources & Primary References

1. [EU AI Act - Full text and risk classification framework](https://artificialintelligenceact.eu) - artificialintelligenceact.eu. Accessed March 2026.
2. [UK AI Safety Institute - Guidance and principles](https://www.gov.uk/guidance/the-ai-safety-institute) - GOV.UK. Accessed March 2026.
3. [ICO - Explaining decisions made with AI](https://ico.org.uk/for-organisations/guide-to-data-protection/key-dp-themes/explaining-decisions-made-with-ai/) - Information Commissioner's Office. Accessed March 2026.
4. [NIST AI Risk Management Framework 1.0](https://www.nist.gov/system/files/documents/2023/01/26/AI%20RMF%201.0.pdf) - National Institute of Standards and Technology. January 2023.
5. [Mitchell et al. - Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993) - arXiv:1810.03993. Google, 2018.
