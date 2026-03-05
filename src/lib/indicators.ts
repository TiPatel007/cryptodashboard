// Technical indicator utilities

/**
 * Calculate RSI (Relative Strength Index)
 * @param prices - Array of closing prices (most recent last)
 * @param period - RSI period (default 14)
 * @returns RSI value between 0-100
 */
export function calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) {
        return 50 // Not enough data, return neutral
    }

    const changes: number[] = []
    for (let i = 1; i < prices.length; i++) {
        changes.push(prices[i] - prices[i - 1])
    }

    let gains = 0
    let losses = 0

    // Calculate initial average gain/loss
    for (let i = 0; i < period; i++) {
        if (changes[i] >= 0) {
            gains += changes[i]
        } else {
            losses += Math.abs(changes[i])
        }
    }

    let avgGain = gains / period
    let avgLoss = losses / period

    // Calculate smoothed averages for remaining periods
    for (let i = period; i < changes.length; i++) {
        const change = changes[i]
        if (change >= 0) {
            avgGain = (avgGain * (period - 1) + change) / period
            avgLoss = (avgLoss * (period - 1)) / period
        } else {
            avgGain = (avgGain * (period - 1)) / period
            avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period
        }
    }

    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))

    return Math.round(rsi * 100) / 100
}

/**
 * Get RSI signal
 * @param rsi - RSI value
 * @returns Signal type and label
 */
export function getRSISignal(rsi: number): { type: "buy" | "sell" | "neutral"; label: string } {
    if (rsi > 80) {
        return { type: "sell", label: "Overpriced" }
    } else if (rsi < 30) {
        return { type: "buy", label: "Buy Signal" }
    } else if (rsi >= 70) {
        return { type: "neutral", label: "Overbought" }
    } else if (rsi <= 40) {
        return { type: "neutral", label: "Undervalued" }
    }
    return { type: "neutral", label: "Neutral" }
}

/**
 * Calculate Simple Moving Average
 * @param prices - Array of prices
 * @param period - Period for MA
 */
export function calculateSMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null

    const slice = prices.slice(-period)
    const sum = slice.reduce((a, b) => a + b, 0)
    return sum / period
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * @param prices - Array of closing prices
 */
export function calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } | null {
    if (prices.length < 26) return null

    const ema12 = calculateEMA(prices, 12)
    const ema26 = calculateEMA(prices, 26)

    if (ema12 === null || ema26 === null) return null

    const macd = ema12 - ema26

    // For signal line, we'd need to calculate EMA of MACD values
    // Simplified version: return the MACD value
    const signal = 0 // Would need historical MACD values
    const histogram = macd - signal

    return {
        macd: Math.round(macd * 100) / 100,
        signal: Math.round(signal * 100) / 100,
        histogram: Math.round(histogram * 100) / 100
    }
}

/**
 * Calculate Exponential Moving Average
 */
function calculateEMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null

    const multiplier = 2 / (period + 1)
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period

    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema
    }

    return ema
}
