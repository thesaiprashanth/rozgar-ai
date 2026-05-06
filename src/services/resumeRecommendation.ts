import { removeStopwords } from 'stopword';

export interface Internship {
  id: string;
  title: string;
  ministry: string;
  description: string;
  category: string;
  location: string;
  duration: string;
}

function preprocess(text: string) {
  return removeStopwords(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
  );
}

export function recommendInternships(
  resumeText: string,
  internships: Internship[]
) {
  const resumeWords = preprocess(resumeText);

  return internships
    .map((internship) => {
      const internshipWords = preprocess(`
        ${internship.title}
        ${internship.category}
        ${internship.ministry}
        ${internship.description}
      `);

      let score = 0;

      // 🔥 WEIGHTED MATCHING (IMPORTANT)
      resumeWords.forEach((word) => {
        if (internshipWords.includes(word)) {
          if (word.length > 4) score += 2; // strong keywords
          else score += 1;
        }
      });

      return {
        ...internship,
        score,
      };
    })
    .filter((job) => job.score > 2) // 🔥 REMOVE IRRELEVANT JOBS
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}