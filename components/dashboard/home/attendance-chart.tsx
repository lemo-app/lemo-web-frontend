"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useMemo } from "react";

interface AttendanceChartProps {
  data: { name: string; regular: number; lateEarly: number }[];
  year: number;
  onYearChange?: (year: number) => void;
  availableYears?: number[];
  loading?: boolean;
}

export function AttendanceChart({ data, year, onYearChange, availableYears = [], loading }: AttendanceChartProps) {
  // Calculate min/max for dynamic Y axis
  const { minY, maxY, ticks } = useMemo(() => {
    if (!data || data.length === 0) return { minY: 0, maxY: 10, ticks: [0, 2, 4, 6, 8, 10] };
    const allVals = data.flatMap(d => [d.regular, d.lateEarly]);
    let min = Math.min(...allVals);
    let max = Math.max(...allVals);
    if (min > 0) min = 0; // Always start at 0
    // Add some padding
    max = Math.ceil(max * 1.15);
    // Calculate ticks (5 steps)
    const step = Math.max(1, Math.ceil((max - min) / 5));
    const ticks = Array.from({ length: 6 }, (_, i) => min + i * step);
    return { minY: min, maxY: max, ticks };
  }, [data]);

  return (
    <div className="h-[300px] w-full">
      {/* Year selector moved to card header */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 24 }}>
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
            domain={[minY, maxY]}
            ticks={ticks}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        <span className="text-xs text-muted-foreground">Attendance:</span>
                        <span className="font-bold text-xs">{payload[0].value}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        <span className="text-xs text-muted-foreground">Absent:</span>
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
  );
}

