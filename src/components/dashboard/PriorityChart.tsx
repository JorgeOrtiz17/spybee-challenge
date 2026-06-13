"use client";

import { useRouter } from "next/navigation";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  high: number;
  medium: number;
  low: number;
}

export default function PriorityChart({
  high,
  medium,
  low,
}: Props) {
  const router = useRouter();

  const data = [
    {
      name: "Alta",
      value: high,
      priority: "high",
    },
    {
      name: "Media",
      value: medium,
      priority: "medium",
    },
    {
      name: "Baja",
      value: low,
      priority: "low",
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={data}>
        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar
          animationDuration={1200}
          dataKey="value"
          radius={[8, 8, 0, 0]}
          onClick={(data: any) =>
            router.push(
              `/incidents?priority=${data.priority}`
            )
          }
        >
          {data.map(
            (_, index) => (
              <Cell
                key={index}
                fill="#2563eb"
                cursor="pointer"
              />
            )
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}