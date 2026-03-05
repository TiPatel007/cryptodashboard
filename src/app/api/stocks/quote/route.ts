import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });
    }

    try {
        const quote = await yahooFinance.quote(symbol);
        return NextResponse.json({ quote });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Yahoo Finance Quote Error:', error);
        return NextResponse.json({ error: 'Failed to fetch stock quote' }, { status: 500 });
    }
}
