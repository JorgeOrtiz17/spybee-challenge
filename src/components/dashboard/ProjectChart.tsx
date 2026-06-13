"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    name: string;
    total: number;
  }[];
}

export default function ProjectChart({
  data,
}: Props) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />

        <Bar
          dataKey="total"
          fill="#2563eb"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}