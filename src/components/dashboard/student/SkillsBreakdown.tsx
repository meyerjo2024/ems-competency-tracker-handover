'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, ListChecks } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const skillsData = [
  { category: "Airway", completed: 8, required: 10, color: "hsl(var(--chart-1))" },
  { category: "Cardiac", completed: 12, required: 15, color: "hsl(var(--chart-2))"  },
  { category: "Trauma", completed: 5, required: 8, color: "hsl(var(--chart-3))"  },
  { category: "Medical", completed: 7, required: 12, color: "hsl(var(--chart-4))"  },
  { category: "Special Pops", completed: 3, required: 5, color: "hsl(var(--chart-5))"  },
];

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  required: {
    label: "Required",
     color: "hsl(var(--muted))",
  }
} satisfies ChartConfig


export function SkillsBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListChecks className="mr-2 h-5 w-5 text-primary" />
          Skills Breakdown
        </CardTitle>
        <CardDescription>Completed vs. required skills by category.</CardDescription>
      </CardHeader>
      <CardContent>
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
            <Bar dataKey="completed" name="Completed" radius={4} fill="var(--color-completed)" />
            <Bar dataKey="required" name="Required" radius={4} fill="var(--color-required)" />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
