"use client"

import { useState } from "react"
import { usePortfolioStore, AssetType } from "@/store/portfolio-store"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner" // Need to install sonner if not present, otherwise use alert or basic
import { isIndianStock, convertINRtoUSD, formatCurrency } from "@/lib/currency"

interface TradeModalProps {
    assetId: string
    assetName: string
    currentPrice: number
    assetType: AssetType
    buttonClassName?: string
}

export function TradeModal({ assetId, assetName, currentPrice, assetType, buttonClassName }: TradeModalProps) {
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [activeTab, setActiveTab] = useState("buy")
    const [isConverting, setIsConverting] = useState(false)

    const { balance, holdings, addTransaction } = usePortfolioStore()
    const holding = holdings[assetId]?.amount || 0

    const handleTrade = async () => {
        const val = parseFloat(amount)
        if (isNaN(val) || val <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        setIsConverting(true)

        try {
            // Convert price to USD if it's an Indian stock
            let priceInUSD = currentPrice
            if (isIndianStock(assetId)) {
                priceInUSD = await convertINRtoUSD(currentPrice)
                console.log(`Converting INR ${currentPrice} to USD ${priceInUSD}`)
            }

            if (activeTab === "buy") {
                const cost = val * priceInUSD
                if (cost > balance) {
                    toast.error("Insufficient funds")
                    setIsConverting(false)
                    return
                }
                addTransaction({
                    assetId,
                    assetName,
                    assetType,
                    type: "buy",
                    amount: val,
                    pricePerUnit: priceInUSD
                })
                toast.success(`Successfully bought ${val} ${assetName}`)
            } else {
                if (val > holding) {
                    toast.error("Insufficient holdings")
                    setIsConverting(false)
                    return
                }
                addTransaction({
                    assetId,
                    assetName,
                    assetType,
                    type: "sell",
                    amount: val,
                    pricePerUnit: priceInUSD
                })
                toast.success(`Successfully sold ${val} ${assetName}`)
            }
        } catch (error) {
            toast.error("Failed to process transaction")
            console.error("Trade error:", error)
        } finally {
            setIsConverting(false)
            setOpen(false)
            setAmount("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={buttonClassName || "w-full bg-violet-600 hover:bg-violet-700"}>
                    Trade {assetName}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0f172a] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Trade {assetName}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Current Price: {formatCurrency(currentPrice, assetId)}
                        {isIndianStock(assetId) && <span className="text-xs ml-2 text-zinc-500">(Converted to USD in portfolio)</span>}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="buy" onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5">
                        <TabsTrigger value="buy">Buy</TabsTrigger>
                        <TabsTrigger value="sell">Sell</TabsTrigger>
                    </TabsList>

                    <div className="py-4 space-y-4">
                        <div className="flex justify-between text-sm text-zinc-400">
                            <span>Available Balance: ${balance.toLocaleString()}</span>
                            <span>Owned: {holding.toFixed(assetType === 'stock' ? 0 : 4)} {assetName}</span>
                        </div>

                        <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>

                        <div className="text-sm text-zinc-400">
                            {amount && !isNaN(parseFloat(amount)) && (
                                <span>
                                    Total: ${(parseFloat(amount) * currentPrice * (isIndianStock(assetId) ? 0.012 : 1)).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} USD
                                </span>
                            )}
                        </div>
                    </div>
                </Tabs>

                <DialogFooter>
                    <Button onClick={handleTrade} disabled={isConverting} className="w-full bg-violet-600 hover:bg-violet-700">
                        {isConverting ? "Processing..." : activeTab === "buy" ? "Buy" : "Sell"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
