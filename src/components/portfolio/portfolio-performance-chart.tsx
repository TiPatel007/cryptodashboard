"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { Transaction } from "@/store/portfolio-store"
import {
    generatePortfolioHistory,
    calculatePerformanceMetrics,
    formatChartDate,
    type Timeframe,
    type PortfolioDataPoint
} from "@/lib/portfolio-history"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react"

interface TooltipProps {
    active?: boolean
    payload?: ReadonlyArray<{ payload: PortfolioDataPoint }>
    selectedTimeframe: Timeframe
}

function CustomTooltip({ active, payload, selectedTimeframe }: TooltipProps) {
    if (active && payload && payload.length) {
        const data = payload[0].payload
        return (
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-xl">
                <p className="text-xs text-slate-400 mb-1">
                    {formatChartDate(data.timestamp, selectedTimeframe)}
                </p>
                <p className="text-lg font-bold text-white">
                    ${data.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
            </div>
        )
    }
    return null
}

interface PortfolioPerformanceChartProps {
    transactions: Transaction[]
    initialBalance: number
    currentPrices: { [assetId: string]: number }
}

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
    { value: "1H", label: "1H" },
    { value: "1D", label: "1D" },
    { value: "5D", label: "5D" },
    { value: "1W", label: "1W" },
    { value: "1M", label: "1M" },
    { value: "3M", label: "3M" },
    { value: "1Y", label: "1Y" },
    { value: "ALL", label: "ALL" },
]

export function PortfolioPerformanceChart({
    transactions,
    initialBalance,
    currentPrices
}: PortfolioPerformanceChartProps) {
    const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("1M")

    // Generate portfolio history data
    const chartData = generatePortfolioHistory(
        selectedTimeframe,
        transactions,
        initialBalance,
        currentPrices
    )

    // Calculate performance metrics
    const metrics = calculatePerformanceMetrics(chartData)
    const isPositive = metrics.change >= 0

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-white">Portfolio Performance</CardTitle>
                            <p className="text-sm text-slate-400">Track your portfolio value over time</p>
                        </div>
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                        {TIMEFRAMES.map((tf) => (
                            <button
                                key={tf.value}
                                onClick={() => setSelectedTimeframe(tf.value)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                                    selectedTimeframe === tf.value
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {tf.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Current Value</p>
                        <p className="text-2xl font-bold text-white">
                            ${metrics.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Change</p>
                        <p className={cn(
                            "text-2xl font-bold flex items-center gap-2",
                            isPositive ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {isPositive ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                            ${Math.abs(metrics.change).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400 mb-1">Percentage</p>
                        <p className={cn(
                            "text-2xl font-bold",
                            isPositive ? "text-emerald-500" : "text-rose-500"
                        )}>
                            {isPositive ? '+' : ''}{metrics.changePercent.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => formatChartDate(timestamp, selectedTimeframe)}
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={50}
                            />
                            <YAxis
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={60}
                            />
                            <Tooltip content={(props) => <CustomTooltip {...props} selectedTimeframe={selectedTimeframe} />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={isPositive ? "#10b981" : "#ef4444"}
                                strokeWidth={2}
                                fill={isPositive ? "url(#colorPositive)" : "url(#colorNegative)"}
                                animationDuration={500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
