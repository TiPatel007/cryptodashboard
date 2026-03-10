import { AssetsTable } from "@/components/dashboard/assets-table"

export default function CoinsPage() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Crypto Coins</h1>
                <p className="text-zinc-400">Browse and track top cryptocurrencies by market cap.</p>
            </div>
            <AssetsTable />
        </div>
    )
}
