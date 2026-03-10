"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { searchCoins } from "@/lib/api"
import { searchStocks } from "@/lib/stocks-api"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { AssetType, Stock } from "@/lib/types"
import { Bitcoin, TrendingUp } from "lucide-react"

interface CoinSearchResult {
    id: string
    name: string
    symbol: string
    thumb?: string
}

export function Search() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const debouncedQuery = useDebounce(query, 300)
    const router = useRouter()

    const { data: coinResults, isLoading: coinsLoading } = useQuery({
        queryKey: ["search", "coins", debouncedQuery],
        queryFn: () => searchCoins(debouncedQuery),
        enabled: !!debouncedQuery,
    })

    const { data: stockResults, isLoading: stocksLoading } = useQuery({
        queryKey: ["search", "stocks", debouncedQuery],
        queryFn: () => searchStocks(debouncedQuery),
        enabled: !!debouncedQuery,
    })

    const isLoading = coinsLoading || stocksLoading

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const handleSelect = (id: string, type: AssetType) => {
        setOpen(false)
        if (type === "crypto") {
            router.push(`/coins/${id}`)
        } else {
            router.push(`/stocks/${id}`)
        }
    }

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-9 w-full justify-start rounded-[0.5rem] bg-background/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                )}
                onClick={() => setOpen(true)}
            >
                <span className="hidden lg:inline-flex">Search assets...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search crypto or stocks..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    {isLoading && (
                        <div className="py-6 text-center text-sm text-zinc-500">
                            Searching assets...
                        </div>
                    )}
                    {!isLoading && (!coinResults || coinResults.length === 0) && (!stockResults || stockResults.length === 0) && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    {stockResults && stockResults.length > 0 && (
                        <CommandGroup heading="Stocks">
                            {stockResults.slice(0, 5).map((stock: Stock) => (
                                <CommandItem
                                    key={stock.symbol}
                                    value={stock.longName || stock.shortName || stock.symbol}
                                    onSelect={() => handleSelect(stock.symbol, "stock")}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={`https://financialmodelingprep.com/image-stock/${stock.symbol}.png`}
                                        alt={stock.symbol}
                                        className="h-6 w-6 rounded-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                        }}
                                    />
                                    <div className="hidden h-6 w-6 rounded-full bg-violet-500/20 text-violet-400 text-xs font-semibold items-center justify-center">
                                        {stock.symbol.slice(0, 2)}
                                    </div>
                                    <span>{stock.shortName || stock.longName || stock.symbol}</span>
                                    <span className="ml-2 text-xs text-muted-foreground">({stock.symbol})</span>
                                    <span className="ml-auto text-xs text-zinc-500">{stock.exchange}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {stockResults && stockResults.length > 0 && coinResults && coinResults.length > 0 && (
                        <CommandSeparator />
                    )}

                    {coinResults && coinResults.length > 0 && (
                        <CommandGroup heading="Crypto">
                            {(coinResults as CoinSearchResult[])
                                .filter((coin) => !coin.name.toLowerCase().includes("tokenized stock") && !coin.name.toLowerCase().includes("xstock"))
                                .slice(0, 5)
                                .map((coin) => (
                                    <CommandItem
                                        key={coin.id}
                                        value={coin.name}
                                        onSelect={() => handleSelect(coin.id, "crypto")}
                                    >
                                        <Bitcoin className="mr-2 h-4 w-4 text-orange-500" />
                                        <span>{coin.name}</span>
                                        <span className="ml-2 text-xs text-muted-foreground">({coin.symbol})</span>
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
