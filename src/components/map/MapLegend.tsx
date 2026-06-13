export default function MapLegend() {
  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        background: "white",
        padding: "12px",
        borderRadius: "12px",
        zIndex: 10,
        boxShadow:
          "0 4px 12px rgba(0,0,0,.1)",

        display: "flex",
        flexDirection: "column",
        gap: "6px",

        maxWidth: "140px",
      }}
    >
      <span>🔴 Alta</span>
      <span>🟠 Media</span>
      <span>🔵 Baja</span>
    </div>
  );
}