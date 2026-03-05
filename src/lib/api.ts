import axios from "axios"
import { Coin, MarketData, TrendingCoin } from "./types"

// Use local proxy to avoid CORS issues
const API_BASE_URL = "/api/proxy"

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
})

// Helper to intercept requests and move the endpoint to a query param
api.interceptors.request.use((config) => {
    // If the url is absolute (external), don't modify it
    if (config.url?.startsWith('http')) return config;

    // Move the url path to the 'endpoint' query param
    const originalUrl = config.url || '';
    config.url = ''; // Send to base URL (which is /api/proxy)
    config.params = { ...config.params, endpoint: originalUrl };
    return config;
});

// Simple in-memory cache
let marketDataCache: { data: Coin[], timestamp: number } | null = null;
const CACHE_DURATION = 60 * 1000; // 1 minute

export const getMarketData = async (
    page = 1,
    perPage = 50,
    currency = "usd"
): Promise<Coin[]> => {
    try {
        // Return cached data if fresh (optional, but good for rate limits)
        if (marketDataCache && Date.now() - marketDataCache.timestamp < CACHE_DURATION) {
            return marketDataCache.data;
        }

        const { data } = await api.get<Coin[]>("/coins/markets", {
            params: {
                vs_currency: currency,
                order: "market_cap_desc",
                per_page: perPage,
                page,
                sparkline: true,
                price_change_percentage: "24h,7d",
            },
        })

        // Update cache
        marketDataCache = { data, timestamp: Date.now() };
        return data
    } catch (error) {
        console.error("Error fetching market data:", error)
        // Return cached data if available (fallback for rate limits)
        if (marketDataCache) {
            console.log("Serving cached market data due to error.");
            return marketDataCache.data;
        }
        return []
    }
}

export const getGlobalMarketData = async (): Promise<MarketData | null> => {
    try {
        const { data } = await api.get("/global")
        return data.data
    } catch (error) {
        console.error("Error fetching global market data:", error)
        return null
    }
}

export const getTrendingCoins = async (): Promise<TrendingCoin[]> => {
    try {
        const { data } = await api.get("/search/trending")
        return data.coins
    } catch (error) {
        console.error("Error fetching trending coins:", error)
        return []
    }
}

export const getCoinDetails = async (id: string) => {
    try {
        const { data } = await api.get(`/coins/${id}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
                sparkline: true,
            },
        })
        return data
    } catch (error) {
        console.error(`Error fetching details for ${id}:`, error)
        return null
    }
}

export const getCoinHistory = async (id: string, days = "7") => {
    try {
        const { data } = await api.get(`/coins/${id}/market_chart`, {
            params: {
                vs_currency: "usd",
                days,
            },
        })
        return data
    } catch (error) {
        console.error(`Error fetching history for ${id}:`, error)
        return null
    }
}

export const searchCoins = async (query: string) => {
    try {
        const { data } = await api.get("/search", {
            params: {
                query,
            },
        })
        return data.coins
    } catch (error) {
        console.error("Error searching coins:", error)
        return []
    }
}
