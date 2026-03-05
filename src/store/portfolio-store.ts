import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AssetType = "crypto" | "stock"

export interface Transaction {
    id: string
    assetId: string // Crypto: coinId (e.g., "bitcoin"), Stock: symbol (e.g., "NVDA")
    assetName: string // Display name
    assetType: AssetType
    type: "buy" | "sell"
    amount: number
    pricePerUnit: number
    date: string
}

export interface PortfolioState {
    initialBalance: number // Customizable starting amount
    balance: number
    holdings: { [assetId: string]: { amount: number; type: AssetType } }
    transactions: Transaction[]
    realizedGains: number // Total profit/loss from completed sells
    addTransaction: (transaction: Omit<Transaction, "id" | "date">) => void
    resetPortfolio: () => void
    setInitialBalance: (amount: number) => void
}

// Helper: Calculate average cost basis for an asset
const getAverageCostBasis = (assetId: string, transactions: Transaction[]): number => {
    const assetTxs = transactions.filter(tx => tx.assetId === assetId && tx.type === "buy")
    if (assetTxs.length === 0) return 0

    const totalCost = assetTxs.reduce((sum, tx) => sum + (tx.amount * tx.pricePerUnit), 0)
    const totalAmount = assetTxs.reduce((sum, tx) => sum + tx.amount, 0)

    return totalAmount > 0 ? totalCost / totalAmount : 0
}

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set, get) => ({
            initialBalance: 100000, // Default $100k, user can customize
            balance: 100000,
            holdings: {},
            transactions: [],
            realizedGains: 0,

            addTransaction: (tx) => {
                const { balance, holdings, transactions, realizedGains } = get()
                const totalCost = tx.amount * tx.pricePerUnit

                if (tx.type === "buy") {
                    if (balance < totalCost) return

                    set({
                        balance: balance - totalCost,
                        holdings: {
                            ...holdings,
                            [tx.assetId]: {
                                amount: (holdings[tx.assetId]?.amount || 0) + tx.amount,
                                type: tx.assetType
                            },
                        },
                        transactions: [
                            { ...tx, id: crypto.randomUUID(), date: new Date().toISOString() },
                            ...transactions,
                        ],
                    })
                } else {
                    // Sell logic with realized gains calculation
                    const currentHolding = holdings[tx.assetId]?.amount || 0
                    if (currentHolding < tx.amount) return

                    // Calculate realized gain/loss for this sale
                    const avgCostBasis = getAverageCostBasis(tx.assetId, transactions)
                    const costBasis = avgCostBasis * tx.amount
                    const saleProceeds = tx.pricePerUnit * tx.amount
                    const gainLoss = saleProceeds - costBasis

                    const newAmount = currentHolding - tx.amount
                    const newHoldings = { ...holdings }
                    if (newAmount <= 0) {
                        delete newHoldings[tx.assetId]
                    } else {
                        newHoldings[tx.assetId] = { amount: newAmount, type: tx.assetType }
                    }

                    set({
                        balance: balance + totalCost,
                        holdings: newHoldings,
                        realizedGains: realizedGains + gainLoss,
                        transactions: [
                            { ...tx, id: crypto.randomUUID(), date: new Date().toISOString() },
                            ...transactions,
                        ],
                    })
                }
            },

            resetPortfolio: () => {
                const { initialBalance } = get()
                set({
                    balance: initialBalance,
                    holdings: {},
                    transactions: [],
                    realizedGains: 0
                })
            },

            setInitialBalance: (amount: number) => {
                set({
                    initialBalance: amount,
                    balance: amount,
                    holdings: {},
                    transactions: [],
                    realizedGains: 0
                })
            },
        }),
        {
            name: "portfolio-storage",
        }
    )
)

// Helper function to calculate unrealized gains (used in components)
export const calculateUnrealizedGains = (
    holdings: { [assetId: string]: { amount: number; type: AssetType } },
    transactions: Transaction[],
    currentPrices: { [assetId: string]: number }
): number => {
    let totalUnrealized = 0

    Object.entries(holdings).forEach(([assetId, { amount }]) => {
        const avgCostBasis = getAverageCostBasis(assetId, transactions)
        const currentPrice = currentPrices[assetId] || 0
        const currentValue = amount * currentPrice
        const costBasis = amount * avgCostBasis

        totalUnrealized += (currentValue - costBasis)
    })

    return totalUnrealized
}
