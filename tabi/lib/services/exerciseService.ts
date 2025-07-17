import { supabase } from "@/lib/supabaseClient"

export interface Exercise {
  id: string;
  name: string;
  created_at: string;
  exercise_type: 'global' | 'custom';
}

export const exerciseService = {
  async getExercises(userId: string): Promise<Exercise[]> {
    const [globalRes, userRes] = await Promise.all([
      supabase.from('exercises').select('*'),
      supabase.from('user_exercises').select('*').eq('user_id', userId)
    ]);
  
    if (globalRes.error) throw globalRes.error;
    if (userRes.error) throw userRes.error;
  
    const globalExercises = (globalRes.data || []).map(ex => ({
      ...ex,
      exercise_type: 'global' as const
    }));
    
    const customExercises = (userRes.data || []).map(ex => ({
      ...ex,
      exercise_type: 'custom' as const
    }));
  
    const combined = [
      ...globalExercises,
      ...customExercises
    ];
  
    return combined.sort((a, b) => a.name.localeCompare(b.name));
  },

  async createExercise(userId: string, exercise: string): Promise<Exercise> {
    const { data, error } = await supabase
      .from('user_exercises')
      .insert({ user_id: userId, name: exercise })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      exercise_type: 'custom' as const
    };
  }
}; 