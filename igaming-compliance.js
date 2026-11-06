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
    notes: 'Detailed operating conditions for all UK-licensed gambling operators. Recent 2026 updates include Social Responsibility Code 5.1.1 (10x maximum wagering requirement cap and ban on mixed-product promotions, in force 19 January 2026), Licence Condition 7.1.1 updated 6 April 2026 to align with the Digital Markets, Competition and Consumers Act 2024, and Phase 2 Remote Technical Standards gross deposit limit rules effective 30 September 2026.'
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
    name: 'UKGC Online Slots Stake Limits 2025',
    url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Enacted under The Gambling Act 2005 (Operating Licence Conditions) (Amendment) Regulations 2025: maximum £5 per spin/game cycle for players aged 25+ (in force 9 April 2025) and £2 per spin/game cycle for ages 18–24 (in force 21 May 2025).'
  },
  {
    id: 'uk-affordability-checks-2026',
    name: 'UKGC Financial Risk Assessments (Affordability Checks) 2026',
    url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/upcoming-changes',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Financial Risk Assessment regime. Light-touch financial vulnerability checks (SR Code 3.4.4) remain active at £150 net deposits within a rolling 30-day window (in force since 28 February 2025, following the initial £500/30-day threshold from 30 August 2024; ~95% of accounts resolve without player interruption). On 7 July 2026 the Commission announced a staged FRA rollout following its pilot (which found 97% of above-threshold customers can be assessed frictionlessly via credit reference agencies): Stage 1 applies to the largest operators at £5,000+ net deposit in a rolling 24-hour period (£2,500 for 18–24s and high-risk groups), with implementation groups convening through autumn 2026 ahead of mandatory activation; final-stage thresholds are £1,000/24h or £3,000/90d net deposits (£750/£2,000 for 18–24s). No enforcement action is taken for failure to act on an FRA during early implementation — note thresholds are net deposits, not losses.'
  },
  {
    id: 'uk-promotional-restrictions-deposit-limits-2026',
    name: 'UKGC Promotional Restrictions & Gross Deposit Limits (LCCP / RTS 2026)',
    url: 'https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'From 19 January 2026 (Social Responsibility Code 5.1.1), bonus wagering requirements are capped at 10x and mixed-product promotions combining multiple gambling verticals (such as sports betting and online casino) are prohibited. From 30 September 2026 (Phase 2 Remote Technical Standards, RTS 12), operators must offer gross deposit limits — calculated strictly on total deposits without deducting withdrawals — with at least equal prominence to any net deposit limit option.'
  },
  {
    id: 'uk-remote-gaming-duty-2026',
    name: 'UK Remote Gaming Duty Increase (Finance Act 2026)',
    url: 'https://www.gov.uk/government/collections/gambling-duties',
    countries: ['GB'],
    category: 'gambling',
    region: 'europe',
    notes: 'Effective 1 April 2026, UK Remote Gaming Duty (RGD) on online casino, slots and bingo gross gaming yield increased from 21% to 40%. A companion 25% Remote Betting Duty rate on general remote bets (excluding UK horseracing, spread betting and pool betting) is scheduled to take effect from 1 April 2027.'
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
    notes: 'Superseded by the Gibraltar Gambling Act 2025 (in force 1 April 2026).'
  },
  {
    id: 'gibraltar-gambling-act-2025',
    name: 'Gambling Act 2025 (Gibraltar)',
    url: 'https://www.gibraltarlaws.gov.gi/',
    countries: ['GI'],
    category: 'gambling',
    region: 'europe',
    notes: 'In force 1 April 2026 (Act No. 2026-04, via LN.2026/064), replacing the 2005 Act, with a 6-month transitional window running to 1 October 2026. Organises regulated activities into three core licence families — B2C Gambling Operator, B2B Gambling Operator (platforms, aggregators, software integrations and outsourced compliance/KYC/fraud/CRM), and Gambling Operator Support Services (GOSS, bringing Gibraltar-based marketing affiliates, customer-fund holders and >25% holding entities into scope) — with tiered fees under LN.2026/065 (£30,000 B2C application fee; B2B direct integration fees from £10,000; B2C annual fees £50,000–£200,000 by GGY; 0.15% gambling duty). Establishes an independent Gambling Appeals Tribunal, a Regulated Individuals regime (Part 5, modelled on the UK SMCR), and expanded Gambling Commissioner investigation, fining and suspension powers.'
  },
  {
    id: 'iom-ogra-2001',
    name: 'Online Gambling Regulation Act 2001 (OGRA)',
    url: 'https://legislation.gov.im/',
    countries: ['IM'],
    category: 'gambling',
    region: 'europe',
    notes: 'Isle of Man online gambling licensing framework. The Gambling Legislation (Amendment) Bill — amending and harmonising seven gambling acts under a unified supervisory framework — completed its passage through Tynwald on 28 April 2026 and received final Tynwald approval on 21 July 2026 alongside the Gambling (Civil Penalties) Regulations 2026. Brings into force a unified Fitness & Propriety standard, personal civil penalties for key persons, controllers and senior managers, and expanded GSC inspection powers including warrantless entry and seizure ahead of the October 2026 MONEYVAL sixth-round on-site evaluation (28 September – 9 October 2026).'
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
    id: 'finland-gambling-act-2026',
    name: 'Gambling Act (Rahapelilaki, 2026) & Lotteries Act (Arpajaislaki 1047/2001)',
    url: 'https://intermin.fi/en/projects-and-legislation/gambling-system-reform',
    countries: ['FI'],
    category: 'gambling',
    region: 'europe',
    notes: 'Approved by the Finnish Parliament on 16 December 2025 and signed by President Alexander Stubb on 16 January 2026, ending the Veikkaus online monopoly over fixed-odds betting, online casino and online slots (Veikkaus retains lotteries, scratch cards and physical gaming machines). B2C licence applications opened with the National Police Board on 1 March 2026 (€29,000 fee) and passed 70 applications by autumn 2026; the competitive market goes live on 1 July 2027 under the new Finnish Supervisory Agency (Lupa- ja valvontavirasto) at a 22% GGR tax rate. B2B software supplier applications open 1 July 2027, with mandatory B2B licensing in force from 1 July 2028.'
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
    notes: '€1,000/month cross-operator deposit limit (LUGAS), €1 max stake per spin, 5-second minimum spin time, and OASIS self-exclusion system. Formal evaluation of the 2021 Interstate Treaty runs through 31 December 2026; GGL estimates legal channelisation at ~77%. Following the Federal Administrative Court\'s March 2025 ruling (8 C 3.24) restricting ISP-blocking orders, the 16 federal states signed the Second Amending Treaty (2. GlüÄndStV 2021) in March 2026 to restore GGL\'s statutory IP-blocking and data-sharing powers, currently undergoing state parliament ratification.'
  },
  {
    id: 'netherlands-koa-2021',
    name: 'Wet Kansspelen op afstand / Remote Gambling Act (KOA)',
    url: 'https://kansspelautoriteit.nl/',
    countries: ['NL'],
    category: 'gambling',
    region: 'europe',
    notes: 'Dutch online gambling market opened October 2021 under KSA oversight. Gambling tax rose to 34.2% in January 2025 and 37.8% in January 2026. On 1 October 2026 the first five-year KOA licences expired: 8 of the original 10 2021 licensees (TOTO Online, Holland Casino, Play North/Kansino, FPO Nederland/FairPlay, Bingoal, Hillside/Bet365, NSUS Malta/GGPoker and Betent/BetCity) received five-year follow-up licences through 30 September 2031 under the tightened 2026 Policy Rules requiring mandatory exit plans (Art. 2.4), updated Wwft AML risk assessments and full integration with the KSA\'s April 2026 addiction-intervention framework.'
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
    notes: 'Austrian gambling monopoly framework managed by BMF. Reform underway: draft legislation to end the Casinos Austria (win2day) online monopoly and introduce an open multi-licence system was published in May 2026 and notified to the European Commission on 4 August 2026 under TRIS (2026/0415/AT); the initial three-month standstill period (to 5 November 2026) was extended to 7 December 2026 after Malta submitted a detailed opinion. Target market go-live is 1 October 2027. Draft terms: unlicensed operators must exit by 1 January 2027 to qualify for a licence (18-month cooling-off penalty, rising to 24 months from 2030); deposit limits €250/week (under 26) and €1,680/month (26+); and a centralised national exclusion register.'
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
    name: 'Reorganisation of Gambling Decree (Legislative Decree 41/2024)',
    url: 'https://www.adm.gov.it/',
    countries: ['IT'],
    category: 'gambling',
    region: 'europe',
    notes: 'New 9-year online licences offered at €7M each (€4M on award + €3M on launch); 3% GGR fee + 0.2% for responsible gambling. Two-stage ADM tender closed September 2025: 52 concessions awarded to 46 operators. From 13 November 2025 the use of secondary "skins" websites ended — each licensee may operate online gaming only through a single ADM-authorised domain. A new "partial" self-exclusion mechanism became operative from 1 February 2026, Sports Betting Protocol 5.0 took effect in March 2026, and ADM issued technical protocol v1.2.1 on 23 September 2026 (with ISP blocking exceeding 12,600 black-market domains). After shelving the companion land-based retail reorganisation decree in August 2026, the cabinet\'s October 2026 draft 2027 Budget (Legge di Bilancio 2027) extends expiring retail concessions for three years through 31 December 2029 and raises the land-based PREU tax by 1% on AWP slots (to 25%) and VLTs (to 9.6%) from 1 January 2027 while leaving online GGR tax rates unchanged (25.5% casino/poker/bingo; 24.5% sports betting).'
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
    notes: 'GRAI launched 5 March 2025. B2C remote betting licence applications opened 9 February 2026 and GRAI began issuing remote betting licences on 1 July 2026 (with Google Ads and major ad networks requiring GRAI certification from 1 September 2026). In-person bookmakers must transition by 1 December 2026 when legacy Revenue Commissioners licences expire; remote gaming/online casino licensing follows in 2027 and B2B supplier licensing in 2028. Includes credit card ban, 5:30am–9pm TV/radio ad blackout, and National Gambling Exclusion Register.'
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
    id: 'us-sweepstakes-bans-2025-2026',
    name: 'US State Sweepstakes-Casino Prohibitions (2025–2026)',
    url: 'https://www.infolawgroup.com/',
    countries: ['US'],
    category: 'gambling',
    region: 'americas',
    notes: 'Sweepstakes casinos are now banned or restricted by statute or enforcement in 14+ states as of November 2026. Statutory bans enacted 2025–2026 include California (AB 831, effective 1 Jan 2026), Connecticut (SB 1235), Montana (SB 555), Nevada (SB 256), New Jersey (A5447), New York (S5935A, signed 5 Dec 2025), Indiana (HB 1052, civil penalties from 1 July 2026), Louisiana (HB 883 / HB 53) and Tennessee (SB 2136, signed May 2026), Maine (LD 2007, effective 14 July 2026), and Oklahoma (SB 1589 enacted by veto override, in force 1 November 2026 as a Class C2 felony extending liability to platform providers, geolocation vendors, payment processors and media affiliates). Florida\'s Attorney General also filed civil enforcement actions against major sweepstakes operators on 19 August 2026.'
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
    name: 'iGaming Alberta Act (Bill 48, 2025) — market live July 2026',
    url: 'https://aglc.ca',
    countries: ['CA'],
    category: 'gambling',
    region: 'americas',
    notes: 'Bill 48 (iGaming Alberta Act) passed spring 2025. The regulated private market launched 13 July 2026 with 22 operator sites live on day one (including FanDuel, DraftKings, BetMGM and BetRivers), making Alberta the second Canadian province with an open market after Ontario. Alberta iGaming Corporation (AiGC) conducts market operations; AGLC regulates. Operator registration opened 13 January 2026 (~CA$200,000 combined fees); minimum age 18.'
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
    notes: 'Established Brazil\'s regulated fixed-odds sports betting and online gaming market from January 2025 under the Secretariat of Prizes and Bets (SPA/MF), generating BRL37bn (~US$7bn) in 2025 GGR across 25.2m bettors and BRL9.95bn in federal taxes (plus BRL3.4bn in Q1 2026 tax receipts and >US$3.2bn H1 2026 GGR across ~85 licensed operators). Following H1 2026 enforcement (26 licences revoked/suspended, Decree 13,033 on 24h account freezes, Ordinance 1,964/2026 on ad warnings, Ordinance 2,750/2026 on illegal payment blocking, and Public Consultation No. 3/2026 closing 9 September 2026), the framework was abruptly halted on 25 September 2026 by Provisional Measure No. 1,394/2026 (MP do Fim das Bets), which enacted a nationwide prohibition on fixed-odds betting and online casino games and extinguished all federal authorisations from 25 October 2026, subject to ongoing Congressional review and Supreme Federal Court (STF) constitutional challenges.'
  },
  {
    id: 'brazil-mp-1394-2026',
    name: 'Provisional Measure No. 1,394/2026 (MP do Fim das Bets) & SPA/MF Ordinance No. 3,005/2026',
    url: 'https://www.gov.br/fazenda/pt-br/assuntos/apostas-esportivas-e-jogos-on-line',
    countries: ['BR'],
    category: 'gambling',
    region: 'americas',
    notes: 'Issued 25 September 2026, enacting an immediate nationwide prohibition on fixed-odds sports betting and online gaming across Brazil. Required an immediate halt to customer deposits and marketing, voluntary withdrawal of player balances by 5 October 2026, platform shutdowns by 6 October 2026, and formal extinction of all ~85 federal SPA authorisations on 25 October 2026 without refund of BRL 30m licence fees (carrying penalties up to BRL 2bn per violation and daily fines of BRL 50,000 for ISPs, app stores and payment institutions that fail to block access within 48 hours). SPA/MF Ordinance No. 3,005/2026 (published 2 October 2026) sets a 15 December 2026 deadline for operators to settle remaining accounting, tax and regulatory obligations. Direct Unconstitutionality Actions (ADIs by ANJL and Anseja) before the Supreme Federal Court (STF, Justice Luiz Fux public hearings in November 2026) and Brazil\'s 60-day Congressional review window remain active.'
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
    notes: 'Replaced master/sublicense system with direct CGA licensing. Green seal mandatory; orange seal expired 15 October 2025. Physical presence in Curaçao required (local staffing compliance extended to 1 April 2027) alongside mandatory ADR and tightened T&C rules. Following unauthorized access to its legacy portal disclosed on 17 September 2026, the CGA permanently retired the old portal on 7 October 2026 and launched a new interim licensing portal on 19 October 2026 alongside updated PDF licence registries. Curaçao-based B2B gaming suppliers face a 24 December 2026 deadline to hold a direct CGA B2B licence, and revised sector-wide AML/CFT rules rolled out in November 2026.'
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
    notes: 'Foundational New Zealand gambling legislation. Online casino licensing is now governed by the Online Casino Gambling Act 2026.'
  },
  {
    id: 'nz-online-casino-gambling-act-2026',
    name: 'Online Casino Gambling Act 2026 (New Zealand)',
    url: 'https://www.legislation.govt.nz/',
    countries: ['NZ'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'In force 1 May 2026; the Online Casino Gambling Regulations 2026 followed from 3 July 2026. Licenses up to 15 online casino platforms with extraterritorial reach. Following the Expression of Interest stage (17 July – 14 August 2026; NZ$19,000 fee; NZ$7.5m minimum capital), the DIA held a 10-round ascending clock auction from 29 September to 12 October 2026 across 32 qualified bidders. Results published on 13 October 2026 saw 11 legal entities (across 10 operator groups) secure the right to apply for all 15 licence slots at a clearing price of NZ$15m per licence (capped at 3 per group: Baytree Interactive/Betway with 3 rights, Playvia Gaming/Entain with 2, Rock Swift Group with 2, SkyCity across two subsidiaries with 2, TAB New Zealand with 1, Stake with 1, Skill On Net with 1, One Casino with 1, Christchurch Online NZ with 1 and Rush Entertainment with 1). Unlicensed offshore operators must exit New Zealand by 1 December 2026 (penalties up to NZ$5m) ahead of the 2027 market launch. Credit card ban, mandatory player-set limits, and a 3.5% quarterly levy on online gambling profits.'
  },
  {
    id: 'india-meity-online-gaming-2025',
    name: 'Promotion and Regulation of Online Gaming Act, 2025 (PROGA)',
    url: 'https://www.meity.gov.in/',
    countries: ['IN'],
    category: 'gambling',
    region: 'asia-pacific',
    notes: 'PROGA received Presidential assent August 2025; the Promotion and Regulation of Online Gaming Rules, 2026 were notified on 22 April 2026 and entered into force on 1 May 2026. Establishes the Online Gaming Authority of India (OGAI). Prohibits online money games regardless of any skill/chance distinction. Constitutional challenges by Head Digital Works (A23), Clubboom 11 Sports, Bagheera Carrom and others were referred to a three-judge Supreme Court bench (led by CJI Surya Kant), listed from 21 January 2026. On 27 May 2026 the Supreme Court (State of Tamil Nadu v. Junglee Games) upheld the Tamil Nadu and Karnataka bans, confirming individual states retain concurrent power to regulate, restrict or ban online gaming alongside the federal PROGA framework - operators face state-by-state divergence on top of PROGA. The core constitutional challenge to PROGA remains pending before a three-judge bench. The same two-judge bench (Justices Pardiwala and Mahadevan) also upheld the 28% GST on the full face value of deposits for real-money games including fantasy sports (DG GST Intelligence v. Gameskraft, 27 May 2026); the tax has been in force since October 2023.'
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
    notes: 'PAGCOR authority over Philippine gambling; EO 74 (Nov 2024) banned POGOs/offshore gaming. Under PAGCOR\'s 2026 regulatory overhaul for B2B online gaming suppliers (content aggregators, game studios and platform providers), the extended mandatory accreditation deadline closed on 30 September 2026 (requiring corporate probity checks, ocular facility inspections, EGS/OGP walkthrough testing and performance cash deposits). From 1 October 2026, unaccredited B2B suppliers faced mandatory decommissioning across all PAGCOR-licensed Gaming System Administrators (GSAs).'
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
    notes: 'Assented 7 August 2025 and commenced 26 August 2025, establishing Kenya\'s first formal online gambling regulation, the Gambling Regulatory Authority (GRA), and a 30% Kenyan ownership mandate. Subsidiary regulations took effect 1 July 2026 alongside a real-time Gambling Management System. After Justice William Musyoka issued an interim stay on 20 July 2026 (HCJR/E251/2026), the High Court partially lifted the suspension on 7 August 2026 to let the GRA resume administrative, compliance and application-processing functions while keeping the stay on the contested Second Schedule (steep licensing fees, e.g. bookmaker renewals rising from KES 5,000 to up to KES 2.5m) and Third Schedule (KSh 100m minimum paid-up capital and KSh 200m security bond for online operators); a late August 2026 order then permitted provisional fee collection strictly subject to a court-ordered refund undertaking if the schedules are struck down, with final judgment deferred into autumn 2026.'
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
    notes: 'Payment Services Directive 2. SCA requirements directly impact deposit flows. Successor PSD3/PSR package: provisional political agreement reached November 2025; Council formally adopted its first-reading position on 28–29 October 2026 ahead of the European Parliament second-reading vote in December 2026.'
  },
  {
    id: 'eu-mica-2023',
    name: 'MiCA — Regulation (EU) 2023/1114 (Markets in Crypto-Assets)',
    url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32023R1114',
    countries: EU,
    category: 'financial',
    region: 'eu-wide',
    notes: 'Fully applicable December 2024. The transitional period for legacy crypto-asset service providers ended 1 July 2026 — any entity now providing crypto-asset services to EU clients without a MiCA licence is in breach of EU law. Governs crypto-asset payments including those accepted by gambling operators. iGaming operators accepting cryptocurrencies or stablecoins from EU players face additional licensing, KYC and AML obligations including blockchain transaction analysis, Source of Funds checks, real-time transaction monitoring and (for asset-referenced tokens under Art. 58) auditable 1:1 reserve backing with quarterly third-party attestations.'
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
    notes: 'Risk-based AI regulation. Prohibitions in force since February 2025; Article 50 transparency obligations in force since 2 August 2026. Under the July 2026 Digital Omnibus, high-risk (Annex III) obligations — the classification most relevant to player risk profiling and personalised marketing — are deferred to 2 December 2027 (Annex I embedded AI: 2 August 2028).'
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
  { id: 'us-me-igaming', name: 'Maine LD 1164 (Jan 2026, tribal-exclusive iGaming)', url: 'https://www.maine.gov/dps/gamb-control', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Maine tribal-exclusive online casino framework enacted January 2026 for the state\'s four Wabanaki Nations; MGCU rulemaking underway for 2027 commercial launch.' },
  { id: 'us-il-igaming-2026', name: 'Illinois HB 4797 / SB 1963 (iGaming, 2026 — pending)', url: 'https://www.ilga.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Illinois iGaming remains pending: the Internet Gaming Act (HB 4797, Rep. Edgar González Jr., and Senate companion SB 1963; 25% GGR tax, US$250,000 licence fee, up to 3 skins per licensee) and online poker bill HB 4802 stalled in committee without a floor vote. No additional US state beyond Maine (LD 1164, enacted January 2026) has joined the eight regulated iGaming markets (CT, DE, MI, NJ, PA, RI, WV and ME) in 2026 to date. Fiscal estimates project nearly US$400m in annual tax revenue at maturity.' },

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
  { id: 'us-mo-sports', name: 'Missouri Amendment 2 (2024 ballot)', url: 'https://www.mgc.dps.mo.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Missouri sports betting approved by voters in November 2024; regulated online and retail sports wagering launched 1 December 2025 under the Missouri Gaming Commission.' },
  { id: 'us-nc-sports', name: 'North Carolina HB 347 (2023)', url: 'https://www.nclottery.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'North Carolina online sports betting launched March 2024.' },
  { id: 'us-oh-sports', name: 'Ohio HB 29 (2021)', url: 'https://casinocontrol.ohio.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Ohio sports betting launched January 2023.' },
  { id: 'us-tn-sports', name: 'Tennessee Sports Gaming Act (2019)', url: 'https://www.tn.gov/swac.html', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Tennessee online-only sports betting; no retail sportsbooks.' },
  { id: 'us-vt-sports', name: 'Vermont Act 75 of 2023', url: 'https://liquorandlottery.vermont.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Vermont sports betting.' },
  { id: 'us-va-sports', name: 'Virginia HB 896/SB 384 (2020)', url: 'https://www.valottery.com', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Virginia sports betting.' },
  { id: 'us-wy-sports', name: 'Wyoming HB 133 (2021)', url: 'https://gaming.wyo.gov', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Wyoming online-only sports betting.' },
  { id: 'us-wi-sports-2026', name: 'Wisconsin Online Sports Betting Act (Act 247 / AB 601, signed 9 April 2026)', url: 'https://docs.legis.wisconsin.gov/', countries: ['US'], category: 'gambling', region: 'americas', notes: 'Online sports betting only (not online casino). Signed by Governor Tony Evers on 9 April 2026 (2025 Wisconsin Act 247), authorising hub-and-spoke mobile wagering across Wisconsin\'s 11 federally-recognised tribes contingent on renegotiation and federal BIA approval of tribal-state compacts. No state-licensed online casino games legal.' },

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

  { id: 'eu-psd3-proposal', name: 'PSD3 proposal — COM(2023) 366', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52023PC0366', countries: EU, category: 'financial', region: 'eu-wide', notes: 'Proposed Payment Services Directive 3. Provisional political agreement reached November 2025; the Council of the EU formally adopted its first-reading position on 28–29 October 2026, with the European Parliament second-reading plenary vote scheduled for 14 December 2026 and Official Journal publication expected late 2026 / January 2027 (followed by a 21-month transition period).' },
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
    body: 'GRAI launched 5 March 2025. B2C remote betting licence applications opened 9 February 2026 and GRAI began issuing remote betting licences on 1 July 2026, with major advertising platforms (including Google Ads from 1 September 2026) requiring GRAI certification for Irish gambling ads. In-person bookmakers must transition by 1 December 2026 when legacy Revenue Commissioners licences expire; remote gaming/online casino licensing follows in 2027 and B2B supplier licensing in 2028. Includes credit card ban, 5:30am–9pm TV/radio ad blackout, under-18 team sponsorship ban, and National Gambling Exclusion Register.'
  },
  {
    title: 'EU AML Package 2024 & PSD3 Progress',
    jurisdiction: 'European Union',
    body: 'AMLA operational 1 July 2025 in Frankfurt. Directly applicable AML Regulation (EU) 2024/1624 takes effect 10 July 2027 — eliminating national AMLD divergence — with direct AMLA supervision of 40 high-risk cross-border entities from January 2028. Separately, the Council of the EU formally adopted its first-reading position on the PSD3 and Payment Services Regulation (PSR) package on 28–29 October 2026 ahead of the European Parliament second-reading plenary vote on 14 December 2026.'
  },
  {
    title: "Brazil's SPA Regime & Provisional Measure 1,394/2026",
    jurisdiction: 'Brazil',
    body: 'After launching on 1 January 2025 and generating BRL37bn (~US$7bn) in 2025 GGR across 25.2m bettors, BRL9.95bn in 2025 federal taxes, BRL3.4bn in Q1 2026 tax receipts and >US$3.2bn in H1 2026 GGR across ~85 licensed operators, Brazil\'s regulated market was abruptly halted on 25 September 2026 by Provisional Measure No. 1,394/2026 (MP do Fim das Bets). Following H1/Q3 2026 tightening — 26 operator revocations/suspensions, Decree 13,033 (24-hour account freezes), Ordinance 1,964/2026 (ad warnings), Ordinance 2,750/2026 (illegal-market payment blocking) and Public Consultation No. 3/2026 (27 July – 9 September 2026) — MP 1,394/2026 enacted an immediate nationwide prohibition on fixed-odds sports betting and online gaming, halting deposits and advertising immediately, requiring customer balance withdrawals by 5 October and platform shutdowns by 6 October, and extinguishing all federal SPA authorisations on 25 October 2026 without refunding BRL 30m licence fees. SPA/MF Ordinance No. 3,005/2026 (2 October 2026) sets a 15 December 2026 deadline for operators to settle remaining accounting, tax and regulatory liabilities. Constitutional challenges (including ADI 8027 before Supreme Federal Court Justice Luiz Fux, who held a public hearing on 3 November 2026) and Congressional review within the 60-day provisional measure window remain ongoing.'
  },
  {
    title: "India's Online Gaming Act 2025 (PROGA)",
    jurisdiction: 'India',
    body: 'PROGA received Presidential assent August 2025. The implementing Promotion and Regulation of Online Gaming Rules, 2026 were notified by MeitY on 22 April 2026 and entered into force on 1 May 2026, operationalising the Act and establishing the Online Gaming Authority of India (OGAI) with powers to register social games, issue guidelines and impose penalties up to ₹2 crore. The Act prohibits all online money games regardless of skill/chance distinction. Constitutional challenges by Head Digital Works (A23), Clubboom 11 Sports, Bagheera Carrom and others were referred to a three-judge Supreme Court bench (led by CJI Surya Kant), listed from 21 January 2026. On 27 May 2026 the Supreme Court (State of Tamil Nadu v. Junglee Games, Justices Pardiwala and Mahadevan) upheld the Tamil Nadu and Karnataka bans, confirming individual states retain concurrent power to regulate, restrict or ban online gaming alongside the federal PROGA framework - operators face state-by-state divergence on top of PROGA. The core constitutional challenge to PROGA remains pending before a three-judge bench. Most major real-money operators (Dream11, MPL, PokerBaazi, Zupee) have suspended or wound down Indian operations. The same bench also upheld the 28% GST on the full face value of deposits for real-money games including fantasy sports (DG GST Intelligence v. Gameskraft, 27 May 2026).'
  },
  {
    title: "Kenya's Gambling Control Act 2025",
    jurisdiction: 'Kenya',
    body: 'Assented 7 August 2025 (Act No. 14 of 2025) and commenced 26 August 2025, replacing 1966-era law with Kenya\'s first formal online gambling framework and a 30% Kenyan ownership mandate. The Gambling Regulatory Authority (GRA) assumed authority from BCLB on 28 February 2026, and subsidiary regulations took effect on 1 July 2026 alongside a real-time Gambling Management System. After Justice William Musyoka suspended enforcement of the Licensing Regulations on 20 July 2026 (HCJR/E251/2026), the High Court partially lifted the stay on 7 August 2026, permitting the GRA to resume administrative, compliance and application-processing functions while keeping the freeze active on the contested Second Schedule (steep licensing fees, such as bookmaker renewals rising from KES 5,000 to up to KES 2.5m) and Third Schedule (KSh 100m minimum paid-up capital and KSh 200m security bond for online operators); a late August 2026 order then permitted provisional fee collection strictly subject to a court-ordered refund undertaking if the schedules are struck down, with final judgment deferred into autumn 2026.'
  },
  {
    title: "UK Gambling Act Review — 2025/2026 Changes",
    jurisdiction: 'United Kingdom',
    body: 'Statutory Gambling Levy in force 6 April 2025 (1.1% of GGY for remote operators; forecast £90–£100m/yr). Remote Gaming Duty increased from 21% to 40% of GGY on 1 April 2026 (with a 25% Remote Betting Duty on general remote bets excluding UK horseracing taking effect 1 April 2027). Online slot stake limits: £5 max for 25+ (in force 9 April 2025) and £2 for 18–24 (in force 21 May 2025). Promotional restrictions (SR Code 5.1.1, in force 19 January 2026) cap bonus wagering requirements at 10x and ban mixed-product promotions across gambling verticals. From 30 September 2026 (Phase 2 Remote Technical Standards, RTS 12), operators must offer gross deposit limits — calculated strictly on total deposits without deducting withdrawals — with at least equal prominence to any net limit option. Financial Risk Assessments: light-touch credit-reference checks remain active at £150 net deposits/30d (since 28 February 2025; ~95% frictionless), while the staged FRA rollout announced 7 July 2026 (~97% frictionless pilot rate) begins with Stage 1 for the largest operators at £5,000+ net deposit in 24h (£2,500 for 18–24s) ahead of final-stage thresholds (£1,000/24h or £3,000/90d net deposits; £750/£2,000 for 18–24s). LCCP Licence Condition 7.1.1 updated 6 April 2026 for the Digital Markets, Competition and Consumers Act 2024.'
  },
  {
    title: 'EU AI Act — Phased Application',
    jurisdiction: 'European Union',
    body: 'Prohibitions in force since February 2025, and Article 50 transparency obligations entered into force on 2 August 2026. The Digital Omnibus on AI (Regulation (EU) 2026/1744, in force 27 July 2026) defers high-risk obligations: standalone Annex III high-risk systems — the classification that would capture player risk profiling, personalised marketing and responsible gambling AI — to 2 December 2027, and Annex I embedded-product AI to 2 August 2028.'
  },
  {
    title: "Germany GGL Enforcement & 2026 Treaty Evaluation",
    jurisdiction: 'Germany',
    body: '€1,000/month cross-operator deposit limit (LUGAS), €1 maximum stake per spin, and 5-second minimum spin time. The formal five-year evaluation of the 2021 Interstate Treaty on Gambling (GlüStV 2021) runs to 31 December 2026; GGL estimates legal online channelisation at ~77%. Following the Federal Administrative Court\'s March 2025 ruling (8 C 3.24) restricting ISP-blocking orders, the 16 federal states signed the Second Amending Treaty (2. GlüÄndStV 2021) in March 2026 to restore GGL\'s statutory IP-blocking and data-sharing powers, currently undergoing state parliament ratification.'
  },
  {
    title: "Philippines POGO Ban & 2026 B2B Accreditation",
    jurisdiction: 'Philippines',
    body: 'Executive Order No. 74 (November 2024, permanently codified into law by Republic Act No. 12312 in October 2025) banned all Philippine Offshore Gaming Operators (POGOs) and Internet Gaming Licensees (IGLs). Separately, under PAGCOR\'s 2026 regulatory overhaul for online gaming B2B suppliers (content aggregators, studios and platform providers), the extended accreditation deadline closed on 30 September 2026 (requiring corporate probity checks, ocular facility inspections, EGS/OGP walkthrough testing and performance cash deposits). From 1 October 2026, unaccredited B2B suppliers faced mandatory decommissioning across all PAGCOR-licensed Gaming System Administrators (GSAs).'
  },
  {
    title: "Gibraltar Gambling Act 2025",
    jurisdiction: 'Gibraltar',
    body: 'In force 1 April 2026 (Act No. 2026-04, via LN.2026/064), replacing the 2005 Act, with a 6-month transitional window running to 1 October 2026. Organises regulated activities into three core licence families — B2C Gambling Operator, B2B Gambling Operator (platforms, aggregators, software integrations and outsourced compliance/KYC/fraud/CRM), and Gambling Operator Support Services (GOSS, bringing Gibraltar-based marketing affiliates, customer-fund holders and >25% holding entities into scope) — with tiered fees under LN.2026/065 (£30,000 B2C application fee; B2B direct integration fees from £10,000; B2C annual fees £50,000–£200,000 by GGY; 0.15% gambling duty). Establishes an independent Gambling Appeals Tribunal, a Regulated Individuals regime (Part 5, modelled on the UK SMCR), and expanded Commissioner investigation, fining and suspension powers.'
  },
  {
    title: "Isle of Man GSC Legislative Consolidation",
    jurisdiction: 'Isle of Man',
    body: 'The Gambling Legislation (Amendment) Bill — amending and harmonising seven gambling acts under a unified supervisory framework — completed its passage through Tynwald on 28 April 2026 and received final Tynwald approval on 21 July 2026 alongside the Gambling (Civil Penalties) Regulations 2026. The reforms bring into force a unified Fitness & Propriety standard, personal civil penalties for key persons, controllers and senior managers, and expanded GSC inspection powers (including warrantless entry and seizure) ahead of the October 2026 MONEYVAL sixth-round on-site evaluation (28 September – 9 October 2026).'
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
    body: 'Finland\'s new Gambling Act (Rahapelilaki) was approved by Parliament on 16 December 2025 and signed by President Alexander Stubb on 16 January 2026, ending the Veikkaus exclusive monopoly over betting, online slots and online casino games (Veikkaus retains lotteries, scratch cards and physical gaming machines). B2C licence applications opened with the National Police Board on 1 March 2026 (€29,000 application fee) and passed 70 applications by autumn 2026. The competitive market goes live on 1 July 2027 at a 22% GGR tax rate under the new Finnish Supervisory Agency (Lupa- ja valvontavirasto), with B2B software supplier applications opening 1 July 2027 and mandatory B2B licensing from 1 July 2028.'
  },
  {
    title: "Netherlands KSA — October 2026 Licence Renewals & Reforms",
    jurisdiction: 'Netherlands',
    body: 'Dutch gambling tax increased to 37.8% of GGR in January 2026 (up from 34.2% in 2025). On 1 October 2026 the initial five-year KOA licences (issued September 2021) expired: the KSA granted five-year follow-up licences through 30 September 2031 to 8 of the original 10 2021 cohort (TOTO Online, Holland Casino, Play North/Kansino, FPO Nederland/FairPlay, Bingoal, Hillside/Bet365, NSUS Malta/GGPoker and Betent/BetCity; LiveScore Bet and Tombola exited earlier). Renewal required mandatory exit plans (Art. 2.4), updated Wwft AML risk analyses, compliance track-record reviews and implementation of the April 2026 KSA addiction-intervention guidance. Existing deposit limits remain €300/month for 18–23s and €700/month for 24+, while ministerial proposals for a cross-operator deposit limit and raising the minimum age for online slots to 21 remain under consideration.'
  },
  {
    title: "Curaçao LOK — Implementation Progress",
    jurisdiction: 'Curaçao',
    body: 'LOK in force 24 December 2024, with the Curaçao Gaming Authority (CGA) replacing the Gaming Control Board (GCB) and ending the master/sublicence model (the orange transitional seal expired permanently on 15 October 2025). Following unauthorized access to its legacy online portal disclosed on 17 September 2026, the CGA permanently shut down the legacy portal on 7 October 2026 and launched an interim licensing portal on 19 October 2026 alongside updated PDF licence registries (over 615 active licences). Operators must maintain a physical presence in Curaçao (local staffing compliance extended to 1 April 2027), Curaçao-based B2B suppliers must hold a direct CGA B2B licence by 24 December 2026, and updated sector-wide AML/CFT compliance rules rolled out in November 2026.'
  },
  {
    title: "New Zealand — Online Casino Licensing & Auction Results",
    jurisdiction: 'New Zealand',
    body: 'The Online Casino Gambling Act 2026 came into force 1 May 2026, with the Online Casino Gambling Regulations 2026 following from 3 July 2026. Following the Expression of Interest stage (17 July – 14 August 2026; NZ$19,000 fee; NZ$7.5m minimum capital), the Department of Internal Affairs held a 10-round ascending clock auction from 29 September to 12 October 2026 with 32 competing bidders. Results published on 13 October 2026 saw 11 legal entities (across 10 operator groups) secure the right to apply for all 15 available online casino licence slots at a clearing price of NZ$15m per licence (capped at 3 per operator group: Baytree Interactive/Betway with 3 rights, Playvia Gaming/Entain with 2, Rock Swift Group with 2, SkyCity across two subsidiaries with 2, TAB New Zealand with 1, Stake with 1, Skill On Net with 1, One Casino with 1, Christchurch Online NZ with 1 and Rush Entertainment with 1). Successful bidders now undergo full compliance vetting ahead of the 2027 market launch, while unlicensed offshore operators must exit New Zealand by 1 December 2026 (penalties up to NZ$5m). Includes a credit card ban, mandatory player-set limits, and a 3.5% quarterly levy on online gambling profits.'
  },
  {
    title: "United States — State-Level 2026 Shifts",
    jurisdiction: 'United States',
    body: 'Eight US states have enacted real-money online casino laws: Connecticut, Delaware, Maine (LD 1164 tribal-exclusive law enacted January 2026; MGCU rulemaking underway for 2027 launch), Michigan, New Jersey, Pennsylvania, Rhode Island and West Virginia. Wisconsin Governor Tony Evers signed an online sports betting (not iGaming) bill on 9 April 2026 (Act 247 / AB 601), authorising hub-and-spoke mobile wagering across Wisconsin\'s 11 federally-recognised tribes contingent on compact renegotiation and federal BIA approval, while Illinois iGaming bills (HB 4797 / SB 1963) and New York\'s S2614 remain pending. A coordinated wave of sweepstakes casino bans has reached 14+ states: Oklahoma\'s SB 1589 (enacted by veto override) took effect on 1 November 2026 as a Class C2 felony extending liability to platform providers, geolocation vendors, payment processors and affiliates, joining statutory bans in California (AB 831, effective 1 Jan 2026), New York (S5935A, signed Dec 2025), New Jersey, Montana, Connecticut, Nevada, Indiana (HB 1052, effective 1 July 2026), Maine (LD 2007, effective 14 July 2026), Tennessee and Louisiana, alongside August 2026 Florida AG lawsuits and Illinois cease-and-desist orders. Federal/state tension over sports prediction markets continues across multiple federal appeals courts.'
  },
  {
    title: "Austria — End of the Online Monopoly",
    jurisdiction: 'Austria',
    body: 'Draft legislation to replace Austria\'s Casinos Austria (win2day) online gambling monopoly with an open multi-licence system was published in May 2026 and notified to the European Commission on 4 August 2026 under the TRIS procedure (2026/0415/AT). The initial three-month standstill period (due to end 5 November 2026) was extended to 7 December 2026 after Malta submitted a detailed opinion. Target go-live for the competitive market is 1 October 2027. Key draft terms: unlicensed operators must exit the market by 1 January 2027 to qualify for a licence (18-month cooling-off lock-out for non-compliance, rising to 24 months from 2030); statutory deposit limits of €250/week for under-26s and €1,680/month for 26+; and Austria\'s first centralised national exclusion register.'
  },
  {
    title: "Italy ADM — 2025/26 Concession Round and Online Reforms",
    jurisdiction: 'Italy',
    body: 'ADM completed its two-stage 9-year online concession tender in September 2025: 52 concessions awarded to 46 operators at €7m each (€4m on award, €3m on launch), with a 3% GGR fee plus 0.2% responsible gambling levy. From 13 November 2025 the use of secondary "skin" websites ended — each licensee may operate online gaming through a single ADM-authorised domain only. A "partial" self-exclusion mechanism became operative on 1 February 2026, Sports Betting Protocol 5.0 launched in March 2026, and ADM issued remote gaming technical protocol v1.2.1 on 23 September 2026 (with ISP blocking surpassing 12,600 black-market sites). After shelving the planned land-based retail reorganisation decree in August 2026, the cabinet\'s October 2026 draft 2027 Budget (Legge di Bilancio 2027) extends expiring retail concessions for three years through 31 December 2029 and raises the land-based PREU tax by 1% on AWP slots (to 25%) and VLTs (to 9.6%) from 1 January 2027 while leaving online GGR tax rates unchanged. Italy\'s total ban on gambling advertising under the Decreto Dignità remains in force.'
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
  initJurisdictionLinks();
  renderEmerging();
  revealFromHash();

  let mapLoadStarted = false;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  async function loadAndInitMap() {
    if (mapLoadStarted) return;
    mapLoadStarted = true;
    try {
      if (typeof am5 === 'undefined') {
        await loadScript('https://cdn.amcharts.com/lib/5/index.js');
      }
      await Promise.all([
        typeof am5map === 'undefined' ? loadScript('https://cdn.amcharts.com/lib/5/map.js') : Promise.resolve(),
        typeof am5geodata_worldLow === 'undefined' ? loadScript('https://cdn.amcharts.com/lib/5/geodata/worldLow.js') : Promise.resolve(),
        typeof am5themes_Animated === 'undefined' ? loadScript('https://cdn.amcharts.com/lib/5/themes/Animated.js') : Promise.resolve()
      ]);
      initMap();
    } catch (e) {
      console.warn('amCharts failed to load', e);
    }
  }

  ['pointermove', 'pointerenter', 'touchstart', 'scroll', 'keydown', 'click'].forEach(evt =>
    window.addEventListener(evt, loadAndInitMap, { once: true, passive: true })
  );
  window.addEventListener('load', () => {
    setTimeout(loadAndInitMap, 4000);
  });
});

// ── STATS ─────────────────────────────────────────────────────────────────────

function renderStats() {
  const el = document.getElementById('igc-stats');
  if (el && el.children.length >= 3) return;
  const jurisdictions = new Set();
  REGULATIONS.forEach(r => r.countries.forEach(c => jurisdictions.add(c)));
  const desc = document.getElementById('igc-description');
  if (desc) desc.textContent = `${REGULATIONS.length} regulations across ${jurisdictions.size} jurisdictions - click any country to explore`;
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
      const countryNames = reg.countries.map(c => COUNTRY_META[c]?.name || c).join(' ');
      const haystack = (reg.name + ' ' + reg.notes + ' ' + reg.countries.join(' ') + ' ' + countryNames).toLowerCase();
      if (!haystack.includes(searchQuery)) return false;
    }
    return true;
  });
}

// ── TABLE ─────────────────────────────────────────────────────────────────────

function initTable() {
  const tbody = document.getElementById('igc-table-body');
  if (activeCategory === 'all' && activeRegion === 'all' && !searchQuery && tbody && tbody.children.length === REGULATIONS.length) {
    return;
  }
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
  // NOTE: the block between the row-template markers is copied verbatim into
  // generate-compliance-table.py (static build). The script compares the two
  // and fails the build if they drift, so copy it across whole.
  tbody.innerHTML = regs.map(reg => {
    // row-template:start
    let jurisdiction;
    if (reg.region === 'eu-wide' || reg.region === 'global') {
      jurisdiction = reg.region === 'eu-wide' ? '🇪🇺 EU / EEA' : '🌐 Global';
    } else if (reg.countries.length > 3) {
      const first = reg.countries.slice(0, 2).map(c => (COUNTRY_META[c]?.flag || '') + ' ' + (COUNTRY_META[c]?.name || c)).join(', ');
      jurisdiction = `${first} +${reg.countries.length - 2} more`;
    } else {
      jurisdiction = reg.countries.map(c => (COUNTRY_META[c]?.flag || '') + ' ' + (COUNTRY_META[c]?.name || c)).join(', ');
    }

    return `<tr id="reg-${escHtml(reg.id)}">
      <td>
        <span class="igc-reg-name">${escHtml(reg.name)}</span>
        <span class="igc-reg-note">${escHtml(reg.notes)}</span>
      </td>
      <td>${escHtml(jurisdiction)}</td>
      <td><span class="igc-badge igc-badge-${reg.category}">${catLabel(reg.category)}</span></td>
      <td>
        <a class="igc-table-link" href="${reg.url}" target="_blank" rel="noopener noreferrer" aria-label="Official source for ${escHtml(reg.name)}">
          <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>Official
        </a>
      </td>
    </tr>`;
    // row-template:end
  }).join('');
}

// ── JURISDICTION ANCHORS + DEEP LINKS ─────────────────────────────────────────

// The jurisdiction index and its per-jurisdiction sections are static HTML,
// generated by generate-compliance-table.py, so they are never filtered out of
// the page. This only keeps the database table in step with a deep link.

function setFilters({ category = 'all', region = 'all', search = '' }) {
  activeCategory = category;
  activeRegion = region;
  searchQuery = search.trim().toLowerCase();
  document.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat === category));
  document.querySelectorAll('[data-region]').forEach(b => b.classList.toggle('active', b.dataset.region === region));
  ['igc-search', 'igc-db-search'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = search;
  });
  refreshTable();
  refreshMap();
}

function initJurisdictionLinks() {
  const section = document.getElementById('igc-jurisdictions');
  if (!section) return;
  section.addEventListener('click', e => {
    const link = e.target.closest('[data-jur-search], [data-jur-region]');
    if (!link) return;
    // The href scrolls to the table on its own - this narrows what's in it.
    setFilters({ region: link.dataset.jurRegion || 'all', search: link.dataset.jurSearch || '' });
  });
}

function revealFromHash() {
  const id = decodeURIComponent((window.location.hash || '').slice(1));
  if (!id) return;
  if (id.startsWith('reg-')) {
    const regId = id.slice(4);
    // A row hidden by the current filters can't be linked to - clear them.
    if (REGULATIONS.some(r => r.id === regId) && !getFilteredRegs().some(r => r.id === regId)) {
      setFilters({});
    }
  }
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ block: 'start' });
}

window.addEventListener('hashchange', revealFromHash);

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
    bodyEl.innerHTML = `<p style="color:rgba(248,245,253,0.68);font-size:0.82rem;padding:0.5rem 0">
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
          <a class="igc-reg-card-link" href="${reg.url}" target="_blank" rel="noopener noreferrer" title="Official source" aria-label="Official source for ${escHtml(reg.name)}">
            <span class="material-symbols-outlined" aria-hidden="true">open_in_new</span>
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

// NOTE: copied verbatim into generate-compliance-table.py -- keep in sync.
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

// NOTE: copied verbatim into generate-compliance-table.py -- keep in sync.
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
