import { supabase } from "@/lib/supabaseClient"
import type { User, Session } from "@supabase/supabase-js";

export const userService = {
    getSession: async (): Promise<Session | null> => {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            throw error
        }
        return data.session
    },

    getUser: async (): Promise<User | null> => {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            throw error
        }
        return data.user
    },

    getUserId: async (): Promise<string | null> => {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            throw error
        }
        return data.user.id
    },

    signIn: async (email: string, password: string): Promise<User | null> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            throw error
        }  
        return data.user
    },
    
    signUp: async (email: string, password: string): Promise<User | null> => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            throw error
        }
        return data.user
    },

    signOut: async (): Promise<void> => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
    },

}