export default function AuthError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-gray-600 mb-4">
        There was a problem with the authentication process.
      </p>
      <a
        href="/auth/sign-in"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Return to Sign In
      </a>
    </div>
  )
} 