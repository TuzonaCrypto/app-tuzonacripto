"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
}

export default function PriceTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Mock data para demostración (en producción usarías CoinGecko API)
  const mockPrices: CryptoPrice[] = [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      current_price: 43250.75,
      price_change_percentage_24h: 2.45,
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      current_price: 2580.32,
      price_change_percentage_24h: -1.23,
    },
    {
      id: "tether",
      symbol: "USDT",
      name: "Tether",
      current_price: 1.0,
      price_change_percentage_24h: 0.01,
    },
    {
      id: "binancecoin",
      symbol: "BNB",
      name: "BNB",
      current_price: 315.67,
      price_change_percentage_24h: 3.12,
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      current_price: 98.45,
      price_change_percentage_24h: 5.67,
    },
    {
      id: "usd-coin",
      symbol: "USDC",
      name: "USD Coin",
      current_price: 1.0,
      price_change_percentage_24h: -0.02,
    },
    {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      current_price: 0.485,
      price_change_percentage_24h: -2.34,
    },
    {
      id: "dogecoin",
      symbol: "DOGE",
      name: "Dogecoin",
      current_price: 0.087,
      price_change_percentage_24h: 4.56,
    },
    {
      id: "polygon",
      symbol: "MATIC",
      name: "Polygon",
      current_price: 0.89,
      price_change_percentage_24h: 1.89,
    },
    {
      id: "litecoin",
      symbol: "LTC",
      name: "Litecoin",
      current_price: 72.34,
      price_change_percentage_24h: -0.78,
    },
  ]

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsLoading(true)
        // Simular llamada a API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // En producción, usarías algo como:
        // const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1')
        // const data = await response.json()

        setPrices(mockPrices)
        setError(false)
      } catch (err) {
        console.error("Error fetching prices:", err)
        setError(true)
        // Usar datos mock como fallback
        setPrices(mockPrices)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()

    // Actualizar precios cada 30 segundos
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(4)}`
    }
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? "+" : ""
    return `${sign}${percentage.toFixed(2)}%`
  }

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className="animate-pulse flex space-x-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 whitespace-nowrap">
              <div className="w-8 h-4 bg-gray-700 rounded"></div>
              <div className="w-16 h-4 bg-gray-700 rounded"></div>
              <div className="w-12 h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden relative">
      <div className="animate-scroll flex space-x-8 whitespace-nowrap">
        {prices.concat(prices).map((crypto, index) => (
          <div key={`${crypto.id}-${index}`} className="flex items-center space-x-2 text-sm">
            <span className="font-semibold text-orange-400">{crypto.symbol}</span>
            <span className="text-white">{formatPrice(crypto.current_price)}</span>
            <span
              className={`flex items-center ${
                crypto.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {crypto.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {formatPercentage(crypto.price_change_percentage_24h)}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
          Datos de demostración
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  )
}
