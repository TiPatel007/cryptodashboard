import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Top stocks to display
const TOP_STOCKS = ['NVDA', 'GOOGL', 'MSFT', 'AAPL', 'TSLA', 'AMZN', 'META'];

export async function GET() {
    try {
        const quotes = await yahooFinance.quote(TOP_STOCKS);

        // If single quote, convert to array
        const quotesArray = Array.isArray(quotes) ? quotes : [quotes];

        return NextResponse.json({ quotes: quotesArray });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Yahoo Finance Trending Stocks Error:', error);
        return NextResponse.json({ error: (error as Error).message || String(error) }, { status: 500 });
    }
}
