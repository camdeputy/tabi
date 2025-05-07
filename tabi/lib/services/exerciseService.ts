import { supabase } from "@/lib/supabaseClient"

export interface Exercise {
  id: string;
  name: string;
  created_at: string;
}

export const exerciseService = {
  async getExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data || [];
  }
}; 