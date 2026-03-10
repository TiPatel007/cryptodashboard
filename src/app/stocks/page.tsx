import { TopStocksTable } from "@/components/dashboard/top-stocks-table"
import { IndianStocksTable } from "@/components/dashboard/indian-stocks-table"

export default function StocksPage() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Stocks</h1>
                <p className="text-zinc-400">Track top US and Indian stock market data in real time.</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Top US Stocks</h2>
                <TopStocksTable />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Top Indian Stocks (NSE)</h2>
                <IndianStocksTable />
            </div>
        </div>
    )
}
