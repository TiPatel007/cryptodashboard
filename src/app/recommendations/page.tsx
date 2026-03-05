"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getStockQuote, getStockHistory } from "@/lib/stocks-api"
import { calculateRSI, calculateSMA } from "@/lib/indicators"
import { scoreStock, StockScore } from "@/lib/stock-scorer"
import { StockRecommendationCard } from "@/components/recommendations/stock-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, TrendingUp, Globe } from "lucide-react"

// Curated stock universe
const US_STOCKS = ["AAPL", "GOOGL", "MSFT", "NVDA", "TSLA", "AMZN", "META", "JPM", "V", "WMT"]
const INDIAN_STOCKS = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "HINDUNILVR.NS",
    "ICICIBANK.NS", "ITC.NS", "BHARTIARTL.NS", "SBIN.NS", "BAJFINANCE.NS"]

type Market = "all" | "us" | "india"
type SortBy = "total" | "technical" | "fundamental"

export default function RecommendationsPage() {
    const [market, setMarket] = useState<Market>("all")
    const [sortBy, setSortBy] = useState<SortBy>("total")
    const [scores, setScores] = useState<StockScore[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch and score all stocks
    useEffect(() => {
        async function analyzeStocks() {
            setIsLoading(true)
            const stocksToAnalyze = market === "us" ? US_STOCKS
                : market === "india" ? INDIAN_STOCKS
                    : [...US_STOCKS, ...INDIAN_STOCKS]

            const stockScores: StockScore[] = []

            for (const symbol of stocksToAnalyze) {
                try {
                    const quote = await getStockQuote(symbol)
                    const history = await getStockHistory(symbol, "30")

                    if (!quote || !history?.prices) continue

                    const prices = history.prices.map((p: [number, number]) => p[1])
                    const rsi = calculateRSI(prices)
                    const sma50 = calculateSMA(prices, 50) || 0
                    const sma200 = calculateSMA(prices, 200) || 0

                    const score = scoreStock(quote, rsi, sma50, sma200)
                    stockScores.push(score)
                } catch (error) {
                    console.error(`Failed to score ${symbol}:`, error)
                }
            }

            // Sort scores
            stockScores.sort((a, b) => {
                if (sortBy === "technical") return b.technicalScore - a.technicalScore
                if (sortBy === "fundamental") return b.fundamentalScore - a.fundamentalScore
                return b.totalScore - a.totalScore
            })

            setScores(stockScores)
            setIsLoading(false)
        }

        analyzeStocks()
    }, [market, sortBy])

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl">
                        <Sparkles className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Stock Recommendations</h1>
                        <p className="text-zinc-400">
                            AI-powered analysis based on technical indicators and fundamentals
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            {/* Market Filter */}
                            <div className="flex gap-2">
                                <Button
                                    variant={market === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setMarket("all")}
                                    className={market === "all" ?
                                        "bg-violet-500 hover:bg-violet-600" :
                                        "border-white/20 hover:bg-white/10"}
                                >
                                    <Globe className="w-4 h-4 mr-2" />
                                    All Markets
                                </Button>
                                <Button
                                    variant={market === "us" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setMarket("us")}
                                    className={market === "us" ?
                                        "bg-violet-500 hover:bg-violet-600" :
                                        "border-white/20 hover:bg-white/10"}
                                >
                                    US Stocks
                                </Button>
                                <Button
                                    variant={market === "india" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setMarket("india")}
                                    className={market === "india" ?
                                        "bg-violet-500 hover:bg-violet-600" :
                                        "border-white/20 hover:bg-white/10"}
                                >
                                    Indian Stocks
                                </Button>
                            </div>

                            {/* Sort Filter */}
                            <div className="flex gap-2">
                                <span className="text-sm text-zinc-400 self-center">Sort by:</span>
                                <Button
                                    variant={sortBy === "total" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSortBy("total")}
                                    className={sortBy === "total" ?
                                        "bg-violet-500 hover:bg-violet-600" :
                                        "border-white/20 hover:bg-white/10"}
                                >
                                    Total Score
                                </Button>
                                <Button
                                    variant={sortBy === "technical" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSortBy("technical")}
                                    className={sortBy === "technical" ?
                                        "bg-violet-500 hover:bg-violet-600" :
                                        "border-white/20 hover:bg-white/10"}
                                >
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    Technical
                                </Button>
                                <Button
                                    variant={sortBy === "fundamental" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSortBy("fundamental")}
                                    className={sortBy === "fundamental" ?
                                        "bg-violet-500 hover:bg-violet-600" :
                                        "border-white/20 hover:bg-white/10"}
                                >
                                    Fundamental
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Disclaimer */}
            <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-4">
                    <p className="text-sm text-yellow-200/80">
                        ⚠️ <strong>Disclaimer:</strong> These recommendations are for educational purposes only
                        and should not be considered as financial advice. Always do your own research before making
                        investment decisions.
                    </p>
                </CardContent>
            </Card>

            {/* Recommendations Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, idx) => (
                        <Skeleton key={idx} className="h-96" />
                    ))}
                </div>
            ) : scores.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scores.map((score, idx) => (
                        <StockRecommendationCard key={score.symbol} score={score} rank={idx + 1} />
                    ))}
                </div>
            ) : (
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-12 text-center">
                        <p className="text-zinc-400">No recommendations available at the moment.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
