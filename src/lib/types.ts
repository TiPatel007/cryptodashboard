export interface Coin {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    market_cap: number
    market_cap_rank: number
    fully_diluted_valuation: number
    total_volume: number
    high_24h: number
    low_24h: number
    price_change_24h: number
    price_change_percentage_24h: number
    market_cap_change_24h: number
    market_cap_change_percentage_24h: number
    circulating_supply: number
    total_supply: number
    max_supply: number | null
    ath: number
    ath_change_percentage: number
    ath_date: string
    atl: number
    atl_change_percentage: number
    atl_date: string
    roi: null | {
        times: number
        currency: string
        percentage: number
    }
    last_updated: string
    sparkline_in_7d?: {
        price: number[]
    }
}

export interface MarketData {
    total_market_cap: { [key: string]: number }
    total_volume: { [key: string]: number }
    market_cap_percentage: { [key: string]: number }
    market_cap_change_percentage_24h_usd: number
    updated_at: number
}

export interface TrendingCoin {
    item: {
        id: string
        coin_id: number
        name: string
        symbol: string
        market_cap_rank: number
        thumb: string
        small: string
        large: string
        slug: string
        price_btc: number
        score: number
        data: {
            price: number
            price_btc: string
            price_change_percentage_24h: {
                [key: string]: number
            }
            market_cap: string
            market_cap_btc: string
            total_volume: string
            total_volume_btc: string
            sparkline: string
            content?: {
                description: string
            }
        }
    }
}

export interface Stock {
    symbol: string
    shortName: string
    longName: string
    regularMarketPrice: number
    regularMarketChange: number
    regularMarketChangePercent: number
    regularMarketVolume: number
    marketCap: number
    fiftyTwoWeekHigh: number
    fiftyTwoWeekLow: number
    exchange: string
    quoteType: string
}

export type AssetType = "crypto" | "stock"

export interface SearchResult {
    id: string // coin id or symbol
    name: string
    symbol: string
    thumb?: string // image for crypto
    type: AssetType
    marketCapRank?: number
}
