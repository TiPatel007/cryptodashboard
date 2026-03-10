import axios from "axios";
import { Stock } from "./types";

const api = axios.create({
    baseURL: "/api/stocks",
    timeout: 10000,
});

export const searchStocks = async (query: string): Promise<Stock[]> => {
    try {
        const { data } = await api.get("/search", {
            params: { q: query }
        });
        // Map Yahoo Finance result to our Stock interface if needed, 
        // but for now let's assume the API returns what we need or we map it here.
        // The API returns { results: [...] }
        return data.results || [];
    } catch (error) {
        console.error("Error searching stocks:", error);
        return [];
    }
};

export const getStockQuote = async (symbol: string): Promise<Stock | null> => {
    try {
        const { data } = await api.get("/quote", {
            params: { symbol }
        });
        return data.quote || null;
    } catch (error) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return null;
    }
};

export const getStockHistory = async (symbol: string, range: string) => {
    try {
        // Map days to Yahoo range/interval
        let yRange = '1mo';
        let yInterval = '1d';

        switch (range) {
            case '1':
                yRange = '1d';
                yInterval = '5m';
                break;
            case '7':
                yRange = '5d'; // Yahoo doesn't support 7d exactly, 5d is closest for trading days
                yInterval = '15m'; // or 60m
                break;
            case '30':
                yRange = '1mo';
                yInterval = '1d';
                break;
            case '365':
                yRange = '1y';
                yInterval = '1d';
                break;
            default:
                yRange = '1mo';
                yInterval = '1d';
        }

        const { data } = await api.get("/chart", {
            params: { symbol, range: yRange, interval: yInterval }
        });

        // Yahoo Finance returns: { quotes: [{ date, close, high, low, open }] }
        const quotes: { date: string; close: number | null }[] = data.quotes || [];

        const prices: [number, number][] = quotes
            .filter((q) => q.close !== null && q.close !== undefined)
            .map((q) => [new Date(q.date).getTime(), q.close as number]);

        return { prices };

    } catch (error) {
        console.error(`Error fetching history for ${symbol}:`, error);
        return { prices: [] };
    }
};

export const getTrendingStocks = async () => {
    try {
        const { data } = await api.get("/trending");
        return data.quotes || [];
    } catch (error) {
        console.error("Error fetching trending stocks:", error);
        return [];
    }
};
