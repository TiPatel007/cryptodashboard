"use client"

import { useWatchlistStore } from "@/store/watchlist-store"
import { useQuery } from "@tanstack/react-query"
import { getMarketData } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, StarOff, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Coin } from "@/lib/types"

export default function WatchlistPage() {
    const { watchlist, removeFromWatchlist } = useWatchlistStore()

    const { data: coins, isLoading } = useQuery({
        queryKey: ["marketData"],
        queryFn: () => getMarketData(1, 50),
        staleTime: 60000,
        refetchInterval: 60000,
    })

    const watchedCoins = coins?.filter((coin: Coin) => watchlist.includes(coin.id)) ?? []

    return (
        <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Watchlist</h1>
                <p className="text-zinc-400">
                    Your saved coins. Add coins to your watchlist from the{" "}
                    <Link href="/coins" className="text-violet-400 hover:underline">
                        Coins
                    </Link>{" "}
                    or{" "}
                    <Link href="/coins" className="text-violet-400 hover:underline">
                        coin detail
                    </Link>{" "}
                    pages.
                </p>
            </div>

            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />
                    ))}
                </div>
            )}

            {!isLoading && watchlist.length === 0 && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                        <Star className="w-12 h-12 text-zinc-600" />
                        <p className="text-zinc-400 text-center">
                            Your watchlist is empty. Browse coins and click the star icon to add them here.
                        </p>
                        <Link href="/coins">
                            <Button variant="secondary">Browse Coins</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {!isLoading && watchlist.length > 0 && watchedCoins.length === 0 && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                        <p className="text-zinc-400 text-center">
                            Could not load price data for your watched coins. Please try again.
                        </p>
                    </CardContent>
                </Card>
            )}

            {watchedCoins.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 text-sm font-medium text-zinc-400">Coin</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Price</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">24h Change</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Market Cap</th>
                                <th className="text-right p-4 text-sm font-medium text-zinc-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {watchedCoins.map((coin: Coin) => (
                                <tr
                                    key={coin.id}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4">
                                        <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={coin.image} alt={coin.name} />
                                                <AvatarFallback>{coin.symbol[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-white">{coin.name}</p>
                                                <p className="text-xs text-zinc-500 uppercase">{coin.symbol}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-right font-medium text-white">
                                        ${coin.current_price.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className={cn(
                                            "flex items-center justify-end",
                                            coin.price_change_percentage_24h >= 0 ? "text-emerald-500" : "text-rose-500"
                                        )}>
                                            {coin.price_change_percentage_24h >= 0
                                                ? <ArrowUp className="w-3 h-3 mr-1" />
                                                : <ArrowDown className="w-3 h-3 mr-1" />}
                                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-zinc-300">
                                        ${coin.market_cap.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFromWatchlist(coin.id)}
                                            className="text-yellow-400 hover:text-yellow-300"
                                        >
                                            <StarOff className="w-4 h-4 mr-1" />
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
