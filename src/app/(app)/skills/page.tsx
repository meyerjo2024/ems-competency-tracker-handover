import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Skill } from "@/types";

const mockSkills: Skill[] = [
  { id: "1", name: "Endotracheal Intubation", category: "Advanced Airway", successfulAttempts: 3, attemptsRequired: 5, verificationStatus: "Verified", confidenceLevel: "Competent", lastPerformed: new Date(2024, 6, 15) },
  { id: "2", name: "IV Cannulation", category: "Vascular Access", successfulAttempts: 8, attemptsRequired: 10, verificationStatus: "Pending", confidenceLevel: "Developing", lastPerformed: new Date(2024, 7, 1) },
  { id: "3", name: "CPR - Adult", category: "Cardiac", successfulAttempts: 5, attemptsRequired: 5, verificationStatus: "Verified", confidenceLevel: "Proficient", lastPerformed: new Date(2024, 5, 20) },
  { id: "4", name: "Bag-valve-mask Ventilation", category: "Basic Airway", successfulAttempts: 12, attemptsRequired: 10, verificationStatus: "Verified", confidenceLevel: "Competent", lastPerformed: new Date(2024, 7, 5) },
  { id: "5", name: "Surgical Cricothyroidotomy", category: "Advanced Airway", successfulAttempts: 0, attemptsRequired: 2, verificationStatus: "Pending", confidenceLevel: "Not Confident", lastPerformed: undefined },
];

export default function SkillsLogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">My Skills Log</h1>
      </div>
      <p className="text-muted-foreground">
        Review your logged skills, track progress towards certification, and identify areas for improvement.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockSkills.map(skill => (
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
                  skill.verificationStatus === "Pending" ? "secondary" : "destructive"
                }
                className={
                  skill.verificationStatus === "Verified" ? "bg-accent text-accent-foreground" :
                  skill.verificationStatus === "Pending" ? "bg-yellow-500 text-white" : ""
                }
                >
                  {skill.verificationStatus === "Verified" && <CheckCircle className="mr-1 h-3 w-3" />}
                  {skill.verificationStatus === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                  {skill.verificationStatus === "Rejected" && <AlertCircle className="mr-1 h-3 w-3" />}
                  {skill.verificationStatus}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-medium text-foreground">{skill.confidenceLevel || 'N/A'}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Last Performed: {skill.lastPerformed ? skill.lastPerformed.toLocaleDateString() : 'Never'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       {mockSkills.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No skills logged yet. Start by logging a patient encounter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
