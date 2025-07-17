import { supabase } from "@/lib/supabaseClient"

export interface WorkoutLog {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise_type: 'global' | 'custom';
  weight: number;
  reps: number;
  logged_at: string;
}

export interface MaxWeight {
  exercise_id: string;
  exercise_name: string;
  weight: number;
  logged_at: string;
}

const PAGINATION_LIMIT = 6;

export const workoutLogService = {
  async createLog(data: Omit<WorkoutLog, 'id' | 'logged_at'>): Promise<WorkoutLog> {
    const { data: log, error } = await supabase
      .from('workout_logs')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return log;
  },

  async getLatestMaxWeights(userId: string, limit: number = PAGINATION_LIMIT): Promise<MaxWeight[]> {
    // Get workout logs with exercise information
    const { data, error } = await supabase
      .from('workout_logs')
      .select(`
        exercise_id,
        exercise_type,
        weight,
        logged_at
      `)
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(limit * 10); // Get more records to account for grouping

    if (error) {
      throw error;
    }

    // Get exercise names for global exercises
    const globalExerciseIds = [...new Set(data.filter(log => log.exercise_type === 'global').map(log => log.exercise_id))];
    const { data: globalExercises } = await supabase
      .from('exercises')
      .select('id, name')
      .in('id', globalExerciseIds);

    // Get exercise names for custom exercises
    const customExerciseIds = [...new Set(data.filter(log => log.exercise_type === 'custom').map(log => log.exercise_id))];
    const { data: customExercises } = await supabase
      .from('user_exercises')
      .select('id, name')
      .in('id', customExerciseIds)
      .eq('user_id', userId);

    // Create a map of exercise names
    const exerciseNameMap = new Map<string, string>();
    globalExercises?.forEach(ex => exerciseNameMap.set(ex.id, ex.name));
    customExercises?.forEach(ex => exerciseNameMap.set(ex.id, ex.name));

    // Group by exercise_id and get the latest entry for each
    const maxWeights = data.reduce((acc: { [key: string]: MaxWeight }, log: any) => {
      const exerciseName = exerciseNameMap.get(log.exercise_id);
      if (!exerciseName) return acc;

      if (!acc[log.exercise_id] || new Date(log.logged_at) > new Date(acc[log.exercise_id].logged_at)) {
        acc[log.exercise_id] = {
          exercise_id: log.exercise_id,
          exercise_name: exerciseName,
          weight: log.weight,
          logged_at: log.logged_at
        };
      }
      return acc;
    }, {});

    return Object.values(maxWeights).slice(0, limit);
  }
}; 