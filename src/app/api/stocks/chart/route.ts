import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

type YahooInterval = '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const range = searchParams.get('range') || '1mo';
    const interval = searchParams.get('interval') || '1d';

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });
    }

    try {
        // Convert range to Date objects
        const period2 = new Date(); // End date is now
        let period1: Date;

        switch (range) {
            case '1d':
                period1 = new Date(Date.now() - 24 * 60 * 60 * 1000);
                break;
            case '5d':
                period1 = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
                break;
            case '1mo':
                period1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '3mo':
                period1 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
                break;
            case '6mo':
                period1 = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
                break;
            case '1y':
                period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
                break;
            case '5y':
                period1 = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                period1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default 1 month
        }

        const result = await yahooFinance.chart(symbol, {
            period1,
            period2,
            interval: interval as YahooInterval,
        });

        return NextResponse.json(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Yahoo Finance Chart Error:', error);
        return NextResponse.json({ error: (error as Error).message || String(error) }, { status: 500 });
    }
}
