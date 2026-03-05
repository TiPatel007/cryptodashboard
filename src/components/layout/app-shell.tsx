"use client"

import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10 h-full">
                <Navbar />
                <div className="p-8 h-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
