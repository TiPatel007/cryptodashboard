// Currency conversion utilities
const INR_TO_USD_API = "https://api.exchangerate-api.com/v4/latest/INR"

let cachedRate: { rate: number; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function getINRtoUSDRate(): Promise<number> {
    // Check cache
    if (cachedRate && Date.now() - cachedRate.timestamp < CACHE_DURATION) {
        return cachedRate.rate
    }

    try {
        const response = await fetch(INR_TO_USD_API)
        const data = await response.json()
        const rate = data.rates.USD

        // Update cache
        cachedRate = {
            rate,
            timestamp: Date.now()
        }

        return rate
    } catch (error) {
        console.error("Failed to fetch INR to USD rate:", error)
        // Fallback to approximate rate if API fails
        return 0.012 // Approximate 1 INR = 0.012 USD
    }
}

export function isIndianStock(symbol: string): boolean {
    return symbol.endsWith('.NS') || symbol.endsWith('.BO')
}

export async function convertINRtoUSD(inrAmount: number): Promise<number> {
    const rate = await getINRtoUSDRate()
    return inrAmount * rate
}

export function formatCurrency(amount: number, symbol: string): string {
    if (isIndianStock(symbol)) {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
