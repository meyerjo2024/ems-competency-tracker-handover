'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, CheckCircle2, Target } from "lucide-react";
import type { UCAPSkillProgressSummary } from '@/types';

interface ProgressSummaryProps {
  progress: UCAPSkillProgressSummary | null;
}

export function ProgressSummary({ progress }: ProgressSummaryProps) {
  const skillsCompleted = progress?.totalLogged || 0;
  const skillsRequired = progress?.categories.reduce((sum, category) => sum + category.required, 0) || 0;
  const overallProgress = progress?.completionPercent || 0;
  const certificationReadiness = progress ? Math.min(100, Math.round((progress.verifiedSkills / Math.max(progress.uniqueSkills, 1)) * 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-primary" />
          Progress Summary
        </CardTitle>
        <CardDescription>Your current progress towards certification requirements.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm font-medium text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} aria-label="Overall progress" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Skills Logged</span>
             <span className="text-sm font-medium text-primary">
              <CheckCircle2 className="inline h-4 w-4 mr-1" />
              {skillsCompleted} / {skillsRequired}
            </span>
          </div>
          <Progress value={skillsRequired > 0 ? (skillsCompleted / skillsRequired) * 100 : 0} aria-label="Skills completed" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Certification Readiness</span>
            <span className="text-sm font-medium text-accent">
              <Target className="inline h-4 w-4 mr-1" />
              {certificationReadiness}%
            </span>
          </div>
          <Progress value={certificationReadiness} className="[&>div]:bg-accent" aria-label="Certification readiness"/>
        </div>
      </CardContent>
    </Card>
  );
}
