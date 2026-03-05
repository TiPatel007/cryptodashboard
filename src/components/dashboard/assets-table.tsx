"use client"

import { useQuery } from "@tanstack/react-query"
import { getMarketData } from "@/lib/api"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AssetsTable() {
    const { data: coins, isLoading } = useQuery({
        queryKey: ["marketData"],
        queryFn: () => getMarketData(1, 10), // Top 10 crypto only
    })

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/5" />
                ))}
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-zinc-400 w-[50px]">Rank</TableHead>
                        <TableHead className="text-zinc-400">Asset</TableHead>
                        <TableHead className="text-zinc-400 text-right">Price</TableHead>
                        <TableHead className="text-zinc-400 text-right">24h Change</TableHead>
                        <TableHead className="text-zinc-400 text-right hidden md:table-cell">Market Cap</TableHead>
                        <TableHead className="text-zinc-400 text-right hidden lg:table-cell">Volume (24h)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coins?.map((coin) => (
                        <TableRow key={coin.id} className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer group">
                            <TableCell className="font-medium text-zinc-500">
                                {coin.market_cap_rank}
                            </TableCell>
                            <TableCell>
                                <Link href={`/coins/${coin.id}`} className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={coin.image} alt={coin.name} />
                                        <AvatarFallback>{coin.symbol[0].toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white group-hover:text-violet-400 transition-colors">
                                            {coin.name}
                                        </span>
                                        <span className="text-zinc-500 text-xs uppercase">{coin.symbol}</span>
                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell className="text-right font-medium text-white">
                                ${coin.current_price.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className={cn(
                                    "flex items-center justify-end",
                                    coin.price_change_percentage_24h >= 0 ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {coin.price_change_percentage_24h >= 0 ?
                                        <ArrowUp className="w-3 h-3 mr-1" /> :
                                        <ArrowDown className="w-3 h-3 mr-1" />
                                    }
                                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </div>
                            </TableCell>
                            <TableCell className="text-right hidden md:table-cell text-zinc-300">
                                ${coin.market_cap.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right hidden lg:table-cell text-zinc-300">
                                ${coin.total_volume.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
