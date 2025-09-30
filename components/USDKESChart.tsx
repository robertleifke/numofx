"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

const USDKESChart = () => {
  const [data, setData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [showBid, setShowBid] = useState(true)
  const [showOffer, setShowOffer] = useState(true)
  const [showForward, setShowForward] = useState(true)

  // Generate realistic USD/KES data based on actual 2024-2025 trends
  // Starting from Oct 2024 (~129 KES) to Sept 2025 (~129 KES)
  const generateHistoricalData = () => {
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    const points = []

    // Actual trend: Started ~129, peaked early 2024 at ~163, now back to ~129
    const baseRates = [129.5, 129.2, 129.8, 130.5, 130.7, 128.0, 130.1, 129.8, 129.5, 129.3, 129.4, 129.2]

    // Forward rate segments (step function)
    const forwardSegments = [
      { start: 0, end: 90, rate: 130.2 },
      { start: 90, end: 210, rate: 131.5 },
      { start: 210, end: 360, rate: 128.8 },
    ]

    let dayCounter = 0
    baseRates.forEach((baseRate, monthIdx) => {
      const daysInMonth = 30
      for (let day = 0; day < daysInMonth; day++) {
        const volatility = (Math.random() - 0.5) * 0.4
        const dayVolatility = Math.sin((day / daysInMonth) * Math.PI) * 0.3
        const bid = baseRate + volatility + dayVolatility
        const offer = bid + 0.15 + Math.random() * 0.1

        // Find applicable forward rate
        const forwardSegment = forwardSegments.find((seg) => dayCounter >= seg.start && dayCounter <= seg.end)
        const forward = forwardSegment ? forwardSegment.rate : null

        points.push({
          day: dayCounter,
          monthLabel: day === 0 ? months[monthIdx] : "",
          bid: Number.parseFloat(bid.toFixed(2)),
          offer: Number.parseFloat(offer.toFixed(2)),
          forward: forward,
        })
        dayCounter++
      }
    })

    return points
  }

  useEffect(() => {
    const historicalData = generateHistoricalData()
    setData(historicalData)
  }, [])

  useEffect(() => {
    if (!isAnimating || data.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= data.length - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
    }, 15)

    return () => clearInterval(interval)
  }, [isAnimating, data.length])

  const visibleData = data.slice(0, currentIndex + 1)
  const latestData = visibleData[visibleData.length - 1] || { bid: 129.37, offer: 129.52, forward: 128.8 }

  const handleReplay = () => {
    setCurrentIndex(0)
    setIsAnimating(true)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white px-3 py-2 rounded text-xs">
          {showBid && payload[0] && <div>Bid: {payload[0].value?.toFixed(2)}</div>}
          {showOffer && payload[1] && <div>Offer: {payload[1].value?.toFixed(2)}</div>}
          {showForward && payload[2] && payload[2].value && <div>Forward: {payload[2].value?.toFixed(2)}</div>}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-white text-xl font-medium mb-1">Exchange Rate USD/KES</h2>
        </div>
        <button
          onClick={handleReplay}
          className="px-4 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded border border-slate-500 transition-colors flex items-center gap-2"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          BID/OFFER
        </button>
      </div>

      <div className="h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={visibleData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" strokeOpacity={0.3} />
            <XAxis
              dataKey="monthLabel"
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
            />
            <YAxis
              domain={[127, 132]}
              stroke="#94a3b8"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
              ticks={[127.5, 128, 128.5, 129, 129.5, 130, 130.5, 131, 131.5]}
            />
            <Tooltip content={<CustomTooltip />} />
            {showBid && (
              <Line
                type="monotone"
                dataKey="bid"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
            {showOffer && (
              <Line
                type="monotone"
                dataKey="offer"
                stroke="#9ca3af"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
            {showForward && (
              <Line
                type="stepAfter"
                dataKey="forward"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Tooltip overlay on chart */}
        {visibleData.length > 0 && (
          <div
            className="absolute bg-slate-700 text-white px-2 py-1 rounded text-xs font-medium"
            style={{
              right: "10%",
              top: "30%",
              opacity: currentIndex > data.length * 0.7 ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          >
            {latestData.bid?.toFixed(2)}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-8 mt-6">
        <button
          onClick={() => setShowBid(!showBid)}
          className={`flex items-center gap-2 text-sm transition-opacity ${!showBid && "opacity-40"}`}
        >
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span className="text-gray-300">Bid</span>
        </button>
        <button
          onClick={() => setShowOffer(!showOffer)}
          className={`flex items-center gap-2 text-sm transition-opacity ${!showOffer && "opacity-40"}`}
        >
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span className="text-gray-300">Offer</span>
        </button>
        <button
          onClick={() => setShowForward(!showForward)}
          className={`flex items-center gap-2 text-sm transition-opacity ${!showForward && "opacity-40"}`}
        >
          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          <span className="text-gray-300">Forward</span>
        </button>
      </div>
    </div>
  )
}

export default USDKESChart
