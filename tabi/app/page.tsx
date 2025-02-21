import Header from "@/components/Header"
import { LinearChartExample } from "@/components/LinearChartExample"


export default function Home() {
  return (
    <>
    <main className="flex-1">
      <Header />
      <section className="grid place-items-center flex-1 min-h-[calc(100vh-4rem)]">
        <h1>Sign in to access your data</h1>
      </section>
    </main>
    <LinearChartExample />
    </>
  )
}
