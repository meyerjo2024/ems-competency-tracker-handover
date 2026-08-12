'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { UCAPSkillProgressSummary } from '@/types';

const chartConfig = {
  logged: {
    label: "Logged",
    color: "hsl(var(--chart-1))",
  },
  required: {
    label: "Required",
     color: "hsl(var(--muted))",
  }
} satisfies ChartConfig

interface SkillsBreakdownProps {
  progress: UCAPSkillProgressSummary | null;
}

export function SkillsBreakdown({ progress }: SkillsBreakdownProps) {
  const skillsData = progress?.categories || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-primary" />
          Skills Breakdown
        </CardTitle>
        <CardDescription>Logged UCAP skills by category.</CardDescription>
      </CardHeader>
      <CardContent>
        {skillsData.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submitted UCAP skills yet.</p>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <RechartsBarChart accessibilityLayer data={skillsData} layout="vertical" margin={{left:10, right:30}}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" dataKey="required" hide/>
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 15)}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="logged" name="Logged" radius={4} fill="var(--color-logged)" />
              <Bar dataKey="required" name="Required" radius={4} fill="var(--color-required)" />
            </RechartsBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
