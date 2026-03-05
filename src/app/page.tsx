import { MarketStats } from "@/components/dashboard/market-stats"
import { TrendingCarousel } from "@/components/dashboard/trending-carousel"
import { AssetsTable } from "@/components/dashboard/assets-table"
import { TopStocksTable } from "@/components/dashboard/top-stocks-table"
import { IndianStocksTable } from "@/components/dashboard/indian-stocks-table"

export default function Home() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-zinc-400">
          Real-time overview of crypto and stock markets.
        </p>
      </div>

      <MarketStats />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-4">
          <TrendingCarousel />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Top Stocks</h2>
        <TopStocksTable />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Top Indian Stocks (NSE)</h2>
        <IndianStocksTable />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Top Crypto by Market Cap</h2>
        <AssetsTable />
      </div>
    </div>
  )
}
