"use client"

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const data = [
  { name: "Facebook", value: 700, color: "#8B5CF6" },
  { name: "Instagram", value: 500, color: "#7DD3FC" },
  { name: "Reddit", value: 400, color: "#F87171" },
  { name: "Snapchat", value: 400, color: "#FCD34D" },
]

export function BlockedSitesChart() {
  return (
    <div className="relative h-[300px] flex flex-col items-center justify-center">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold">2000</p>
        <p className="text-muted-foreground text-xs">50 today</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={95}
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-sm text-muted-foreground">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

