"use client"

import { useQuery } from "@tanstack/react-query"
import { getGlobalMarketData } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown, Activity, DollarSign, BarChart3 } from "lucide-react"

export function MarketStats() {
    const { data: globalData, isLoading } = useQuery({
        queryKey: ["globalMarket"],
        queryFn: getGlobalMarketData,
    })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl bg-white/5" />
                ))}
            </div>
        )
    }

    if (!globalData) return null

    const marketCap = globalData.total_market_cap?.usd || 0
    const volume = globalData.total_volume?.usd || 0
    const btcDominance = globalData.market_cap_percentage?.btc || 0

    const marketCapChange = globalData.market_cap_change_percentage_24h_usd

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Market Cap</CardTitle>
                    <DollarSign className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className={`text-xs flex items-center mt-1 ${marketCapChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {marketCapChange >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                        {Math.abs(marketCapChange).toFixed(2)}%
                        <span className="text-zinc-500 ml-1">24h</span>
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">24h Volume</CardTitle>
                    <Activity className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        ${volume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                        Global trading volume
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">BTC Dominance</CardTitle>
                    <BarChart3 className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        {btcDominance.toFixed(1)}%
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                        Bitcoin market share
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
