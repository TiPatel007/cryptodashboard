import { StockDetails } from "@/components/stock-details"

export default async function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params
    return (
        <StockDetails symbol={symbol} />
    )
}
