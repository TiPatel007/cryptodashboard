import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LineChart, Wallet, Newspaper, Settings, Menu, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Market",
        icon: LineChart,
        href: "/market",
        color: "text-violet-500",
    },
    {
        label: "Portfolio",
        icon: Wallet,
        href: "/portfolio",
        color: "text-emerald-500",
    },
    {
        label: "Recommendations",
        icon: Sparkles,
        href: "/recommendations",
        color: "text-yellow-500",
    },
    {
        label: "News",
        icon: Newspaper,
        href: "/news",
        color: "text-orange-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        color: "text-gray-500",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#0f172a]/50 backdrop-blur-xl border-r border-white/5 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-lg blur-sm opacity-75 animate-pulse" />
                        <div className="relative bg-black rounded-lg w-full h-full flex items-center justify-center border border-white/10">
                            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                                F
                            </span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        FinanceView
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition duration-200",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-[#0f172a] border-r border-white/10">
                <Sidebar />
            </SheetContent>
        </Sheet>
    )
}
