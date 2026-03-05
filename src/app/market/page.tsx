import { AssetsTable } from "@/components/dashboard/assets-table"

export default function MarketPage() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-white">Market Overview</h1>
                <p className="text-zinc-400">Current prices and market performance of top cryptocurrencies.</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden p-6">
                <AssetsTable />
            </div>
        </div>
    )
}
