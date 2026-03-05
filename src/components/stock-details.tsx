"use client"

import { useQuery } from "@tanstack/react-query"
import { getStockQuote, getStockHistory } from "@/lib/stocks-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowUp, ArrowDown, Globe, TrendingUp, TrendingDown } from "lucide-react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TradeModal } from "@/components/portfolio/trade-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { isIndianStock, formatCurrency } from "@/lib/currency"
import { calculateRSI, calculateSMA } from "@/lib/indicators"
import { RSIGauge } from "@/components/indicators/rsi-gauge"


export function StockDetails({ symbol }: { symbol: string }) {
    const [days, setDays] = useState("30") // Default to 30 days for stocks

    const { data: stock, isLoading: loadingStock } = useQuery({
        queryKey: ["stock", symbol],
        queryFn: () => getStockQuote(symbol),
    })

    const { data: history, isLoading: loadingHistory } = useQuery({
        queryKey: ["stock-history", symbol, days],
        queryFn: () => getStockHistory(symbol, days),
    })

    // Calculate technical indicators at the top level (before any early returns)
    const rsi = useMemo(() => {
        if (!history?.prices || history.prices.length === 0) return 50
        const prices = history.prices.map((p: [number, number]) => p[1])
        return calculateRSI(prices)
    }, [history?.prices])

    const sma50 = useMemo(() => {
        if (!history?.prices || history.prices.length === 0) return 0
        const prices = history.prices.map((p: [number, number]) => p[1])
        return calculateSMA(prices, 50) || 0
    }, [history?.prices])

    const sma200 = useMemo(() => {
        if (!history?.prices || history.prices.length === 0) return 0
        const prices = history.prices.map((p: [number, number]) => p[1])
        return calculateSMA(prices, 200) || 0
    }, [history?.prices])

    if (loadingStock) {
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

    if (!stock) return <div>Stock not found</div>

    // Yahoo Finance data mapping
    const price = stock.regularMarketPrice
    const changePercent = stock.regularMarketChangePercent
    const isPositive = changePercent >= 0

    const chartData = history?.prices?.map((price: [number, number]) => ({
        date: price[0],
        price: price[1],
    })) ?? []

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-full">
                        <AvatarImage
                            src={`https://financialmodelingprep.com/image-stock/${symbol}.png`}
                            alt={stock.shortName || symbol}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xl font-semibold">
                            {symbol.slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {stock.shortName} ({symbol})
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-white/10 text-zinc-300 hover:bg-white/20">
                                {stock.exchange}
                            </Badge>
                            <Badge variant="outline" className="border-white/10 text-zinc-400">
                                {stock.quoteType}
                            </Badge>
                            <TradeModal
                                assetId={symbol.toUpperCase()}
                                assetName={stock.shortName || symbol}
                                currentPrice={price}
                                assetType="stock"
                                buttonClassName="bg-blue-600 hover:bg-blue-700 text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                        {formatCurrency(price, symbol)}
                    </div>
                    <div className={cn(
                        "flex items-center justify-end text-sm font-medium",
                        isPositive ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                        {Math.abs(changePercent).toFixed(2)}%
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
                                    days === d ? "bg-blue-600 hover:bg-blue-700" : "text-zinc-400 hover:text-white"
                                )}
                            >
                                {d === '1' ? '1D' : d === '365' ? '1Y' : `${d}D`}
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
                                        <linearGradient id="colorStockPrice" x1="0" y1="0" x2="0" y2="1">
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
                                        minTickGap={30}
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
                                        fill="url(#colorStockPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Technical Indicators & Fundamentals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Technical Indicators */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Technical Indicators</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {history?.prices && history.prices.length > 0 ? (
                            <>
                                {/* RSI Gauge */}
                                <div className="mb-6">
                                    <RSIGauge rsi={rsi} />
                                </div>

                                {/* Moving Averages */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm text-zinc-300">50-Day MA</span>
                                        </div>
                                        <span className="text-white font-semibold">
                                            {formatCurrency(sma50, symbol)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <TrendingDown className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm text-zinc-300">200-Day MA</span>
                                        </div>
                                        <span className="text-white font-semibold">
                                            {formatCurrency(sma200, symbol)}
                                        </span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-zinc-500 py-8">
                                Loading technical data...
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Fundamentals */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Fundamentals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-zinc-300">P/E Ratio</span>
                            <span className="text-white font-semibold">
                                {(stock as any).trailingPE ? (stock as any).trailingPE.toFixed(2) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-zinc-300">Market Cap</span>
                            <span className="text-white font-semibold">
                                {stock.marketCap ? `${formatCurrency(stock.marketCap / 1e9, symbol)}B` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-zinc-300">Dividend Yield</span>
                            <span className="text-white font-semibold">
                                {(stock as any).dividendYield ? `${(stock as any).dividendYield.toFixed(2)}%` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-zinc-300">EPS</span>
                            <span className="text-white font-semibold">
                                {(stock as any).epsTrailingTwelveMonths ? formatCurrency((stock as any).epsTrailingTwelveMonths, symbol) : 'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-zinc-300">Beta</span>
                            <span className="text-white font-semibold">
                                {(stock as any).beta ? (stock as any).beta.toFixed(2) : 'N/A'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Market Cap" value={stock.marketCap ? `${formatCurrency(stock.marketCap / 1e9, symbol)}B` : 'N/A'} />
                <StatCard label="52W High" value={formatCurrency(stock.fiftyTwoWeekHigh || 0, symbol)} />
                <StatCard label="52W Low" value={formatCurrency(stock.fiftyTwoWeekLow || 0, symbol)} />
                <StatCard label="Volume" value={stock.regularMarketVolume?.toLocaleString()} />
            </div>
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
