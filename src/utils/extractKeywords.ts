const SKILL_KEYWORDS = [
  // Tech
  'python',
  'java',
  'c',
  'c++',
  'javascript',
  'typescript',
  'react',
  'node',
  'firebase',
  'machine learning',
  'deep learning',
  'nlp',
  'tensorflow',
  'pytorch',
  'sql',
  'mysql',
  'mongodb',
  'html',
  'css',
  'git',
  'github',
  'cybersecurity',
  'cloud',
  'aws',
  'azure',
  'data science',
  'data analysis',
  'web development',
  'software development',
  'programming',

  // Business / Finance
  'finance',
  'accounting',
  'economics',
  'budgeting',
  'financial analysis',
  'investment',
  'banking',
  'taxation',
  'auditing',
  'business development',
  'market research',
  'marketing',
  'digital marketing',
  'sales',
  'management',
  'entrepreneurship',

  // Media / Communication
  'journalism',
  'content writing',
  'editing',
  'social media',
  'public relations',
  'communication',
  'advertising',
  'media',
  'broadcasting',
  'copywriting',

  // Law / Policy
  'law',
  'legal research',
  'public policy',
  'policy analysis',
  'constitutional law',
  'criminal law',
  'human rights',
  'governance',
  'international relations',

  // Science / Environment
  'biology',
  'chemistry',
  'physics',
  'mathematics',
  'statistics',
  'research',
  'environment',
  'climate change',
  'biodiversity',
  'environmental science',
  'ecology',
  'laboratory',
  'scientific writing',

  // Health
  'medicine',
  'healthcare',
  'public health',
  'hospital',
  'nursing',
  'pharmacy',
  'medical research',
  'health policy',

  // Design / Creative
  'graphic design',
  'ui ux',
  'photoshop',
  'illustrator',
  'video editing',
  'photography',
  'animation',
  'creative writing',

  // Social / Education
  'teaching',
  'education',
  'social work',
  'community development',
  'psychology',
  'counselling',
  'training',
  'volunteering',

  // General soft skills
  'leadership',
  'teamwork',
  'problem solving',
  'critical thinking',
  'presentation',
  'time management',
  'organization',
  'analytical skills',
  'communication skills',
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, ' ') // keep + for c++
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractKeywords(text: string) {
  const normalizedText = normalize(text);

  const foundKeywords = SKILL_KEYWORDS.filter((keyword) => {
    const normalizedKeyword = normalize(keyword);

    // 🔥 main match
    if (normalizedText.includes(normalizedKeyword)) return true;

    // 🔥 smart alias handling
    if (normalizedKeyword === 'machine learning' && normalizedText.includes('ml')) return true;
    if (normalizedKeyword === 'artificial intelligence' && normalizedText.includes('ai')) return true;
    if (normalizedKeyword === 'javascript' && normalizedText.includes('js')) return true;
    if (normalizedKeyword === 'typescript' && normalizedText.includes('ts')) return true;
    if (normalizedKeyword === 'react' && normalizedText.includes('reactjs')) return true;
    if (normalizedKeyword === 'node' && normalizedText.includes('nodejs')) return true;
    if (normalizedKeyword === 'c++' && normalizedText.includes('c++')) return true;

    return false;
  });

  return [...new Set(foundKeywords)];
}