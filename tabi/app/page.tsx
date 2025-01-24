'use client'

import { supabase } from '../lib/supabaseClient';
import { useEffect } from 'react';

export default function Home() {

  const signInUser = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: '...',
      password: '...'
    })
    await getTestUser();
  }

  const getTestUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    console.log(user)
  }

  useEffect(() => {
    signInUser();
  }, []);

  return (
    <div>
      <h1>The start of the fitness tracker</h1>
    </div>
  )
}
