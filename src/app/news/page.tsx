"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock } from "lucide-react"

const getRelativeTime = (hoursAgo: number) => {
    const date = new Date();
    date.setHours(date.getHours() - hoursAgo);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function NewsPage() {
    const NEWS_ITEMS = [
        {
            id: 1,
            title: "Bitcoin Surpasses $100k for the First Time in History",
            source: "CryptoDaily",
            time: getRelativeTime(0),
            category: "Market",
            url: "#"
        },
        {
            id: 2,
            title: "Ethereum 3.0 Roadmap Unveiled: Focus on Scalability",
            source: "EthNews",
            time: getRelativeTime(2),
            category: "Technology",
            url: "#"
        },
        {
            id: 3,
            title: "SEC Approves New Crypto ETFs, Signaling Regulatory Shift",
            source: "FinanceWorld",
            time: getRelativeTime(4),
            category: "Regulation",
            url: "#"
        },
        {
            id: 4,
            title: "DeFi TVL Reaches New All-Time High",
            source: "DeFiPulse",
            time: getRelativeTime(6),
            category: "DeFi",
            url: "#"
        },
        {
            id: 5,
            title: "NFT Market Sees Resurgence with Dynamic Art Collections",
            source: "NFTNow",
            time: getRelativeTime(12),
            category: "NFT",
            url: "#"
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-white">Latest News</h1>
                <p className="text-zinc-400">Stay updated with the latest in the crypto world.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {NEWS_ITEMS.map((item) => (
                    <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group cursor-pointer">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="border-violet-500/50 text-violet-400">{item.category}</Badge>
                                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                            </div>
                            <CardTitle className="text-lg leading-tight text-white group-hover:text-violet-300 transition-colors">
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center text-xs text-zinc-500 mt-2">
                                <span>{item.source}</span>
                                <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {item.time}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
