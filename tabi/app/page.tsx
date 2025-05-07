"use client"

import Header from "@/components/Header"
import { LinearChartExample } from "@/components/LinearChartExample"
import { userService } from "@/lib/services/userService"
import { workoutLogService, MaxWeight } from "@/lib/services/workoutLogService"
import LoadingSpinner from '@/components/LoadingSpinner'
import useSWR from "swr"
import LiftCard from "@/components/LiftCard"

const fetcher = async () => { 
  return await userService.getSession();
};

export default function Home() {
  const { data: user, error: userError, isLoading: isUserLoading } = useSWR('user', fetcher);
  const isAuthenticated = !!user?.user;

  const { data: maxWeights, error: maxWeightsError, isLoading: isMaxWeightsLoading } = useSWR(
    isAuthenticated ? ['maxWeights', user.user?.id] : null,
    async () => {
      if (!user?.user?.id) return [];
      return await workoutLogService.getLatestMaxWeights(user.user.id);
    }
  );

  if (isUserLoading || isMaxWeightsLoading) {
    return (
      <main className="flex-1 grid place-items-center min-h-screen">
        <LoadingSpinner />
      </main>
    );
  }
  
  return (
    <main className="flex-1">
      <Header isAuthenticated={isAuthenticated} />
      {!isAuthenticated && (
        <section className="grid place-items-center flex-1 min-h-[calc(100vh-4rem)]">
          <a href="/auth/sign-in" className="underline"><h1>Sign in to access your data</h1></a>
        </section>
      )}
      {isAuthenticated && (
        <div className="flex flex-col gap-8 p-6">
          <section className="w-full">
            <h1 className="text-2xl font-semibold">Logbook - set some PRs!</h1>
          </section>
          {/* Highlights */}
          <section className="w-full">
            <h2 className="text-xl font-semibold mb-4">Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {maxWeights?.map((maxWeight) => (
                <LiftCard
                  key={maxWeight.exercise_id}
                  weight={maxWeight.weight}
                  exercise={maxWeight.exercise_name}
                  date={new Date(maxWeight.logged_at).toISOString().split('T')[0]}
                />
              ))}
            </div>
          </section>
          
          {/* Trends */}
          <section className="w-full">
            <h2 className="text-xl font-semibold mb-4">Trends</h2>
            <div className="w-full bg-white rounded-lg shadow p-4">
              <LinearChartExample />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}