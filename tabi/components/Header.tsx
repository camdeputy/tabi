import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header(isAuthenticated: any) {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          tabi
        </Link>
        {!isAuthenticated ? (
          <Link href="/auth/sign-in" legacyBehavior passHref>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white" variant="outline">Sign In</Button>
          </Link>
        ) : (
          <Link href="/auth/sign-out" legacyBehavior passHref>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white" variant="outline">Sign Out</Button>
          </Link>
        )}
      </div>
    </header>
  )
}