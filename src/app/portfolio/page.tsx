"use client"

import { usePortfolioStore, calculateUnrealizedGains } from "@/store/portfolio-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { getMarketData } from "@/lib/api"
import { getStockQuote } from "@/lib/stocks-api"
import { Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isIndianStock, convertINRtoUSD } from "@/lib/currency"
import { PortfolioPerformanceChart } from "@/components/portfolio/portfolio-performance-chart"


export default function PortfolioPage() {
    const { balance, holdings, resetPortfolio, realizedGains, transactions, initialBalance } = usePortfolioStore()

    // Fetch crypto market data
    const { data: marketData } = useQuery({
        queryKey: ["marketData"],
        queryFn: () => getMarketData(1, 100),
        refetchInterval: 30000,
    })

    // Extract stock symbols from holdings
    const stockHoldings = Object.entries(holdings)
        .filter(([, data]) => data.type === "stock")
        .map(([symbol]) => symbol)

    // Fetch stock quotes for all stock holdings
    const stockQueries = useQuery({
        queryKey: ["stockQuotes", stockHoldings],
        queryFn: async () => {
            if (stockHoldings.length === 0) return {}
            const quotes = await Promise.all(
                stockHoldings.map(async (symbol) => {
                    try {
                        const quote = await getStockQuote(symbol)
                        return { symbol, quote }
                    } catch (error) {
                        console.error(`Error fetching ${symbol}:`, error)
                        return { symbol, quote: null }
                    }
                })
            )
            return Object.fromEntries(quotes.map(q => [q.symbol, q.quote]))
        },
        refetchInterval: 30000,
        enabled: stockHoldings.length > 0,
    })

    const stockPrices = stockQueries.data || {}

    // Fetch INR to USD rate if we have Indian stocks
    const hasIndianStocks = stockHoldings.some(symbol => isIndianStock(symbol))
    const { data: inrToUsdRate } = useQuery({
        queryKey: ["inrToUsdRate"],
        queryFn: async () => {
            try {
                const response = await fetch("https://api.exchangerate-api.com/v4/latest/INR")
                const data = await response.json()
                return data.rates.USD
            } catch (error) {
                console.error("Failed to fetch INR to USD rate:", error)
                return 0.012 // Fallback rate
            }
        },
        refetchInterval: 3600000, // Refresh every hour
        enabled: hasIndianStocks,
    })

    const conversionRate = inrToUsdRate || 0.012

    // Calculate unified holdings list + current prices map
    let totalPortfolioValue = balance
    const currentPrices: { [assetId: string]: number } = {}

    const holdingsList = Object.entries(holdings).map(([assetId, { amount, type }]) => {
        if (type === "crypto") {
            const coin = marketData?.find(c => c.id === assetId)
            const currentPrice = coin?.current_price || 0
            currentPrices[assetId] = currentPrice
            const value = amount * currentPrice
            totalPortfolioValue += value
            return {
                id: assetId,
                name: coin?.name || assetId,
                symbol: coin?.symbol || "",
                amount,
                currentPrice,
                value,
                type: "crypto" as const
            }
        } else {
            // Stock
            const stockQuote = stockPrices[assetId]
            let currentPrice = stockQuote?.regularMarketPrice || 0

            // Convert INR to USD for Indian stocks
            if (isIndianStock(assetId)) {
                currentPrice = currentPrice * conversionRate
            }

            currentPrices[assetId] = currentPrice
            const value = amount * currentPrice
            totalPortfolioValue += value
            return {
                id: assetId,
                name: stockQuote?.shortName || assetId,
                symbol: assetId,
                amount,
                currentPrice,
                value,
                type: "stock" as const
            }
        }
    }).filter(h => h.amount > 0).sort((a, b) => b.value - a.value)


    // Calculate unrealized gains
    const unrealizedGains = calculateUnrealizedGains(holdings, transactions, currentPrices)

    // Calculate total gains (realized + unrealized)
    const totalGains = realizedGains + unrealizedGains
    const totalGainsPercent = initialBalance > 0 ? (totalGains / initialBalance) * 100 : 0

    const pieData = [
        { name: "Cash", value: balance },
        ...holdingsList.map(h => ({ name: h.name, value: h.value }))
    ]

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f59e0b', '#06b6d4']

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Portfolio</h1>
                    <p className="text-zinc-400">Track your simulated holdings and performance.</p>
                </div>
                <Button variant="destructive" onClick={resetPortfolio} size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset Portfolio
                </Button>
            </div>

            {/* Portfolio Performance Chart */}
            <PortfolioPerformanceChart
                transactions={transactions}
                initialBalance={initialBalance}
                currentPrices={currentPrices}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-zinc-400">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm text-zinc-400 mb-1">Total Value</div>
                            <div className="text-4xl font-bold text-white">
                                ${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div>
                                <div className="text-sm text-zinc-400 mb-1">Cash Balance</div>
                                <div className="text-lg font-semibold text-white">
                                    ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-zinc-400 mb-1">Total Gains/Losses</div>
                                <div className={cn(
                                    "text-lg font-semibold flex items-center gap-1",
                                    totalGains >= 0 ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {totalGains >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                    ${Math.abs(totalGains).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    <span className="text-sm">({totalGainsPercent >= 0 ? '+' : ''}{totalGainsPercent.toFixed(2)}%)</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div>
                                <div className="text-sm text-zinc-400 mb-1 flex items-center gap-2">
                                    Unrealized G/L
                                    <Badge variant="outline" className="text-xs">Open Positions</Badge>
                                </div>
                                <div className={cn(
                                    "text-lg font-semibold",
                                    unrealizedGains >= 0 ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {unrealizedGains >= 0 ? '+' : ''}${unrealizedGains.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-zinc-400 mb-1 flex items-center gap-2">
                                    Realized G/L
                                    <Badge variant="outline" className="text-xs">Closed Positions</Badge>
                                </div>
                                <div className={cn(
                                    "text-lg font-semibold",
                                    realizedGains >= 0 ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {realizedGains >= 0 ? '+' : ''}${realizedGains.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-zinc-400">Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                                    formatter={(value: number | undefined) => value ? `$${value.toLocaleString()}` : '$0'}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>Your Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-zinc-400">Asset</TableHead>
                                <TableHead className="text-zinc-400 text-right">Holdings</TableHead>
                                <TableHead className="text-zinc-400 text-right">Price</TableHead>
                                <TableHead className="text-zinc-400 text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holdingsList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-zinc-500 py-8">
                                        No assets found. Go to the market to start trading!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                holdingsList.map(item => (
                                    <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium text-white">
                                            <div className="flex items-center gap-2">
                                                {item.type === 'stock' ? `${item.name} (${item.symbol})` : item.name}
                                                <Badge variant="outline" className="text-xs">
                                                    {item.type === 'crypto' ? 'CRYPTO' : 'STOCK'}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-zinc-300">
                                            {item.type === 'stock' ? item.amount.toFixed(0) : item.amount.toFixed(4)} {item.symbol.toUpperCase()}
                                        </TableCell>
                                        <TableCell className="text-right text-zinc-300">
                                            ${item.currentPrice.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-white">
                                            ${item.value.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
