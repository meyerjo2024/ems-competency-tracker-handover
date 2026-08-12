import type { PatientCareFormData, UCAPSkill, UCAPSkillProgressSummary } from '@/types';
import { getEncountersForStudent } from '@/actions/patientCareFormActions';

function getEncounterTimestamp(encounter: PatientCareFormData): Date {
  const dateValue = encounter.submittedAt || encounter.updatedAt || encounter.createdAt;
  if (dateValue instanceof Date) return dateValue;
  if (dateValue && typeof (dateValue as any).toDate === 'function') return (dateValue as any).toDate();
  return new Date(0);
}

export async function getUCAPSkillsForStudent(studentId: string): Promise<{
  success: boolean;
  data?: UCAPSkill[];
  progress?: UCAPSkillProgressSummary;
  error?: string;
}> {
  if (!studentId) {
    return { success: false, error: 'Student ID is required.' };
  }

  const encountersResult = await getEncountersForStudent(studentId);
  if (!encountersResult.success) {
    return { success: false, error: encountersResult.error || 'Failed to retrieve student encounters.' };
  }

  const allEncounters = encountersResult.data || [];
  const submittedEncounters = allEncounters.filter((encounter) => !encounter.isDraft);
  const aggregate = new Map<string, UCAPSkill>();

  for (const encounter of submittedEncounters) {
    const performedAt = getEncounterTimestamp(encounter);
    const skills = encounter.ucapSkills || [];

    for (const skill of skills) {
      const skillName = skill.name?.trim();
      if (!skillName) continue;
      const skillCategory = (skill.category || 'General').trim() || 'General';
      const key = `${skillName.toLowerCase()}::${skillCategory.toLowerCase()}`;
      const existing = aggregate.get(key);

      if (!existing) {
        aggregate.set(key, {
          ...skill,
          name: skillName,
          category: skillCategory,
          id: skill.id || key,
          successfulAttempts: skill.successfulAttempts || 1,
          attemptsRequired: skill.attemptsRequired || 1,
          lastPerformed: skill.lastPerformed || performedAt,
        });
        continue;
      }

      const existingLastPerformed =
        existing.lastPerformed instanceof Date
          ? existing.lastPerformed
          : (existing.lastPerformed as any)?.toDate?.() || new Date(0);

      aggregate.set(key, {
        ...existing,
        successfulAttempts: (existing.successfulAttempts || 0) + (skill.successfulAttempts || 1),
        attemptsRequired: Math.max(existing.attemptsRequired || 1, skill.attemptsRequired || 1),
        lastPerformed: performedAt > existingLastPerformed ? performedAt : existing.lastPerformed,
      });
    }
  }

  const data = Array.from(aggregate.values()).sort((a, b) => a.name.localeCompare(b.name));
  const categoryAccumulator = new Map<string, { logged: number; required: number }>();

  for (const skill of data) {
    const category = skill.category || 'General';
    const current = categoryAccumulator.get(category) || { logged: 0, required: 0 };
    categoryAccumulator.set(category, {
      logged: current.logged + (skill.successfulAttempts || 0),
      required: current.required + (skill.attemptsRequired || 1),
    });
  }

  const totalLogged = data.reduce((sum, skill) => sum + (skill.successfulAttempts || 0), 0);
  const totalRequired = data.reduce((sum, skill) => sum + (skill.attemptsRequired || 1), 0);
  const verifiedSkills = data.filter((skill) => skill.verificationStatus === 'Verified').length;
  const pendingSkills = data.filter((skill) => (skill.verificationStatus || 'Pending') !== 'Verified').length;

  return {
    success: true,
    data,
    progress: {
      totalLogged,
      uniqueSkills: data.length,
      verifiedSkills,
      pendingSkills,
      completionPercent: totalRequired > 0 ? Math.min(100, Math.round((totalLogged / totalRequired) * 100)) : 0,
      categories: Array.from(categoryAccumulator.entries())
        .map(([category, values]) => ({ category, logged: values.logged, required: values.required }))
        .sort((a, b) => b.logged - a.logged),
    },
  };
}
