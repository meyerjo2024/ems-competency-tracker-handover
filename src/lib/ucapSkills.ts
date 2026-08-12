import type { UCAPSkill } from '@/types';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Airway: ['airway', 'intub', 'opa', 'npa', 'bvm', 'cric', 'suction', 'ventilation'],
  Cardiac: ['cardiac', 'cpr', 'defib', 'ecg', 'rhythm', 'pacing', 'cardioversion', 'stemi'],
  Trauma: ['trauma', 'splint', 'tourniquet', 'hemorrhage', 'immobilization', 'c-collar', 'pelvic'],
  Vascular: ['iv', 'io', 'vascular', 'cannulation', 'catheter', 'blood draw', 'access'],
  Breathing: ['oxygen', 'cpap', 'nebulizer', 'respiratory', 'chest decompression', 'chest tube'],
  Medical: ['medication', 'pharmacology', 'glucose', 'assessment', 'monitoring'],
  Obstetrics: ['delivery', 'neonatal', 'obstetric', 'placenta', 'uterine'],
};

export function inferUCAPSkillCategory(skillName: string): string {
  const normalized = skillName.toLowerCase();
  const matched = Object.entries(CATEGORY_KEYWORDS).find(([, keywords]) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  return matched?.[0] ?? 'General';
}

export function buildUCAPSkillsFromExtractedNames(skillNames: string[]): UCAPSkill[] {
  return skillNames
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name, index) => {
      const category = inferUCAPSkillCategory(name);
      const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      return {
        id: `ai-${normalized}-${category.toLowerCase()}-${index}`,
        name,
        category,
        source: 'AI' as const,
        attemptsRequired: 1,
        successfulAttempts: 1,
        verificationStatus: 'Pending' as const,
        confidenceLevel: 'Developing' as const,
        lastPerformed: new Date(),
        extractedAt: new Date(),
      };
    });
}

export function mergeUCAPSkills(skills: UCAPSkill[]): UCAPSkill[] {
  const merged = new Map<string, UCAPSkill>();

  for (const skill of skills) {
    const key = `${skill.name.toLowerCase()}::${skill.category.toLowerCase()}`;
    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, { ...skill });
      continue;
    }

    merged.set(key, {
      ...existing,
      successfulAttempts: (existing.successfulAttempts || 0) + (skill.successfulAttempts || 0),
      attemptsRequired: Math.max(existing.attemptsRequired || 1, skill.attemptsRequired || 1),
      lastPerformed: skill.lastPerformed || existing.lastPerformed,
      extractedAt: skill.extractedAt || existing.extractedAt,
    });
  }

  return Array.from(merged.values());
}
