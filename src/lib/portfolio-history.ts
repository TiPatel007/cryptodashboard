import { Transaction, AssetType } from "@/store/portfolio-store"

export type Timeframe = "1H" | "1D" | "5D" | "1W" | "1M" | "3M" | "1Y" | "ALL"

export interface PortfolioDataPoint {
    timestamp: number
    value: number
    date: string
}

export interface PerformanceMetrics {
    currentValue: number
    previousValue: number
    change: number
    changePercent: number
}

/**
 * Calculate portfolio value at a specific point in time
 */
export const calculatePortfolioValueAtTime = (
    timestamp: number,
    transactions: Transaction[],
    initialBalance: number,
    currentPrices: { [assetId: string]: number }
): number => {
    // Filter transactions up to this timestamp
    const relevantTransactions = transactions.filter(
        tx => new Date(tx.date).getTime() <= timestamp
    )

    // Calculate balance and holdings at this point
    let balance = initialBalance
    const holdings: { [assetId: string]: number } = {}

    relevantTransactions.forEach(tx => {
        const totalCost = tx.amount * tx.pricePerUnit

        if (tx.type === "buy") {
            balance -= totalCost
            holdings[tx.assetId] = (holdings[tx.assetId] || 0) + tx.amount
        } else {
            balance += totalCost
            holdings[tx.assetId] = (holdings[tx.assetId] || 0) - tx.amount
        }
    })

    // Calculate current value of holdings using current prices
    let holdingsValue = 0
    Object.entries(holdings).forEach(([assetId, amount]) => {
        const currentPrice = currentPrices[assetId] || 0
        holdingsValue += amount * currentPrice
    })

    return balance + holdingsValue
}

/**
 * Generate time series data for portfolio history
 */
export const generatePortfolioHistory = (
    timeframe: Timeframe,
    transactions: Transaction[],
    initialBalance: number,
    currentPrices: { [assetId: string]: number }
): PortfolioDataPoint[] => {
    if (transactions.length === 0) {
        // No transactions, return flat line at initial balance
        const now = Date.now()
        return [
            {
                timestamp: now - getTimeframeMilliseconds(timeframe),
                value: initialBalance,
                date: new Date(now - getTimeframeMilliseconds(timeframe)).toISOString()
            },
            {
                timestamp: now,
                value: initialBalance,
                date: new Date(now).toISOString()
            }
        ]
    }

    const now = Date.now()
    const timeframeMs = getTimeframeMilliseconds(timeframe)
    const startTime = timeframe === "ALL"
        ? new Date(transactions[transactions.length - 1].date).getTime()
        : now - timeframeMs

    const dataPoints: PortfolioDataPoint[] = []
    const interval = getDataPointInterval(timeframe)

    // Generate data points at regular intervals
    for (let time = startTime; time <= now; time += interval) {
        const value = calculatePortfolioValueAtTime(time, transactions, initialBalance, currentPrices)
        dataPoints.push({
            timestamp: time,
            value,
            date: new Date(time).toISOString()
        })
    }

    // Always include current time
    const currentValue = calculatePortfolioValueAtTime(now, transactions, initialBalance, currentPrices)
    dataPoints.push({
        timestamp: now,
        value: currentValue,
        date: new Date(now).toISOString()
    })

    return dataPoints
}

/**
 * Calculate performance metrics for a timeframe
 */
export const calculatePerformanceMetrics = (
    data: PortfolioDataPoint[]
): PerformanceMetrics => {
    if (data.length === 0) {
        return {
            currentValue: 0,
            previousValue: 0,
            change: 0,
            changePercent: 0
        }
    }

    const currentValue = data[data.length - 1].value
    const previousValue = data[0].value

    const change = currentValue - previousValue
    const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0

    return {
        currentValue,
        previousValue,
        change,
        changePercent
    }
}

/**
 * Get milliseconds for each timeframe
 */
const getTimeframeMilliseconds = (timeframe: Timeframe): number => {
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    switch (timeframe) {
        case "1H": return hour
        case "1D": return day
        case "5D": return 5 * day
        case "1W": return 7 * day
        case "1M": return 30 * day
        case "3M": return 90 * day
        case "1Y": return 365 * day
        case "ALL": return Infinity
    }
}

/**
 * Get interval between data points for smooth charts
 */
const getDataPointInterval = (timeframe: Timeframe): number => {
    const minute = 60 * 1000
    const hour = 60 * minute

    switch (timeframe) {
        case "1H": return minute // Every minute
        case "1D": return 5 * minute // Every 5 minutes
        case "5D": return 30 * minute // Every 30 minutes
        case "1W": return hour // Every hour
        case "1M": return 4 * hour // Every 4 hours
        case "3M": return 12 * hour // Every 12 hours
        case "1Y": return 24 * hour // Daily
        case "ALL": return 24 * hour // Daily
    }
}

/**
 * Format date for chart tooltip based on timeframe
 */
export const formatChartDate = (timestamp: number, timeframe: Timeframe): string => {
    const date = new Date(timestamp)

    switch (timeframe) {
        case "1H":
        case "1D":
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        case "5D":
        case "1W":
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric'
            })
        case "1M":
        case "3M":
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        case "1Y":
        case "ALL":
            return date.toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
            })
    }
}
