import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WatchlistState {
    watchlist: string[]
    addToWatchlist: (id: string) => void
    removeFromWatchlist: (id: string) => void
    isWatched: (id: string) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
    persist(
        (set, get) => ({
            watchlist: [],

            addToWatchlist: (id: string) => {
                const { watchlist } = get()
                if (!watchlist.includes(id)) {
                    set({ watchlist: [...watchlist, id] })
                }
            },

            removeFromWatchlist: (id: string) => {
                const { watchlist } = get()
                set({ watchlist: watchlist.filter((item) => item !== id) })
            },

            isWatched: (id: string) => {
                return get().watchlist.includes(id)
            },
        }),
        {
            name: "watchlist-storage",
        }
    )
)
