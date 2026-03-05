import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter required' }, { status: 400 });
    }

    try {
        const results = await yahooFinance.search(query);
        // Filter for relevant quotes (EQUITY, ETF)
        const filtered = results.quotes.filter(q =>
            (q.isYahooFinance === true) &&
            (q.quoteType === 'EQUITY' || q.quoteType === 'ETF')
        );

        return NextResponse.json({ results: filtered });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Yahoo Finance Search Error:', error);
        return NextResponse.json({ error: (error as Error).message || String(error) }, { status: 500 });
    }
}
