"use client";

import { useRouter } from "next/navigation";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  open: number;
  closed: number;
  paused: number;
}

const COLORS = [
  "#f59e0b",
  "#10b981",
  "#64748b",
];

export default function StatusChart({
  open,
  closed,
  paused,
}: Props) {
  const router = useRouter();

  const data = [
    {
      name: "Abiertas",
      value: open,
      status: "open",
    },
    {
      name: "Cerradas",
      value: closed,
      status: "closed",
    },
    {
      name: "En pausa",
      value: paused,
      status: "on_pause",
    },
  ];

  return (
    <ResponsiveContainer
      width="100%"
      height={320}
    >
      <PieChart>
        <Pie
          isAnimationActive
          animationDuration={1200}
          data={data}
          dataKey="value"
          cx="50%"
          cy="45%"
          outerRadius={90}
          label
          onClick={(data: any) =>
            router.push(
              `/incidents?status=${data.status}`
            )
          }
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
              style={{
                cursor: "pointer",
              }}
            />
          ))}
        </Pie>

        <Tooltip />

        <Legend
          verticalAlign="bottom"
          height={36}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}