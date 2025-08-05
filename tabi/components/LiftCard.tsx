import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState } from "react"
import { favoriteExerciseService } from "@/lib/services/favoriteExerciseService"
import { useToast } from "@/hooks/use-toast"

interface LiftCardProps {
    weight: number;
    exercise: string;
    date: string;
    exerciseId: string;
    userId: string;
    isFavorite: boolean;
    onFavoriteToggle?: () => void;
}

export default function LiftCard({weight, exercise, date, exerciseId, userId, isFavorite, onFavoriteToggle}: LiftCardProps) {
    const [isFavoriting, setIsFavoriting] = useState(false);
    const { toast } = useToast();

    const handleFavoriteToggle = async () => {
        setIsFavoriting(true);
        try {
            if (isFavorite) {
                await favoriteExerciseService.removeFavorite(userId, exerciseId);
                toast({
                    title: "Removed from favorites",
                    description: `${exercise} removed from favorites`,
                });
            } else {
                await favoriteExerciseService.addFavorite(userId, exerciseId);
                toast({
                    title: "Added to favorites",
                    description: `${exercise} added to favorites`,
                });
            }
            onFavoriteToggle?.();
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast({
                title: "Error",
                description: "Failed to update favorite status",
                variant: "destructive",
            });
        } finally {
            setIsFavoriting(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-md">{exercise}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
                disabled={isFavoriting}
                className="h-6 w-6 p-0"
              >
                <Star 
                  className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                />
              </Button>
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