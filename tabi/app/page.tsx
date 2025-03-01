"use client"

import Header from "@/components/Header"
import { LinearChartExample } from "@/components/LinearChartExample"
import { userService } from "@/lib/services/userService"
import LoadingSpinner from '@/components/LoadingSpinner'
import useSWR from "swr"
import LiftCard from "@/components/LiftCard"

const fetcher = async () => {
  return await userService.getSession();
};

export default function Home() {
  const { data: user, error, isLoading } = useSWR('user', fetcher);
  const isAuthenticated = !!user;

  if (isLoading) {
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
          <h1>Sign in to access your data</h1>
        </section>
      )}
      {isAuthenticated && (
        <div className="flex flex-col gap-8 p-6">
          {/* Row 1 */}
          <section className="w-full">
            <h2 className="text-xl font-semibold mb-4">Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cards or content for row 1 */}
              <div className="bg-white rounded-lg shadow p-4">Card 2</div>
              <div className="bg-white rounded-lg shadow p-4">Card 3</div>
            </div>
          </section>
          
          {/* Row 2 */}
          <section className="w-full">
            <h2 className="text-xl font-semibold mb-4">Current Maxes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cards or content for row 1 */}
              <LiftCard weight={225.0} exercise="Barbell Bench Press" date="2024-01-01" />
              <LiftCard weight={315.0} exercise="Barbell Squat" date="2024-01-02" />
              <LiftCard weight={405.0} exercise="Deadlift" date="2024-01-03" />
            </div>
          </section>
          
          {/* Row 3 */}
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
