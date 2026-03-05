"use client"

import { useQuery } from "@tanstack/react-query"
import { getStockQuote } from "@/lib/stocks-api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const INDIAN_STOCKS = [
    "RELIANCE.NS",
    "TCS.NS",
    "HDFCBANK.NS",
    "INFY.NS",
    "HINDUNILVR.NS",
    "ICICIBANK.NS",
    "BHARTIARTL.NS",
    "SBIN.NS"
]

export function IndianStocksTable() {
    const router = useRouter()
    const { data: stocks, isLoading } = useQuery({
        queryKey: ["indian-stocks"],
        queryFn: async () => {
            const promises = INDIAN_STOCKS.map(symbol => getStockQuote(symbol))
            const results = await Promise.all(promises)
            return results.filter(stock => stock !== null)
        },
        refetchInterval: 30000, // Refetch every 30 seconds
    })

    if (isLoading) {
        return (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-12 w-48 bg-white/5" />
                                <Skeleton className="h-12 w-32 bg-white/5" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!stocks || stocks.length === 0) {
        return (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                    <p className="text-zinc-400 text-center">No Indian stocks data available</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left p-4 text-sm font-medium text-zinc-400">#</th>
                                <th className="text-left p-4 text-sm font-medium text-zinc-400">Name</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Price</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Market Cap</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock: any, index: number) => {
                                const changePercent = stock.regularMarketChangePercent || 0
                                const isPositive = changePercent >= 0
                                const marketCap = stock.marketCap || 0
                                const volume = stock.regularMarketVolume || 0
                                const symbol = stock.symbol.replace('.NS', '')

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
                                                        src={`https://financialmodelingprep.com/image-stock/${symbol}.png`}
                                                        alt={stock.shortName || symbol}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs font-semibold">
                                                        {symbol.slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{stock.shortName || symbol}</p>
                                                    <p className="text-xs text-zinc-500">{symbol}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-white font-medium">
                                                    ₹{stock.regularMarketPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                                <div className={cn(
                                                    "flex items-center text-xs font-medium mt-1",
                                                    isPositive ? "text-emerald-400" : "text-rose-400"
                                                )}>
                                                    {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                                    {Math.abs(changePercent).toFixed(2)}%
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-zinc-300">
                                                ₹{(marketCap / 1e12).toFixed(2)}T
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1 text-zinc-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-sm">
                                                    {(volume / 1e6).toFixed(2)}M
                                                </span>
                                            </div>
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
