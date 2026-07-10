"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TrendPoint } from "@/types/stats";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const hasData = data.some((point) => point.averageEmoji !== null);

  if (!hasData) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Inga svar med emoji i det här intervallet än.
      </p>
    );
  }

  return (
    <div className="h-80 w-full rounded-lg border border-black/10 p-4 dark:border-white/10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis domain={[1, 5]} allowDecimals={false} fontSize={12} />
          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? value.toFixed(1) : value
            }
            contentStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="averageEmoji"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
