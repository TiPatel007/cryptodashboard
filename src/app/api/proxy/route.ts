import { NextResponse } from 'next/server';
import axios from 'axios';

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }

    // Construct the target URL
    // Remove 'endpoint' from params to forward the rest
    const params = new URLSearchParams(searchParams);
    params.delete('endpoint');

    try {
        const { data } = await axios.get(`${COINGECKO_API_URL}${endpoint}`, {
            params: Object.fromEntries(params),
            headers: {
                'Accept': 'application/json',
            }
        });
        return NextResponse.json(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error(`Error proxying request to ${endpoint}:`, (error as any).message);
        return NextResponse.json(
            { error: 'Failed to fetch data from CoinGecko' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { status: (error as any).response?.status || 500 }
        );
    }
}
