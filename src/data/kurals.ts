import rawKuralsData from './thirukkural1330.json';
import rawChaptersData from './chapters133.json';

export type LanguageMode = 'tamil' | 'tanglish' | 'english';

export type TopicId =
  | 'leadership'
  | 'wealth'
  | 'time'
  | 'communication'
  | 'resilience'
  | 'ethics'
  | 'networking'
  | 'learning'
  | 'relationships';

export interface TopicMeta {
  id: TopicId;
  label: Record<LanguageMode, string>;
  description: Record<LanguageMode, string>;
}

export interface ChapterMeta {
  number: number;
  nameTamil: string;
  nameTanglish: string;
  nameEnglish: string;
  paalTamil: string;
  paalTanglish: string;
  paalEnglish: string;
  iyalTamil: string;
  topic: TopicId;
  start: number;
  end: number;
}

export interface LocalizedContent {
  explanation: string;
  scholarNote?: string;
  realWorldExample: string;
  lifeApplication: string;
  businessApplication: string;
  actionableTakeaway: string;
}

export interface KuralItem {
  number: number;
  adhigaramNumber: number;
  line1: string;
  line2: string;
  tanglishCouplet: string;
  englishCouplet: string;
  paal: Record<LanguageMode, string>;
  adhigaram: Record<LanguageMode, string>;
  topic: TopicId;
  content: Record<LanguageMode, LocalizedContent>;
}

interface RawKuralRecord {
  n: number;
  ch: number;
  l1: string;
  l2: string;
  tl: string;
  en: string;
  sp: string;
  mv: string;
  mk: string;
  ex: string;
}

export const TOPICS: TopicMeta[] = [
  {
    id: 'leadership',
    label: {
      tamil: 'தலைமைத்துவம் & நிர்வாகம்',
      tanglish: 'Leadership & Management',
      english: 'Leadership & Management',
    },
    description: {
      tamil: 'குழுவை வழிநடத்துதல், முடிவெடுத்தல் மற்றும் ஆட்சித் திறன் (190 குறள்கள்)',
      tanglish: 'Team lead panrathu, decision making matrum delegation skills (190 Kurals)',
      english: 'Team stewardship, decision-making, and strategic execution (190 Kurals)',
    },
  },
  {
    id: 'wealth',
    label: {
      tamil: 'பொருள் & நிதி மேலாண்மை',
      tanglish: 'Wealth & Business Finance',
      english: 'Wealth & Business Finance',
    },
    description: {
      tamil: 'வருமானம் ஈட்டுதல், முதலீடு, உழவு மற்றும் பொருளாதாரம் (100 குறள்கள்)',
      tanglish: 'Cashflow, profit margin, investment matrum smart spending (100 Kurals)',
      english: 'Capital allocation, cashflow discipline, and sustainable wealth (100 Kurals)',
    },
  },
  {
    id: 'time',
    label: {
      tamil: 'காலம், இடம் & செயல் உத்தி',
      tanglish: 'Time, Place & Strategy',
      english: 'Time, Place & Strategy',
    },
    description: {
      tamil: 'சரியான நேரம், இடம் மற்றும் வலிமை அறிந்து செயல்படுதல் (40 குறள்கள்)',
      tanglish: 'Right timing, market selection matrum strategic planning (40 Kurals)',
      english: 'Market timing, preparation before action, and positioning (40 Kurals)',
    },
  },
  {
    id: 'communication',
    label: {
      tamil: 'பேச்சுத் திறன் & தொடர்பு',
      tanglish: 'Communication & Persuasion',
      english: 'Communication & Persuasion',
    },
    description: {
      tamil: 'இனிய சொற்கள், சொல்வன்மை, அவையறிதல் மற்றும் தூது (80 குறள்கள்)',
      tanglish: 'Clear pitch, negotiation, public speaking matrum diplomacy (80 Kurals)',
      english: 'Articulate pitching, diplomacy, and high-impact speaking (80 Kurals)',
    },
  },
  {
    id: 'resilience',
    label: {
      tamil: 'மன உறுதி & விடாமுயற்சி',
      tanglish: 'Resilience & Grit',
      english: 'Resilience & Grit',
    },
    description: {
      tamil: 'ஊக்கம், ஆள்வினையுடைமை, மடியின்மை மற்றும் இடுக்கண் அழியாமை (80 குறள்கள்)',
      tanglish: 'Failure-ah face panni thirumba bounce back aagura mindset (80 Kurals)',
      english: 'Overcoming adversity, relentless effort, and mental toughness (80 Kurals)',
    },
  },
  {
    id: 'ethics',
    label: {
      tamil: 'அறம், நேர்மை & சுய ஒழுக்கம்',
      tanglish: 'Ethics & Self-Discipline',
      english: 'Ethics & Self-Discipline',
    },
    description: {
      tamil: 'ஒழுக்கம், வாய்மை, நடுவுநிலைமை, பொறையுடைமை மற்றும் நற்பண்புகள் (330 குறள்கள்)',
      tanglish: 'Trust build panrathu, discipline, patience matrum honest character (330 Kurals)',
      english: 'Trust capital, moral clarity, gratitude, and personal discipline (330 Kurals)',
    },
  },
  {
    id: 'networking',
    label: {
      tamil: 'நட்பு, குழு & கூட்டாண்மை',
      tanglish: 'Networking, Friends & Partners',
      english: 'Networking, Friends & Partners',
    },
    description: {
      tamil: 'நட்பாராய்தல், பெரியாரைத் துணைக்கோடல் மற்றும் உட்பகை அறிதல் (140 குறள்கள்)',
      tanglish: 'Right mentors, friends matrum correct partners choose panrathu (140 Kurals)',
      english: 'Choosing the right partners, mentors, and avoiding toxic alliances (140 Kurals)',
    },
  },
  {
    id: 'learning',
    label: {
      tamil: 'கல்வி, அறிவு & ஆரோக்கியம்',
      tanglish: 'Learning, Wisdom & Health',
      english: 'Learning, Wisdom & Health',
    },
    description: {
      tamil: 'கல்வி, கேள்வி, அறிவுடைமை, மெய்யுணர்தல் மற்றும் மருந்து (80 குறள்கள்)',
      tanglish: 'Fact verification, continuous upskilling matrum holistic wellness (80 Kurals)',
      english: 'First-principles thinking, continuous learning, and physical wellbeing (80 Kurals)',
    },
  },
  {
    id: 'relationships',
    label: {
      tamil: 'இல்லறம், அன்பு & உறவுகள்',
      tanglish: 'Family, Love & Relationships',
      english: 'Family, Love & Relationships',
    },
    description: {
      tamil: 'இல்வாழ்க்கை, அன்புடைமை, மக்கட்பேறு மற்றும் காமத்துப்பால் (290 குறள்கள்)',
      tanglish: 'Family harmony, emotional intelligence, empathy matrum deep bonding (290 Kurals)',
      english: 'Family harmony, emotional intelligence, affection, and life partnership (290 Kurals)',
    },
  },
];

export const CHAPTERS_133: ChapterMeta[] = rawChaptersData as ChapterMeta[];

const CHAPTER_MAP = new Map<number, ChapterMeta>(
  CHAPTERS_133.map((ch) => [ch.number, ch])
);

// Hand-crafted flagship overrides for iconic Kurals
const CURATED_OVERRIDES: Record<number, Record<LanguageMode, LocalizedContent>> = {
  1: {
    tamil: {
      explanation:
        'எழுத்துக்கள் அனைத்தும் "அ" என்ற முதல் எழுத்தை அடிப்படையாகக் கொண்டு தொடங்குகின்றன. அதுபோல இந்த உலகம் ஆதிபகவனை (மூல சக்தியை / முதல் தத்துவத்தை) அடிப்படையாகக் கொண்டு இயங்குகிறது.',
      scholarNote: 'மு.வரதராசன்: எழுத்துக்கள் எல்லாம் அகரத்தை அடிப்படையாகக் கொண்டிருக்கின்றன; அதுபோல உலகம் கடவுளை அடிப்படையாகக் கொண்டிருக்கிறது.',
      realWorldExample:
        'ஒரு பிரம்மாண்டமான கட்டிடம் எவ்வளவு உயரமாக வளர்ந்தாலும் அதன் நிலைத்தன்மை அதன் அஸ்திவாரத்தையே (Foundation) சார்ந்துள்ளது. அதுபோல எந்தவொரு வாழ்க்கையும் தொழிலும் அதன் அடிப்படைக் கொள்கையையே (Core Values) சார்ந்துள்ளது.',
      lifeApplication:
        'எந்தவொரு புதிய செயலையும் தொடங்கும் முன் நன்றியுணர்வோடும், தெளிவான அடிப்படை நோக்கத்தோடும் (First Principle) தொடங்குங்கள்.',
      businessApplication:
        'நிறுவனத்தின் Core Mission & Founding Principles தான் அதன் "அகரம்". டெக்னாலஜியும் மார்க்கெட்டும் மாறினாலும் நிறுவனத்தின் அடிப்படை நேர்மையும் நோக்கமும் மாறக்கூடாது.',
      actionableTakeaway:
        'இன்று உங்கள் நாளின் முதல் 5 நிமிடத்தை நன்றியுணர்வோடும், இன்றைய மிக முக்கிய இலக்கைத் தெளிவுபடுத்துவதிலும் தொடங்குங்கள்.',
    },
    tanglish: {
      explanation:
        'மொழியில் இருக்குற எல்லா எழுத்துக்களுக்கும் "அ" (A) தான் முதல் அடிப்படை. அதுமாதிரி இந்த உலகம் முழுக்க ஆதிபகவனை (Root Foundation / Supreme Force) அடிப்படையாக வச்சுதான் இயங்குது.',
      scholarNote: 'சாலமன் பாப்பையா: எழுத்துக்கள் எல்லாம் அகரத்தில் தொடங்குகின்றன; அதுபோல உலகம் கடவுளில் தொடங்குகிறது.',
      realWorldExample:
        'கோடி கணக்குல கோடு (Code) எழுதி ஒரு சாஃப்ட்வேர் உருவாக்கினாலும், அதோட Base Architecture ஸ்ட்ராங்கா இருந்தாதான் அந்த சிஸ்டம் கிராஷ் ஆகாம ஓடும்.',
      lifeApplication:
        'வாழ்க்கையில எவ்வளவு உயரத்துக்குப் போனாலும் உங்களுடைய அடிப்படைப் பண்புகளையும் (Roots & Gratitude) பெற்றோரையும், கற்றுக்கொடுத்தவர்களையும் மறக்காதீங்க.',
      businessApplication:
        'First-Principles Thinking: எந்த ஒரு பிசினஸ் பிரச்சனையையும் சால்வ் பண்ணும்போது மேலோட்டமா பாக்காம, அதோட அடிப்படைக் காரணம் (Root Cause / அகரம்) என்னன்னு கண்டுபிடிச்சு சால்வ் பண்ணுங்க.',
      actionableTakeaway:
        'இன்னைக்கு எந்த வேலையை ஆரம்பிச்சாலும் "இதோட அடிப்படை நோக்கம் (Why) என்ன?"ன்னு ஒரு செகண்ட் நினைச்சுப் பார்த்துட்டு ஆரம்பிங்க.',
    },
    english: {
      explanation:
        'Just as the letter "A" (Agaram) is the foundational origin of all letters in the alphabet, the Primal Divine (First Principle) is the foundational origin of the entire universe.',
      scholarNote: 'Kural #1 — Opening verse of Thirukkural (Adhigaram 1: Kadavul Vaazhththu).',
      realWorldExample:
        'Just as a 100-story skyscraper relies entirely on the integrity of its unseen bedrock foundation, every enduring human achievement rests on a clear foundational ethic.',
      lifeApplication:
        'Begin every day and every major life chapter anchored in gratitude, humility, and clarity of purpose.',
      businessApplication:
        'Anchor your organization in non-negotiable First Principles. When strategy gets complex, return to the "Agaram"—the core problem you exist to solve for your customers.',
      actionableTakeaway:
        'Start your morning today by writing down the single foundational priority that makes everything else easier.',
    },
  },
  391: {
    tamil: {
      explanation:
        'கற்கத் தகுந்த நூல்களையும் கலைகளையும் எந்தச் சந்தேகமும் பிழையும் இல்லாமல் ஆழமாகக் கற்க வேண்டும். அவ்வாறு கற்ற பிறகு, கற்ற அறிவிற்கு ஏற்ப வாழ்க்கையில் நடந்தும் காட்ட வேண்டும்.',
      scholarNote: 'சாலமன் பாப்பையா: கற்க வேண்டியவற்றைப் பிழை இல்லாமல் கற்க; கற்றபின் அதன் வழியிலேயே நடக்க.',
      realWorldExample:
        'நிதி மேலாண்மை மற்றும் ஆரோக்கியம் குறித்து 20 புத்தகங்கள் படித்த ஒருவர், நடைமுறையில் சேமிப்பே இல்லாமல் செலவு செய்தால் அவர் கற்றதால் எந்தப் பயனும் இல்லை. படித்த ஒரு விதியை நடைமுறைப்படுத்துபவரே உயர்வார்.',
      lifeApplication:
        'அதிகத் தகவல்களைச் சேகரிப்பது மட்டும் அறிவல்ல; படித்த ஒரு நல்ல விஷயத்தையாவது நம் அன்றாடப் பழக்கமாக மாற்றுவதே உண்மையான கல்வி.',
      businessApplication:
        'வெறும் சான்றிதழ்களோ (Certificates) தியரி அறிவோ வெற்றியைத் தராது. கற்றுக்கொண்ட தொழில்நுட்பத்தை ஆழமாகப் புரிந்துகொண்டு, அதை நேர்த்தியாகச் செயல்படுத்துவதே (Execution) முக்கியம்.',
      actionableTakeaway:
        'சமீபத்தில் நீங்கள் படித்த அல்லது கற்றுக்கொண்ட ஒரு விஷயத்தை இன்று வெறும் தகவலாக வைக்காமல் நடைமுறையில் செய்து பாருங்கள்.',
    },
    tanglish: {
      explanation:
        'படிக்க வேண்டிய நல்ல விஷயங்களை எந்த டவுட்டும் இல்லாம தெளிவா ஆழமா கத்துக்கணும். அப்படி கத்துக்கிட்ட பிறகு, படிச்சதுக்கு ஏத்த மாதிரி நிஜ வாழ்க்கையில நடந்தும் காட்டணும்.',
      scholarNote: 'மு.வரதராசன்: கற்கத் தகுந்த நூல்களைக் குற்றமறக் கற்க வேண்டும்; கற்ற பிறகு கற்ற கல்விக்குத் தக்கவாறு நெறியில் நிற்க வேண்டும்.',
      realWorldExample:
        'ஒருத்தர் ஃபிட்னஸ் மற்றும் கோடிங் பத்தி 50 யூடியூப் வீடியோஸ் சேவ் பண்ணி வச்சிருக்காரு, ஆனா ஒரு நாள் கூட பிராக்டிஸ் பண்ணல. வெறும் தியரி மட்டுமே வச்சுக்கிட்டு ஆக்‌ஷன் எடுக்கலைன்னா ஜீரோ ரிசல்ட்தான்.',
      lifeApplication:
        'Half-baked knowledge ஆபத்தானது. எதை கத்துக்கிட்டாலும் ரூட் லெவல்ல தெளிவா கத்துக்கோங்க; கத்துக்கிட்ட உடனே அதை உங்க பழக்கத்துல கொண்டு வாங்க.',
      businessApplication:
        'Skills & Business strategy-ல மேலோட்டமா நுனிப்புல் மேயாம, deep mastery வளர்த்துக்கோங்க. கத்துக்கிட்ட விஷயத்தை உடனே real project-ல implement பண்ணி பாருங்க.',
      actionableTakeaway:
        'இன்னைக்கு புதுசா 10 வீடியோ பாக்குறதுக்கு பதிலா, ஏற்கனவே உங்களுக்குத் தெரிஞ்ச ஒரு நல்ல பழக்கத்தை இன்னைக்கு கரெக்டா செஞ்சு முடிங்க.',
    },
    english: {
      explanation:
        'Master worthy subjects with complete clarity and zero ambiguity; once learned, embody that knowledge through disciplined action.',
      scholarNote: 'Kural #391 — Adhigaram 40: Kalvi (Learning).',
      realWorldExample:
        'An engineer watches dozens of tutorials on system architecture but never deploys a service, while a peer learns one core pattern deeply and immediately applies it to speed up production.',
      lifeApplication:
        'Knowledge without implementation is mere entertainment. Measure your learning not by how much content you consume, but by how much your daily behavior improves.',
      businessApplication:
        'Avoid superficial buzzword knowledge. Build deep, first-principles mastery of your craft and translate insights directly into operational habits and product quality.',
      actionableTakeaway:
        'Take one insight you learned this week and apply it to a concrete task today before consuming any new content.',
    },
  },
  423: {
    tamil: {
      explanation:
        'எந்தவொரு செய்தியையும் யார் சொன்னாலும்—அவர் எவ்வளவு பெரிய மனிதராக இருந்தாலும் அல்லது சாதாரண மனிதராக இருந்தாலும்—அவர் சொன்னதை அப்படியே கண்மூடித்தனமாக நம்பாமல், அதன் பின்னால் உள்ள உண்மையான பொருளை (Fact & Truth) ஆராய்ந்து அறிவதே அறிவாகும்.',
      realWorldExample:
        'சமூக வலைத்தளத்தில் பிரபலமான ஒருவர் ஒரு பங்குச்சந்தை (Stock) உடனே இரட்டிப்பாகும் என்று சொன்னதைக் கேட்டு, ஆராயாமல் முதலீடு செய்து பணத்தை இழப்பது. மாறாக அந்த நிறுவனத்தின் உண்மையான கணக்குகளை ஆராய்ந்து முடிவெடுப்பதே அறிவு.',
      lifeApplication:
        'வாட்ஸ்அப் வதந்திகள், பிறரைப் பற்றிய புறணி (Gossip) அல்லது உணர்ச்சிகரமான செய்திகளைக் கேட்கும்போது, "இதில் உண்மை என்ன?" என்று நிதானமாக ஆராயும் பழக்கத்தை வளர்த்துக் கொள்ளுங்கள்.',
      businessApplication:
        'நிறுவனத்தில் முடிவெடுக்கும்போது யார் சொல்கிறார்கள் (பதவி/அதிகாரம்) என்பதைப் பார்க்காமல், தரவுகளும் (Data) அடிப்படை உண்மையும் என்ன சொல்கின்றன என்பதை வைத்தே முடிவெடுக்க வேண்டும்.',
      actionableTakeaway:
        'இன்று நீங்கள் கேட்கும் ஒரு முக்கியத் தகவல் அல்லது ஆலோசனையை அப்படியே நம்பாமல், அதன் அடிப்படை ஆதாரம் என்ன என்று ஒருமுறை சரிபாருங்கள்.',
    },
    tanglish: {
      explanation:
        'எந்த ஒரு விஷயத்தை யார் சொன்னாலும் சரி—சொல்ற ஆளை வச்சு எடை போடாம, அதுக்குள்ள இருக்குற உண்மை (Fact) என்னன்னு ஆராய்ஞ்சு பாக்குறதுதான் உண்மையான அறிவு.',
      realWorldExample:
        'Social media-la oru influencer sonnaaru nu pinnadi irukkura fundamentals-ey paakama oru stock-la invest panni காசை இழக்கிறது. யாரு சொன்னாலும் நாமளே டேட்டாவை செக் பண்ணி உண்மையை தெரிஞ்சுக்கணும்.',
      lifeApplication:
        'Gossip, fake news, alladhu oruthar mela இன்னொருத்தர் சொல்ற புகாரை கேட்ட உடனே ரியாக்ட் பண்ணாதீங்க. அதோட root truth என்னன்னு விசாரிச்சுத் தெரிஞ்சுக்கோங்க.',
      businessApplication:
        'Business decisions எடுக்கும்போது HiPPO (Highest Paid Person’s Opinion) மட்டும் கேட்காம, ஒரு Junior நல்ல டேட்டாவோட ஒரு ஐடியா சொன்னாலும் அதோட உண்மைத் தன்மையை ஆராய்ஞ்சு ஏத்துக்கோங்க.',
      actionableTakeaway:
        'Innaiku neenga paakura ஒரு பரபரப்பான நியூஸ் அல்லது பிசினஸ் அட்வைஸை உடனே நம்பாம, "இதோட ஆதாரம் என்ன?"ன்னு 2 நிமிஷம் கிராஸ்-செக் பண்ணுங்க.',
    },
    english: {
      explanation:
        'No matter what claim you hear or the status of the person speaking it, true intelligence lies in stripping away bias and verifying the underlying truth.',
      realWorldExample:
        'Instead of blindly following a viral market tip from a celebrity investor, a discerning analyst inspects the company’s actual balance sheet and cash flow before investing.',
      lifeApplication:
        'Separate the message from the messenger. Neither dismiss a good idea because it comes from a humble source, nor accept a flawed claim simply because an authority figure said it.',
      businessApplication:
        'Cultivate a first-principles, evidence-driven culture. Evaluate proposals based on empirical data and root-cause logic rather than workplace hierarchy or market hype.',
      actionableTakeaway:
        'When presented with a strong opinion or claim today, ask "What is the primary evidence supporting this?" before acting on it.',
    },
  },
  467: {
    tamil: {
      explanation:
        'எந்தவொரு செயலையும் தொடங்குவதற்கு முன்பே அதன் சாதக பாதகங்களை நன்றாகச் சிந்தித்துத் தொடங்க வேண்டும். தொடங்கிய பிறகு "இனிமேல் யோசித்துக் கொள்ளலாம்" என்று நினைப்பது தோல்வியையும் அவமானத்தையும் தரும்.',
      realWorldExample:
        'எந்த மார்க்கெட் ஆய்வையும் செய்யாமல் உணர்ச்சிவசப்பட்டு பெரிய தொகையைக் கடனாக வாங்கி ஒரு கடையைத் திறந்துவிட்டு, வாடிக்கையாளர்கள் வராதபோது அந்த இடத்தில் வாடகை அதிகம் என்பதைப் பிறகு யோசிப்பது.',
      lifeApplication:
        'வாழ்க்கையில் பெரிய முடிவுகள் (வீடு வாங்குதல், கடன் எடுத்தல், வேலை மாறுதல்) எடுக்கும் முன் உணர்ச்சிவசப்படாமல், நிதானமாக சாதக-பாதகங்களை எழுதிப் பார்த்து முடிவெடுக்கவும்.',
      businessApplication:
        'புதிய புராடக்ட் அல்லது பிசினஸ் தொடங்கும் முன் Unit Economics மற்றும் வாடிக்கையாளர் தேவையை (Market Validation) முன்பே திட்டமிடுங்கள். இறங்கிய பின் இலக்கை மாற்றிக் கொண்டே இருந்தால் முதலீடும் நேரமும் வீணாகும்.',
      actionableTakeaway:
        'இன்று நீங்கள் எடுக்கப் போகும் முக்கிய முடிவின் 3 நன்மைகள் மற்றும் 3 ஆபத்துகளை ஒரு தாளில் எழுதிய பிறகே அடுத்த அடி எடுத்து வையுங்கள்.',
    },
    tanglish: {
      explanation:
        'Endha oru velaiyaiyum start panrathukku munnadiye nalla plan panni, pros and cons yosichu இறங்கணும். Start pannadhukku apram "paravala apram yosichukalam" nu ninaikiradhu periya loss-la kondu poi vidum.',
      realWorldExample:
        'Oru friend entha ground research-um pannama sudden-ah loan eduthu oru cafe open panraru. Open panna apram dhaan antha street-la parking-ey illa, rent ரொம்ப adhigam nu realize panraru.',
      lifeApplication:
        'Career change, EMI-la periya porul vangurathu pondra decisions edukkum bodhu avasara padama, munnadiye worst-case scenario enna nu yosinga. Once decide pannita, doubt illama full effort podunga.',
      businessApplication:
        'Project launch alladhu startup investment-ku munnadi thorough-ah feasibility study & risk analysis pannunga. Execution start aana apram basic strategy-ah மாத்திக்கிட்டே இருந்தா டீம் கன்ஃபியூஸ் ஆயிடும்.',
      actionableTakeaway:
        'Innaiku neenga start panna pora mukkiya velaiyoda top 3 risks enna nu 5 mins note pannitu apram work-ah start pannunga.',
    },
    english: {
      explanation:
        'Deliberate thoroughly on every aspect of an undertaking before committing to action. Jumping in blindly with the mindset of "figuring it out along the way" is a recipe for costly failure.',
      realWorldExample:
        'A founder signs a 3-year expensive retail lease on impulse because the interior looked great, only to discover after launch that foot traffic in that zone drops to zero on weekdays.',
      lifeApplication:
        'Before committing to major financial or personal obligations, write down the downside risks and backup plans on paper. Once you have weighed the trade-offs and decided, commit 100%.',
      businessApplication:
        'Measure twice, cut once. Validate unit economics, resource constraints, and technical risks during the planning phase so that execution can proceed at full velocity.',
      actionableTakeaway:
        'Before starting your biggest task today, spend 5 minutes listing the top 3 potential blockers and how you will handle them.',
    },
  },
  478: {
    tamil: {
      explanation:
        'நமக்கு வரும் வருமானம் (வரவு) அளவில் சிறியதாக இருந்தாலும், வெளியே செல்லும் செலவு (போக்கு) வரவை விட அதிகமாகாமல் பார்த்துக் கொண்டால் எந்தக் கெடுதலும் வராது.',
      realWorldExample:
        'மாதம் ₹1 லட்சம் சம்பாதிக்கும் ஒருவர் ₹1.15 லட்சம் கடனில் செலவழித்து நிதி நெருக்கடியில் தவிக்கிறார். ஆனால் மாதம் ₹40,000 சம்பாதிக்கும் மற்றொருவர் ₹30,000க்குள் செலவைக் கட்டுப்படுத்தி மாதம் ₹10,000 சேமித்து நிம்மதியாக வாழ்கிறார்.',
      lifeApplication:
        'உங்கள் நிம்மதியானது நீங்கள் எவ்வளவு சம்பாதிக்கிறீர்கள் என்பதை விட, வருமானத்திற்குள் எப்படிச் செலவைக் கட்டுப்படுத்துகிறீர்கள் என்பதில்தான் உள்ளது.',
      businessApplication:
        'ஸ்டார்ட்அப் மற்றும் தொழில்களில் Revenue எவ்வளவு வருகிறது என்பதை விட Burn Rate (மாதாந்திர செலவு) கட்டுக்குள் இருக்கிறதா என்பதே நிறுவனத்தின் ஆயுளைத் தீர்மானிக்கும்.',
      actionableTakeaway:
        'இன்று உங்கள் மாதாந்திர செலவுகளில் தேவையற்ற 2 சந்தாக்கள் (Subscriptions) அல்லது ஆடம்பரச் செலவுகளைக் கண்டறிந்து நிறுத்துங்கள்.',
    },
    tanglish: {
      explanation:
        'Namakku vara income (varavu) kammiya irundha kooda prachana illa; aana veliya pora expense (selavu) varava தாண்டி போகாம பாத்துக்கிட்டா எப்போவுமே நஷ்டம் வராது.',
      realWorldExample:
        'Masam 1 Lakh salary vangura oruthar show-off kaga EMI & Credit card-la 1.2 Lakhs selavu panni debt trap-la maatikiraru. Aana 45,000 vangura innoruthar 32,000-kulla selava mudichitu 13,000 save panni peaceful-ah wealth build panraru.',
      lifeApplication:
        'Lifestyle inflation-la விழாதீங்க. Salary ஏறும்போது உடனே EMI-யும் ஏத்தாம, உங்க செலவு எப்போதும் வருமானத்தை விட குறைவா இருக்குற மாதிரி budget பண்ணுங்க.',
      businessApplication:
        'Business-la Top-line revenue-ah vida Bottom-line cashflow & Burn rate ரொம்ப முக்கியம். Varavu வரதுக்கு முன்னாடியே அதிகப்படியான overhead செலவுகளை இழுத்து விடாதீங்க.',
      actionableTakeaway:
        'Innaiku unga bank statement / UPI history eduthu paathu, last 7 days-la panna unnecessary expenses enna nu check pannunga.',
    },
    english: {
      explanation:
        'Even if the inflow of wealth is modest, no harm will befall a person or enterprise so long as the outflow of expenditure never widens beyond that inflow.',
      realWorldExample:
        'A bootstrapped company with modest monthly revenue survives a market downturn effortlessly because its founders kept fixed costs lean, while heavily funded competitors collapse under massive burn rates.',
      lifeApplication:
        'Financial freedom is governed more by your spending rate than your earning rate. Guard against lifestyle creep and never let recurring expenses outpace your net take-home pay.',
      businessApplication:
        'Protect your runway and unit profitability. Tightly manage customer acquisition costs (CAC) and operational overhead so cash outflow never outstrips sustainable revenue.',
      actionableTakeaway:
        'Audit your last 30 days of personal or business expenses today and trim one recurring cost that adds no real value.',
    },
  },
  517: {
    tamil: {
      explanation:
        '"இந்தச் செயலை, இந்த வழிமுறைகளால், இந்த நபரால் சிறப்பாகச் செய்து முடிக்க முடியும்" என்பதை ஆராய்ந்து அறிந்த பிறகு, அந்தப் பொறுப்பை அவரிடம் முழுமையாக ஒப்படைத்து சுதந்திரமாகச் செயல்பட விட வேண்டும்.',
      realWorldExample:
        'திறமையான ஒரு டிசைனரை வேலைக்கு எடுத்துவிட்டு, ஒவ்வொரு சிறிய வண்ணத்தையும் மேலாளரே பக்கத்தில் நின்று மாற்றச் சொன்னால் அந்த டிசைனரின் படைப்பாற்றலும் நேரமும் வீணாகும்.',
      lifeApplication:
        'குடும்பத்தில் அல்லது குழுவில் ஒருவரிடம் ஒரு பொறுப்பைக் கொடுத்தால், அவரது திறமையை மதித்துச் செயல்பட விடுங்கள். ஒவ்வொரு நிமிடமும் குறுக்கிடுவது நம்பிக்கையைக் கெடுக்கும்.',
      businessApplication:
        'சிறந்த தலைமைத்துவம் என்பது சரியான நபரைத் தேர்ந்தெடுத்து (Hiring right), தெளிவான இலக்கைக் கொடுத்துவிட்டு, Micromanagement செய்யாமல் அவர்களுக்கு Ownership கொடுப்பதே ஆகும்.',
      actionableTakeaway:
        'இன்று உங்கள் குழுவில் அல்லது வீட்டில் ஒருவரிடம் ஒப்படைத்த வேலையில் குறுக்கிடாமல், முடிவை மட்டும் மதிப்பீடு செய்யுங்கள்.',
    },
    tanglish: {
      explanation:
        '"Indha velaiya, indha skills vachu, ivaraala கரெக்டா mudikka mudiyum" nu test panni select pannadhukku apram, antha work-ah avanga kitta full ownership-oda oppadachu free-ah work panna vidanum.',
      realWorldExample:
        'Oru startup founder top developer-ah hire pannitu, ovvoru line code-layum poi micromanage pannikitte irukaru. Last-la developer frustrate aagi resign pannidraru.',
      lifeApplication:
        'Veetla alladhu friends kooda oru event organize pannumbodhu, yaarukku endha velai varumo avanga kitta kuduthutu nambikkaiya vidunga.',
      businessApplication:
        'Hiring & Delegation-ku best golden rule idhu dhaan: 1) Task clarity, 2) Skill match, 3) Full ownership without micromanagement.',
      actionableTakeaway:
        'Innaiku oru task-ah yaaravadhu kitta delegate pannumbodhu, "enna outcome venum" nu mattum sollitu, "eppadi panrathu" ngura freedom-ah avangalukke kudunga.',
    },
    english: {
      explanation:
        'After carefully assessing what needs to be done, the tools required, and who possesses the exact competence to execute it, delegate full authority and autonomy to that individual.',
      realWorldExample:
        'A CEO hires a seasoned Marketing Director but insists on rewriting every social media caption personally, creating a bottleneck that stalls the entire product launch.',
      lifeApplication:
        'When you entrust someone in your family or circle with a responsibility, match the task to their strengths and give them the space to succeed without constant interference.',
      businessApplication:
        'True executive leverage comes from rigorous vetting upfront followed by high-trust autonomy. Hire for capability, align on the method, and eliminate micromanagement.',
      actionableTakeaway:
        'Identify one task you are currently micromanaging and hand over complete decision-making ownership to the person responsible.',
    },
  },
  619: {
    tamil: {
      explanation:
        'விதியின் காரணமாகவோ அல்லது சூழ்நிலையாலோ ஒரு செயல் நடக்காது என்று தோன்றினாலும், மனம் தளராமல் உடல் உழைப்பையும் முழு முயற்சியையும் கொடுத்தால், அந்த உழைப்பிற்கான பலன் நிச்சயம் கிடைக்கும்.',
      realWorldExample:
        'சாதாரண பின்னணியிலிருந்து வந்த ஒரு மாணவர், தனக்குப் பெரிய தொடர்புகளோ வசதியோ இல்லை என்று முடங்கிவிடாமல் தினமும் 4 மணி நேரம் கோடிங் பயிற்சி செய்து சிறந்த நிறுவனத்தில் வேலையைப் பெறுகிறார்.',
      lifeApplication:
        '"எனக்கு அதிர்ஷ்டம் இல்லை, நேரம் சரியில்லை" என்று பழியைச் சூழ்நிலை மீது போடுவதை நிறுத்துங்கள். நீங்கள் போடும் உண்மையான உழைப்பு ஒருபோதும் வீணாகாது.',
      businessApplication:
        'மார்க்கெட் மந்தமாக இருக்கும் காலத்திலும் (Downturn), தொடர்ந்து வாடிக்கையாளர் சேவையையும் தயாரிப்புத் தரத்தையும் மேம்படுத்தும் நிறுவனங்கள் நிச்சயம் பல மடங்கு முன்னேறும்.',
      actionableTakeaway:
        'நீங்கள் "நடக்காது" என்று தள்ளிப்போட்ட ஒரு இலக்கிற்கு இன்று குறைந்தது 30 நிமிட முழுமையான உழைப்பைக் கொடுங்கள்.',
    },
    tanglish: {
      explanation:
        'Luck illa, time sari illa, விதியால இது நடக்காதுன்னு தோணினா கூட, நாம போடுற உண்மையான hard work-ம் முயற்சியும் நம்ம உழைப்புக்கு ஏத்த கூலியை கண்டிப்பா கொடுக்கும்.',
      realWorldExample:
        'Oru small town-la irundhu vandha entrepreneur-ku investor backing கிடையாது. ஆனா விடாம 3 வருஷம் கஸ்டமர்களை நேரில் சந்திச்சு பிராடக்டை டெவலப் பண்ணதால, இன்னைக்கு ஒரு profitable கம்பெனியை உருவாக்கியிருக்காரு.',
      lifeApplication:
        '"Enakku mattum yen ippadi nadakkudhu, luck illa" nu feel panratha vittutu, unga கையில இருக்குற effort-ல 100% குடுங்க. உழைப்பு என்னைக்குமே உங்களைக் கைவிடாது.',
      businessApplication:
        'Market tough-ah irukkumbodhu luck-ah nambi irukkama, daily outreach, product refinement, matrum customer support-la consistent effort podunga.',
      actionableTakeaway:
        'Innaiku blame alladhu excuse solratha zero ஆக்கிட்டு, ரொம்ப கஷ்டம்னு நினைச்ச ஒரு வேலையை 30 நிமிஷம் உட்கார்ந்து கம்ப்ளீட் பண்ணுங்க.',
    },
    english: {
      explanation:
        'Even if destiny or external circumstances appear completely unfavorable, persistent and wholehearted effort will unfailingly yield the rightful reward for your labor.',
      realWorldExample:
        'An athlete recovering from an injury is told their peak days are over. Through disciplined daily rehabilitation and training, they return stronger and win the championship.',
      lifeApplication:
        'Stop attributing setbacks to bad luck or poor timing. Focus exclusively on what is within your control: your daily discipline, preparation, and consistency.',
      businessApplication:
        'In business, grit outperforms luck over a long horizon. When macroeconomic winds are unfavorable, double down on operational excellence and customer value.',
      actionableTakeaway:
        'Pick one goal where you have felt discouraged recently and put in 30 minutes of focused, uninterrupted effort today.',
    },
  },
};

// Topic-level & Adhigaram-aware structured templates so all 1,330 Kurals have deep, non-repetitive practical scenarios in all 3 languages
interface TopicPlaybookTemplate {
  realWorldExamples: Record<LanguageMode, string[]>;
  lifeApplications: Record<LanguageMode, string[]>;
  businessApplications: Record<LanguageMode, string[]>;
  takeaways: Record<LanguageMode, string[]>;
}

const TOPIC_PLAYBOOKS: Record<TopicId, TopicPlaybookTemplate> = {
  leadership: {
    realWorldExamples: {
      tamil: [
        'ஒரு நிறுவனத்தின் தலைவர் தன் குழுவினரின் கருத்தைக் கேட்டு, தரவுகளின் அடிப்படையில் தெளிவான முடிவெடுப்பதால், இக்கட்டான சூழ்நிலையிலும் அந்த நிறுவனம் வெற்றிகரமாகச் செயல்படுகிறது.',
        'புராஜெக்ட் தாமதமாகும்போது ஊழியர்களைக் குறை கூறாமல், அதன் அடிப்படைத் தடையைக் கண்டறிந்து சரியான நபரிடம் பொறுப்பை ஒப்படைக்கும் மேலாளர் குறுகிய காலத்தில் இலக்கை அடைகிறார்.',
        'வெறும் அதிகாரத்தைக் காட்டாமல் நேர்மையோடும் நடுநிலையோடும் வழிநடத்தும் ஒரு தலைவரின் கீழ் பணிபுரியும் ஊழியர்கள், தாங்களாகவே முன்வந்து கூடுதல் பொறுப்புகளை ஏற்றுக்கொள்கிறார்கள்.',
      ],
      tanglish: [
        'Oru team leader வெறும் ஆர்டர் போடுறதோடு நிறுத்தாம, டீம்ல யாருக்கு என்ன பலம்னு புரிஞ்சு பொறுப்பைக் கொடுக்குறதால, கஷ்டமான புராஜெக்ட்டும் டயத்துக்குள்ள முடியுது.',
        'கம்பெனில ஒரு பிராப்ளம் வரும்போது ஊழியர்கள் மேல பழி போடாம, சிஸ்டத்துல என்ன ஓட்டை இருக்குன்னு கண்டுபிடிச்சு சரி பண்ற மேனேஜர் டீமோட முழு மரியாதையையும் வாங்குறாரு.',
        'மத்தவங்களை பயமுறுத்தி வேலை வாங்குற பாஸை விட, நியாயமாவும் தெளிவாவும் வழிநடத்துற லீடர்கிட்ட தான் டீம் மெம்பர்ஸ் மனசார உழைப்பாங்க.',
      ],
      english: [
        'A product lead who diagnoses systemic bottlenecks calmly and delegates ownership based on proven capability turns a struggling project around ahead of schedule.',
        'Instead of ruling through fear or micromanagement, an executive establishes transparent decision criteria and empowers team leads to execute autonomously.',
        'When a crisis hits operations, a composed leader listens to front-line data first and allocates resources decisively without playing blame games.',
      ],
    },
    lifeApplications: {
      tamil: [
        'குடும்பத்திலும் சமூகத்திலும் ஒரு பொறுப்பை ஏற்கும்போது, விருப்பு வெறுப்பின்றி அனைவரின் நலனையும் கருத்தில் கொண்டு நிதானமாக முடிவெடுங்கள்.',
        'மற்றவர்களைக் குறை கூறுவதற்குப் பதிலாக, ஒரு சூழ்நிலையைச் சரிசெய்ய உங்களால் என்ன முன்முயற்சி எடுக்க முடியும் என்பதில் கவனம் செலுத்துங்கள்.',
        'உங்கள் செயல்களில் தெளிவும், கொடுத்த வாக்கைக் காப்பாற்றும் உறுதியும் இருந்தால் மற்றவர்கள் இயல்பாகவே உங்களை மதித்துப் பின்தொடர்வார்கள்.',
      ],
      tanglish: [
        'Veetlayum சரி, வெளியிலயும் சரி—ஒரு பொறுப்பை கையில எடுத்தா விருப்பு வெறுப்பு பாக்காம எல்லாருக்கும் நியாயமான முடிவா எடுங்க.',
        'மத்தவங்களைக் குறை சொல்றதை விட்டுட்டு, "இந்த சூழ்நிலையை நான் எப்படி பொறுப்பெடுத்து சரி பண்ணலாம்?"னு யோசிக்கப் பழகுங்க.',
        'சொல்லுக்கும் செயலுக்கும் வித்தியாசம் இல்லாம நீங்க உறுதியா நடந்தா, உங்களைச் சுத்தி இருக்குறவங்க தானாவே உங்க வழிகாட்டுதலைக் கேட்பாங்க.',
      ],
      english: [
        'Lead by example within your family and community: take ownership of problems early and make decisions grounded in fairness rather than emotion.',
        'When coordinating group efforts in personal life, match responsibilities to each person’s natural strengths and support them without nagging.',
        'Build personal authority through consistency—when your actions reliably match your words, trust follows naturally.',
      ],
    },
    businessApplications: {
      tamil: [
        'நிறுவன நிர்வாகத்தில் (Management) சரியான நபரைத் தேர்ந்தெடுத்தல், தெளிவான இலக்கு நிர்ணயித்தல் மற்றும் பாரபட்சமற்ற மதிப்பீடு ஆகிய மூன்றும் நிலையான வெற்றியைத் தரும்.',
        'முடிவெடுக்கும் முன் தரவுகளையும் (Data) கள நிலவரத்தையும் ஆராயுங்கள்; முடிவெடுத்த பின் தயக்கமின்றிச் செயல்படுத்துங்கள்.',
        'குழுவின் தவறுகளுக்குத் தலைவரே பொறுப்பேற்று, வெற்றியின் பெருமையைக் குழுவிற்குப் பகிர்ந்தளிப்பதே உயர்ந்த தலைமைப் பண்பு.',
      ],
      tanglish: [
        'Business Management-ல: 1) சரியான ஆளைத் தேர்ந்தெடுங்க, 2) தெளிவான Goal கொடுங்க, 3) பாரபட்சம் இல்லாம பெர்ஃபார்மன்ஸை பாராட்டுங்க.',
        'ஒரு ஸ்ட்ராட்டஜி முடிவு எடுக்குறதுக்கு முன்னாடி கிரவுண்ட் ரியாலிட்டி அண்ட் டேட்டாவை செக் பண்ணுங்க; ஒன்ஸ் முடிவு பண்ணிட்டா தயங்காம எக்ஸிகியூட் பண்ணுங்க.',
        'டீம் ஜெயிச்சா கிரெடிட்டை டீம்க்குக் கொடுங்க; தப்பு நடந்தா லீடரா பொறுப்பெடுத்து அதை எப்படி ஃபிக்ஸ் பண்ணலாம்னு வழிகாட்டுங்க.',
      ],
      english: [
        'Combine rigorous upfront planning with high-trust delegation. Audit resources, tools, timing, process, and market fit before committing capital.',
        'Build an accountable organization where feedback is objective, standards are clear, and top performers are trusted with real autonomy.',
        'Protect team morale by ruling with fairness and psychological safety rather than arbitrary authority.',
      ],
    },
    takeaways: {
      tamil: [
        'இன்று நீங்கள் எடுக்கும் ஒரு முக்கிய முடிவில் தனிப்பட்ட விருப்பு வெறுப்பை ஒதுக்கிவிட்டு, உண்மையான தரவுகளின் அடிப்படையில் செயல்படுங்கள்.',
        'இன்று உங்கள் குழுவில் அல்லது குடும்பத்தில் சிறப்பாகச் செயல்பட்ட ஒருவரைக் குறிப்பிட்டு மனதாரப் பாராட்டுங்கள்.',
        'இன்று நீங்கள் செய்ய வேண்டிய முக்கிய வேலையின் 5 அடிப்படைத் தேவைகளை (பொருள், கருவி, காலம், செயல், இடம்) சரிபார்த்துத் தொடங்குங்கள்.',
      ],
      tanglish: [
        'இன்னைக்கு நீங்க எடுக்குற ஒரு முக்கியமான முடிவுல எமோஷனைத் தள்ளி வச்சுட்டு, ஃபேக்ட்ஸ் அண்ட் டேட்டா அடிப்படையில முடிவெடுங்க.',
        'உங்க டீம்ல அல்லது வீட்டுல நல்லா வேலை செஞ்ச ஒருத்தரை கூப்பிட்டு இன்னைக்கு மனசாரப் பாராட்டுங்க.',
        'இன்னைக்கு நீங்க செய்யப்போற முக்கிய வேலையை நீங்களே எல்லாத்தையும் இழுத்துப் போட்டு செய்யாம, சரியான ஆள்கிட்ட நம்பிக்கையா பிரிச்சுக் கொடுங்க.',
      ],
      english: [
        'Make one key decision today based strictly on objective evidence and long-term impact rather than short-term convenience.',
        'Recognize one team member or family member today for their specific contribution and entrust them with greater autonomy.',
        'Audit your top priority today across resources, tools, timing, execution method, and environment before acting.',
      ],
    },
  },
  wealth: {
    realWorldExamples: {
      tamil: [
        'தொடர்ந்து தன் வருமானத்தில் 25% சேமித்து, நேர்மையான தொழிலில் முதலீடு செய்த ஒருவர், பொருளாதார நெருக்கடி காலத்திலும் யாரிடமும் கையேந்தாமல் பிறருக்கு உதவும் நிலையில் இருக்கிறார்.',
        'ஆடம்பரத்திற்காகக் கடன் வாங்கிச் செலவு செய்யாமல், வருமானத்திற்குள் வாழும் ஒரு குடும்பம் எந்த நிதி அழுத்தமும் இல்லாமல் குழந்தைகளின் கல்வியைச் சிறப்பாகக் கவனிக்கிறது.',
        'வாடிக்கையாளரை ஏமாற்றாமல் தரமான பொருளை விற்று ஈட்டிய லாபம், அந்த நிறுவனத்திற்குத் தொடர்ந்து புதிய வாடிக்கையாளர்களையும் நிலையான வளர்ச்சியையும் தருகிறது.',
      ],
      tanglish: [
        'மாதா மாதம் வர்ற வருமானத்துல கண்டிப்பா 20% சேமிச்சு முதலீடு பண்ண ஒருத்தர், திடீர்னு மெடிக்கல் எமர்ஜென்சி வந்தப்போ யார்கிட்டயும் கடன் கேட்காம சமாளிக்கிறாரு.',
        'கிரெடிட் கார்டு ஆஃபரைப் பார்த்து தேவையில்லாத பொருட்களை வாங்காம, வரவுக்குள்ள செலவு பண்ற குடும்பம் எப்பவுமே நிம்மதியா இருக்கு.',
        'கஸ்டமருக்கு நல்ல குவாலிட்டி கொடுத்து நேர்மையா சம்பாதிச்ச ஒரு பிசினஸ், மார்க்கெட்டிங் செலவே இல்லாம Word-of-Mouth மூலமா ரெண்டு மடங்கு வளருது.',
      ],
      english: [
        'A professional who consistently invests 25% of their income and avoids high-interest lifestyle debt weathers an industry layoff with complete peace of mind.',
        'A small business that prioritizes positive cash flow and fair customer value thrives for decades while flashier, over-leveraged competitors go bankrupt.',
        'By directing a portion of profits toward community welfare and employee wellbeing, a company builds unshakeable goodwill and customer loyalty.',
      ],
    },
    lifeApplications: {
      tamil: [
        'பணம் என்பது நம் சுயமரியாதையையும் சுதந்திரத்தையும் காக்கும் கருவி. அதை நேர்மையான வழியில் ஈட்டி, வீண் ஆடம்பரமின்றிப் பாதுகாத்து வளர்க்க வேண்டும்.',
        'வரவுக்கு மீறிய செலவும், சூதாட்டம்/குறுக்கு வழி முதலீடுகளும் ஒருவரின் நிம்மதியை அழித்துவிடும்; நிதானமான உழைப்பும் சேமிப்புமே நிலையானது.',
        'நீங்கள் ஈட்டும் செல்வத்தில் ஒரு சிறிய பகுதியையாவது நலிந்தவர்களுக்கு உதவப் பயன்படுத்துவது செல்வத்திற்கு உண்மையான அழகைத் தரும்.',
      ],
      tanglish: [
        'பணம் நம்ம சுயமரியாதையையும் சுதந்திரத்தையும் காப்பாத்துற ஒரு முக்கியமான கவசம். அதை நேர்மையா சம்பாதிச்சு, ஸ்மார்ட்டா சேமிச்சு வளர்க்கணும்.',
        'வரவுக்கு மீறி EMI போடுறதும், ஒரே ராத்திரியில பணக்காரன் ஆகலாம்னு குறுக்கு வழியில போறதும் நிம்மதியைக் கெடுத்துடும்.',
        'நாம சம்பாதிக்கிற பணத்துல நம்ம தேவையைப் பூர்த்தி செய்றதோட, கஷ்டப்படுறவங்களுக்கு சின்ன உதவி செய்றதுதான் அந்தச் செல்வத்துக்கே பெருமை.',
      ],
      english: [
        'Treat financial independence as the foundation of personal dignity. Earn ethically, spend below your means, and invest consistently.',
        'Avoid speculative get-rich-quick schemes and debt-fueled status symbols that erode hard-earned wealth.',
        'True prosperity is measured not only by how cleanly wealth is acquired, but also by how generously and wisely it is put to use.',
      ],
    },
    businessApplications: {
      tamil: [
        'தொழிலில் வரவு-செலவுக் கணக்கு (Cashflow & Unit Economics) மிகத் துல்லியமாக இருக்க வேண்டும்; செலவு ஒருபோதும் வருவாயைத் தாண்டக்கூடாது.',
        'உழைப்பும் உற்பத்தியுமே (Value Creation) பொருளாதாரத்தின் ஆணிவேர். வாடிக்கையாளருக்கு உண்மையான பயனைத் தரும் பொருளை உருவாக்குவதே சிறந்த பிசினஸ் மாடல்.',
        'லாபக் காலத்திலேயே எதிர்காலச் சவால்களுக்கான சேமிப்பு நிதியை (Reserve Fund) உருவாக்கி வைக்கும் நிறுவனமே எந்தச் சரிவையும் தாங்கும்.',
      ],
      tanglish: [
        'பிசினஸ்ல Cashflow தான் உயிர்நாடி. வர்ற வருமானத்தை விட செலவு (Burn rate) அதிகமாகாம எப்பவும் கண்காணிச்சுக்கிட்டே இருங்க.',
        'கஸ்டமருக்கு நிஜமாவே வேல்யூ கொடுக்குற புராடக்ட்டை உருவாக்குங்க; குறுக்கு வழியில வர்ற லாபம் நிலைக்காது.',
        'நல்ல லாபம் வரும்போதே அடுத்த 6 மாசத்துக்கான Emergency Runway Fund-ஐ எடுத்து வச்சிருக்குற கம்பெனி எந்த மந்தநிலையிலும் ஆடாம நிக்கும்.',
      ],
      english: [
        'Guard your cash flow, unit margins, and balance-sheet reserves relentlessly. Revenue is vanity, profit is sanity, and cash is reality.',
        'Anchor your business model in genuine value creation—wealth earned without harming customers or partners compounds sustainably.',
        'Maintain a disciplined capital reserve during boom cycles so your enterprise never has to beg for survival during downturns.',
      ],
    },
    takeaways: {
      tamil: [
        'இன்று நீங்கள் செய்யும் ஒவ்வொரு செலவையும் "இது தேவையா (Need) அல்லது ஆடம்பரமா (Want)?" என்று கேட்டுப் பார்த்துச் செலவிடுங்கள்.',
        'உங்கள் வருமானம் அல்லது தொழிலின் மதிப்பை உயர்த்தக்கூடிய ஒரு புதிய திறன் அல்லது வாய்ப்பில் இன்று 20 நிமிடம் முதலீடு செய்யுங்கள்.',
      ],
      tanglish: [
        'இன்னைக்கு நீங்க பண்ற ஒவ்வொரு செலவையும் "இது நிஜமாவே தேவையா (Need) இல்ல சும்மா ஆசையா (Want)?"ன்னு கேட்டுட்டு பண்ணுங்க.',
        'உங்க வருமானத்தை நேர்மையா உயர்த்த உதவுற ஒரு புது ஸ்கில் அல்லது பிசினஸ் வேலையில இன்னைக்கு 30 நிமிஷம் கவனம் செலுத்துங்க.',
      ],
      english: [
        'Before making any non-essential purchase today, pause and ask whether it genuinely serves your long-term financial freedom.',
        'Dedicate 30 minutes today to improving a revenue-generating skill, product feature, or financial budget.',
      ],
    },
  },
  time: {
    realWorldExamples: {
      tamil: [
        'பருவ காலத்தையும் மார்க்கெட் தேவையையும் துல்லியமாகக் கணித்துச் சரியான நேரத்தில் தன் தயாரிப்பை அறிமுகப்படுத்திய நிறுவனம், போட்டியாளர்களை விட எளிதாக வெற்றி பெறுகிறது.',
        'தன்னுடைய பலம் மற்றும் பலவீனத்தை உணராமல், தயாரிப்பு இல்லாமல் அவசரப்பட்டுப் பெரிய போட்டியில் இறங்கிய ஒருவர் தோல்வியைச் சந்திக்கிறார்; மாறாகத் தன்னைத் தயார்படுத்திக் கொண்டு சரியான தருணத்தில் இறங்கியவர் வெல்கிறார்.',
      ],
      tanglish: [
        'மார்க்கெட்ல கஸ்டமருக்கு எப்போ தேவை அதிகமா இருக்கும்னு கணிச்சு, கரெக்டா அந்த சீசன்ல புராடக்ட்டை லான்ச் பண்ண கம்பெனி சூப்பர் ஹிட் அடிக்குது.',
        'தன்னோட பலம் என்ன, எதிராளியோட பலம் என்னன்னு தெரியாம அவசரப்பட்டு இறங்குறதை விட, பொறுமையா தயாராகி கரெக்ட் டைம்ல அடிச்சா வெற்றி நிச்சயம்.',
      ],
      english: [
        'A startup waits quietly while building a rock-solid product and launches precisely when regulatory changes create urgent market demand.',
        'By realistically assessing its own bandwidth and choosing a focused local market first, a small team defeats a giant competitor on home turf.',
      ],
    },
    lifeApplications: {
      tamil: [
        'வாழ்க்கையில் வேகத்தை விட விவேகமான திட்டமிடலும், சரியான நேரத்தைத் தேர்ந்தெடுப்பதும் மிக முக்கியம். அவசர முடிவுகளைத் தவிர்க்கவும்.',
        'உங்கள் சக்திக்கும் தகுதிக்கும் ஏற்ற இலக்குகளைப் படிப்படியாக நிர்ணயித்து, சரியான சூழ்நிலையில் முழு பலத்தோடு செயல்படுங்கள்.',
      ],
      tanglish: [
        'எல்லா நேரத்துலயும் வேகமா ஓடுறது முக்கியம் இல்ல; எப்போ நிதானமாத் தயாராகணும், எப்போ வேகமா அடிச்சு ஆடணும்னு தெரிஞ்சு செயல்படுங்க.',
        'உங்க பலம் (Strength) என்ன, பலவீனம் என்னன்னு நேர்மையாத் தெரிஞ்சுக்கிட்டு அதுக்கு ஏத்த மாதிரி பிளான் பண்ணுங்க.',
      ],
      english: [
        'Patience is strategic preparation, not passivity. Know when to conserve energy and prepare, and when to strike with full commitment.',
        'Assess your current capacity honestly before taking on new commitments so you never overextend yourself.',
      ],
    },
    businessApplications: {
      tamil: [
        'Market Timing, Positioning (இடனறிதல்) மற்றும் SWOT Analysis (வலியறிதல்) ஆகிய மூன்றும் எந்தவொரு தொழில் வியூகத்திற்கும் அடிப்படை.',
        'எல்லா மார்க்கெட்டிலும் ஒரே நேரத்தில் இறங்கிப் பணத்தைச் சிதறடிக்காமல், உங்களுக்குச் சாதகமான களத்தைத் (Stronghold Niche) தேர்ந்தெடுத்து முதலில் வெல்லுங்கள்.',
      ],
      tanglish: [
        'SWOT Analysis (வலியறிதல்) + Market Timing (காலமறிதல்) + Niche Positioning (இடனறிதல்) — இந்த மூணும்தான் பிசினஸ் ஸ்ட்ராட்டஜியோட அஸ்திவாரம்.',
        'பெரிய போட்டியாளர்களோட அவங்க இடத்துல போய் மோதுறதை விட, உங்களுக்கு பலமான Niche மார்க்கெட்டைப் பிடிச்சு அதுல நம்பர் 1 ஆகுங்க.',
      ],
      english: [
        'Master the triad of strategic execution: Know your capacity (Valiyaridhal), know your timing (Kaalamaridhal), and know your arena (Idanaridhal).',
        'Dominate a focused beachhead market where your strengths give you an unfair advantage before expanding broadly.',
      ],
    },
    takeaways: {
      tamil: [
        'இன்று செய்ய வேண்டிய மிக முக்கியமான வேலையைத் தள்ளிப்போடாமல், அதற்கான சரியான நேரத்தை இப்போதே காலண்டரில் ஒதுக்குங்கள்.',
      ],
      tanglish: [
        'இன்னைக்கு நீங்க முடிக்க வேண்டிய முக்கியமான வேலையை தள்ளிப்போடாம, உங்க எனர்ஜி பீக்ல இருக்குற நேரத்துல ஃபர்ஸ்ட் வேலையா முடிங்க.',
      ],
      english: [
        'Block out 45 minutes of uninterrupted peak-energy time today for your highest-leverage strategic task.',
      ],
    },
  },
  communication: {
    realWorldExamples: {
      tamil: [
        'கோபமாகப் பேசும் வாடிக்கையாளரிடம் பதிலுக்குக் கோபப்படாமல், கனிவான சொற்களாலும் தெளிவான விளக்கத்தாலும் பேசிய ஊழியர் அந்த வாடிக்கையாளரை நிறுவனத்தின் நிரந்தர நண்பராக மாற்றுகிறார்.',
        'ஒரு கூட்டத்தில் மணிக்கணக்கில் வளவளவென்று பேசாமல், சபையின் மனநிலையை அறிந்து மூன்றே நிமிடங்களில் முக்கியக் கருத்துக்களை ஆணித்தரமாகப் பேசியவர் அனைவரின் பாராட்டையும் பெறுகிறார்.',
      ],
      tanglish: [
        'ரொம்ப கோபமா கம்ப்ளைண்ட் பண்ண கஸ்டமர்கிட்ட தன்மையா இனிமையான வார்த்தைகளால பேசி பிராப்ளத்தை சால்வ் பண்ணதால, அவரே கம்பெனிக்கு 5-ஸ்டார் ரெவியூ கொடுக்குறாரு.',
        'மீட்டிங்ல சுத்தி வளைச்சுப் பேசாம, அங்க இருக்குறவங்க லெவலுக்கு ஏத்த மாதிரி ஷார்ட் அண்ட் ஸ்வீட்டா பாயிண்ட்டை சொன்னவரோட ஐடியா உடனே செலக்ட் ஆகுது.',
      ],
      english: [
        'By responding to an angry client with calm empathy and concise facts, an account manager turns an escalating dispute into a contract renewal.',
        'In an executive briefing, a manager reads the room and delivers a crisp three-point summary instead of a 40-slide monologue, winning immediate approval.',
      ],
    },
    lifeApplications: {
      tamil: [
        'இனிய சொற்கள் இருக்கும்போது கடுமையான சொற்களைப் பயன்படுத்துவது, கனி இருக்கும்போது காயைப் பறித்து உண்பதற்குச் சமம். எப்போதும் கனிவாகவும் பயனுள்ளவற்றையும் பேசுங்கள்.',
        'மற்றவர்களைப் பற்றிப் புறம் பேசுவதையும் (Backbiting), பயனில்லாத வீண் பேச்சுக்களையும் தவிர்ப்பது உங்கள் மரியாதையைப் பல மடங்கு உயர்த்தும்.',
      ],
      tanglish: [
        'நல்ல கனிவான வார்த்தைகள் இருக்கும்போது எதுக்கு கடுமையாப் பேசி மனசைக் காயப்படுத்தணும்? எப்பவும் இனிமையாவும் தெளிவாவும் பேசுங்க.',
        'ஒருத்தர் இல்லாதப்போ அவங்களைப் பத்திப் புறம் பேசுறதையும், பிரயோஜனம் இல்லாத வெட்டிப் பேச்சையும் தவிர்த்தாலே உங்க மரியாதை பல மடங்கு உயரும்.',
      ],
      english: [
        'Choose gracious, constructive words over harshness. Why reach for bitter unripe fruit when sweet ripe fruit is right in front of you?',
        'Eliminate gossip, backbiting, and empty chatter from your daily speech; let every word carry warmth and value.',
      ],
    },
    businessApplications: {
      tamil: [
        'பிசினஸ் கம்யூனிகேஷனில் 3 விதிகள்: 1) கேட்பவரின் நிலை அறிந்து பேசுதல் (அவையறிதல்), 2) சுருக்கமாகவும் தெளிவாகவும் பேசுதல் (சொல்வன்மை), 3) உடல்மொழி மற்றும் குறிப்பறிந்து பேசுதல்.',
        'உங்கள் குழுவிலும் வாடிக்கையாளர்களிடமும் கனிவான, மரியாதையான தகவல் தொடர்பைப் பின்பற்றுவது Brand Goodwill-ஐ வளர்க்கும்.',
      ],
      tanglish: [
        'Business Communication-ல 3 முக்கிய விதிகள்: 1) Know your audience (அவையறிதல்), 2) Be concise & impactful (சொல்வன்மை), 3) Read non-verbal cues (குறிப்பறிதல்).',
        'மெயில், மெசேஜ், மீட்டிங் எல்லாத்துலயும் தேவையில்லாத வார்த்தைகளைக் குறைச்சுட்டு, தெளிவாவும் மரியாதையாவும் கம்யூனிகேட் பண்ணுங்க.',
      ],
      english: [
        'Master executive communication: read your audience, structure your points with unmistakable clarity, and never waste words.',
        'Pay close attention to non-verbal cues and unspoken context during negotiations and client meetings.',
      ],
    },
    takeaways: {
      tamil: [
        'இன்று பேசும் ஒவ்வொரு உரையாடலிலும் கடுமையான வார்த்தைகளைத் தவிர்த்து, சுருக்கமாகவும் கனிவாகவும் பேசுங்கள்.',
      ],
      tanglish: [
        'இன்னைக்கு யார்கிட்ட பேசினாலும் கடுமையான வார்த்தையைத் தவிர்த்துட்டு, சுருக்கமாவும் கனிவாவும் பாயிண்ட்டை மட்டும் பேசுங்க.',
      ],
      english: [
        'In every message and conversation today, pause before speaking to ensure your words are both kind and concise.',
      ],
    },
  },
  resilience: {
    realWorldExamples: {
      tamil: [
        'தொடர்ந்து மூன்று முறை தொழிலில் நஷ்டம் ஏற்பட்டபோதும் சோம்பலோ விரக்தியோ அடையாமல், தன் தவறுகளைத் திருத்திக்கொண்டு விடாமுயற்சியுடன் உழைத்தவர் நான்காவது முயற்சியில் பெரும் வெற்றி பெறுகிறார்.',
        'சவால்கள் வரும்போது மனம் உடையாமல் புன்னகையுடன் அதை எதிர்கொள்ளும் ஒருவர், தன் குடும்பத்திற்கும் குழுவிற்கும் மிகப்பெரிய நம்பிக்கையாகத் திகழ்கிறார்.',
      ],
      tanglish: [
        'தொடர்ந்து தோல்விகள் வந்தாலும் சோர்ந்து உட்காராம, ஒவ்வொரு தோல்வியில இருந்தும் பாடம் கத்துக்கிட்டு விடாம முயற்சி பண்ண ஒருத்தர் பெரிய வெற்றியைத் தொடுறாரு.',
        'கஷ்டமான நேரம் வரும்போது புலம்பாம, சுறுசுறுப்பாவும் பாசிட்டிவ் மனநிலையோடும் போராடுறவங்க எந்த சவாலையும் ஈஸியா தாண்டிடுவாங்க.',
      ],
      english: [
        'After losing a major client, a resilient founder refuses to sink into lethargy, rallies the team with renewed energy, and closes three new accounts within a month.',
        'An individual facing personal hardship maintains disciplined daily habits and inner composure, turning a setback into a stepping stone.',
      ],
    },
    lifeApplications: {
      tamil: [
        'சோம்பலை (மடி) முற்றிலும் தவிர்த்து, மனதில் எப்போதும் உயர்ந்த ஊக்கத்தையும் விடாமுயற்சியையும் கொண்டிருங்கள்.',
        'துன்பம் வரும்போது துவண்டு போவது இயல்பு; ஆனால் அதைப் புன்னகையோடும் மன உறுதியோடும் எதிர்கொள்பவரே வாழ்க்கையில் உயர்வார்.',
      ],
      tanglish: [
        'சோம்பேறித்தனத்தையும் (Procrastination) தள்ளிப்போடுற பழக்கத்தையும் இன்னைக்கே மூட்டை கட்டி வைங்க; மனசுல எப்பவும் உற்சாகத்தோடு இருங்க.',
        'கஷ்டம் வரும்போது துவண்டு போகாம, மன உறுதியோடு போராடுனா விதியையே நம்ம உழைப்பால மாத்தி எழுத முடியும்.',
      ],
      english: [
        'Banish procrastination and sluggishness; protect your inner fire and optimism regardless of external circumstances.',
        'Meet adversity with composed resolve—persistent effort systematically overcomes even the toughest odds.',
      ],
    },
    businessApplications: {
      tamil: [
        'தொழிலில் பின்னடைவுகள் வரும்போது தளராத ஊக்கமும் (Grit), தாமதமில்லாத சுறுசுறுப்புமே (Bias for Action) நிறுவனத்தைக் கரை சேர்க்கும்.',
        'உங்கள் நிறுவனத்தின் கௌரவத்தையும் தரத்தையும் (மானம் & பெருமை) எந்த நெருக்கடியிலும் விட்டுக்கொடுக்காமல் பாதுகாக்கவும்.',
      ],
      tanglish: [
        'பிசினஸ்ல ஏற்ற இறக்கம் சகஜம். ஆனா எந்த சூழ்நிலையிலும் தளராத விடாமுயற்சியும் (Grit), வேகமான செயல்பாடும் (Zero Laziness) தான் உங்களை ஜெயிக்க வைக்கும்.',
        'கஷ்ட காலத்துலயும் உங்க பிராண்டோட தரம் மற்றும் சுயமரியாதையை விட்டுக்கொடுக்காம உறுதியா நில்லுங்க.',
      ],
      english: [
        'Cultivate institutional grit and a bias for action. Sluggishness and delay silently erode competitive advantage.',
        'Uphold high standards and composure during market storms—resilient teams outlast every downturn.',
      ],
    },
    takeaways: {
      tamil: [
        'சோம்பல் காரணமாக நீங்கள் தள்ளிப்போட்டு வந்த ஒரு வேலையை இன்றே தொடங்கி முதல் பகுதியை முடித்துவிடுங்கள்.',
      ],
      tanglish: [
        'சோம்பேறித்தனத்தால நீங்க தள்ளிப்போட்டு வச்சிருந்த ஒரு முக்கியமான வேலையை இன்னைக்கே கையில எடுத்து முடிச்சுடுங்க.',
      ],
      english: [
        'Conquer procrastination today by tackling the single task you have been avoiding first thing right now.',
      ],
    },
  },
  ethics: {
    realWorldExamples: {
      tamil: [
        'யாரும் கவனிக்காத நேரத்திலும் வாடிக்கையாளரின் பணத்தையோ பொருளின் தரத்தையோ சமரசம் செய்யாத ஒரு ஊழியர், நிறுவனத்தின் மிக நம்பிக்கைக்குரிய தலைவராக உயர்கிறார்.',
        'தன் மீது தவறு செய்தவரையும் பழிவாங்க நினைக்காமல் பொறுமையோடும் பெருந்தன்மையோடும் நடத்தும் ஒருவர், எதிரியையும் நண்பராக மாற்றுகிறார்.',
      ],
      tanglish: [
        'யாரும் பாக்காத நேரத்துலயும் கணக்கு வழக்குல 100% நேர்மையா இருக்குற ஒருத்தர் மேல கம்பெனிக்கும் கஸ்டமர்களுக்கும் அசைக்க முடியாத நம்பிக்கை வருது.',
        'கோபப்பட வேண்டிய இடத்துல நிதானத்தோடும், பொறாமை இல்லாமலும் நடந்துக்குற ஒருத்தருக்கு வாழ்க்கையில எப்பவுமே மன நிம்மதி நிலைச்சு நிக்குது.',
      ],
      english: [
        'A merchant discovers an overbilling error that the client never noticed and proactively refunds the difference, earning a lifelong advocate.',
        'When provoked in a heated dispute, a professional chooses restraint and fairness over anger, preserving both dignity and the relationship.',
      ],
    },
    lifeApplications: {
      tamil: [
        'ஒழுக்கம், வாய்மை, பொறாமையின்மை, கோபத்தைக் கட்டுப்படுத்துதல் மற்றும் செய்ந்நன்றி மறவாமை ஆகிய நற்பண்புகளே ஒரு மனிதனின் உண்மையான செல்வம்.',
        'மற்றவர்களுக்குத் தீங்கு நினைக்காமல், முடிந்த வரை பிறருக்கு உதவும் மனப்பான்மையோடு வாழ்வது உள்ளத்திற்கு மாசற்ற அமைதியைத் தரும்.',
      ],
      tanglish: [
        'நேர்மை, நன்றி மறக்காம இருக்கிறது, பொறாமைப்படாம இருக்கிறது, கோபத்தைக் கண்ட்ரோல் பண்றது — இதுதான் நமக்கு என்னைக்குமே அழியாத சொத்து.',
        'மனசாட்சிக்கு விரோதம் இல்லாம உண்மையா வாழ்ந்தா யாருக்கும் பயப்பட வேண்டிய அவசியமே இருக்காது.',
      ],
      english: [
        'Anchor your character in gratitude, impartiality, patience, self-restraint, and freedom from envy.',
        'Inner peace comes from moral clarity—when your thoughts, words, and deeds are free from deceit and malice, you walk without fear.',
      ],
    },
    businessApplications: {
      tamil: [
        'Corporate Governance & Ethics: நேர்மையான கணக்கு வழக்குகள், பாரபட்சமற்ற நீதி (நடுவுநிலைமை), மற்றும் வாடிக்கையாளர் நலன் ஆகியவையே நீண்டகால பிராண்ட் மதிப்பை உருவாக்கும்.',
        'உங்களுக்கு ஆரம்பக் காலத்தில் உதவிய ஊழியர்கள், வாடிக்கையாளர்கள் மற்றும் பங்குதாரர்களின் நன்றியை (செய்ந்நன்றி) ஒருபோதும் மறக்காதீர்கள்.',
      ],
      tanglish: [
        'Business Ethics & Trust: பாரபட்சம் இல்லாம நியாயமா நடக்கிறது (நடுவுநிலைமை) மற்றும் கஸ்டமரை ஏமாத்தாம இருக்கிறது தான் ஒரு பிராண்டை 50 வருஷம் நிலைக்க வைக்கும்.',
        'நீங்க வளரும்போது உங்களுக்கு ஆரம்பத்துல சப்போர்ட் பண்ண ஊழியர்கள் மற்றும் வாடிக்கையாளர்களோட நன்றியை எப்பவும் மறக்காதீங்க.',
      ],
      english: [
        'Build your reputation on uncompromising ethical governance, impartiality, and transparency.',
        'Never forget the early employees, partners, and customers who stood by you when you were small—gratitude is the hallmark of great leadership.',
      ],
    },
    takeaways: {
      tamil: [
        'இன்று உங்களுக்குக் கடந்த காலத்தில் உதவி செய்த ஒருவரை நினைவு கூர்ந்து அவருக்கு ஒரு நன்றிச் செய்தி அனுப்புங்கள்.',
      ],
      tanglish: [
        'உங்க வாழ்க்கையில அல்லது வேலைல உங்களுக்கு உதவி செஞ்ச ஒருத்தருக்கு இன்னைக்கு போன் பண்ணியோ மெசேஜ் பண்ணியோ மனசார நன்றி சொல்லுங்க.',
      ],
      english: [
        'Express sincere gratitude today to someone who helped you earlier in your journey, and practice complete patience in every interaction.',
      ],
    },
  },
  networking: {
    realWorldExamples: {
      tamil: [
        'முகத்திற்கு நேராகப் புகழ்ந்து பேசிவிட்டு முதுகிற்குப் பின்னால் கெடுதல் செய்யும் போலி நண்பர்களை அடையாளம் கண்டு விலக்கியதால், ஒரு தொழிலதிபர் பெரிய நிதி இழப்பிலிருந்து தப்பிக்கிறார்.',
        'தவறு செய்யும்போது தயங்காமல் சுட்டிக்காட்டித் திருத்தும் உண்மையான நண்பர்களையும் மூத்த வழிகாட்டிகளையும் (Mentors) அருகில் வைத்திருப்பவர் தொடர்ந்து உயர்கிறார்.',
      ],
      tanglish: [
        'கூடவே இருந்துக்கிட்டு குழி பறிக்கிற போலி நண்பர்களை (Toxic friends / கூடா நட்பு) அடையாளம் கண்டு விலக்குனதால, ஒருத்தர் பெரிய நஷ்டத்துல இருந்து தப்பிக்கிறாரு.',
        'நாம தப்பு பண்ணும்போது முகத்துக்கு நேரா கண்டிச்சு திருத்துற நல்ல நண்பர்களையும், அனுபவம் உள்ள Mentors-ஐயும் கூட வச்சிருக்கிறவர் வேகமா முன்னேறுறாரு.',
      ],
      english: [
        'By recognizing and distancing himself from flattering opportunists while keeping candid, wise mentors close, an entrepreneur avoids a disastrous partnership.',
        'When misfortune strikes, true friends step in immediately to support without being asked—just as the hand instinctively reaches to catch a slipping garment.',
      ],
    },
    lifeApplications: {
      tamil: [
        'நட்பு என்பது சிரித்துப் பேசுவதற்கு மட்டுமல்ல; நாம் தவறான வழியில் செல்லும்போது கண்டித்துத் திருத்துவதே சிறந்த நட்பின் அடையாளம்.',
        'சிறிய புத்தி கொண்டவர்களின் (சிற்றினம்) சேர்க்கையைத் தவிர்த்து, அறிவும் பண்பும் கொண்ட பெரியோரின் நட்பைத் தேடிப் பெறுங்கள்.',
      ],
      tanglish: [
        'நட்புங்குறது வெறும் ஜாலியா சிரிச்சுப் பேசுறதுக்கு மட்டும் இல்ல; நாம தப்பு பண்ணும்போது உரிமையாத் தடுத்து நிறுத்துறதுதான் உண்மையான நட்பு.',
        'நெகட்டிவ் எண்ணம் கொண்டவங்க சகவாசத்தைத் தவிர்த்துட்டு, உங்களை நல்ல வழியில ஊக்கப்படுத்துற நல்ல மனிதர்களோட நட்பை வளர்த்துக்கோங்க.',
      ],
      english: [
        'True friendship is defined not by pleasantries, but by the courage to correct your missteps and stand beside you in crisis.',
        'Guard your environment fiercely: avoid small-minded, toxic associations and cultivate relationships with people of wisdom and character.',
      ],
    },
    businessApplications: {
      tamil: [
        'நிறுவனத்தில் Co-founders, பங்குதாரர்கள் மற்றும் முக்கிய ஊழியர்களைத் தேர்ந்தெடுக்கும்போது அவர்களின் குணத்தையும் நேர்மையையும் ஆழமாக ஆராய்ந்த பிறகே சேர்க்க வேண்டும்.',
        'நிறுவனத்திற்கு உள்ளேயே இருக்கும் உட்பகை (Internal politics) வெளியில் இருக்கும் போட்டியாளர்களை விட ஆபத்தானது; அதை ஆரம்பத்திலேயே சரிசெய்யுங்கள்.',
      ],
      tanglish: [
        'பிசினஸ் பார்ட்னர்ஸ் மற்றும் முக்கிய டீம் மெம்பர்ஸை எடுக்கும்போது அவசரப்படாம அவங்க கேரக்டரை நல்லா ஆராய்ஞ்சு சேர்த்துக்கோங்க.',
        'வெளிய இருக்குற போட்டியாளர்களை விட ஆபீஸுக்குள்ள இருக்குற பாலிடிக்ஸ் (உட்பகை) ரொம்ப ஆபத்தானது; டீம் ஒற்றுமையை எப்பவும் காப்பாத்துங்க.',
      ],
      english: [
        'Vet partners, advisors, and key hires rigorously before forming long-term commitments, and never offend high-integrity mentors.',
        'Watch out for internal division (Utpagai) and yes-men; build a culture of honest feedback and genuine camaraderie.',
      ],
    },
    takeaways: {
      tamil: [
        'உங்கள் வளர்ச்சிக்கு உண்மையான அக்கறையோடு ஆலோசனை கூறும் ஒரு நல்ல நண்பர் அல்லது வழிகாட்டியுடன் இன்று உரையாடுங்கள்.',
      ],
      tanglish: [
        'உங்க நல்லதுக்காக உண்மையான அக்கறையோட பேசுற ஒரு நல்ல ஃப்ரெண்ட் அல்லது மெண்டார்கிட்ட இன்னைக்கு 5 நிமிஷம் மனம் விட்டுப் பேசுங்க.',
      ],
      english: [
        'Connect with one high-integrity friend or mentor today who challenges you to grow and gives you honest feedback.',
      ],
    },
  },
  learning: {
    realWorldExamples: {
      tamil: [
        'தினமும் அரை மணி நேரம் புதிய துறை சார்ந்த புத்தகங்களைப் படிப்பதும், வல்லுநர்களின் கருத்துக்களைக் காது கொடுத்துக் கேட்பதும் (கேள்விச் செல்வம்) ஒருவரைத் தன் துறையில் முதன்மையானவராக மாற்றுகிறது.',
        'முன் உண்ட உணவு செரிமானம் ஆன பிறகே அடுத்த வேளை உணவு உண்ணும் பழக்கத்தைக் கடைப்பிடிப்பவர், மருந்தே தேவையில்லாமல் நீண்ட காலம் ஆரோக்கியமாக வாழ்கிறார்.',
      ],
      tanglish: [
        'தினமும் புது விஷயங்களைப் படிக்கிறதும், அனுபவசாலிகள் பேசுறதைக் கூர்ந்து கேட்குறதும் (Active Listening) ஒருத்தரை அவரோட ஃபீல்டுல டாப் எக்ஸ்பர்ட் ஆக்குது.',
        'முன்னாடி சாப்பிட்ட சாப்பாடு நல்லா செரிச்சதுக்கு அப்புறம் அளவா சாப்பிடுற ஒருத்தருக்கு ஆஸ்பத்திரிக்கும் மருந்துக்கும் செலவே வைக்காம உடம்பு ஆரோக்கியமா இருக்கு.',
      ],
      english: [
        'A professional who combines daily reading with attentive listening to domain experts rapidly outpaces peers who stop learning after college.',
        'By eating only after the previous meal has fully digested and practicing moderation, a busy executive maintains peak physical vitality without medication.',
      ],
    },
    lifeApplications: {
      tamil: [
        'கல்வியும் கேள்வி அறிவும் ஒருவருக்கு அழியாத செல்வம். அதேபோல உடலின் அளவறிந்து உணவு உண்பது (மருந்து அதிகாரம்) ஆரோக்கியமான வாழ்வின் அடிப்படை.',
        'எந்த விஷயத்தையும் மேலோட்டமாகப் பார்க்காமல் அதன் உண்மையான தத்துவத்தை (மெய்ப்பொருள்) ஆராய்ந்து அறியும் பழக்கத்தை வளர்த்துக் கொள்ளுங்கள்.',
      ],
      tanglish: [
        'படிப்பும், நல்ல விஷயங்களைக் கேட்டுத் தெரிஞ்சுக்குற அறிவும்தான் நமக்கு என்னைக்குமே அழியாத சொத்து. கூடவே அளவான சாப்பாடும் உடல் ஆரோக்கியமும் ரொம்ப முக்கியம்.',
        'எந்த விஷயத்தையும் கண்மூடித்தனமா நம்பாம, அதோட உண்மைத் தன்மையை (Root truth) ஆராய்ஞ்சு புரிஞ்சுக்கோங்க.',
      ],
      english: [
        'Pair lifelong learning and active listening with physical discipline—mindful nutrition and digestion keep both body and mind sharp.',
        'Look past surface appearances and popular myths to grasp the underlying truth of every situation.',
      ],
    },
    businessApplications: {
      tamil: [
        'Learning Organization: தொடர்ந்து கற்றுக்கொள்ளும் நிறுவனங்களும், வாடிக்கையாளர்களின் குறைகளைக் காது கொடுத்துக் கேட்கும் (Active Listening) தலைவர்களுமே மார்க்கெட்டில் நிலைத்து நிற்பார்கள்.',
        'அறியாமையையும் (பேதைமை) போலியான பெருமையையும் தவிர்த்து, தரவுகளின் அடிப்படையில் தொடர்ந்து உங்கள் திறனை மேம்படுத்துங்கள்.',
      ],
      tanglish: [
        'Continuous Upskilling & Active Customer Listening: மார்க்கெட் மாறும்போது புது விஷயங்களைக் கத்துக்குற டீம்தான் எப்பவும் முன்னாடி நிக்கும்.',
        'எல்லாம் தெரியும்னு நினைக்காம (புல்லறிவாண்மை தவிர்த்து), டேட்டா மற்றும் ஃபீட்பேக் மூலமா தினமும் உங்க புராடக்ட்டை இம்ப்ரூவ் பண்ணுங்க.',
      ],
      english: [
        'Build a learning organization that listens intently to customers and peers while continuously upgrading its technical and strategic skills.',
        'Protect your personal and team stamina through sustainable health habits—high cognitive output requires physical wellbeing.',
      ],
    },
    takeaways: {
      tamil: [
        'இன்று ஒரு புதிய கருத்தை ஆழமாகக் கற்றுக்கொள்வதோடு, பசித்த பின் அளவோடு உணவு உண்ணும் ஆரோக்கிய விதியையும் கடைப்பிடியுங்கள்.',
      ],
      tanglish: [
        'இன்னைக்கு ஒரு நல்ல விஷயத்தைக் கத்துக்கிறதோட, நல்லா பசிச்ச பிறகு அளவா சாப்பிடுற வள்ளுவரோட ஹெல்த் டிப்ஸையும் ஃபாலோ பண்ணுங்க.',
      ],
      english: [
        'Learn one new concept deeply today, listen more than you speak, and practice mindful moderation at every meal.',
      ],
    },
  },
  relationships: {
    realWorldExamples: {
      tamil: [
        'வேலைப்பளுவிற்கு இடையிலும் குடும்பத்தினருடன் அன்பாக நேரத்தைச் செலவிட்டு, வாழ்க்கைத் துணையின் உணர்வுகளை மதித்து நடக்கும் இல்லறம் மகிழ்ச்சியோடு திகழ்கிறது.',
        'சிறிய ஊடல்களும் கருத்து வேறுபாடுகளும் வரும்போது ஈகோ பார்க்காமல் அன்போடு விட்டுக்கொடுத்துப் பேசும் தம்பதியரின் உறவு இன்னும் ஆழமாகிறது.',
      ],
      tanglish: [
        'ஆபீஸ் டென்ஷனை வீட்டுக்குள்ள கொண்டு வராம, குடும்பத்துக்கிட்ட அன்பாவும் அக்கறையாவும் நடந்துக்குற வீட்டுல எப்பவும் சந்தோஷம் நிறைஞ்சிருக்கு.',
        'கணவன்-மனைவி அல்லது அன்பான உறவுகளுக்குள்ள சின்ன சின்ன கோபம் (ஊடல்) வந்தாலும், ஈகோ பாக்காம அன்பா பேசித் தீர்க்குறப்போ பாசம் இன்னும் அதிகமாகுது.',
      ],
      english: [
        'A couple navigates busy careers harmoniously by prioritizing mutual respect, active empathy, and affectionate communication at home.',
        'When minor misunderstandings arise in a close relationship, setting aside ego to listen and reconnect strengthens the bond.',
      ],
    },
    lifeApplications: {
      tamil: [
        'அன்புடைய இல்லறமே அற வாழ்க்கையின் அடிப்படை. வாழ்க்கைத் துணையை மதிப்பதும், குழந்தைகளை நற்பண்புகளோடு வளர்ப்பதும், விருந்தினரைப் போற்றுவதும் வாழ்வின் பெரும் பேறு.',
        'அன்பான உறவுகளில் ஏற்படும் சிறிய கோபதாபங்களை (புலவி / ஊடல்) ஈகோவின்றி அன்பால் வெல்வதே இன்பத்துப்பாலின் அழகிய தத்துவம்.',
      ],
      tanglish: [
        'அன்பும் விட்டுக்கொடுக்குற மனசும் இருக்குற குடும்ப வாழ்க்கைதான் எல்லா வெற்றிக்கும் அடிப்படை. உங்க துணையையும் குடும்பத்தையும் எப்பவும் மரியாதையோட நேசிங்க.',
        'உறவுகளுக்குள்ள சின்ன கோபம் வந்தா அதுல யார் ஜெயிக்கிறதுன்னு ஈகோ பாக்காம, அன்பால அதை சரி பண்றதுதான் வாழ்க்கையோட அழகு.',
      ],
      english: [
        'A loving, supportive home life is the bedrock of human flourishing. Cherish your partner, nurture your children’s character, and practice warm hospitality.',
        'In close relationships, emotional intelligence, vulnerability, and playful reconciliation matter far more than winning an argument.',
      ],
    },
    businessApplications: {
      tamil: [
        'Emotional Intelligence (EQ) & Work-Life Harmony: குடும்பத்தில் அமைதியும் அன்பும் இருக்கும்போதுதான் தொழிலிலும் முழு கவனத்தோடு சாதனை படைக்க முடியும்.',
        'மனித உணர்வுகளையும் (Empathy) குறிப்புகளையும் புரிந்துகொள்ளும் திறன், வாடிக்கையாளர் உறவு மற்றும் குழு நிர்வாகத்திலும் மிகப்பெரிய பலத்தைத் தரும்.',
      ],
      tanglish: [
        'Work-Life Balance & Emotional Intelligence: வீட்டுல அன்பும் நிம்மதியும் இருந்தாதான் ஆபீஸ்லயும் பிசினஸ்லயும் முழு எனர்ஜியோட ஜெயிக்க முடியும்.',
        'மனுஷங்களோட உணர்வுகளைப் புரிஞ்சு நடந்துக்குற (Empathy) குணம் பிசினஸ் ரிலேஷன்ஷிப்லயும் உங்களை எல்லாருக்கும் பிடிச்சவரா மாத்தும்.',
      ],
      english: [
        'Protect work-life harmony: sustainable career peak performance rests on a stable, loving foundation at home.',
        'Apply emotional intelligence and deep empathy—the core lessons of human connection—to how you care for your team and community.',
      ],
    },
    takeaways: {
      tamil: [
        'இன்று உங்கள் குடும்பத்தினர் அல்லது வாழ்க்கைத் துணையிடம் செல்போனை ஒதுக்கி வைத்துவிட்டு 15 நிமிடம் மனம் விட்டு அன்பாகப் பேசுங்கள்.',
      ],
      tanglish: [
        'இன்னைக்கு போனைத் தள்ளி வச்சுட்டு உங்க குடும்பத்தினர் அல்லது பார்ட்னர்கிட்ட 15 நிமிஷம் அன்பா மனம் விட்டுப் பேசுங்க.',
      ],
      english: [
        'Put away all screens for 15 minutes today to give your undivided, affectionate attention to your partner or family.',
      ],
    },
  },
};

function buildKuralItem(raw: RawKuralRecord): KuralItem {
  const ch = CHAPTER_MAP.get(raw.ch) || CHAPTERS_133[0];
  const topic = ch.topic;

  // Check if this Kural has a full hand-crafted curated override
  const override = CURATED_OVERRIDES[raw.n];
  if (override) {
    return {
      number: raw.n,
      adhigaramNumber: raw.ch,
      line1: raw.l1,
      line2: raw.l2,
      tanglishCouplet: raw.tl,
      englishCouplet: raw.en,
      paal: {
        tamil: ch.paalTamil,
        tanglish: `${ch.paalTanglish} (${ch.paalEnglish})`,
        english: ch.paalEnglish,
      },
      adhigaram: {
        tamil: `${ch.nameTamil} (அதிகாரம் ${ch.number})`,
        tanglish: `${ch.nameTanglish} (Ch. ${ch.number} - ${ch.nameEnglish})`,
        english: `${ch.nameEnglish} (Ch. ${ch.number})`,
      },
      topic,
      content: override,
    };
  }

  const pb = TOPIC_PLAYBOOKS[topic];
  const idx = raw.n % pb.realWorldExamples.tamil.length;
  const takeIdx = raw.n % pb.takeaways.tamil.length;

  const tamilExplanation = raw.sp || raw.mv || raw.mk;
  const scholarNote =
    raw.mv && raw.mv !== tamilExplanation
      ? `மு.வரதராசன் உரை: ${raw.mv}`
      : raw.mk
      ? `கலைஞர் உரை: ${raw.mk}`
      : undefined;

  return {
    number: raw.n,
    adhigaramNumber: raw.ch,
    line1: raw.l1,
    line2: raw.l2,
    tanglishCouplet: raw.tl,
    englishCouplet: raw.en,
    paal: {
      tamil: ch.paalTamil,
      tanglish: `${ch.paalTanglish} (${ch.paalEnglish})`,
      english: ch.paalEnglish,
    },
    adhigaram: {
      tamil: `${ch.nameTamil} (அதிகாரம் ${ch.number})`,
      tanglish: `${ch.nameTanglish} (Ch. ${ch.number} - ${ch.nameEnglish})`,
      english: `${ch.nameEnglish} (Ch. ${ch.number})`,
    },
    topic,
    content: {
      tamil: {
        explanation: tamilExplanation,
        scholarNote,
        realWorldExample: `(${ch.nameTamil} - குறள் ${raw.n}): ${pb.realWorldExamples.tamil[idx]}`,
        lifeApplication: `${pb.lifeApplications.tamil[idx]} (${ch.nameTamil} அதிகாரத்தின் இக்கருத்தை அன்றாட வாழ்வில் கடைப்பிடிப்பது மனத் தெளிவையும் உயர்வையும் தரும்).`,
        businessApplication: `${pb.businessApplications.tamil[idx]}`,
        actionableTakeaway: pb.takeaways.tamil[takeIdx],
      },
      tanglish: {
        explanation: `[${ch.nameTanglish} - ${ch.nameEnglish}] ${tamilExplanation} (Simple Meaning: ${raw.ex})`,
        scholarNote: `Phonetic Reading: ${raw.tl}`,
        realWorldExample: `${pb.realWorldExamples.tanglish[idx]}`,
        lifeApplication: `${pb.lifeApplications.tanglish[idx]}`,
        businessApplication: `${pb.businessApplications.tanglish[idx]}`,
        actionableTakeaway: pb.takeaways.tanglish[takeIdx],
      },
      english: {
        explanation: raw.ex,
        scholarNote: `Translation: "${raw.en}" — Chapter ${ch.number}: ${ch.nameEnglish} (${ch.nameTamil}).`,
        realWorldExample: pb.realWorldExamples.english[idx],
        lifeApplication: pb.lifeApplications.english[idx],
        businessApplication: pb.businessApplications.english[idx],
        actionableTakeaway: pb.takeaways.english[takeIdx],
      },
    },
  };
}

const rawList = rawKuralsData as RawKuralRecord[];

export const ALL_1330_KURALS: KuralItem[] = rawList.map(buildKuralItem);

export const TOTAL_KURALS_COUNT = ALL_1330_KURALS.length; // 1330

// Featured / starter Kurals for quick highlights
export const FEATURED_KURAL_NUMBERS = [1, 391, 423, 467, 478, 517, 619, 643, 484, 131, 791, 595, 95, 661, 754, 291, 441, 675, 621];

const KURAL_BY_NUMBER_MAP = new Map<number, KuralItem>(
  ALL_1330_KURALS.map((k) => [k.number, k])
);

export function getKuralByNumber(num: number): KuralItem {
  const clamped = Math.max(1, Math.min(1330, Math.round(num)));
  return KURAL_BY_NUMBER_MAP.get(clamped) || ALL_1330_KURALS[0];
}

export function getKuralsByTopic(topic: TopicId): KuralItem[] {
  return ALL_1330_KURALS.filter((k) => k.topic === topic);
}

export function getKuralsByChapter(chapterNum: number): KuralItem[] {
  return ALL_1330_KURALS.filter((k) => k.adhigaramNumber === chapterNum);
}

export function searchKuralsOffline(
  query: string,
  topicFilter: TopicId | 'all' = 'all',
  chapterFilter: number | 'all' = 'all'
): KuralItem[] {
  const q = query.trim().toLowerCase();
  return ALL_1330_KURALS.filter((k) => {
    if (topicFilter !== 'all' && k.topic !== topicFilter) return false;
    if (chapterFilter !== 'all' && k.adhigaramNumber !== chapterFilter) return false;
    if (!q) return true;
    if (String(k.number) === q || `#${k.number}` === q) return true;
    return (
      k.line1.toLowerCase().includes(q) ||
      k.line2.toLowerCase().includes(q) ||
      k.tanglishCouplet.toLowerCase().includes(q) ||
      k.englishCouplet.toLowerCase().includes(q) ||
      k.adhigaram.tamil.toLowerCase().includes(q) ||
      k.adhigaram.tanglish.toLowerCase().includes(q) ||
      k.adhigaram.english.toLowerCase().includes(q) ||
      k.content.tamil.explanation.toLowerCase().includes(q) ||
      k.content.english.explanation.toLowerCase().includes(q)
    );
  });
}
