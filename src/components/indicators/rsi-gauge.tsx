"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface RSIGaugeProps {
    rsi: number
    className?: string
}

export function RSIGauge({ rsi, className }: RSIGaugeProps) {
    // Determine color and signal
    const getColor = () => {
        if (rsi > 80) return "text-rose-500"
        if (rsi > 70) return "text-orange-500"
        if (rsi < 30) return "text-emerald-500"
        if (rsi < 40) return "text-green-500"
        return "text-yellow-500"
    }

    const getSignal = () => {
        if (rsi > 80) return { label: "Overpriced", variant: "destructive" as const, icon: TrendingDown }
        if (rsi > 70) return { label: "Overbought", variant: "secondary" as const, icon: TrendingUp }
        if (rsi < 30) return { label: "Buy Signal", variant: "default" as const, icon: TrendingUp }
        if (rsi < 40) return { label: "Undervalued", variant: "outline" as const, icon: TrendingUp }
        return { label: "Neutral", variant: "secondary" as const, icon: Minus }
    }

    const signal = getSignal()
    const Icon = signal.icon

    // Calculate gauge position (0-100 maps to 0-180 degrees)
    const rotation = (rsi / 100) * 180 - 90

    return (
        <div className={cn("relative", className)}>
            {/* RSI Value */}
            <div className="text-center mb-4">
                <div className={cn("text-4xl font-bold", getColor())}>
                    {rsi.toFixed(1)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">RSI (14)</div>
            </div>

            {/* Gauge */}
            <div className="relative w-48 h-24 mx-auto">
                {/* Background arc */}
                <svg className="w-full h-full" viewBox="0 0 200 100">
                    {/* Zones */}
                    <path
                        d="M 10 90 A 90 90 0 0 1 190 90"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="12"
                        opacity="0.3"
                        strokeDasharray="28.27 141.37"
                        strokeDashoffset="0"
                    />
                    <path
                        d="M 10 90 A 90 90 0 0 1 190 90"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="12"
                        opacity="0.3"
                        strokeDasharray="84.82 84.82"
                        strokeDashoffset="-28.27"
                    />
                    <path
                        d="M 10 90 A 90 90 0 0 1 190 90"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="12"
                        opacity="0.3"
                        strokeDasharray="28.27 141.37"
                        strokeDashoffset="-113.09"
                    />

                    {/* Needle */}
                    <line
                        x1="100"
                        y1="90"
                        x2="100"
                        y2="20"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className={getColor()}
                        style={{ transformOrigin: "100px 90px", transform: `rotate(${rotation}deg)` }}
                    />

                    {/* Center dot */}
                    <circle cx="100" cy="90" r="5" fill="currentColor" className={getColor()} />
                </svg>

                {/* Labels */}
                <div className="absolute bottom-0 left-0 text-xs text-zinc-500">0</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-zinc-500">50</div>
                <div className="absolute bottom-0 right-0 text-xs text-zinc-500">100</div>
            </div>

            {/* Signal Badge */}
            <div className="flex justify-center mt-4">
                <Badge variant={signal.variant} className="flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    {signal.label}
                </Badge>
            </div>
        </div>
    )
}
