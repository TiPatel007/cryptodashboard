import { signIn } from "@/auth"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center space-y-4 mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50 mb-2">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            Finance Dashboard
                        </h1>
                        <p className="text-slate-400">
                            Sign in to track your crypto and stocks in real-time
                        </p>
                    </div>

                    {/* Sign In Form */}
                    <form
                        action={async () => {
                            "use server"
                            await signIn("google", { redirectTo: "/" })
                        }}
                        className="space-y-4"
                    >
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Chrome className="mr-2 h-5 w-5" />
                            Sign in with Google
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        By signing in, you agree to our terms of service
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/4 -left-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
        </div>
    )
}
