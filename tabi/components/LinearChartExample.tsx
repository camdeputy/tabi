"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { userService } from "@/lib/services/userService"

const chartConfig = {
  desktop: {
    label: "Weight (lbs)",
    color: "blue",
  },
} satisfies ChartConfig

const fetchExerciseId = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('id')
    .eq('name', 'Barbell Bench Press')
    .single()

  return data!.id  
}

const fetchWorkoutData = async (exerciseId: string, userId: string): Promise<{ logged_at: string; weight: number }[] | null> => {
  const { data, error } = await supabase
    .from("workout_logs")
    .select("weight, logged_at")
    .eq("exercise_id", exerciseId)
    .eq("user_id", userId)

    return data
}

export function LinearChartExample() {
  const [chartData, setChartData] = useState<{ day: string; weight: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const userId = await userService.getUserId()
      const exerciseId = await fetchExerciseId()
      if (userId) {
        const workoutData = await fetchWorkoutData(exerciseId, userId)
        if (workoutData) {
          setChartData(workoutData.map((data) => ({ day: data.logged_at, weight: data.weight })))
        }
      }
    }
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barbell Bench Press</CardTitle>
        <CardDescription>Current Max: 225</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="weight"
              type="linear"
              stroke="blue"
              strokeWidth={3}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
