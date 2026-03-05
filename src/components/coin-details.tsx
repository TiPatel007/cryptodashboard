"use client"

import { useQuery } from "@tanstack/react-query"
import { getCoinDetails, getCoinHistory } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowUp, ArrowDown, Globe, Twitter } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TradeModal } from "@/components/portfolio/trade-modal"

export function CoinDetails({ id }: { id: string }) {
    const [days, setDays] = useState("7")

    const { data: coin, isLoading: loadingCoin } = useQuery({
        queryKey: ["coin", id],
        queryFn: () => getCoinDetails(id),
    })

    const { data: history, isLoading: loadingHistory } = useQuery({
        queryKey: ["history", id, days],
        queryFn: () => getCoinHistory(id, days),
    })

    if (loadingCoin) {
        return <div className="space-y-6">
            <div className="flex justify-between">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-24" />
            </div>
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
        </div>
    }

    if (!coin) return <div>Coin not found</div>

    const priceChange = coin.market_data?.price_change_percentage_24h ?? 0
    const isPositive = priceChange >= 0

    const chartData = history?.prices?.map((price: [number, number]) => ({
        date: price[0],
        price: price[1],
    })) ?? []

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <img src={coin.image?.large} alt={coin.name} className="w-12 h-12" />
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                            {coin.name}
                            <span className="text-zinc-500 text-lg uppercase">({coin.symbol})</span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-white/10 text-zinc-300 hover:bg-white/20">
                                Rank #{coin.market_cap_rank}
                            </Badge>
                            <TradeModal
                                assetId={id}
                                assetName={coin.name}
                                currentPrice={coin.market_data?.current_price?.usd || 0}
                                assetType="crypto"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                        ${coin.market_data?.current_price?.usd.toLocaleString()}
                    </div>
                    <div className={cn(
                        "flex items-center justify-end text-sm font-medium",
                        isPositive ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                        {Math.abs(priceChange).toFixed(2)}% (24h)
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-zinc-400">Price Chart</CardTitle>
                    <div className="flex gap-2">
                        {['1', '7', '30', '365'].map((d) => (
                            <Button
                                key={d}
                                variant={days === d ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setDays(d)}
                                className={cn(
                                    "h-7 text-xs",
                                    days === d ? "bg-violet-600 hover:bg-violet-700" : "text-zinc-400 hover:text-white"
                                )}
                            >
                                {d === '1' ? '24H' : d === '365' ? '1Y' : `${d}D`}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        {loadingHistory ? (
                            <Skeleton className="h-full w-full bg-white/5" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(tick) => {
                                            const date = new Date(tick);
                                            return days === '1'
                                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                        }}
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        domain={['auto', 'auto']}
                                        tickFormatter={(tick) => `$${tick.toLocaleString()}`}
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        mirror
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                        labelFormatter={(label) => new Date(label).toLocaleString()}
                                        formatter={(value: number | undefined) => [value ? `$${value.toLocaleString()}` : '$0', 'Price']}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke={isPositive ? "#10b981" : "#ef4444"}
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Market Cap" value={`$${coin.market_data?.market_cap?.usd.toLocaleString()}`} />
                <StatCard label="Volume (24h)" value={`$${coin.market_data?.total_volume?.usd.toLocaleString()}`} />
                <StatCard label="Circulating Supply" value={`${coin.market_data?.circulating_supply?.toLocaleString()} ${coin.symbol.toUpperCase()}`} />
                <StatCard label="All Time High" value={`$${coin.market_data?.ath?.usd.toLocaleString()}`} subValue={`${coin.market_data?.ath_change_percentage?.usd.toFixed(2)}%`} isNegative />
            </div>

            {/* About */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-white">About {coin.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="text-zinc-400 prose prose-invert max-w-none prose-sm"
                        dangerouslySetInnerHTML={{ __html: coin.description?.en || "No description available." }}
                    />

                    <div className="flex gap-4 mt-6">
                        {coin.links?.homepage?.[0] && (
                            <a href={coin.links.homepage[0]} target="_blank" rel="noreferrer" className="flex items-center text-violet-400 hover:text-violet-300 transition-colors text-sm">
                                <Globe className="w-4 h-4 mr-2" />
                                Website
                            </a>
                        )}
                        {coin.links?.twitter_screen_name && (
                            <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noreferrer" className="flex items-center text-sky-400 hover:text-sky-300 transition-colors text-sm">
                                <Twitter className="w-4 h-4 mr-2" />
                                Twitter
                            </a>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function StatCard({ label, value, subValue, isNegative }: { label: string, value: string, subValue?: string, isNegative?: boolean }) {
    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
                <p className="text-sm font-medium text-zinc-400">{label}</p>
                <div className="text-lg font-bold text-white mt-1">{value}</div>
                {subValue && (
                    <p className={cn("text-xs mt-1", isNegative ? "text-rose-500" : "text-emerald-500")}>
                        {subValue}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
