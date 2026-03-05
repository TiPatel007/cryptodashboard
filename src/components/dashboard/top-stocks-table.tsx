"use client"

import { useQuery } from "@tanstack/react-query"
import { getTrendingStocks } from "@/lib/stocks-api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function TopStocksTable() {
    const router = useRouter()
    const { data: stocks, isLoading } = useQuery({
        queryKey: ["trending-stocks"],
        queryFn: getTrendingStocks,
        refetchInterval: 30000, // Refetch every 30 seconds for real-time updates,
    })

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        )
    }

    if (!stocks || stocks.length === 0) {
        return <div className="text-zinc-400">No stock data available</div>
    }

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 text-sm font-medium text-zinc-400">Rank</th>
                                <th className="text-left p-4 text-sm font-medium text-zinc-400">Asset</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Price</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Change</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Market Cap</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Volume (24h)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock: any, index: number) => {
                                const price = stock.regularMarketPrice || 0
                                const changePercent = stock.regularMarketChangePercent || 0
                                const isPositive = changePercent >= 0
                                const isAfterHours = stock.marketState !== 'REGULAR'
                                const displayPrice = isAfterHours && stock.postMarketPrice
                                    ? stock.postMarketPrice
                                    : price

                                return (
                                    <tr
                                        key={stock.symbol}
                                        onClick={() => router.push(`/stocks/${stock.symbol}`)}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                    >
                                        <td className="p-4">
                                            <span className="text-zinc-400 text-sm">{index + 1}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 rounded-full">
                                                    <AvatarImage
                                                        src={`https://financialmodelingprep.com/image-stock/${stock.symbol}.png`}
                                                        alt={stock.shortName || stock.symbol}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs font-semibold">
                                                        {stock.symbol.slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{stock.shortName || stock.symbol}</p>
                                                    <p className="text-xs text-zinc-500">{stock.symbol}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-white font-medium">
                                                    ${displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                {isAfterHours && (
                                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        After Hours
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={cn(
                                                "inline-flex items-center font-medium",
                                                isPositive ? "text-emerald-500" : "text-rose-500"
                                            )}>
                                                {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                                {Math.abs(changePercent).toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-white">
                                                {stock.marketCap
                                                    ? `$${(stock.marketCap / 1e12).toFixed(2)}T`
                                                    : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-white">
                                                {stock.regularMarketVolume
                                                    ? `${(stock.regularMarketVolume / 1e6).toFixed(2)}M`
                                                    : 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

