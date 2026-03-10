// Stock scoring and recommendation engine

export interface StockScore {
    symbol: string
    name: string
    totalScore: number
    technicalScore: number
    fundamentalScore: number
    recommendation: "strong_buy" | "buy" | "hold" | "sell"
    reasons: string[]
    rsi: number
    price: number
    pe?: number
    marketCap?: number
    dividendYield?: number
}

export interface StockQuoteInput {
    symbol: string
    shortName?: string
    regularMarketPrice?: number
    regularMarketChangePercent?: number
    regularMarketVolume?: number
    averageVolume?: number
    marketCap?: number
    trailingPE?: number
    dividendYield?: number
    epsTrailingTwelveMonths?: number
    beta?: number
}

/**
 * Score a stock based on technical and fundamental analysis
 */
export function scoreStock(
    quote: StockQuoteInput,
    rsi: number,
    sma50: number,
    sma200: number
): StockScore {
    let technicalScore = 0
    let fundamentalScore = 0
    const reasons: string[] = []

    // TECHNICAL SCORING (50 points max)

    // 1. RSI Analysis (15 points)
    if (rsi >= 30 && rsi <= 40) {
        technicalScore += 15
        reasons.push("Strong buy signal (RSI in optimal range)")
    } else if (rsi > 40 && rsi <= 50) {
        technicalScore += 10
        reasons.push("Buy signal (RSI indicates undervalued)")
    } else if (rsi > 50 && rsi <= 60) {
        technicalScore += 5
        reasons.push("Neutral RSI")
    } else if (rsi < 30) {
        technicalScore += 5
        reasons.push("Oversold - potential bounce")
    } else if (rsi > 70) {
        technicalScore += 3
        reasons.push("Overbought - caution advised")
    }

    const currentPrice = quote.regularMarketPrice || 0

    // 2. Moving Average Analysis (15 points)
    if (sma50 > 0 && sma200 > 0) {
        if (currentPrice > sma50 && sma50 > sma200) {
            technicalScore += 15
            reasons.push("Golden cross pattern (bullish)")
        } else if (currentPrice > sma50) {
            technicalScore += 10
            reasons.push("Above 50-day MA (short-term bullish)")
        } else if (currentPrice > sma200) {
            technicalScore += 5
            reasons.push("Above 200-day MA (long-term bullish)")
        }
    }

    // 3. Price Momentum (10 points)
    const changePercent = quote.regularMarketChangePercent || 0
    if (changePercent > 0) {
        technicalScore += 10
        reasons.push(`Positive momentum (+${changePercent.toFixed(2)}%)`)
    } else if (changePercent === 0) {
        technicalScore += 5
    }

    // 4. Volume Analysis (10 points)
    const volume = quote.regularMarketVolume || 0
    const avgVolume = quote.averageVolume || 0
    if (volume > avgVolume * 1.2) {
        technicalScore += 10
        reasons.push("High trading volume")
    } else if (volume > avgVolume * 0.8) {
        technicalScore += 5
    }

    // FUNDAMENTAL SCORING (50 points max)

    // 1. P/E Ratio (15 points)
    const pe = quote.trailingPE
    if (pe) {
        if (pe >= 10 && pe <= 20) {
            fundamentalScore += 15
            reasons.push("Attractive P/E ratio (undervalued)")
        } else if (pe > 20 && pe <= 30) {
            fundamentalScore += 10
            reasons.push("Fair P/E ratio")
        } else if (pe > 30) {
            fundamentalScore += 5
            reasons.push("Growth stock (high P/E)")
        }
    }

    // 2. Dividend Yield (10 points)
    const dividendYield = quote.dividendYield
    if (dividendYield) {
        if (dividendYield > 3) {
            fundamentalScore += 10
            reasons.push(`Strong dividend yield (${dividendYield.toFixed(2)}%)`)
        } else if (dividendYield >= 1) {
            fundamentalScore += 7
            reasons.push(`Good dividend yield (${dividendYield.toFixed(2)}%)`)
        } else {
            fundamentalScore += 3
        }
    } else {
        fundamentalScore += 2 // Some points for growth stocks without dividends
    }


    // 3. Market Cap (10 points)
    const marketCap = quote.marketCap || 0
    if (marketCap > 10e9) {
        fundamentalScore += 10
        reasons.push("Large cap (stable and established)")
    } else if (marketCap > 2e9) {
        fundamentalScore += 7
        reasons.push("Mid cap (growth potential)")
    } else if (marketCap > 0) {
        fundamentalScore += 5
        reasons.push("Small cap (high growth potential)")
    }

    // 4. EPS (10 points)
    const eps = quote.epsTrailingTwelveMonths
    if (eps && eps > 0) {
        fundamentalScore += 10
        reasons.push("Profitable (positive EPS)")
    } else if (eps) {
        fundamentalScore += 5
    }

    // 5. Beta (5 points)
    const beta = quote.beta
    if (beta !== undefined && beta >= 0.8 && beta <= 1.2) {
        fundamentalScore += 5
        reasons.push("Moderate risk (stable beta)")
    } else if (beta) {
        fundamentalScore += 3
    }

    const totalScore = technicalScore + fundamentalScore
    const recommendation = getRecommendation(totalScore)

    return {
        symbol: quote.symbol,
        name: quote.shortName || quote.symbol,
        totalScore,
        technicalScore,
        fundamentalScore,
        recommendation,
        reasons: reasons.slice(0, 5), // Top 5 reasons
        rsi,
        price: currentPrice,
        pe,
        marketCap,
        dividendYield
    }
}

/**
 * Get recommendation based on total score
 */
export function getRecommendation(score: number): "strong_buy" | "buy" | "hold" | "sell" {
    if (score >= 75) return "strong_buy"
    if (score >= 60) return "buy"
    if (score >= 40) return "hold"
    return "sell"
}

/**
 * Get recommendation label and color
 */
export function getRecommendationStyle(recommendation: string) {
    switch (recommendation) {
        case "strong_buy":
            return { label: "Strong Buy", color: "bg-emerald-500", textColor: "text-emerald-500" }
        case "buy":
            return { label: "Buy", color: "bg-green-500", textColor: "text-green-500" }
        case "hold":
            return { label: "Hold", color: "bg-yellow-500", textColor: "text-yellow-500" }
        case "sell":
            return { label: "Sell", color: "bg-rose-500", textColor: "text-rose-500" }
        default:
            return { label: "Unknown", color: "bg-gray-500", textColor: "text-gray-500" }
    }
}
