'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, CheckCircle2, Target } from "lucide-react";

const progressData = {
  overallProgress: 65,
  skillsCompleted: 32,
  skillsRequired: 50,
  certificationReadiness: 70,
};

export function ProgressSummary() {
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
            <span className="text-sm font-medium text-primary">{progressData.overallProgress}%</span>
          </div>
          <Progress value={progressData.overallProgress} aria-label="Overall progress" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Skills Logged</span>
             <span className="text-sm font-medium text-primary">
              <CheckCircle2 className="inline h-4 w-4 mr-1" />
              {progressData.skillsCompleted} / {progressData.skillsRequired}
            </span>
          </div>
          <Progress value={(progressData.skillsCompleted / progressData.skillsRequired) * 100} aria-label="Skills completed" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">Certification Readiness</span>
            <span className="text-sm font-medium text-accent">
              <Target className="inline h-4 w-4 mr-1" />
              {progressData.certificationReadiness}%
            </span>
          </div>
          <Progress value={progressData.certificationReadiness} className="[&>div]:bg-accent" aria-label="Certification readiness"/>
        </div>
      </CardContent>
    </Card>
  );
}
