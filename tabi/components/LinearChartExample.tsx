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

const fetchExerciseId = async (exerciseName: string): Promise<{ id: string; exercise_type: 'global' | 'custom' }> => {
  // First check global exercises
  const { data: globalData, error: globalError } = await supabase
    .from('exercises')
    .select('id')
    .eq('name', exerciseName)

  if (globalData && globalData.length > 0) {
    return { id: globalData[0].id, exercise_type: 'global' as const }
  }

  // If not found in global, check user exercises
  const userId = await userService.getUserId()
  if (!userId) throw new Error('User not authenticated')

  const { data: customData, error: customError } = await supabase
    .from('user_exercises')
    .select('id')
    .eq('name', exerciseName)
    .eq('user_id', userId)

  if (customData && customData.length > 0) {
    return { id: customData[0].id, exercise_type: 'custom' as const }
  }

  throw new Error('Exercise not found')
}

const fetchWorkoutData = async (exerciseId: string, exerciseType: 'global' | 'custom', userId: string): Promise<{ logged_at: string; weight: number }[] | null> => {
  const { data, error } = await supabase
    .from("workout_logs")
    .select("weight, logged_at")
    .eq("exercise_id", exerciseId)
    .eq("exercise_type", exerciseType)
    .eq("user_id", userId)

    return data
}

export function LinearChartExample({ exerciseName, maxWeight }: { exerciseName: string, maxWeight: number }) {
  const [chartData, setChartData] = useState<{ day: string; weight: number }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const userId = await userService.getUserId()
      const exerciseInfo = await fetchExerciseId(exerciseName)
      if (userId) {
        const workoutData = await fetchWorkoutData(exerciseInfo.id, exerciseInfo.exercise_type, userId)
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
        <CardTitle>{exerciseName}</CardTitle>
        <CardDescription>Current Max: {maxWeight}</CardDescription>
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
