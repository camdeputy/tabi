import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface LiftCardProps {
    weight: number;
    exercise: string;
    date: string;
}

export default function LiftCard({weight, exercise, date}: LiftCardProps) {
    return (
        <Card className="w-full max-w-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-md">{exercise}</h3>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{weight}<span className="text-lg">lbs</span></p>
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-sm text-muted-foreground">{date}</p>
          </CardFooter>
        </Card>
      )
}