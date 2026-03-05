# Crypto Dashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js%2014-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A real-time cryptocurrency dashboard built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. Displays live prices, market cap, 24h change, volume, and sparkline charts for top cryptocurrencies using the CoinGecko public API.

---

## Features

- 📈 Live crypto prices (BTC, ETH, and top 50 coins)
- 🔄 Auto-refreshing data every 60 seconds
- 📊 Sparkline 7-day price charts per coin
- 🌙 Dark / Light mode toggle
- 🔍 Search & filter by coin name or symbol
- 📱 Fully responsive design

---

## Tech Stack

| Technology    | Purpose                          |
| ------------- | -------------------------------- |
| Next.js 14    | App framework (App Router)       |
| TypeScript    | Type safety                      |
| Tailwind CSS  | Utility-first styling            |
| shadcn/ui     | Accessible UI component library  |
| Recharts      | Sparkline / chart rendering      |
| CoinGecko API | Free public cryptocurrency data  |

---

## Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/TiPatel007/cryptodashboard.git
cd cryptodashboard

# 2. Install dependencies
npm install

# 3. Copy the example environment file and fill in any values
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

All configurable values are documented in [`.env.example`](.env.example). Copy it to `.env.local` to get started:

```bash
cp .env.example .env.local
```

---

## Project Structure

```
src/
├── app/            # Next.js App Router pages and layouts
├── components/     # Reusable UI components
├── lib/            # Utility functions and API clients
└── types/          # Shared TypeScript type definitions
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
