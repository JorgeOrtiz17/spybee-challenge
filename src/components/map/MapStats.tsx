interface Props {
  high: number;
  medium: number;
  low: number;
}

export default function MapStats({
  high,
  medium,
  low,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "16px",
      }}
    >
      <div>🔴 Alta: {high}</div>

      <div>🟠 Media: {medium}</div>

      <div>🔵 Baja: {low}</div>
    </div>
  );
}