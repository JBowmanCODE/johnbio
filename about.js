document.addEventListener('DOMContentLoaded', function() {
    const skillButtons = document.querySelectorAll('.skill-button');
    const skillDetails = document.getElementById('skill-details');

    if (skillButtons.length > 0 && skillDetails) {
        skillButtons.forEach(button => {
            button.addEventListener('click', function() {
                skillButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                displaySkillDetails(this.getAttribute('data-skill'));
            });
        });
    }
});

function displaySkillDetails(skillCategory) {
    const skills = {
        'ai-engineering': [
            'LLM Engineering & Deployment',
            'Claude API (Anthropic)',
            'OpenAI API',
            'Gemini API',
            'RAG & LangChain Agents',
            'Prompt Engineering',
            'NLP & Text Processing',
            'Machine Learning',
            'Deep Learning',
            'Computer Vision',
            'Transformer Models',
            'Python & PyTorch',
            'AI Image Generation',
            'AI Video Generation',
            'Cloudflare Workers',
            'API Integration',
            'Automation Scripting',
            'SEO & Content AI Tools'
        ],
        'leadership': [
            'Strategy & Roadmap Ownership',
            'Team Leadership (90+ people)',
            'Stakeholder Communication',
            'Budget Management (£1.5M+)',
            'Multi-project Delivery',
            'Cross-functional Collaboration',
            'Product Ownership',
            'Crisis Leadership',
            'Employee Training & Mentoring',
            'Commercial Accountability',
            'Decision Driving',
            'Director-level Reporting',
            'Asana Project Management'
        ],
        'digital-seo': [
            'SEO Strategy (24 language markets)',
            'Content Strategy',
            'Digital Marketing',
            'CRM & EDM Campaigns',
            'PPC & Affiliate Marketing',
            'Digital Acquisition',
            'Conversion Optimisation',
            'Google Analytics',
            'Social Media Strategy',
            'PR & Communications',
            'YouTube Content Strategy',
            'Platform Migration'
        ],
        'gaming-industry': [
            'Online Poker',
            'Casino Operations',
            'Poker Education & Content',
            'Fraud Investigations',
            'Chargeback Recovery (£150k+)',
            'Online Gaming Security',
            'Live Events Media',
            'Multilingual Operations (40 countries)',
            'TV Poker Format Production',
            'Poker Tools Development',
            'Community Management',
            'Regulatory Compliance'
        ],
        'creative-tools': [
            'Adobe Photoshop',
            'Figma',
            'UI/UX Design',
            'Wireframing & Prototyping',
            'DaVinci Resolve',
            'Video Editing',
            'AI Image Generation',
            'AI Video Generation',
            'AI Music Generation',
            'Microsoft Excel',
            'Microsoft Word',
            'PowerPoint Presentations',
            'Storytelling & Scripting',
            'Editing & Proofreading',
            'Online Journalism'
        ],
        'education': [
            'IBM — Generative AI Engineering (2026)',
            'DataCamp — Responsible AI Practices (2026)',
            'DataCamp — Understanding the EU AI Act (2026)',
            'DataCamp — Python for Developers — Beginner (2026)',
            'DataCamp — Python for Developers — Intermediate (2026)',
            'Oxford University — AI Programme (2024)',
            'SuperDataScience — AI + ChatGPT Executive Briefing (2024)',
            '365 Careers — Intro to ChatGPT & Generative AI (2024)',
            'Udemy — GenAI Security & Compliance Program (2024)',
            'Udemy — SEO 2023: Complete SEO Training (2023)',
            'Udemy — Metaverse Masterclass (2022)',
            'Udemy — NFT Fundamentals (2022)',
            'Udemy — Master CSS3 Flexbox (2021)',
            'Udemy — Asana Project Management (2021)',
            'Udemy — An Entire MBA in 1 Course (2021)',
            'Udemy — Learn Figma: UI/UX Design (2021)',
            'CalArts — UI/UX Design (2021)',
            'CalArts — Web Design: Wireframes to Prototypes (2021)',
            'CalArts — Web Design: Strategy & Information Architecture (2021)',
            'CalArts — UX Design Fundamentals (2021)',
            'CalArts — Visual Elements of User Interface Design (2021)',
            'Rutgers University — New Technologies for Business Leaders (2020)',
            'Digital Marketing Institute — Professional Diploma (2016)'
        ]
    };

    const skillDetails = document.getElementById('skill-details');
    if (!skillDetails) return;

    const selectedSkills = skills[skillCategory];
    if (!selectedSkills) {
        skillDetails.innerHTML = '<p>No skills found.</p>';
        return;
    }

    const labels = {
        'ai-engineering': 'AI & Engineering',
        'leadership': 'Leadership',
        'digital-seo': 'Digital & SEO',
        'gaming-industry': 'Gaming Industry',
        'creative-tools': 'Creative Tools',
        'education': 'Education & Qualifications'
    };

    let html = `<h3>${labels[skillCategory] || skillCategory}</h3><ul class="skill-list">`;
    selectedSkills.forEach(skill => {
        html += `<li>${skill}</li>`;
    });
    html += '</ul>';
    skillDetails.innerHTML = html;
}
