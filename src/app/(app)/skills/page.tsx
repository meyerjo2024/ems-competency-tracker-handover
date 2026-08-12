'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, CheckCircle, AlertCircle, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { getUCAPSkillsForStudent } from '@/actions/ucapSkillsActions';
import type { UCAPSkill } from '@/types';

function formatSkillDate(value: UCAPSkill['lastPerformed']) {
  if (!value) return 'Never';
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof (value as any)?.toDate === 'function') return (value as any).toDate().toLocaleDateString();
  const parsed = new Date(value as any);
  return Number.isNaN(parsed.getTime()) ? 'Never' : parsed.toLocaleDateString();
}

export default function SkillsLogPage() {
  const { currentUser } = useAuth();
  const [skills, setSkills] = React.useState<UCAPSkill[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSkills() {
      if (!currentUser?.id) {
        setSkills([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const result = await getUCAPSkillsForStudent(currentUser.id);
      setSkills(result.success && result.data ? result.data : []);
      setIsLoading(false);
    }

    loadSkills();
  }, [currentUser?.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">My Skills Log</h1>
      </div>
      <p className="text-muted-foreground">
        Review your logged skills, track progress towards certification, and identify areas for improvement.
      </p>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading UCAP skills...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{skill.name}</CardTitle>
                  <CardDescription>{skill.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-medium text-foreground">{skill.successfulAttempts || 0} / {skill.attemptsRequired || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Verification:</span>
                    <Badge variant={
                      skill.verificationStatus === "Verified" ? "default" :
                      skill.verificationStatus === "Pending" || !skill.verificationStatus ? "secondary" : "destructive"
                    }
                    className={
                      skill.verificationStatus === "Verified" ? "bg-accent text-accent-foreground" :
                      skill.verificationStatus === "Pending" || !skill.verificationStatus ? "bg-yellow-500 text-white" : ""
                    }
                    >
                      {skill.verificationStatus === "Verified" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {(skill.verificationStatus === "Pending" || !skill.verificationStatus) && <Clock className="mr-1 h-3 w-3" />}
                      {skill.verificationStatus === "Rejected" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {skill.verificationStatus || 'Pending'}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-medium text-foreground">{skill.confidenceLevel || 'N/A'}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last Performed: {formatSkillDate(skill.lastPerformed)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {skills.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No skills logged yet. Submit a patient encounter to populate your UCAP skills log.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
