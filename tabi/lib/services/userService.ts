import { supabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js";

export interface AppSession {
  user: {
    id: string;
    email?: string;
  } | null;
}

export const userService = {
    // Private variable to track authentication state
    _isAuthenticated: false,

    // Method to get authentication state
    isAuthenticated: (): boolean => {
        return userService._isAuthenticated
    },

    async getSession(): Promise<AppSession> {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
            throw error
        }
        userService._isAuthenticated = !!session
        return {
            user: session?.user ? {
                id: session.user.id,
                email: session.user.email
            } : null
        }
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
        userService._isAuthenticated = true
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
        userService._isAuthenticated = true
        return data.user
    },

    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
        userService._isAuthenticated = false
    },

}