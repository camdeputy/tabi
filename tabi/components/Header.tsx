import Link from "next/link"
import { Button } from "@/components/ui/button"
import { userService } from "@/lib/services/userService"
import { exerciseService, Exercise } from "@/lib/services/exerciseService"
import { workoutLogService } from "@/lib/services/workoutLogService"
import { useRouter } from "next/navigation" 
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exerciseService.getExercises();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleSignOut = async () => {
    await userService.signOut();
    router.push('/auth/sign-in');
  }

  const handleLogNewExercise = () => {
    setIsDialogOpen(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const session = await userService.getSession();
      if (!session?.user) {
        throw new Error('User not authenticated');
      }

      await workoutLogService.createLog({
        user_id: session.user.id,
        exercise_id: exercise,
        weight: parseFloat(weight),
        reps: parseInt(reps),
      });

      toast({
        title: "Success",
        description: "Workout logged successfully",
      });

      // Reset form
      setExercise("");
      setWeight("");
      setReps("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error logging workout:', error);
      toast({
        title: "Error",
        description: "Failed to log workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <header className="w-full py-4 px-6 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          tabi
        </Link>
        <div className="flex gap-4">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white" variant="outline" onClick={handleLogNewExercise}>Log Exercise</Button>
          {!isAuthenticated ? (
            <Link href="/auth/sign-in" legacyBehavior passHref>
              <Button className="bg-blue-800 text-white hover:bg-blue-900 hover:text-white" variant="outline">Sign In</Button>
            </Link>
          ) : (
            <Button className="bg-blue-800 text-white hover:bg-blue-900 hover:text-white" variant="outline" onClick={handleSignOut}>Sign Out</Button>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log New Exercise</DialogTitle>
            <DialogDescription>
              Enter the details of your exercise.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Select value={exercise} onValueChange={setExercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Loading exercises...</SelectItem>
                  ) : (
                    exercises.map((ex) => (
                      <SelectItem key={ex.id} value={ex.id}>
                        {ex.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps">Reps</Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="Enter number of reps"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging..." : "Log"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}