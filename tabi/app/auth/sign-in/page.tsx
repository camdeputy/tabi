'use client';

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormMessage, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from "next/navigation";

const formSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(8),
});

export default function LoginPage() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    }
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: values.emailAddress,
        password: values.password
      })

      if (error) {
        console.error(error.message)
        throw new Error(error.message)
      }

      // On successful sign in
      if (data.user) router.push('/')

    } catch (err) {
      console.error('An unexpected error occured during sign in: ', err)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="max-width-md w-full flex flex-col gap-4">
          <FormField control={form.control} name="emailAddress" render={({ field }) => {
            return <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email Address" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }}/>
          <FormField control={form.control} name="password" render={({ field }) => {
            return <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          }}/>
          <Button type="submit" className="w-full">Sign in</Button> 
        </form>
      </Form>
    </main>
  )
}