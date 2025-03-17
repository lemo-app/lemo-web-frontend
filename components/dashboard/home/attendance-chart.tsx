"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const data = months.map((month, index) => {
  // More consistent values to ensure visible lines
  const regular = 500 + Math.sin(index * 0.5) * 200 + Math.random() * 100
  const lateEarly = 400 + Math.cos(index * 0.5) * 150 + Math.random() * 100

  return {
    name: month,
    regular: Math.round(regular),
    lateEarly: Math.round(lateEarly),
    highlight: month === "Jul",
  }
})

export function AttendanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRegular" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorLateEarly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            domain={[0, 1000]}
            ticks={[0, 200, 400, 600, 800, 1000]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <span className="text-xs text-muted-foreground">Regular:</span>
                        <span className="font-bold text-xs">{payload[0].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs text-muted-foreground">Late/Early Leaves:</span>
                        <span className="font-bold text-xs">{payload[1].value}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="regular"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: "#3b82f6" }}
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: "#3b82f6",
            }}
            isAnimationActive={true}
            animationDuration={1000}
            fill="url(#colorRegular)"
          />
          <Line
            type="monotone"
            dataKey="lateEarly"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: "white", stroke: "#f59e0b" }}
            activeDot={{
              r: 6,
              strokeWidth: 0,
              fill: "#f59e0b",
            }}
            isAnimationActive={true}
            animationDuration={1000}
            fill="url(#colorLateEarly)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

