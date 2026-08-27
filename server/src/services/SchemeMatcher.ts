import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SchemeMatcher {
  static async matchBestScheme(params: {
    projectCost: Decimal;
    businessCategoryId: string;
    isRural: boolean;
  }) {
    // 1. Fetch schemes that match the category
    const categoryMatches = await prisma.schemeCategoryMatch.findMany({
      where: { businessCategoryId: params.businessCategoryId },
      include: { scheme: true }
    });

    const candidateSchemes = categoryMatches.map(m => m.scheme).filter(s => s.active);

    let bestScheme = null;
    let highestScore = 0;

    for (const scheme of candidateSchemes) {
      let score = 0;

      // Category match (guaranteed if in this list)
      score += 30;

      // Rural eligibility
      if (params.isRural && scheme.ruralEligible) {
        score += 20;
      } else if (!params.isRural) {
        // Assume urban
        score += 10; 
      }

      // Project cost range
      if (params.projectCost.toNumber() >= scheme.minProjectCost && params.projectCost.toNumber() <= scheme.maxProjectCost) {
        score += 25;
      }

      // We'll give it a base score to ensure something is returned if category matches
      score += 15;

      if (score > highestScore) {
        highestScore = score;
        bestScheme = scheme;
      }
    }

    if (!bestScheme) {
      // Fallback to a default if no specific category match
      const defaultScheme = await prisma.scheme.findFirst({
        where: { schemeCode: 'DEFAULT_TERM_LOAN' }
      });
      if (defaultScheme) {
        return { scheme: defaultScheme, score: 50 };
      }
      return null;
    }

    return { scheme: bestScheme, score: Math.min(highestScore, 100) };
  }
}
