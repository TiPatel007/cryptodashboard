import { CoinDetails } from "@/components/coin-details"

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return (
        <CoinDetails id={id} />
    )
}
