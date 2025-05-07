import { supabase } from "@/lib/supabaseClient"

export interface WorkoutLog {
  id: string;
  user_id: string;
  exercise_id: string;
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
    const { data, error } = await supabase
      .from('workout_logs')
      .select(`
        exercise_id,
        weight,
        logged_at,
        exercises!inner (
          name
        )
      `)
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Group by exercise_id and get the latest entry for each
    const maxWeights = data.reduce((acc: { [key: string]: MaxWeight }, log: any) => {
      if (!acc[log.exercise_id] || new Date(log.logged_at) > new Date(acc[log.exercise_id].logged_at)) {
        acc[log.exercise_id] = {
          exercise_id: log.exercise_id,
          exercise_name: log.exercises.name,
          weight: log.weight,
          logged_at: log.logged_at
        };
      }
      return acc;
    }, {});

    return Object.values(maxWeights);
  }
}; 