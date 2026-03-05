"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, BarChart3, CheckCircle2 } from "lucide-react"
import { StockScore, getRecommendationStyle } from "@/lib/stock-scorer"
import { formatCurrency } from "@/lib/currency"
import { TradeModal } from "@/components/portfolio/trade-modal"
import Link from "next/link"

interface StockRecommendationCardProps {
    score: StockScore
    rank: number
}

export function StockRecommendationCard({ score, rank }: StockRecommendationCardProps) {
    const recStyle = getRecommendationStyle(score.recommendation)

    return (
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={`https://financialmodelingprep.com/image-stock/${score.symbol}.png`}
                                    alt={score.name}
                                />
                                <AvatarFallback className="bg-violet-500/20 text-violet-400">
                                    {score.symbol.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                #{rank}
                            </div>
                        </div>
                        <div>
                            <Link href={`/stocks/${score.symbol}`}>
                                <h3 className="font-semibold text-white hover:text-violet-400 transition-colors">
                                    {score.name}
                                </h3>
                            </Link>
                            <p className="text-sm text-zinc-400">{score.symbol}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className={`${recStyle.textColor} border-current`}>
                        {recStyle.label}
                    </Badge>
                </div>

                {/* Score */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">Total Score</span>
                        <span className="text-2xl font-bold text-white">
                            {score.totalScore}/100
                        </span>
                    </div>
                    <Progress value={score.totalScore} className="h-2" />
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-zinc-400">Technical</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                            {score.technicalScore}/50
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-zinc-400">Fundamental</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                            {score.fundamentalScore}/50
                        </div>
                    </div>
                </div>

                {/* Key Reasons */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-zinc-300 mb-2">Key Reasons</h4>
                    <ul className="space-y-1">
                        {score.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>{reason}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                    <div>
                        <span className="text-zinc-500">Price</span>
                        <div className="text-white font-semibold">
                            {formatCurrency(score.price, score.symbol)}
                        </div>
                    </div>
                    <div>
                        <span className="text-zinc-500">RSI</span>
                        <div className="text-white font-semibold">{score.rsi.toFixed(1)}</div>
                    </div>
                    <div>
                        <span className="text-zinc-500">P/E</span>
                        <div className="text-white font-semibold">
                            {score.pe ? score.pe.toFixed(1) : "N/A"}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <TradeModal
                        assetId={score.symbol}
                        assetName={score.name}
                        currentPrice={score.price}
                        assetType="stock"
                        buttonClassName="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                    />
                    <Link href={`/stocks/${score.symbol}`} className="flex-1">
                        <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                            Details
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
