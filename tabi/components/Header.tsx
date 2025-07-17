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
import { Menu, Plus, Search } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

interface HeaderProps {
  isAuthenticated: boolean;
  user: any;
}

export default function Header({ isAuthenticated, user }: HeaderProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isWorkoutLogDialogOpen, setIsWorkoutLogDialogOpen] = useState(false);
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [selectedExerciseType, setSelectedExerciseType] = useState<"global" | "custom" | "">("");
  const [newExerciseName, setNewExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");

  const fetchExercises = async () => {
    try {
      const data = await exerciseService.getExercises(user.id);
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await userService.signOut();
    router.push('/auth/sign-in');
  }

  const handleLogNewExercise = async () => {
    await fetchExercises();
    setIsWorkoutLogDialogOpen(true);
  }

  const handleAddNewExercise = () => {
    setIsAddExerciseDialogOpen(true);
  }

  const handleCancel = () => {
    setIsWorkoutLogDialogOpen(false);
    setIsAddExerciseDialogOpen(false);
    setSelectedExerciseId("");
    setSelectedExerciseType("");
    setNewExerciseName("")
    setWeight("");
    setReps("");
    setExerciseSearch("");
  }

  // Filter exercises based on search term
  const filteredExercises = exercises.filter(ex => 
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const handleSubmitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      await workoutLogService.createLog({
        user_id: user.id,
        exercise_id: selectedExerciseId,
        exercise_type: selectedExerciseType as "global" | "custom",
        weight: parseFloat(weight),
        reps: parseInt(reps),
      });

      toast({
        title: "Success",
        description: "Workout logged successfully",
      });

      // Reset form
      setSelectedExerciseId("");
      setSelectedExerciseType("");
      setWeight("");
      setReps("");
      setIsWorkoutLogDialogOpen(false);
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

  const handleSubmitExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      await exerciseService.createExercise(user.id, newExerciseName);

      toast({
        title: "Success",
        description: "Exercise added successfully",
      });

      // Reset form
      setNewExerciseName("");
      setWeight("");
      setReps("");
      setIsAddExerciseDialogOpen(false);
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({
        title: "Error",
        description: "Failed to add exercise. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    {/* Mobile View */}
      <header className="w-full py-4 px-6 bg-white shadow-md">
        <div className="container mx-auto flex items-center relative">
          <div className="absolute right-0 md:hidden">
            {isAuthenticated ? (
              <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Access your workout options
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={handleLogNewExercise}
                  >
                    Log Exercise
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={handleAddNewExercise}
                  >
                    Add New Exercise
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            ) : (
              <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Sign in to access your data
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => router.push('/auth/sign-in')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => router.push('/auth/sign-up')}
                  >
                    Sign Up
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            )}
          </div>
          
          <Link href="/" className="text-2xl font-bold text-blue-600 w-full text-center">
            tabi
          </Link>

          <div className="hidden md:flex gap-4 absolute right-0">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/sign-in" legacyBehavior passHref>
                  <Button className="bg-blue-800 text-white hover:bg-blue-900 hover:text-white" variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/sign-up" legacyBehavior passHref>
                  <Button className="bg-blue-800 text-white hover:bg-blue-900 hover:text-white" variant="outline">Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white" 
                  variant="outline" 
                  onClick={handleLogNewExercise}
                >
                  Log Exercise
                </Button>
                <Button 
                  className="bg-blue-800 text-white hover:bg-blue-900 hover:text-white" 
                  variant="outline" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {isAuthenticated && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:hidden">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={handleLogNewExercise}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      <Dialog open={isWorkoutLogDialogOpen} onOpenChange={setIsWorkoutLogDialogOpen}>
        <DialogContent className="w-[90%] rounded-xl">
          <DialogTitle>Log New Exercise</DialogTitle>
          <DialogDescription>
            Enter the details of your exercise.
          </DialogDescription>
          <form onSubmit={handleSubmitLog} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Select value={selectedExerciseId} onValueChange={(value) => {
                setSelectedExerciseId(value);
                // Find the selected exercise to get its type
                const selectedExercise = exercises.find(ex => ex.id === value);
                setSelectedExerciseType(selectedExercise?.exercise_type || "");
                console.log(value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an exercise" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search exercises..."
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        className="pl-10 h-8 text-sm"
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Loading exercises...</SelectItem>
                    ) : filteredExercises.length === 0 ? (
                      <SelectItem value="no-results" disabled>No exercises found</SelectItem>
                    ) : (
                      filteredExercises.map((ex) => (
                        <SelectItem key={ex.id} value={ex.id}>
                          {ex.name} {ex.exercise_type === 'custom' && '(Custom)'}
                        </SelectItem>
                      ))
                    )}
                  </div>
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
              <Button type="button" variant="outline" onClick={() => handleCancel()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging..." : "Log"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddExerciseDialogOpen} onOpenChange={setIsAddExerciseDialogOpen}>
        <DialogContent className="w-[90%] rounded-xl">
          <DialogTitle>Add New Exercise</DialogTitle>
        <DialogDescription>
            Enter the name of the exercise you want to add.
        </DialogDescription>
        <form onSubmit={handleSubmitExercise} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exercise">Exercise</Label>
              <Input
                id="exercise"
                type="text"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                placeholder="Enter exercise"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => handleCancel()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
          </DialogContent>
      </Dialog>
    </>
  )
}