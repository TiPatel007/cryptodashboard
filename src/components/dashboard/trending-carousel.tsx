"use client"

import { useQuery } from "@tanstack/react-query"
import { getTrendingStocks } from "@/lib/stocks-api"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Flame, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TrendingCarousel() {
    const { data: trending, isLoading } = useQuery({
        queryKey: ["trending-stocks"],
        queryFn: getTrendingStocks,
    })

    if (isLoading) {
        return (
            <div className="flex gap-4 overflow-hidden mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 w-60 rounded-xl bg-white/5" />
                ))}
            </div>
        )
    }

    return (
        <div className="w-full mb-8">
            <div className="flex items-center mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg mr-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Trending Stocks</h2>
            </div>
            <ScrollArea className="w-full whitespace-nowrap rounded-xl">
                <div className="flex w-max space-x-4 p-1">
                    {trending?.slice(0, 8).map((stock: any) => {
                        const changePercent = stock.regularMarketChangePercent || 0
                        const isPositive = changePercent >= 0
                        const price = stock.regularMarketPrice || 0

                        return (
                            <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                                <Card className="w-60 bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet-500/50 transition-all duration-300 group cursor-pointer backdrop-blur-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Avatar className="h-10 w-10 rounded-full">
                                                <AvatarImage
                                                    src={`https://financialmodelingprep.com/image-stock/${stock.symbol}.png`}
                                                    alt={stock.shortName || stock.symbol}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="bg-violet-500/20 text-violet-400 font-semibold">
                                                    {stock.symbol.slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="font-bold text-white truncate max-w-[120px]">{stock.shortName || stock.symbol}</p>
                                                <p className="text-xs text-zinc-400">{stock.symbol}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-white font-medium">
                                                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                            <div className={cn(
                                                "flex items-center text-xs font-medium",
                                                isPositive ? "text-emerald-400" : "text-rose-400"
                                            )}>
                                                {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                                {Math.abs(changePercent).toFixed(2)}%
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}
