import { supabase } from "@/lib/supabaseClient"

export interface FavoriteExercise {
  id: string;
  user_id: string;
  exercise_id: string;
  created_at: string;
}

export const favoriteExerciseService = {
  async getFavoriteExercises(userId: string): Promise<FavoriteExercise[]> {
    const { data, error } = await supabase
      .from('favorite_exercises')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  },

  async addFavorite(userId: string, exerciseId: string): Promise<FavoriteExercise> {
    const { data, error } = await supabase
      .from('favorite_exercises')
      .insert({ user_id: userId, exercise_id: exerciseId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFavorite(userId: string, exerciseId: string): Promise<void> {
    const { error } = await supabase
      .from('favorite_exercises')
      .delete()
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId);

    if (error) throw error;
  },

  async isFavorite(userId: string, exerciseId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorite_exercises')
      .select('id')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return !!data;
  }
}; 