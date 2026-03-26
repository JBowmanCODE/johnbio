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
    id: 'malta-gaming-act-2018',
    name: 'Gaming Act 2018 (Cap. 583)',
    url: 'https://legislation.mt/eli/cap/583/eng',
    countries: ['MT'],
    category: 'gambling',
    region: 'europe',
    notes: 'Consolidated Maltese gaming legislation underpinning the MGA licensing framework.'
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
    name: 'Gambling Act 2005 (Gibraltar)',
    url: 'https://www.gibraltarlaws.gov.gi/legislations/gambling-act-2005-1344',
    countries: ['GI'],
    category: 'gambling',
    region: 'europe',
    notes: 'Primary Gibraltar gambling legislation.'
  },
  {
    id: 'iom-ogra-2001',
    name: 'Online Gambling Regulation Act 2001 (OGRA)',
    url: 'https://legislation.gov.im/',
    countries: ['IM'],
    category: 'gambling',
    region: 'europe',
    notes: 'Isle of Man online gambling licensing framework.'
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
    notes: 'Dutch online gambling market opened October 2021 under KSA oversight.'
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
    notes: 'GRAI launched March 2025. B2C licenses open December 2025. Credit card ban, 5:30am–9pm TV/radio ad blackout.'
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
    notes: 'Brazil sports betting and online gaming fully operational from January 2025. 78 licensed operators holding 138 brands. .bet.br domains required.'
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
    notes: 'Replaced master/sublicense system with direct CGA licensing. All operators face 12-month transition. Physical presence in Curaçao required.'
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
    notes: 'Fully applicable December 2024. Governs crypto-asset payments including those accepted by gambling operators.'
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
    id: 'kenya-bclb-celebrity-ban-2025',
    name: 'Kenya BCLB celebrity/influencer advertising ban (May 2025)',
    url: 'https://bclb.go.ke/',
    countries: ['KE'],
    category: 'advertising',
    region: 'africa',
    notes: 'Kenya banned celebrity and influencer gambling advertising from May 2025.'
  },
  {
    id: 'india-mib-advisories',
    name: 'India MIB Advisories on online betting advertising (2022–2024)',
    url: 'https://mib.gov.in/',
    countries: ['IN'],
    category: 'advertising',
    region: 'asia-pacific',
    notes: 'Ministry of Information and Broadcasting advisories restricting online betting advertising across TV, digital and print.'
  }

];

// ── EMERGING DEVELOPMENTS ─────────────────────────────────────────────────────

const EMERGING = [
  {
    title: "Ireland's Gambling Regulation Act 2024",
    jurisdiction: 'Ireland',
    body: 'GRAI launched 5 March 2025. B2C betting license applications open December 2025, remote gaming licenses Q1 2026. Credit card ban, 5:30am–9pm TV/radio ad blackout, under-18 team sponsorship ban, National Gambling Exclusion Register.'
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
    title: "UK Gambling Act Review — Ongoing",
    jurisdiction: 'United Kingdom',
    body: 'Financial vulnerability checks at £150 net deposits (August 2024). Statutory Gambling Levy (April 2025). Mandatory deposit limits (October 2025). Wagering requirements cap 10× (January 2026).'
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

  // Search
  document.getElementById('igc-search').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    refreshTable();
  });
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
