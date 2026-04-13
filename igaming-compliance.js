// igaming-compliance.js

// ── COUNTRY GROUPS ────────────────────────────────────────────────────────────

const EU = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
const EEA = [...EU, 'IS','LI','NO'];

// Country ISO → display name + flag emoji
const COUNTRY_META = {
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  MT: { name: 'Malta', flag: '🇲🇹' },
  GI: { name: 'Gibraltar', flag: '🇬🇮' },
  IM: { name: 'Isle of Man', flag: '🇮🇲' },
  GG: { name: 'Alderney / Guernsey', flag: '🇬🇬' },
  SE: { name: 'Sweden', flag: '🇸🇪' },
  DK: { name: 'Denmark', flag: '🇩🇰' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  NL: { name: 'Netherlands', flag: '🇳🇱' },
  BE: { name: 'Belgium', flag: '🇧🇪' },
  CH: { name: 'Switzerland', flag: '🇨🇭' },
  AT: { name: 'Austria', flag: '🇦🇹' },
  ES: { name: 'Spain', flag: '🇪🇸' },
  IT: { name: 'Italy', flag: '🇮🇹' },
  PT: { name: 'Portugal', flag: '🇵🇹' },
  FR: { name: 'France', flag: '🇫🇷' },
  IE: { name: 'Ireland', flag: '🇮🇪' },
  RO: { name: 'Romania', flag: '🇷🇴' },
  GR: { name: 'Greece', flag: '🇬🇷' },
  CZ: { name: 'Czech Republic', flag: '🇨🇿' },
  PL: { name: 'Poland', flag: '🇵🇱' },
  HU: { name: 'Hungary', flag: '🇭🇺' },
  EE: { name: 'Estonia', flag: '🇪🇪' },
  LV: { name: 'Latvia', flag: '🇱🇻' },
  LT: { name: 'Lithuania', flag: '🇱🇹' },
  US: { name: 'United States', flag: '🇺🇸' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  BR: { name: 'Brazil', flag: '🇧🇷' },
  CW: { name: 'Curaçao', flag: '🇨🇼' },
  AG: { name: 'Antigua and Barbuda', flag: '🇦🇬' },
  AU: { name: 'Australia', flag: '🇦🇺' },
  NZ: { name: 'New Zealand', flag: '🇳🇿' },
  IN: { name: 'India', flag: '🇮🇳' },
  JP: { name: 'Japan', flag: '🇯🇵' },
  KR: { name: 'South Korea', flag: '🇰🇷' },
  SG: { name: 'Singapore', flag: '🇸🇬' },
  PH: { name: 'Philippines', flag: '🇵🇭' },
  ZA: { name: 'South Africa', flag: '🇿🇦' },
  NG: { name: 'Nigeria', flag: '🇳🇬' },
  KE: { name: 'Kenya', flag: '🇰🇪' },
  // EU members not above
  BG: { name: 'Bulgaria', flag: '🇧🇬' },
  HR: { name: 'Croatia', flag: '🇭🇷' },
  CY: { name: 'Cyprus', flag: '🇨🇾' },
  FI: { name: 'Finland', flag: '🇫🇮' },
  LU: { name: 'Luxembourg', flag: '🇱🇺' },
  SK: { name: 'Slovakia', flag: '🇸🇰' },
  SI: { name: 'Slovenia', flag: '🇸🇮' },
  IS: { name: 'Iceland', flag: '🇮🇸' },
  LI: { name: 'Liechtenstein', flag: '🇱🇮' },
  NO: { name: 'Norway', flag: '🇳🇴' },
};

// ── REGULATION DATA ───────────────────────────────────────────────────────────

const REGULATIONS = [

  // ════════════════════════════════════════════════════════════
  // GAMBLING-SPECIFIC: EUROPE — WESTERN & NORTHERN
  // ════════════════════════════════════════════════════════════

  {
    id: 'uk-gambling-act-2005',
    name: 'Gambling Act 2005',
    url: 'https://www.legislation.gov.uk/ukpga/2005/19/contents',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Primary UK gambling legislation establishing the Gambling Commission and licensing framework.'
  },
  {
    id: 'uk-lccp',
    name: 'UKGC Licence Conditions and Codes of Practice (LCCP)',
    url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Detailed operating conditions for all UK-licensed gambling operators.'
  },
  {
    id: 'uk-gambling-licensing-advertising-2014',
    name: 'Gambling (Licensing and Advertising) Act 2014',
    url: 'https://www.legislation.gov.uk/ukpga/2014/17/contents',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Extended UK licensing requirements to operators based offshore serving UK consumers.'
  },
  {
    id: 'uk-statutory-levy-2025',
    name: 'Statutory Gambling Levy Regulations 2025',
    url: 'https://www.gamblingcommission.gov.uk/',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: '0.1–1.1% of GGR levy replacing voluntary contributions, effective April 2025.'
  },
  {
    id: 'uk-online-slots-stake-limits-2024',
    name: 'UKGC Online Slots Stake Limits 2024',
    url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Maximum £5 per spin for players aged 25+; £2 for ages 18–24. Applies to all online slots from October 2024.'
  },
  {
    id: 'uk-affordability-checks-2026',
    name: 'UKGC Financial Vulnerability and Affordability Checks 2026',
    url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/upcoming-changes',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Frictionless affordability checks triggered at £150 net deposits within 30 days. Full rollout to all online casino operators required by Q3 2026. Enhanced checks at higher thresholds.'
  },
  {
    id: 'malta-gaming-act-2018',
    name: 'Gaming Act 2018 (Cap. 583)',
    url: 'https://legislation.mt/eli/cap/583/eng',
    countries: ['MT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Consolidated Maltese gaming legislation underpinning the MGA licensing framework.'
  },
  {
    id: 'mga-capital-requirements-2025',
    name: 'MGA Minimum Capital Requirements Policy 2025',
    url: 'https://www.mga.org.mt/our-work/regulatory-framework/',
    countries: ['MT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Effective 2025: €40,000 minimum for B2B licensees; €100,000 for B2C Types 1–2; cumulative cap €240,000. Operators with negative equity must restore it within 6 months or under a supervised 5-year plan. New Interim Financial Reporting (IFR) requirements alongside revised AFR standards.'
  },
  {
    id: 'mga-player-protection-directive',
    name: 'MGA Player Protection Directive (Directive 2 of 2018)',
    url: 'https://www.mga.org.mt/',
    countries: ['MT'],
    category: 'gambling',
    region: 'europe',
    notes: 'MGA responsible gambling and player protection requirements.'
  },
  {
    id: 'mga-authorisations-compliance-directive',
    name: 'MGA Gaming Authorisations and Compliance Directive (Directive 3 of 2018)',
    url: 'https://www.mga.org.mt/',
    countries: ['MT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Licensing procedures and ongoing compliance obligations for MGA licensees.'
  },
  {
    id: 'gibraltar-gambling-act-2005',
    name: 'Gambling Act 2005 (Gibraltar) — superseded',
    url: 'https://www.gibraltarlaws.gov.gi/legislations/gambling-act-2005-1344',
    countries: ['GI'],
    category: 'gambling',
    region: 'europe',
    notes: 'Superseded by the Gibraltar Gambling Act 2025 (in force 1 October 2025).'
  },
  {
    id: 'gibraltar-gambling-act-2025',
    name: 'Gambling Act 2025 (Gibraltar)',
    url: 'https://www.gibraltarlaws.gov.gi/',
    countries: ['GI'],
    category: 'gambling',
    region: 'europe',
    notes: 'In force 1 October 2025. Replaced the 2005 Act entirely. Six new licence categories (£10,000 application fee each). Marketing affiliates now require a licence. Sweepstakes and B2B operators newly in scope. New independent Gambling Appeals Tribunal. Personal accountability requirements for senior staff (similar to UK Senior Managers Regime). Expanded Gambling Commissioner powers: fines, inspections, licence suspension. 6-month transition period ended approximately April 2026.'
  },
  {
    id: 'iom-ogra-2001',
    name: 'Online Gambling Regulation Act 2001 (OGRA)',
    url: 'https://legislation.gov.im/',
    countries: ['IM'],
    category: 'gambling',
    region: 'europe',
    notes: 'Isle of Man online gambling licensing framework. The GSC is consolidating seven existing gambling acts into a single Gambling Supervision Commission Bill expected to be enacted in 2026. New personal accountability rules allow civil penalties for key persons, controllers, and senior managers for AML/CFT contraventions. New Fitness and Propriety Framework expected summer 2026.'
  },
  {
    id: 'alderney-egambling-ordinance-2009',
    name: 'Alderney eGambling Ordinance 2009',
    url: 'https://www.gamblingcontrol.org/regulation-framework/',
    countries: ['GG'],
    category: 'gambling',
    region: 'europe',
    notes: 'Alderney (AGCC) online gambling regulation framework.'
  },
  {
    id: 'sweden-spellagen-2018',
    name: 'Spellagen (2018:1138) — Swedish Gambling Act',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/spellag-20181138_sfs-2018-1138/',
    countries: ['SE'],
    category: 'gambling',
    region: 'europe',
    notes: 'Swedish re-regulation framework effective 2019, introducing channelling model.'
  },
  {
    id: 'sweden-credit-card-ban-2026',
    name: 'Sweden — Complete Credit Card Gambling Ban (April 2026)',
    url: 'https://www.spelinspektionen.se/',
    countries: ['SE'],
    category: 'gambling',
    region: 'europe',
    notes: 'From 1 April 2026, Sweden enacted a complete ban on gambling with credit cards, overdrafts, personal loans, and buy-now-pay-later services. Sweden is the first EU member state to implement a total prohibition of credit-funded gambling.'
  },
  {
    id: 'denmark-spilleloven',
    name: 'Spilleloven (Gambling Act, Act No. 848)',
    url: 'https://www.spillemyndigheden.dk/en/legal-framework',
    countries: ['DK'],
    category: 'gambling',
    region: 'europe',
    notes: 'Danish online gambling regulation administered by Spillemyndigheden.'
  },
  {
    id: 'germany-gluestv-2021',
    name: 'Glücksspielstaatsvertrag 2021 (Interstate Treaty on Gambling)',
    url: 'https://www.ggl.de/',
    countries: ['DE'],
    category: 'gambling',
    region: 'europe',
    notes: '€1,000/month deposit limit, €1 max stake per spin, 5-second minimum spin time. GGL issued 231 C&D proceedings in 2024.'
  },
  {
    id: 'netherlands-koa-2021',
    name: 'Wet Kansspelen op afstand / Remote Gambling Act (KOA)',
    url: 'https://kansspelautoriteit.nl/',
    countries: ['NL'],
    category: 'gambling',
    region: 'europe',
    notes: 'Dutch online gambling market opened October 2021 under KSA oversight. Gambling tax increased to 34.2% (January 2025); new KSA licensing framework with mandatory exit plans effective 1 January 2026.'
  },
  {
    id: 'belgium-gaming-act-1999',
    name: 'Belgian Gaming Act of 7 May 1999 (as amended Feb 2024)',
    url: 'https://www.gamingcommission.be/en',
    countries: ['BE'],
    category: 'gambling',
    region: 'europe',
    notes: 'Comprehensive Belgian gambling legislation; 2024 amendment tightened advertising rules.'
  },
  {
    id: 'switzerland-bgs-2018',
    name: 'Geldspielgesetz / Federal Act on Money Games (BGS 935.51)',
    url: 'https://www.fedlex.admin.ch/eli/cc/2018/795/de',
    countries: ['CH'],
    category: 'gambling',
    region: 'europe',
    notes: 'Swiss gambling act effective 2019, permitting licensed Swiss online casinos.'
  },
  {
    id: 'austria-glucksspielgesetz',
    name: 'Glücksspielgesetz (GSpG — Austrian Gambling Act)',
    url: 'https://www.ris.bka.gv.at/',
    countries: ['AT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Austrian gambling monopoly framework managed by BMF.'
  },

  // ════════════════════════════════════════════════════════════
  // GAMBLING-SPECIFIC: EUROPE — SOUTHERN & EASTERN
  // ════════════════════════════════════════════════════════════

  {
    id: 'spain-ley-13-2011',
    name: 'Ley 13/2011 de regulación del juego',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2011-9280',
    countries: ['ES'],
    category: 'gambling',
    region: 'europe',
    notes: 'Spanish online gambling act administered by DGOJ. RD 958/2020 severely restricts advertising.'
  },
  {
    id: 'spain-rd-176-2023',
    name: 'Real Decreto 176/2023 (Safer Gambling Environments)',
    url: 'https://www.boe.es/',
    countries: ['ES'],
    category: 'gambling',
    region: 'europe',
    notes: 'Enhanced responsible gambling requirements including cross-operator deposit limits under discussion.'
  },
  {
    id: 'italy-decreto-dignita-2018',
    name: 'Decreto Dignità (Decree Law 87/2018)',
    url: 'https://www.adm.gov.it/',
    countries: ['IT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Total ban on gambling advertising in Italy since August 2018.'
  },
  {
    id: 'italy-reorganisation-decree-2024',
    name: 'Reorganisation of Gambling Decree (2024)',
    url: 'https://www.adm.gov.it/',
    countries: ['IT'],
    category: 'gambling',
    region: 'europe',
    notes: '50 new 9-year online licenses offered at €7M each; 3% GGR fee + 0.2% for responsible gambling.'
  },
  {
    id: 'portugal-dl-66-2015',
    name: 'Decreto-Lei 66/2015 (Online Gambling Act)',
    url: 'https://dre.pt/dre/detalhe/decreto-lei/66-2015-67072750',
    countries: ['PT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Portuguese online gambling regulation administered by SRIJ.'
  },
  {
    id: 'france-loi-2010-476',
    name: 'Loi n° 2010-476 (Online Gambling Act)',
    url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000022204510/',
    countries: ['FR'],
    category: 'gambling',
    region: 'europe',
    notes: 'French online gambling framework; ANJ regulator. Loi 2024-449 added fantasy betting (JONUMs).'
  },
  {
    id: 'ireland-gambling-regulation-act-2024',
    name: 'Gambling Regulation Act 2024',
    url: 'https://www.irishstatutebook.ie/eli/2024/act/35/enacted/en/html',
    countries: ['IE'],
    category: 'gambling',
    region: 'europe',
    notes: 'GRAI launched 5 March 2025. B2C betting licence applications opened 9 February 2026; remote operators eligible from 1 July 2026; in-person operator transition from 1 December 2026. Credit card ban, 5:30am–9pm TV/radio ad blackout.'
  },
  {
    id: 'romania-geo-77-2009',
    name: 'Government Emergency Ordinance No. 77/2009 (GEO 77/2009)',
    url: 'https://www.onjn.gov.ro/',
    countries: ['RO'],
    category: 'gambling',
    region: 'europe',
    notes: 'Romanian online gambling regulation. ONJN Order 79/2025 created unified self-exclusion register.'
  },
  {
    id: 'greece-law-4635-2019',
    name: 'Law 4635/2019 (Online Gambling Framework)',
    url: 'https://www.gamingcommission.gov.gr/',
    countries: ['GR'],
    category: 'gambling',
    region: 'europe',
    notes: 'Greek Hellenic Gaming Commission (HGC/EEEP) online gambling licensing.'
  },
  {
    id: 'czech-gambling-act-186-2016',
    name: 'Zákon č. 186/2016 Sb. o hazardních hrách',
    url: 'https://www.zakonyprolidi.cz/cs/2016-186',
    countries: ['CZ'],
    category: 'gambling',
    region: 'europe',
    notes: 'Czech gambling act administered by Ministry of Finance with blacklist enforcement.'
  },
  {
    id: 'poland-gambling-act-2009',
    name: 'Ustawa o grach hazardowych (Gambling Act, 19 Nov 2009)',
    url: 'https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20092011540',
    countries: ['PL'],
    category: 'gambling',
    region: 'europe',
    notes: 'Polish gambling act with strict IP/payment blocking enforcement.'
  },
  {
    id: 'hungary-act-xxxiv-1991',
    name: 'Act XXXIV of 1991 on Gambling Operations',
    url: 'https://njt.hu/',
    countries: ['HU'],
    category: 'gambling',
    region: 'europe',
    notes: 'Hungarian gambling legislation; state monopoly model.'
  },
  {
    id: 'estonia-hasartmanguseadus',
    name: 'Hasartmänguseadus (Gambling Act)',
    url: 'https://www.riigiteataja.ee/en/eli/504012024003/consolide',
    countries: ['EE'],
    category: 'gambling',
    region: 'europe',
    notes: 'Estonian online gambling regulation administered by Tax and Customs Board (EMTA).'
  },
  {
    id: 'latvia-gambling-lotteries-law',
    name: 'Azartspēļu un izložu likums (Gambling and Lotteries Law)',
    url: 'https://likumi.lv/ta/en/en/id/122941',
    countries: ['LV'],
    category: 'gambling',
    region: 'europe',
    notes: 'Latvian gambling regulation administered by IAUI.'
  },
  {
    id: 'lithuania-gaming-law-2001',
    name: 'Azartinių lošimų įstatymas (Gaming Law, 2001)',
    url: 'https://www.e-tar.lt/',
    countries: ['LT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Lithuanian gambling regulation; 2025 tightening of advertising restrictions.'
  },

  // ════════════════════════════════════════════════════════════
  // GAMBLING-SPECIFIC: UNITED STATES
  // ════════════════════════════════════════════════════════════

  {
    id: 'us-wire-act-1961',
    name: 'Interstate Wire Act of 1961 (18 U.S.C. § 1084)',
    url: 'https://www.law.cornell.edu/uscode/text/18/1084',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'Federal prohibition on wire communications for sports wagering; scope disputed for non-sports gambling.'
  },
  {
    id: 'us-uigea-2006',
    name: 'Unlawful Internet Gambling Enforcement Act 2006 (UIGEA)',
    url: 'https://www.federalreserve.gov/supervisionreg/regggcg.htm',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'Prohibits financial institutions from processing payments for unlawful online gambling.'
  },
  {
    id: 'us-igra-1988',
    name: 'Indian Gaming Regulatory Act 1988 (IGRA)',
    url: 'https://www.nigc.gov/general-counsel/indian-gaming-regulatory-act',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'Governs gambling on Native American tribal lands; NIGC oversight.'
  },
  {
    id: 'us-nj-igaming',
    name: 'NJ Casino Control Act; A2578 (2013 iGaming)',
    url: 'https://www.njoag.gov/about/divisions-and-offices/division-of-gaming-enforcement-home/',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'New Jersey — first US state to legalise full online casino gaming.'
  },
  {
    id: 'us-pa-igaming',
    name: 'PA Race Horse Development and Gaming Act; Act 42 of 2017',
    url: 'https://gamingcontrolboard.pa.gov',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'Pennsylvania online casino and sports betting framework.'
  },
  {
    id: 'us-mi-igaming',
    name: 'Michigan Lawful Internet Gaming Act (PA 152 of 2019)',
    url: 'https://www.michigan.gov/mgcb',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'Michigan full-scale online casino and sports betting.'
  },
  {
    id: 'us-ny-sports-betting',
    name: 'NY Chapter 553, Laws of 2019 / Mobile authorization 2021',
    url: 'https://www.gaming.ny.gov',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'New York mobile sports betting launched January 2022; highest-tax model (51% of GGR).'
  },
  {
    id: 'us-il-sports-betting',
    name: 'Illinois Sports Wagering Act (PA 101-0031, 2019)',
    url: 'https://www.igb.illinois.gov',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'Illinois sports betting — major market with in-person registration removed 2022.'
  },

  // ════════════════════════════════════════════════════════════
  // GAMBLING-SPECIFIC: CANADA
  // ════════════════════════════════════════════════════════════

  {
    id: 'canada-criminal-code-gambling',
    name: 'Criminal Code of Canada, Part VII (Sections 201–209)',
    url: 'https://laws-lois.justice.gc.ca/eng/acts/c-46/page-38.html',
    countries: ['CA'],
    category: 'gambling',
    region: 'americas',
    notes: 'Federal framework; gambling regulated at provincial level following C-218 amendment.'
  },
  {
    id: 'canada-bill-c218-2021',
    name: 'Bill C-218 (Safe and Regulated Sports Betting Act, 2021)',
    url: 'https://www.parl.ca/legisinfo/en/bill/43-2/c-218',
    countries: ['CA'],
    category: 'gambling',
    region: 'americas',
    notes: 'Legalised single-event sports wagering in Canada effective August 2021.'
  },
  {
    id: 'ontario-igaming-2022',
    name: 'Gaming Control Act 1992 (Ontario); iGaming Ontario Framework (2022)',
    url: 'https://igamingontario.ca',
    countries: ['CA'],
    category: 'gambling',
    region: 'americas',
    notes: "Ontario open-market iGaming launched April 2022 — Canada's largest competitive market."
  },
  {
    id: 'alberta-igaming-bill48-2025',
    name: 'Bill 48 — iGaming Alberta Act (introduced March 2025)',
    url: 'https://aglc.ca',
    countries: ['CA'],
    category: 'gambling',
    region: 'americas',
    notes: 'Alberta following Ontario model; open competitive iGaming market pending.'
  },

  // ════════════════════════════════════════════════════════════
  // GAMBLING-SPECIFIC: LATIN AMERICA & CARIBBEAN
  // ════════════════════════════════════════════════════════════

  {
    id: 'brazil-lei-14790-2023',
    name: 'Law No. 14,790/2023 (Lei das Apostas / Betting Law)',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14790.htm',
    countries: ['BR'],
    category: 'gambling',
    region: 'americas',
    notes: 'Brazil sports betting and online gaming fully operational from January 2025. Grace period ended 1 January 2026; SPA moved to strict enforcement of Ordinance 722. 78 licensed operators holding 138 brands. .bet.br domains required. Credit cards and crypto-anonymity banned; payments must originate from CPF-verified accounts.'
  },
  {
    id: 'brazil-spa-561-2024',
    name: 'SPA/MF Ordinance No. 561/2024 (Licensing procedures)',
    url: 'https://www.gov.br/fazenda/pt-br/assuntos/apostas-esportivas-e-jogos-on-line',
    countries: ['BR'],
    category: 'gambling',
    region: 'americas',
    notes: 'Procedural rules for Brazil SPA licensing.'
  },
  {
    id: 'curacao-lok-2024',
    name: 'Landsverordening op de Kansspelen (LOK) — new law effective Dec 2024',
    url: 'https://www.cga.cw/regulation/online-gaming',
    countries: ['CW'],
    category: 'gambling',
    region: 'americas',
    notes: 'Replaced master/sublicense system with direct CGA licensing. Green seal mandatory; orange seal expired 15 October 2025. Physical presence in Curaçao required. Mandatory ADR and tightened T&C requirements in force 2026.'
  },
  {
    id: 'antigua-igiwr',
    name: 'Interactive Gaming and Interactive Wagering Regulations (IGIWR)',
    url: 'https://www.fsrc.gov.ag/index.php/services/gaming',
    countries: ['AG'],
    category: 'gambling',
    region: 'americas',
    notes: 'Antigua and Barbuda FSRC online gambling licensing.'
  },

  // ════════════════════════════════════════════════════════════
  // GAMBLING-SPECIFIC: ASIA-PACIFIC
  // ════════════════════════════════════════════════════════════

  {
    id: 'australia-iga-2001',
    name: 'Interactive Gambling Act 2001 (IGA)',
    url: 'https://www.legislation.gov.au/C2004A00851/latest/text',
    countries: ['AU'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'Prohibits most interactive gambling to Australians; sports betting and lottery exempted.'
  },
  {
    id: 'australia-iga-2017-amendment',
    name: 'Interactive Gambling Amendment Act 2017',
    url: 'https://www.legislation.gov.au/C2017A00085/latest/text',
    countries: ['AU'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'Strengthened enforcement including in-play betting ban and credit card prohibition.'
  },
  {
    id: 'australia-ncpf',
    name: 'National Consumer Protection Framework (NCPF) incl. BetStop',
    url: 'https://www.infrastructure.gov.au/media-communications/gambling/interactive-gambling',
    countries: ['AU'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: '10-point framework including BetStop national self-exclusion register launched August 2023.'
  },
  {
    id: 'newzealand-gambling-act-2003',
    name: 'Gambling Act 2003',
    url: 'https://www.legislation.govt.nz/act/public/2003/51/en/latest/',
    countries: ['NZ'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'New Zealand plans to license up to 15 online casino operators by 2026.'
  },
  {
    id: 'india-meity-online-gaming-2025',
    name: 'Promotion and Regulation of Online Gaming Act, 2025',
    url: 'https://www.meity.gov.in/',
    countries: ['IN'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'Notified August 2025 — attempts to prohibit online money games regardless of skill/chance distinction. Constitutional challenges pending. 28% GST on full deposit value.'
  },
  {
    id: 'india-it-rules-2023',
    name: 'IT (Intermediary Guidelines) Rules 2021 (amended April 2023)',
    url: 'https://www.meity.gov.in/',
    countries: ['IN'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'Self-regulatory online gaming intermediary framework via MeitY.'
  },
  {
    id: 'singapore-gambling-control-act-2022',
    name: 'Gambling Control Act 2022 (GCA)',
    url: 'https://sso.agc.gov.sg/Act/GCA2022',
    countries: ['SG'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'Singapore consolidated gambling legislation replacing Casino Control Act for licensing. GRA regulator.'
  },
  {
    id: 'singapore-casino-control-amendment-2024',
    name: 'Casino Control (Amendment) Act 2024',
    url: 'https://sso.agc.gov.sg/',
    countries: ['SG'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'Updated casino entry levy and responsible gambling provisions.'
  },
  {
    id: 'philippines-pagcor-charter',
    name: 'Presidential Decree No. 1869 (PAGCOR Charter)',
    url: 'https://www.pagcor.ph/',
    countries: ['PH'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'PAGCOR authority over Philippine gambling; EO 74 (Nov 2024) banned POGOs/offshore gaming.'
  },

  // ════════════════════════════════════════════════════════════
  // GAMBLING-SPECIFIC: AFRICA
  // ════════════════════════════════════════════════════════════

  {
    id: 'sa-national-gambling-act-2004',
    name: 'National Gambling Act 2004 (Act No. 7 of 2004)',
    url: 'https://www.gov.za/documents/national-gambling-act-0',
    countries: ['ZA'],
    category: 'gambling',
    region: 'africa',
    notes: 'South African provincial licensing framework; Remote Gambling Bill 2024 pending.'
  },
  {
    id: 'nigeria-national-lottery-act-2005',
    name: 'National Lottery Act 2005 (amended)',
    url: 'https://www.nlrc.gov.ng/',
    countries: ['NG'],
    category: 'gambling',
    region: 'africa',
    notes: 'Nigerian federal gambling framework plus Lagos State Lotteries Law (amended 2021) for largest market.'
  },
  {
    id: 'kenya-gambling-control-act-2025',
    name: 'Gambling Control Act, 2025 (Act No. 14 of 2025)',
    url: 'https://new.kenyalaw.org/',
    countries: ['KE'],
    category: 'gambling',
    region: 'africa',
    notes: 'New Kenya law enacted August 2025. First formal online gambling regulation. New GRA regulator. 30% Kenyan ownership, KSh 1B minimum capital.'
  },

  // ════════════════════════════════════════════════════════════
  // AML / CFT
  // ════════════════════════════════════════════════════════════

  {
    id: 'eu-amld4',
    name: 'AMLD4 — Directive (EU) 2015/849',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32015L0849',
    countries: EEA,
    category: 'aml',
    region: 'eu-wide',
    notes: 'EU AML directive explicitly classifying gambling operators as obliged entities. Superseded by 2024 AML package from July 2027.'
  },
  {
    id: 'eu-amld5',
    name: 'AMLD5 — Directive (EU) 2018/843',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32018L0843',
    countries: EEA,
    category: 'aml',
    region: 'eu-wide',
    notes: 'Strengthened beneficial ownership registers and crypto asset oversight.'
  },
  {
    id: 'eu-aml-regulation-2024',
    name: 'EU AML Regulation (EU) 2024/1624 (Single Rulebook)',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32024R1624',
    countries: EU,
    category: 'aml',
    region: 'eu-wide',
    notes: 'Directly applicable from 10 July 2027. Replaces fragmented AMLD transpositions. Eliminates national divergence in CDD requirements.'
  },
  {
    id: 'eu-amla-2024',
    name: 'AMLA — Regulation (EU) 2024/1620',
    url: 'https://www.amla.europa.eu/',
    countries: EU,
    category: 'aml',
    region: 'eu-wide',
    notes: 'EU Anti-Money Laundering Authority operational 1 July 2025 in Frankfurt. Direct supervision of 40 high-risk cross-border entities from January 2028.'
  },
  {
    id: 'fatf-40-recommendations',
    name: 'FATF 40 Recommendations',
    url: 'https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html',
    countries: ['GB','MT','DE','FR','IT','ES','US','CA','AU','IN','JP','KR','SG','BR','ZA'],
    category: 'aml',
    region: 'global',
    notes: 'Global AML/CFT standard across 187+ countries. Gambling operators classified as DNFBPs (Designated Non-Financial Businesses).'
  },
  {
    id: 'uk-ml-regulations-2017',
    name: 'UK Money Laundering Regulations 2017 (as amended)',
    url: 'https://www.legislation.gov.uk/uksi/2017/692/contents',
    countries: ['GB'],
    category: 'aml',
    region: 'europe',
    notes: 'UK AML framework for gambling businesses post-Brexit.'
  },
  {
    id: 'us-bank-secrecy-act',
    name: 'US Bank Secrecy Act / FinCEN',
    url: 'https://www.fincen.gov/resources/statutes-and-regulations/bank-secrecy-act',
    countries: ['US'],
    category: 'aml',
    region: 'americas',
    notes: 'BSA requires casinos to file SARs and CTRs; FinCEN enforcement.'
  },
  {
    id: 'canada-pcmltfa',
    name: "Canada Proceeds of Crime (Money Laundering) and Terrorist Financing Act",
    url: 'https://fintrac-canafe.gc.ca',
    countries: ['CA'],
    category: 'aml',
    region: 'americas',
    notes: 'FINTRAC oversight for Canadian gambling operators.'
  },
  {
    id: 'australia-amlctf-act-2006',
    name: 'Australia AML/CTF Act 2006',
    url: 'https://www.austrac.gov.au/',
    countries: ['AU'],
    category: 'aml',
    region: 'asia-pacific',
    notes: 'AUSTRAC reporting obligations for Australian gambling operators.'
  },
  {
    id: 'brazil-spa-aml-1143-2024',
    name: 'SPA/MF Ordinance No. 1,143/2024 (AML/KYC compliance)',
    url: 'https://www.gov.br/fazenda/pt-br/assuntos/apostas-esportivas-e-jogos-on-line',
    countries: ['BR'],
    category: 'aml',
    region: 'americas',
    notes: 'Brazil AML/KYC requirements for licensed betting operators.'
  },
  {
    id: 'curacao-cga-aml',
    name: 'CGA AML Regulations (NOIS/NORUT)',
    url: 'https://www.cga.cw',
    countries: ['CW'],
    category: 'aml',
    region: 'americas',
    notes: 'Curaçao CGA anti-money laundering rules under new LOK framework.'
  },
  {
    id: 'india-pmla-2002',
    name: 'Prevention of Money Laundering Act 2002 (PMLA)',
    url: 'https://www.indiacode.nic.in/',
    countries: ['IN'],
    category: 'aml',
    region: 'asia-pacific',
    notes: 'Indian AML framework applicable to gambling entities.'
  },
  {
    id: 'sa-fica',
    name: 'South Africa Financial Intelligence Centre Act (FICA)',
    url: 'https://www.fic.gov.za/',
    countries: ['ZA'],
    category: 'aml',
    region: 'africa',
    notes: 'FIC oversight of South African gambling AML obligations.'
  },
  {
    id: 'kenya-aml-cft-2025',
    name: 'Anti-Money Laundering and CFT Laws (Amendment) Act, 2025',
    url: 'https://new.kenyalaw.org/',
    countries: ['KE'],
    category: 'aml',
    region: 'africa',
    notes: 'Updated Kenyan AML/CFT framework aligned with new Gambling Control Act.'
  },

  // ════════════════════════════════════════════════════════════
  // DATA PROTECTION & PRIVACY
  // ════════════════════════════════════════════════════════════

  {
    id: 'eu-gdpr',
    name: 'GDPR — Regulation (EU) 2016/679',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32016R0679',
    countries: EEA,
    category: 'data',
    region: 'eu-wide',
    notes: 'Primary EU data protection regulation. Extraterritorial scope. Fines up to €20M or 4% of global turnover.'
  },
  {
    id: 'eu-eprivacy-directive',
    name: 'ePrivacy Directive 2002/58/EC (as amended)',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32002L0058',
    countries: EEA,
    category: 'data',
    region: 'eu-wide',
    notes: 'Cookie consent and electronic communications privacy.'
  },
  {
    id: 'uk-dpa-2018',
    name: 'UK Data Protection Act 2018 / UK GDPR',
    url: 'https://www.legislation.gov.uk/ukpga/2018/12/contents',
    countries: ['GB'],
    category: 'data',
    region: 'europe',
    notes: 'UK equivalent of GDPR post-Brexit, enforced by ICO.'
  },
  {
    id: 'us-ccpa-cpra',
    name: 'CCPA / CPRA — California Consumer Privacy Act',
    url: 'https://oag.ca.gov/privacy/ccpa',
    countries: ['US'],
    category: 'data',
    region: 'americas',
    notes: 'California privacy law effective 2020 / amended CPRA 2023. Applies to operators processing California residents\' data.'
  },
  {
    id: 'brazil-lgpd',
    name: 'LGPD — Lei Geral de Proteção de Dados (Lei nº 13.709/2018)',
    url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
    countries: ['BR'],
    category: 'data',
    region: 'americas',
    notes: 'Brazilian data protection law. ANPD enforcement authority.'
  },
  {
    id: 'australia-privacy-act-1988',
    name: 'Privacy Act 1988 (Cth)',
    url: 'https://www.legislation.gov.au/C2004A03712/latest/text',
    countries: ['AU'],
    category: 'data',
    region: 'asia-pacific',
    notes: 'Australian Privacy Principles for operators processing Australian data.'
  },
  {
    id: 'canada-pipeda',
    name: 'PIPEDA — Personal Information Protection and Electronic Documents Act',
    url: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/',
    countries: ['CA'],
    category: 'data',
    region: 'americas',
    notes: 'Canadian federal privacy law for private sector. Quebec Law 25 adds stricter requirements.'
  },
  {
    id: 'sa-popia',
    name: 'POPIA — Protection of Personal Information Act 4 of 2013',
    url: 'https://www.gov.za/documents/protection-personal-information-act',
    countries: ['ZA'],
    category: 'data',
    region: 'africa',
    notes: 'South African GDPR-equivalent. ICRSA enforcement.'
  },
  {
    id: 'india-dpdp-2023',
    name: 'Digital Personal Data Protection Act 2023 (DPDP)',
    url: 'https://www.meity.gov.in/data-protection-framework',
    countries: ['IN'],
    category: 'data',
    region: 'asia-pacific',
    notes: 'Indian data protection law. Full compliance required by May 2027.'
  },
  {
    id: 'kenya-data-protection-act',
    name: 'Data Protection Act (Kenya)',
    url: 'https://new.kenyalaw.org/',
    countries: ['KE'],
    category: 'data',
    region: 'africa',
    notes: 'Kenyan data protection framework enforced by ODPC.'
  },
  {
    id: 'philippines-data-privacy-act',
    name: 'Data Privacy Act (Republic Act No. 10173)',
    url: 'https://www.privacy.gov.ph/',
    countries: ['PH'],
    category: 'data',
    region: 'asia-pacific',
    notes: 'Philippine data privacy law administered by National Privacy Commission.'
  },

  // ════════════════════════════════════════════════════════════
  // FINANCIAL REGULATIONS
  // ════════════════════════════════════════════════════════════

  {
    id: 'eu-psd2',
    name: 'PSD2 — Directive (EU) 2015/2366',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32015L2366',
    countries: EEA,
    category: 'financial',
    region: 'eu-wide',
    notes: 'Payment Services Directive 2. SCA requirements directly impact deposit flows. PSD3 provisional agreement November 2025.'
  },
  {
    id: 'eu-mica-2023',
    name: 'MiCA — Regulation (EU) 2023/1114 (Markets in Crypto-Assets)',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32023R1114',
    countries: EU,
    category: 'financial',
    region: 'eu-wide',
    notes: 'Fully applicable December 2024. Governs crypto-asset payments including those accepted by gambling operators. iGaming operators accepting cryptocurrencies or stablecoins from EU players now face additional licensing, KYC, and AML obligations including blockchain transaction analysis, Source of Funds checks, and potential MiCA-specific licensing depending on the assets used.'
  },
  {
    id: 'eu-dora-2022',
    name: 'DORA — Regulation (EU) 2022/2554 (Digital Operational Resilience Act)',
    url: 'https://eur-lex.europa.eu/eli/reg/2022/2554/oj',
    countries: EU,
    category: 'financial',
    region: 'eu-wide',
    notes: 'Applicable January 2025. Imposes digital resilience requirements on financial entities and their ICT providers — captures iGaming payment infrastructure.'
  },
  {
    id: 'eu-sca-2018',
    name: 'SCA — Commission Delegated Regulation (EU) 2018/389',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32018R0389',
    countries: EEA,
    category: 'financial',
    region: 'eu-wide',
    notes: 'Strong Customer Authentication requirements for payment services including gambling deposits.'
  },

  // ════════════════════════════════════════════════════════════
  // DIGITAL SERVICES, CONSUMER PROTECTION & AI
  // ════════════════════════════════════════════════════════════

  {
    id: 'eu-dsa',
    name: 'EU Digital Services Act (DSA) — Regulation (EU) 2022/2065',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32022R2065',
    countries: EEA,
    category: 'digital',
    region: 'eu-wide',
    notes: 'Transparency and advertising obligations for online platforms including iGaming sites. Extraterritorial scope.'
  },
  {
    id: 'eu-ai-act-2024',
    name: 'EU AI Act — Regulation (EU) 2024/1689',
    url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
    countries: EEA,
    category: 'digital',
    region: 'eu-wide',
    notes: 'Risk-based AI regulation. Prohibitions from February 2025; most obligations August 2026. Player risk profiling and personalised marketing may trigger high-risk classification.'
  },
  {
    id: 'eu-accessibility-act',
    name: 'European Accessibility Act — Directive (EU) 2019/882',
    url: 'https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng',
    countries: EEA,
    category: 'digital',
    region: 'eu-wide',
    notes: 'Mandatory from 28 June 2025. Requires iGaming platforms to meet WCAG 2.1 AA standards.'
  },
  {
    id: 'eu-nis2',
    name: 'NIS2 Directive — Directive (EU) 2022/2555',
    url: 'https://eur-lex.europa.eu/eli/dir/2022/2555/oj',
    countries: EEA,
    category: 'digital',
    region: 'eu-wide',
    notes: 'Cybersecurity requirements for essential and important entities; applies to large iGaming operators.'
  },
  {
    id: 'uk-online-safety-act-2023',
    name: 'UK Online Safety Act 2023',
    url: 'https://www.legislation.gov.uk/ukpga/2023/50',
    countries: ['GB'],
    category: 'digital',
    region: 'europe',
    notes: 'Ofcom regulation of online services including gambling platforms with user-generated content features.'
  },
  {
    id: 'uk-childrens-code',
    name: "UK Age Appropriate Design Code (Children's Code)",
    url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/',
    countries: ['GB'],
    category: 'digital',
    region: 'europe',
    notes: 'ICO code requiring high privacy protection for under-18s. Relevant to age verification on gambling sites.'
  },
  {
    id: 'us-coppa',
    name: 'COPPA — Children\'s Online Privacy Protection Act',
    url: 'https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa',
    countries: ['US'],
    category: 'digital',
    region: 'americas',
    notes: 'FTC rule protecting under-13s online privacy; relevant to gambling age verification compliance.'
  },

  // ════════════════════════════════════════════════════════════
  // ADVERTISING & MARKETING
  // ════════════════════════════════════════════════════════════

  {
    id: 'eu-avmsd-2018',
    name: 'AVMSD — Directive (EU) 2018/1808',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32018L1808',
    countries: EEA,
    category: 'advertising',
    region: 'eu-wide',
    notes: 'Audiovisual Media Services Directive. Member states may restrict gambling advertising on TV/streaming.'
  },
  {
    id: 'uk-cap-codes',
    name: 'UK ASA/CAP Codes — Gambling sections (Section 16)',
    url: 'https://www.asa.org.uk/codes-and-rulings/advertising-codes.html',
    countries: ['GB'],
    category: 'advertising',
    region: 'europe',
    notes: 'CAP/BCAP codes governing gambling advertising. Mandatory opt-in for direct marketing from May 2025.'
  },
  {
    id: 'uk-pecr',
    name: 'PECR — Privacy and Electronic Communications Regulations 2003',
    url: 'https://www.legislation.gov.uk/uksi/2003/2426/contents',
    countries: ['GB'],
    category: 'advertising',
    region: 'europe',
    notes: 'UK direct marketing rules governing email, SMS and cookie consent.'
  },
  {
    id: 'spain-rd-958-2020',
    name: 'Real Decreto 958/2020 (Spanish gambling advertising decree)',
    url: 'https://www.boe.es/',
    countries: ['ES'],
    category: 'advertising',
    region: 'europe',
    notes: 'Severe Spanish advertising restrictions: no TV/radio 1am–5am; no celebrity/sports ambassadors; welcome bonuses only to verified existing players.'
  },
  {
    id: 'italy-decreto-dignita-advertising',
    name: 'Decreto Dignità — Law 96/2018 (Italian gambling advertising ban)',
    url: 'https://www.gazzettaufficiale.it/',
    countries: ['IT'],
    category: 'advertising',
    region: 'europe',
    notes: 'Total advertising ban for gambling in Italy since August 2018. No exceptions for sports sponsorship or streaming.'
  },
  {
    id: 'netherlands-ksa-advertising-decree',
    name: 'KSA Decree on Recruitment, Advertising and Addiction Prevention',
    url: 'https://kansspelautoriteit.nl/',
    countries: ['NL'],
    category: 'advertising',
    region: 'europe',
    notes: 'Netherlands banned untargeted gambling advertising from July 2023.'
  },
  {
    id: 'ireland-gambling-act-advertising',
    name: 'Ireland Gambling Regulation Act 2024 — advertising provisions',
    url: 'https://www.irishstatutebook.ie/eli/2024/act/35/enacted/en/html',
    countries: ['IE'],
    category: 'advertising',
    region: 'europe',
    notes: '5:30am–9pm TV/radio ad blackout. Bans sports sponsorship involving under-18 teams. National Gambling Exclusion Register.'
  },
  {
    id: 'belgium-gaming-act-advertising-2024',
    name: 'Belgian Gaming Act advertising amendments (Feb 2024)',
    url: 'https://www.gamingcommission.be/en',
    countries: ['BE'],
    category: 'advertising',
    region: 'europe',
    notes: 'Tightened Belgian advertising rules following 2024 amendment.'
  },
  {
    id: 'romania-onjn-advertising-2025',
    name: 'Romania ONJN advertising provisions (celebrity ban, Oct 2025)',
    url: 'https://www.onjn.gov.ro/',
    countries: ['RO'],
    category: 'advertising',
    region: 'europe',
    notes: 'Romania celebrity/influencer advertising ban effective October 2025.'
  },
  {
    id: 'us-can-spam',
    name: 'CAN-SPAM Act of 2003',
    url: 'https://www.ftc.gov/legal-library/browse/rules/can-spam-rule',
    countries: ['US'],
    category: 'advertising',
    region: 'americas',
    notes: 'US federal email marketing rules. Applies to promotional emails from gambling operators.'
  },
  {
    id: 'australia-ncpf-advertising',
    name: 'Australia NCPF responsible gambling messaging requirements',
    url: 'https://www.infrastructure.gov.au/media-communications/gambling/interactive-gambling',
    countries: ['AU'],
    category: 'advertising',
    region: 'asia-pacific',
    notes: 'Mandatory responsible gambling messaging in all advertising. Ad ban during live sports under ongoing discussion.'
  },
  {
    id: 'kenya-gra-celebrity-ban-2025',
    name: 'Kenya GRA celebrity/influencer advertising ban (May 2025)',
    url: 'https://bclb.go.ke/',
    countries: ['KE'],
    category: 'advertising',
    region: 'africa',
    notes: 'Kenya banned celebrity and influencer gambling advertising from May 2025. BCLB replaced by Gambling Regulatory Authority (GRA) under the Gambling Control Act 2025.'
  },
  {
    id: 'india-mib-advisories',
    name: 'India MIB Advisories on online betting advertising (2022–2024)',
    url: 'https://mib.gov.in/',
    countries: ['IN'],
    category: 'advertising',
    region: 'asia-pacific',
    notes: 'Ministry of Information and Broadcasting advisories restricting online betting advertising across TV, digital and print.'
  },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL EUROPE — MISSING ENTRIES
  // ════════════════════════════════════════════════════════════

  { id: 'uk-national-lottery-act-1993', name: 'National Lottery Act 1993 (as amended)', url: 'https://www.legislation.gov.uk/ukpga/1993/39/contents', countries: ['GB'], category: 'gambling', region: 'europe', notes: 'Regulates the UK National Lottery including online ticket sales via Camelot/Allwyn.' },

  { id: 'gibraltar-generic-code', name: 'Gibraltar Generic Code of Practice for Gambling', url: 'https://www.gibraltar.gov.gi/finance-gaming-and-regulations/remote-gambling', countries: ['GI'], category: 'gambling', region: 'europe', notes: 'Operational requirements for all Gibraltar-licensed gambling operators.' },
  { id: 'gibraltar-aml-code', name: 'Gibraltar AML Code of Practice for Gambling', url: 'https://www.gibraltar.gov.gi/finance-gaming-and-regulations/remote-gambling', countries: ['GI'], category: 'aml', region: 'europe', notes: 'AML/CFT obligations specifically for Gibraltar gambling licence holders.' },

  { id: 'iom-casino-act-1986', name: 'Casino Act 1986 (Isle of Man)', url: 'https://legislation.gov.im/', countries: ['IM'], category: 'gambling', region: 'europe', notes: 'Isle of Man casino licensing foundation.' },
  { id: 'iom-gaming-betting-lotteries-1988', name: 'Gaming, Betting and Lotteries Act 1988 (Isle of Man)', url: 'https://legislation.gov.im/', countries: ['IM'], category: 'gambling', region: 'europe', notes: 'Isle of Man betting and lottery regulation.' },
  { id: 'iom-online-gambling-advertising-2007', name: 'Online Gambling (Advertising) Regulations 2007 (Isle of Man)', url: 'https://legislation.gov.im/', countries: ['IM'], category: 'advertising', region: 'europe', notes: 'Isle of Man advertising rules for online gambling operators.' },

  { id: 'alderney-law-1999', name: 'Gambling (Alderney) Law 1999', url: 'https://www.gamblingcontrol.org/regulation-framework/', countries: ['GG'], category: 'gambling', region: 'europe', notes: 'Foundational Alderney gambling enabling law.' },
  { id: 'alderney-egambling-regs-2009', name: 'Alderney eGambling Regulations 2009', url: 'https://www.gamblingcontrol.org/regulation-framework/', countries: ['GG'], category: 'gambling', region: 'europe', notes: 'Detailed operational and technical requirements for AGCC licensees.' },

  { id: 'sweden-gambling-tax-act-2018', name: 'Gambling Tax Act (2018:1139)', url: 'https://www.riksdagen.se/', countries: ['SE'], category: 'gambling', region: 'europe', notes: 'Swedish gambling tax — 18% of GGR for online casino, 8% for sports betting.' },
  { id: 'sweden-gambling-ordinance-2018', name: 'Gambling Ordinance (2018:1475)', url: 'https://www.riksdagen.se/', countries: ['SE'], category: 'gambling', region: 'europe', notes: 'Implementing ordinance for the Swedish Gambling Act.' },

  { id: 'denmark-executive-orders-spilleloven', name: 'Executive Orders under Spilleloven', url: 'https://www.spillemyndigheden.dk/en/legal-framework', countries: ['DK'], category: 'gambling', region: 'europe', notes: 'Subordinate Danish legislation implementing the Gambling Act.' },

  { id: 'germany-spielverordnung', name: 'Spielverordnung (Federal Gaming Ordinance)', url: 'https://www.gesetze-im-internet.de/spvo_2006/', countries: ['DE'], category: 'gambling', region: 'europe', notes: 'German machine gaming technical standards regulation.' },

  { id: 'netherlands-wet-op-de-kansspelen-1964', name: 'Wet op de kansspelen (Betting and Gaming Act 1964, as amended)', url: 'https://wetten.overheid.nl/BWBR0002469/', countries: ['NL'], category: 'gambling', region: 'europe', notes: 'Original Dutch gambling act; KOA 2021 added online gaming layer.' },

  { id: 'switzerland-geldspielverordnung', name: 'Geldspielverordnung (Gaming Ordinance)', url: 'https://www.fedlex.admin.ch/', countries: ['CH'], category: 'gambling', region: 'europe', notes: 'Swiss implementing ordinance for the Geldspielgesetz.' },
  { id: 'switzerland-esbk-aml', name: 'ESBK Money Laundering Ordinance (Gaming)', url: 'https://www.esbk.admin.ch/', countries: ['CH'], category: 'aml', region: 'europe', notes: 'Swiss gaming-specific AML obligations from ESBK.' },

  { id: 'spain-rd-1614-2011', name: 'Real Decreto 1614/2011 (Licensing and Registration)', url: 'https://www.boe.es/', countries: ['ES'], category: 'gambling', region: 'europe', notes: 'Spanish licensing procedures and operator registration requirements under DGOJ.' },

  { id: 'italy-legge-bersani-2006', name: 'Legge Bersani (Law No. 248/2006)', url: 'https://www.gazzettaufficiale.it/', countries: ['IT'], category: 'gambling', region: 'europe', notes: 'Italian iGaming licensing liberalisation; opened online betting to private operators.' },
  { id: 'italy-legislative-decree-496-1948', name: 'Legislative Decree No. 496/1948', url: 'https://www.gazzettaufficiale.it/', countries: ['IT'], category: 'gambling', region: 'europe', notes: 'Foundational Italian gambling legislation establishing state monopoly.' },

  { id: 'france-code-securite-interieure', name: 'Code de la Sécurité Intérieure (Articles L.320-1 et seq.)', url: 'https://www.legifrance.gouv.fr/', countries: ['FR'], category: 'gambling', region: 'europe', notes: 'French criminal code provisions on unlicensed gambling.' },
  { id: 'france-loi-2024-449', name: 'Loi n° 2024-449 (Fantasy Betting / JONUMs)', url: 'https://www.legifrance.gouv.fr/', countries: ['FR'], category: 'gambling', region: 'europe', notes: 'French fantasy sports betting (Jeux de Pronostics à Univers Multiple) regulatory framework.' },

  { id: 'romania-gov-decision-111-2016', name: 'Government Decision No. 111/2016 (Methodological Norms)', url: 'https://www.onjn.gov.ro/', countries: ['RO'], category: 'gambling', region: 'europe', notes: 'Romanian methodological norms implementing GEO 77/2009.' },
  { id: 'romania-geo-114-2018', name: 'Government Emergency Ordinance No. 114/2018', url: 'https://www.onjn.gov.ro/', countries: ['RO'], category: 'gambling', region: 'europe', notes: 'Romanian gaming tax amendments.' },
  { id: 'romania-onjn-order-79-2025', name: 'ONJN Order 79/2025 (Unified Self-Exclusion)', url: 'https://www.onjn.gov.ro/', countries: ['RO'], category: 'gambling', region: 'europe', notes: 'Romanian national self-exclusion register launched 2025.' },

  { id: 'greece-law-4002-2011', name: 'Law 4002/2011 (Gambling Regulation)', url: 'https://www.gamingcommission.gov.gr/', countries: ['GR'], category: 'gambling', region: 'europe', notes: 'Greek gambling regulation framework. HGC/EEEP regulator.' },

  { id: 'estonia-gambling-tax-act', name: 'Estonian Gambling Tax Act', url: 'https://www.riigiteataja.ee/', countries: ['EE'], category: 'gambling', region: 'europe', notes: 'Estonian gambling tax framework.' },
  { id: 'latvia-gambling-tax-law', name: 'Latvian Gambling Tax Law', url: 'https://likumi.lv/', countries: ['LV'], category: 'gambling', region: 'europe', notes: 'Latvian gambling taxation.' },
  { id: 'lithuania-lotteries-act-2003', name: 'Loterijų įstatymas (Law on Lotteries, 2003)', url: 'https://www.e-tar.lt/', countries: ['LT'], category: 'gambling', region: 'europe', notes: 'Lithuanian lotteries regulation.' },
  { id: 'lithuania-advertising-restrictions-2025', name: 'Lithuania gambling advertising restrictions (2025 tightening)', url: 'https://lpt.lrv.lt/en/', countries: ['LT'], category: 'advertising', region: 'europe', notes: 'Lithuania tightened gambling advertising rules significantly in 2025.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL US — FEDERAL + STATES
  // ════════════════════════════════════════════════════════════

  { id: 'us-paspa-1992', name: 'Professional and Amateur Sports Protection Act 1992 (PASPA) — repealed 2018', url: 'https://www.congress.gov/bill/102nd-congress/senate-bill/474', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Federal sports betting prohibition struck down by Supreme Court (Murphy v. NCAA) May 2018, enabling state legalisation.' },
  { id: 'us-illegal-gambling-business-act', name: 'Illegal Gambling Business Act (18 U.S.C. § 1955)', url: 'https://www.law.cornell.edu/uscode/text/18/1955', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Federal criminal prohibition on illegal gambling businesses with 5+ participants.' },
  { id: 'us-interstate-horseracing-act-1978', name: 'Interstate Horseracing Act 1978', url: 'https://www.law.cornell.edu/uscode/text/15/chapter-57', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Authorises interstate off-track horse race wagering; carve-out from Wire Act.' },
  { id: 'us-regulation-gg', name: 'Regulation GG (12 C.F.R. Part 233) — UIGEA implementing regulation', url: 'https://www.fdic.gov/news/financial-institution-letters/2010/fil10035a.pdf', countries: ['US'], category: 'financial', region: 'americas', notes: 'UIGEA implementing regulation requiring financial institutions to block restricted transactions.' },

  // US States — full iGaming
  { id: 'us-wv-igaming', name: 'WV Lottery Interactive Wagering Act (HB 2934, 2019)', url: 'https://wvlottery.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'West Virginia online casino and sports betting.' },
  { id: 'us-ct-igaming', name: 'Connecticut Public Act 21-23 (2021, tribal compact-based)', url: 'https://portal.ct.gov/DCP', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Connecticut online casino via Mohegan Sun and Foxwoods tribal compacts.' },
  { id: 'us-de-igaming', name: 'Delaware Gaming Competitiveness Act 2012 (HB 333)', url: 'https://www.delottery.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Delaware first US state to legalise full online gambling (November 2013).' },
  { id: 'us-ri-igaming', name: 'Rhode Island iGaming Act (2023)', url: 'https://www.rilot.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Rhode Island online casino legislation.' },
  { id: 'us-nv-igaming', name: 'Nevada AB 114 (2013, online poker) / NRS 463', url: 'https://gaming.nv.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Nevada online poker only (no full casino games); first US online poker market.' },
  { id: 'us-me-igaming', name: 'Maine LD 1164 (Jan 2026, tribal-exclusive iGaming)', url: 'https://www.maine.gov/dps/gamb-control', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Maine tribal-exclusive online casino framework, effective January 2026.' },
  { id: 'us-il-igaming-2026', name: 'Illinois HB 1167 (iGaming, 2026 — pending)', url: 'https://www.ilga.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Illinois iGaming bill passed committee late January 2026; most likely next US state to legalise full online casino gaming.' },

  // US States — sports betting only
  { id: 'us-az-sports', name: 'Arizona HB 2772 (2021)', url: 'https://gaming.az.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Arizona sports betting.' },
  { id: 'us-co-sports', name: 'Colorado HB 19-1327 / Proposition DD (2019)', url: 'https://sbg.colorado.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Colorado sports betting — 10% of tax revenue goes to water conservation.' },
  { id: 'us-in-sports', name: 'Indiana HB 1015 (2019)', url: 'https://www.in.gov/igc', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Indiana sports betting.' },
  { id: 'us-ia-sports', name: 'Iowa SF 617 (2019)', url: 'https://irgc.iowa.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Iowa sports betting.' },
  { id: 'us-ks-sports', name: 'Kansas SB 84 (2022)', url: 'https://krgc.ks.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Kansas sports betting.' },
  { id: 'us-ky-sports', name: 'Kentucky HB 551 (2023)', url: 'https://khrc.ky.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Kentucky sports betting launched September 2023.' },
  { id: 'us-la-sports', name: 'Louisiana SB 247 (2021)', url: 'https://lgcb.dps.louisiana.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Louisiana sports betting; 55 of 64 parishes approved by local referendum.' },
  { id: 'us-md-sports', name: 'Maryland HB 940 (2021) / Question 2 ballot (2020)', url: 'https://www.mdgaming.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Maryland sports betting.' },
  { id: 'us-ma-sports', name: 'Massachusetts Sports Wagering Act (Ch. 164, Acts of 2022)', url: 'https://massgaming.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Massachusetts sports betting.' },
  { id: 'us-mo-sports', name: 'Missouri Amendment 2 (2024 ballot)', url: 'https://www.mgc.dps.mo.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Missouri sports betting approved by voters November 2024.' },
  { id: 'us-nc-sports', name: 'North Carolina HB 347 (2023)', url: 'https://www.nclottery.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'North Carolina online sports betting launched March 2024.' },
  { id: 'us-oh-sports', name: 'Ohio HB 29 (2021)', url: 'https://casinocontrol.ohio.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Ohio sports betting launched January 2023.' },
  { id: 'us-tn-sports', name: 'Tennessee Sports Gaming Act (2019)', url: 'https://www.tn.gov/swac.html', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Tennessee online-only sports betting; no retail sportsbooks.' },
  { id: 'us-vt-sports', name: 'Vermont Act 75 of 2023', url: 'https://liquorandlottery.vermont.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Vermont sports betting.' },
  { id: 'us-va-sports', name: 'Virginia HB 896/SB 384 (2020)', url: 'https://www.valottery.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Virginia sports betting.' },
  { id: 'us-wy-sports', name: 'Wyoming HB 133 (2021)', url: 'https://gaming.wyo.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Wyoming online-only sports betting.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL CANADA
  // ════════════════════════════════════════════════════════════

  { id: 'bc-gaming-control-act', name: 'Gaming Control Act (SBC 2002, c.14)', url: 'https://www2.gov.bc.ca/gov/content/sports-culture/gambling', countries: ['CA'], category: 'gambling', region: 'americas', notes: 'British Columbia gambling framework administered by BCLC.' },
  { id: 'quebec-racj', name: 'Société des loteries du Québec Act / RACJ', url: 'https://www.racj.gouv.qc.ca', countries: ['CA'], category: 'gambling', region: 'americas', notes: 'Quebec gambling regulation — Loto-Québec state monopoly for most products.' },
  { id: 'kahnawake-gaming-law-1996', name: 'Kahnawake Gaming Law (K.R.L. c. G-1, 1996)', url: 'https://gamingcommission.ca', countries: ['CA'], category: 'gambling', region: 'americas', notes: 'Kahnawake Mohawk Territory gaming law; basis for KGC online gambling licensing.' },
  { id: 'kahnawake-interactive-gaming-regs', name: 'Regulations Concerning Interactive Gaming (1999, amended 2020)', url: 'https://gamingcommission.ca/interactive-gaming/regulations/', countries: ['CA'], category: 'gambling', region: 'americas', notes: 'KGC online gambling operator licensing regulations.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL LATIN AMERICA & CARIBBEAN
  // ════════════════════════════════════════════════════════════

  { id: 'brazil-lei-13756-2018', name: 'Law No. 13,756/2018 (Initial sports betting authorization)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13756.htm', countries: ['BR'], category: 'gambling', region: 'americas', notes: 'Initial Brazilian sports betting authorization, superseded by Law 14,790/2023.' },
  { id: 'brazil-spa-1207-2024', name: 'SPA/MF Ordinance No. 1,207/2024 (Technical requirements)', url: 'https://www.gov.br/fazenda/pt-br/assuntos/apostas-esportivas-e-jogos-on-line', countries: ['BR'], category: 'gambling', region: 'americas', notes: 'Brazil technical and operational requirements for licensed betting operators.' },
  { id: 'antigua-free-trade-act-1994', name: 'Free Trade and Processing Zone Act (1994)', url: 'https://www.fsrc.gov.ag/index.php/services/gaming', countries: ['AG'], category: 'gambling', region: 'americas', notes: 'Antigua and Barbuda foundational legislation enabling offshore gaming businesses.' },
  { id: 'antigua-gambling-act-2016', name: 'Gambling Act of 2016 (Antigua and Barbuda)', url: 'https://www.fsrc.gov.ag', countries: ['AG'], category: 'gambling', region: 'americas', notes: 'Updated Antiguan gambling legislation.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL ASIA-PACIFIC
  // ════════════════════════════════════════════════════════════

  { id: 'nz-racing-industry-act-2020', name: 'Racing Industry Act 2020 (New Zealand)', url: 'https://www.legislation.govt.nz/', countries: ['NZ'], category: 'gambling', region: 'asia-pacific', notes: 'New Zealand racing and wagering structural reform.' },
  { id: 'nz-gambling-harm-prevention-regs-2004', name: 'Gambling (Harm Prevention and Minimisation) Regulations 2004 (as amended 2023)', url: 'https://www.dia.govt.nz/Gambling-legislation-regulations', countries: ['NZ'], category: 'gambling', region: 'asia-pacific', notes: 'NZ responsible gambling operational requirements.' },
  { id: 'india-public-gambling-act-1867', name: 'Public Gambling Act, 1867', url: 'https://www.indiacode.nic.in/', countries: ['IN'], category: 'gambling', region: 'asia-pacific', notes: 'Colonial-era Indian gambling prohibition; basis for most state laws.' },
  { id: 'india-sikkim-online-gaming-act', name: 'Sikkim Online Gaming (Regulation) Act, 2008 (amended 2024)', url: 'https://sikkim.gov.in/', countries: ['IN'], category: 'gambling', region: 'asia-pacific', notes: 'Sikkim state online gaming licensing.' },
  { id: 'india-meghalaya-gaming-act-2021', name: 'Meghalaya Regulation of Gaming Act, 2021', url: 'https://meghalaya.gov.in/', countries: ['IN'], category: 'gambling', region: 'asia-pacific', notes: 'Meghalaya state gambling regulation.' },
  { id: 'india-goa-gambling-act-1976', name: 'Goa, Daman and Diu Public Gambling Act, 1976', url: 'https://goaonline.gov.in/', countries: ['IN'], category: 'gambling', region: 'asia-pacific', notes: 'Goa state gambling act permitting licensed offshore and onshore casinos.' },
  { id: 'japan-penal-code-gambling', name: 'Japan Penal Code Articles 185–187 (Gambling offences)', url: 'https://www.japaneselawtranslation.go.jp/', countries: ['JP'], category: 'gambling', region: 'asia-pacific', notes: 'Japanese criminal prohibition on gambling (IR casino exemptions apply).' },
  { id: 'japan-ir-implementation-act-2018', name: 'IR Implementation Act (2018)', url: 'https://www.japaneselawtranslation.go.jp/', countries: ['JP'], category: 'gambling', region: 'asia-pacific', notes: 'Japan Integrated Resort (casino) implementation framework.' },
  { id: 'japan-basic-law-gambling-addiction-2018', name: 'Basic Law on Measures Against Gambling Addiction (2018)', url: 'https://www.japaneselawtranslation.go.jp/', countries: ['JP'], category: 'gambling', region: 'asia-pacific', notes: 'Japanese addiction prevention framework for IR casinos.' },
  { id: 'korea-criminal-act-gambling', name: 'Criminal Act Articles 246–247; National Sports Promotion Act', url: 'https://law.go.kr/', countries: ['KR'], category: 'gambling', region: 'asia-pacific', notes: 'South Korean gambling prohibition with sports toto and Kangwon Land exception.' },
  { id: 'korea-tourism-promotion-act-2024', name: 'Tourism Promotion Act (amended Feb 2024)', url: 'https://law.go.kr/', countries: ['KR'], category: 'gambling', region: 'asia-pacific', notes: 'Korean casino licensing for foreign visitors; amendment February 2024.' },
  { id: 'singapore-casino-control-act-2006', name: 'Casino Control Act 2006 (as amended)', url: 'https://sso.agc.gov.sg/', countries: ['SG'], category: 'gambling', region: 'asia-pacific', notes: 'Singapore land-based casino regulation (Marina Bay Sands, Resorts World Sentosa).' },
  { id: 'philippines-ra-9160-aml', name: 'Republic Act No. 9160 (Anti-Money Laundering Act)', url: 'https://www.amlc.gov.ph/', countries: ['PH'], category: 'aml', region: 'asia-pacific', notes: 'Philippine AML law; casinos are covered institutions under AMLC.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL AFRICA
  // ════════════════════════════════════════════════════════════

  { id: 'sa-remote-gambling-bill-2024', name: 'Remote Gambling Bill, 2024 (South Africa)', url: 'https://www.gov.za/', countries: ['ZA'], category: 'gambling', region: 'africa', notes: 'Pending legislation to create a national online gambling framework. Currently in consultation.' },
  { id: 'nigeria-national-lottery-regs-2007', name: 'National Lottery Regulations, 2007 (as amended)', url: 'https://www.nlrc.gov.ng/', countries: ['NG'], category: 'gambling', region: 'africa', notes: 'Nigerian implementing regulations for the National Lottery Act.' },
  { id: 'nigeria-lagos-state-lotteries-law', name: 'Lagos State Lotteries Law, 2004 (amended 2021)', url: 'https://lslga.org/', countries: ['NG'], category: 'gambling', region: 'africa', notes: 'Lagos State — largest Nigerian gambling market by revenue. Administered by LSLGA.' },
  { id: 'nigeria-ml-act-2011', name: 'Money Laundering (Prohibition) Act, 2011 (amended 2022)', url: 'https://www.nlrc.gov.ng/', countries: ['NG'], category: 'aml', region: 'africa', notes: 'Nigerian AML framework applicable to gambling operators.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL AML
  // ════════════════════════════════════════════════════════════

  { id: 'eu-amld6-criminal-2018', name: 'AMLD6 — Directive (EU) 2018/1673 (criminal provisions)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32018L1673', countries: EEA, category: 'aml', region: 'eu-wide', notes: 'Harmonised EU criminal offences for money laundering; extends predicate offences.' },
  { id: 'eu-amld6-supervisory-2024', name: 'AMLD6 — Directive (EU) 2024/1640 (new supervisory framework)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32024L1640', countries: EU, category: 'aml', region: 'eu-wide', notes: 'New EU AML supervisory framework alongside 2024 AML Regulation. Transpose by 10 July 2027.' },
  { id: 'germany-gwg', name: 'Geldwäschegesetz (German AML Act)', url: 'https://www.gesetze-im-internet.de/gwg_2017/', countries: ['DE'], category: 'aml', region: 'europe', notes: 'German AML law imposing KYC and SAR obligations on gambling operators.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL FINANCIAL
  // ════════════════════════════════════════════════════════════

  { id: 'eu-psd3-proposal', name: 'PSD3 proposal — COM(2023) 366', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52023PC0366', countries: EU, category: 'financial', region: 'eu-wide', notes: 'Proposed Payment Services Directive 3. Provisional political agreement November 2025; formal adoption expected H1 2026.' },
  { id: 'eu-psr-proposal', name: 'Payment Services Regulation (PSR) proposal — COM(2023) 367', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52023PC0367', countries: EU, category: 'financial', region: 'eu-wide', notes: 'Companion PSR regulation to PSD3; directly applicable payment services rules.' },
  { id: 'eu-emd2', name: 'Electronic Money Directive 2 (EMD2) — Directive 2009/110/EC', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32009L0110', countries: EEA, category: 'financial', region: 'eu-wide', notes: 'Governs e-money institutions used as gambling payment intermediaries. To be merged into PSD3.' },

  // ════════════════════════════════════════════════════════════
  // ADDITIONAL DIGITAL & AI
  // ════════════════════════════════════════════════════════════

  { id: 'eu-dma', name: 'EU Digital Markets Act (DMA) — Regulation (EU) 2022/1925', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32022R1925', countries: EEA, category: 'digital', region: 'eu-wide', notes: 'Obligations on gatekeeper platforms; affects app stores and distribution channels for gambling apps.' },
  { id: 'eu-consumer-rights-directive', name: 'EU Consumer Rights Directive — Directive 2011/83/EU', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32011L0083', countries: EEA, category: 'digital', region: 'eu-wide', notes: 'Pre-contractual information, cancellation rights, and fair terms requirements for online services.' },
  { id: 'eu-unfair-commercial-practices', name: 'Unfair Commercial Practices Directive — Directive 2005/29/EC', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32005L0029', countries: EEA, category: 'digital', region: 'eu-wide', notes: 'Prohibits misleading and aggressive commercial practices; applies to gambling bonus promotions.' },
  { id: 'eu-bik-plus', name: 'EU Better Internet for Kids Strategy (BIK+)', url: 'https://digital-strategy.ec.europa.eu/en/policies/strategy-better-internet-kids', countries: EEA, category: 'digital', region: 'eu-wide', notes: 'Child online protection strategy; relevant to age verification obligations on gambling platforms.' },

  // ════════════════════════════════════════════════════════════
  // TESTING STANDARDS & INDUSTRY BODIES (Section 8)
  // ════════════════════════════════════════════════════════════

  { id: 'iso-iec-27001-2022', name: 'ISO/IEC 27001:2022 (Information Security Management)', url: 'https://www.iso.org/standard/27001', countries: ['GB','MT','DE','ES','IT','SE','US','AU'], category: 'standards', region: 'global', notes: 'International information security standard. Required or strongly recommended by MGA, UKGC, and multiple other regulators.' },
  { id: 'gli-standards', name: 'GLI Standards (GLI-19 for iGaming, GLI-11 for devices, GLI-33 for wagering)', url: 'https://gaminglabs.com/gli-standards/', countries: ['GB','MT','US','AU','CA','DE','ES','IT'], category: 'standards', region: 'global', notes: 'Gaming Laboratories International standards mandated or accepted across 480+ jurisdictions worldwide.' },
  { id: 'bmm-testlabs', name: 'BMM Testlabs certification', url: 'https://bmm.com/', countries: ['GB','MT','US','AU','CA'], category: 'standards', region: 'global', notes: 'BMM Testlabs gaming testing and certification accepted across 470+ jurisdictions.' },
  { id: 'ecogra-standards', name: 'eCOGRA standards and certification', url: 'https://ecogra.org/', countries: ['GB','MT','ES','IT','SE','US'], category: 'standards', region: 'global', notes: 'eCOGRA fair gaming and player protection certification. Accepted by UK, Malta, Spain, Italy, Sweden, US states.' },
  { id: 'ibia-standards', name: 'IBIA — International Betting Integrity Association', url: 'https://ibia.bet/', countries: ['GB','MT','AU','US','FR','DE'], category: 'standards', region: 'global', notes: 'Betting integrity monitoring body with 90+ operator members; increasingly referenced in licensing conditions.' }

];

// ── EMERGING DEVELOPMENTS ─────────────────────────────────────────────────────

const EMERGING = [
  {
    title: "Ireland's Gambling Regulation Act 2024",
    jurisdiction: 'Ireland',
    body: 'GRAI launched 5 March 2025. B2C betting licence applications opened 9 February 2026; remote operators eligible from 1 July 2026; in-person operator transition from 1 December 2026. Credit card ban, 5:30am–9pm TV/radio ad blackout, under-18 team sponsorship ban, National Gambling Exclusion Register.'
  },
  {
    title: 'EU AML Package 2024',
    jurisdiction: 'European Union',
    body: 'AMLA operational 1 July 2025. Directly applicable AML Regulation takes effect 10 July 2027 — eliminates national AMLD divergence. Direct AMLA supervision of 40 high-risk cross-border entities from January 2028.'
  },
  {
    title: "Brazil's SPA Licensing Regime",
    jurisdiction: 'Brazil',
    body: 'Fully operational January 2025. 78 licensed operators, 138 brands. .bet.br domains required. GTI-Bets tax enforcement unit active. 12% GGR tax.'
  },
  {
    title: "Curaçao's LOK Reform",
    jurisdiction: 'Curaçao',
    body: 'Effective December 2024. Master/sublicense system replaced by direct CGA licensing. 12-month transition period. Physical presence in Curaçao required for all operators.'
  },
  {
    title: "India's Online Gaming Act 2025",
    jurisdiction: 'India',
    body: 'Notified August 2025. Attempts to prohibit all online money games regardless of skill/chance distinction. Constitutional challenges pending. 28% GST on full deposit value since October 2023.'
  },
  {
    title: "Kenya's Gambling Control Act 2025",
    jurisdiction: 'Kenya',
    body: 'Enacted August 2025. Replaced 1966-era law. First formal online gambling regulation. New GRA regulator. 30% Kenyan ownership mandate. KSh 1 billion minimum capital.'
  },
  {
    title: "UK Gambling Act Review — 2025/2026 Changes",
    jurisdiction: 'United Kingdom',
    body: 'Statutory Gambling Levy in force April 2025 (replaces voluntary system). Online slot stake limits: £5 max for 25+, £2 for 18–24 (October 2024). Affordability checks rolling out to all online casino operators — full compliance required Q3 2026 (triggered at £150 net deposits within 30 days). LCCP Licence Condition 7.1.1 updated 6 April 2026: Consumer Protection from Unfair Trading Regulations 2008 replaced by Digital Markets, Competition and Consumers Act 2024. UKGC enforcement up sharply: 9,700 compliance actions in 2024/25 vs 4,200 the prior year.'
  },
  {
    title: 'EU AI Act — Phased Application',
    jurisdiction: 'European Union',
    body: 'Prohibitions from February 2025. Most obligations from August 2026. Player risk profiling, personalised marketing, and responsible gambling AI may trigger high-risk classification.'
  },
  {
    title: "Germany GGL Enforcement 2024",
    jurisdiction: 'Germany',
    body: '231 cease-and-desist proceedings in 2024. €1,000/month deposit limit. €1 maximum stake per spin. 5-second minimum spin time. DSA-aligned IP blocking amendment under consideration.'
  },
  {
    title: "Philippines POGO Ban",
    jurisdiction: 'Philippines',
    body: 'Executive Order No. 74 (November 2024) banned all Philippine Offshore Gaming Operators (POGOs) and Integrated Gaming Licensees. Operators given wind-down period.'
  },
  {
    title: "Gibraltar Gambling Act 2025",
    jurisdiction: 'Gibraltar',
    body: 'In force 1 October 2025, replacing the 2005 Act entirely. Six new licence categories (£10,000 application fee each). Marketing affiliates now require a licence. Sweepstakes and B2B operators newly in scope. New independent Gambling Appeals Tribunal. Personal accountability requirements for senior staff (similar to UK Senior Managers Regime). Expanded Commissioner powers: fines, inspections, licence suspension. 6-month transition period ended approximately April 2026.'
  },
  {
    title: "Isle of Man GSC Legislative Consolidation",
    jurisdiction: 'Isle of Man',
    body: 'The GSC is consolidating seven existing gambling acts into a single Gambling Supervision Commission Bill, expected to be enacted in 2026. New personal accountability rules allow civil penalties for key persons, controllers, and senior managers for AML/CFT contraventions. New Fitness and Propriety Framework expected summer 2026. Reforms aligned with Moneyval inspection preparation.'
  },
  {
    title: "Sweden — Complete Credit Card Gambling Ban",
    jurisdiction: 'Sweden',
    body: 'From 1 April 2026, Sweden enacted a complete ban on gambling with credit cards, overdrafts, personal loans, and buy-now-pay-later services. Sweden is the first EU member state to implement a total prohibition of credit-funded gambling, going further than earlier restrictions under the Spellagen.'
  },
  {
    title: "Malta MGA — 2025 Capital & Supervisory Reforms",
    jurisdiction: 'Malta',
    body: 'New Minimum Capital Requirements effective 2025: €40,000 for B2B licensees; €100,000 for B2C Types 1–2; cumulative cap €240,000. Operators with negative equity must restore it within 6 months (or up to 5 years under a supervised plan). New Interim Financial Reporting (IFR) requirements. MGA has shifted to a risk-based, evidence-driven regulatory model focused on game fairness, AML enforcement, sports betting integrity, and data analytics for detecting irregular activity.'
  },
  {
    title: "Finland — iGaming Market Liberalisation",
    jurisdiction: 'Finland',
    body: 'Finland is in the process of ending the Veikkaus state monopoly and opening its iGaming market to competitive licensing. The transition is being formalised in 2026. Operators targeting Finnish players should monitor the forthcoming licensing framework. Finland is an EU member state — once licensed, operators would benefit from EU mutual recognition frameworks.'
  },
];

// ── BUILD COUNTRY → REGS INDEX ────────────────────────────────────────────────

const COUNTRY_REGS = {};
REGULATIONS.forEach(reg => {
  reg.countries.forEach(iso => {
    if (!COUNTRY_REGS[iso]) COUNTRY_REGS[iso] = [];
    COUNTRY_REGS[iso].push(reg);
  });
});

// ── STATE ─────────────────────────────────────────────────────────────────────

let activeCategory = 'all';
let activeRegion = 'all';
let searchQuery = '';
let amRoot = null;

// ── INIT ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  initFilters();
  initTable();
  renderEmerging();
  // Map initialises after amCharts loads — it's loaded synchronously via CDN scripts in <head>
  initMap();
});

// ── STATS ─────────────────────────────────────────────────────────────────────

function renderStats() {
  const jurisdictions = new Set();
  REGULATIONS.forEach(r => r.countries.forEach(c => jurisdictions.add(c)));
  const desc = document.getElementById('igc-description');
  if (desc) desc.textContent = `${REGULATIONS.length} regulations across ${jurisdictions.size} jurisdictions - click any country to explore`;
  const el = document.getElementById('igc-stats');
  if (!el) return;
  el.innerHTML = `
    <div class="igc-stat">
      <span class="igc-stat-value">${REGULATIONS.length}</span>
      <span class="igc-stat-label">Regulations</span>
    </div>
    <div class="igc-stat">
      <span class="igc-stat-value">${jurisdictions.size}</span>
      <span class="igc-stat-label">Jurisdictions</span>
    </div>
    <div class="igc-stat">
      <span class="igc-stat-value">2026</span>
      <span class="igc-stat-label">Last updated</span>
    </div>
  `;
}

// ── FILTERS ───────────────────────────────────────────────────────────────────

function initFilters() {
  // Category chips
  document.getElementById('igc-category-chips').addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat;
    refreshTable();
    refreshMap();
  });

  // Region tabs
  document.getElementById('igc-region-tabs').addEventListener('click', e => {
    const btn = e.target.closest('[data-region]');
    if (!btn) return;
    document.querySelectorAll('[data-region]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeRegion = btn.dataset.region;
    refreshTable();
  });

  // Global search (above map)
  document.getElementById('igc-search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    const dbSearch = document.getElementById('igc-db-search');
    if (dbSearch) dbSearch.value = e.target.value;
    refreshTable();
    refreshMap();
  });

  // Database section search (next to region tabs)
  const dbSearch = document.getElementById('igc-db-search');
  if (dbSearch) {
    dbSearch.addEventListener('input', e => {
      searchQuery = e.target.value.trim().toLowerCase();
      const globalSearch = document.getElementById('igc-search');
      if (globalSearch) globalSearch.value = e.target.value;
      refreshTable();
      refreshMap();
    });
  }
}

// ── FILTER LOGIC ──────────────────────────────────────────────────────────────

function getFilteredRegs() {
  return REGULATIONS.filter(reg => {
    if (activeCategory !== 'all' && reg.category !== activeCategory) return false;
    if (activeRegion !== 'all' && reg.region !== activeRegion) return false;
    if (searchQuery) {
      const haystack = (reg.name + ' ' + reg.notes + ' ' + reg.countries.join(' ')).toLowerCase();
      if (!haystack.includes(searchQuery)) return false;
    }
    return true;
  });
}

// ── TABLE ─────────────────────────────────────────────────────────────────────

function initTable() {
  refreshTable();
}

function refreshTable() {
  const regs = getFilteredRegs();
  const tbody = document.getElementById('igc-table-body');
  const empty = document.getElementById('igc-table-empty');

  if (!regs.length) {
    tbody.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  tbody.innerHTML = regs.map(reg => {
    let jurisdiction;
    if (reg.region === 'eu-wide' || reg.region === 'global') {
      jurisdiction = reg.region === 'eu-wide' ? '🇪🇺 EU / EEA' : '🌐 Global';
    } else if (reg.countries.length > 3) {
      const first = reg.countries.slice(0, 2).map(c => (COUNTRY_META[c]?.flag || '') + ' ' + (COUNTRY_META[c]?.name || c)).join(', ');
      jurisdiction = `${first} +${reg.countries.length - 2} more`;
    } else {
      jurisdiction = reg.countries.map(c => (COUNTRY_META[c]?.flag || '') + ' ' + (COUNTRY_META[c]?.name || c)).join(', ');
    }

    return `<tr>
      <td>${escHtml(reg.name)}</td>
      <td>${escHtml(jurisdiction)}</td>
      <td><span class="igc-badge igc-badge-${reg.category}">${catLabel(reg.category)}</span></td>
      <td>
        <a class="igc-table-link" href="${reg.url}" target="_blank" rel="noopener noreferrer">
          <span class="material-symbols-outlined">open_in_new</span>Official
        </a>
      </td>
    </tr>`;
  }).join('');
}

// ── EMERGING ──────────────────────────────────────────────────────────────────

function renderEmerging() {
  const grid = document.getElementById('igc-emerging-grid');
  if (!grid) return;
  grid.innerHTML = EMERGING.map(item => `
    <div class="igc-emerging-card">
      <div class="igc-emerging-card-jurisdiction">${escHtml(item.jurisdiction)}</div>
      <div class="igc-emerging-card-title">${escHtml(item.title)}</div>
      <div class="igc-emerging-card-body">${escHtml(item.body)}</div>
    </div>
  `).join('');
}

// ── COUNTRY PANEL ─────────────────────────────────────────────────────────────

function showCountryPanel(isoId, countryName) {
  // amCharts uses id property from geodata which matches ISO 2-letter
  const regs = COUNTRY_REGS[isoId] || [];
  const meta = COUNTRY_META[isoId] || {};
  const panel = document.getElementById('igc-panel');
  const nameEl = document.getElementById('igc-panel-name');
  const flagEl = document.getElementById('igc-panel-flag');
  const countEl = document.getElementById('igc-panel-count');
  const bodyEl = document.getElementById('igc-panel-body');

  if (!regs.length) {
    // Country has no tracked regulations — show notice
    flagEl.textContent = meta.flag || '';
    nameEl.textContent = meta.name || countryName || isoId;
    countEl.textContent = 'No regulations tracked';
    bodyEl.innerHTML = `<p style="color:rgba(248,245,253,0.4);font-size:0.82rem;padding:0.5rem 0">
      No regulations are currently tracked for this jurisdiction in this database.
    </p>`;
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  // Group by category
  const grouped = {};
  regs.forEach(r => {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  });

  flagEl.textContent = meta.flag || '';
  nameEl.textContent = meta.name || countryName || isoId;
  countEl.textContent = `${regs.length} regulation${regs.length !== 1 ? 's' : ''} tracked`;

  const catOrder = ['gambling','aml','data','financial','digital','advertising'];
  bodyEl.innerHTML = catOrder
    .filter(cat => grouped[cat])
    .map(cat => grouped[cat].map(reg => `
      <div class="igc-reg-card">
        <div class="igc-reg-card-top">
          <span class="igc-reg-card-name">${escHtml(reg.name)}</span>
          <a class="igc-reg-card-link" href="${reg.url}" target="_blank" rel="noopener noreferrer" title="Official source">
            <span class="material-symbols-outlined">open_in_new</span>
          </a>
        </div>
        <span class="igc-badge igc-badge-${cat}">${catLabel(cat)}</span>
        ${reg.notes ? `<div class="igc-reg-card-notes">${escHtml(reg.notes)}</div>` : ''}
      </div>
    `).join('')).join('');

  panel.hidden = false;
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Close panel
document.addEventListener('click', e => {
  if (e.target.closest('#igc-panel-close')) {
    document.getElementById('igc-panel').hidden = true;
  }
});

// ── MAP ───────────────────────────────────────────────────────────────────────

function getRegCount(isoId, cat) {
  const regs = COUNTRY_REGS[isoId] || [];
  if (cat === 'all') return regs.length;
  return regs.filter(r => r.category === cat).length;
}

function countryColor(isoId) {
  const n = getRegCount(isoId, activeCategory);
  if (n === 0) return am5.color(0x1a1a24);
  if (n <= 5)  return am5.color(0x660033);
  if (n <= 15) return am5.color(0xcc0055);
  return am5.color(0xFF007F);
}

function initMap() {
  if (typeof am5 === 'undefined' || typeof am5map === 'undefined') {
    console.warn('amCharts not loaded');
    return;
  }

  const root = am5.Root.new('igc-map');
  amRoot = root;

  root.setThemes([am5themes_Animated.new(root)]);

  const chart = root.container.children.push(
    am5map.MapChart.new(root, {
      panX: 'rotateX',
      panY: 'translateY',
      projection: am5map.geoNaturalEarth1(),
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    })
  );

  // Background
  chart.chartContainer.set('background', am5.Rectangle.new(root, {
    fill: am5.color(0x0e0e13),
    fillOpacity: 1,
  }));

  const polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      exclude: ['AQ'],
    })
  );

  polygonSeries.mapPolygons.template.setAll({
    tooltipText: '{name}',
    toggleKey: 'active',
    interactive: true,
    strokeWidth: 0.5,
    stroke: am5.color(0x2a2a35),
  });

  polygonSeries.mapPolygons.template.states.create('hover', {
    stroke: am5.color(0xFF007F),
    strokeWidth: 1.5,
  });

  polygonSeries.mapPolygons.template.states.create('active', {
    stroke: am5.color(0xFF007F),
    strokeWidth: 2,
  });

  // Colour each country on first render
  polygonSeries.events.on('datavalidated', () => {
    polygonSeries.mapPolygons.each(polygon => {
      const iso = polygon.dataItem?.dataContext?.id;
      if (iso) polygon.set('fill', countryColor(iso));
    });
  });

  // Click handler
  polygonSeries.mapPolygons.template.events.on('click', e => {
    const ctx = e.target.dataItem?.dataContext;
    if (ctx) showCountryPanel(ctx.id, ctx.name);
  });

  // Store reference so we can update on filter change
  root._polygonSeries = polygonSeries;
}

function refreshMap() {
  if (!amRoot || !amRoot._polygonSeries) return;
  amRoot._polygonSeries.mapPolygons.each(polygon => {
    const iso = polygon.dataItem?.dataContext?.id;
    if (iso) polygon.set('fill', countryColor(iso));
  });
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function catLabel(cat) {
  const labels = {
    gambling: 'Gambling',
    aml: 'AML / CFT',
    data: 'Data Protection',
    financial: 'Financial',
    digital: 'Digital & AI',
    advertising: 'Advertising',
    standards: 'Standards',
  };
  return labels[cat] || cat;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
