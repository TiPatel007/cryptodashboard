"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePortfolioStore } from "@/store/portfolio-store"
import { toast } from "sonner"
import { Trash2, DollarSign } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
    const { resetPortfolio, initialBalance, setInitialBalance } = usePortfolioStore()
    const [customBalance, setCustomBalance] = useState(initialBalance.toString())

    const handleReset = () => {
        resetPortfolio()
        toast.success("Portfolio has been reset successfully.")
    }

    const handleSetBalance = () => {
        const amount = parseFloat(customBalance)
        if (isNaN(amount) || amount < 0) {
            toast.error("Please enter a valid positive amount.")
            return
        }
        setInitialBalance(amount)
        toast.success(`Starting balance set to $${amount.toLocaleString()}`)
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-zinc-400">Manage your preferences and data.</p>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Portfolio Configuration</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Set your initial balance to match your real portfolio or start fresh with a custom amount.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="initial-balance" className="text-zinc-300">
                            Initial Balance
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                    id="initial-balance"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={customBalance}
                                    onChange={(e) => setCustomBalance(e.target.value)}
                                    className="pl-9 bg-white/5 border-white/10 text-white"
                                    placeholder="100000"
                                />
                            </div>
                            <Button onClick={handleSetBalance} variant="secondary">
                                Apply
                            </Button>
                        </div>
                        <p className="text-xs text-zinc-500">
                            Current: ${initialBalance.toLocaleString()} • Changing this will reset your portfolio.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">Portfolio Management</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Danger zone. This will permanently delete all your simulated transactions and reset your balance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleReset}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reset Portfolio Data
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">About FinanceView</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Version 1.0.0
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-zinc-400">
                        Built with Next.js, Tailwind CSS, shadcn/ui, CoinGecko API, and Yahoo Finance.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
