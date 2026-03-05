"use client"

import { MobileSidebar } from "@/components/layout/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/layout/user-account-nav"
import { useSession } from "next-auth/react"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <div className="flex items-center p-4 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0f172a]/20 sticky top-0 z-50">
            <MobileSidebar />
            <div className="flex w-full justify-end items-center gap-x-4">
                <div className="hidden md:flex items-center px-4 py-2 w-64">
                    <Search />
                </div>

                <div className="flex items-center gap-x-2">
                    <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white">
                        <Bell className="w-5 h-5" />
                    </Button>
                    <ModeToggle />
                    {session?.user && <UserAccountNav user={session.user} />}
                </div>
            </div>
        </div>
    )
}
