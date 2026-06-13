interface Props {
  value: string;
  onChange: (
    value: string
  ) => void;
}

export default function MapSearch({
  value,
  onChange,
}: Props) {
  return (
    <input
      type="text"
      placeholder="Buscar incidencia..."
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      style={{
        width: "100%",
        maxWidth: "420px",

        padding: "12px 16px",

        borderRadius: "12px",

        border:
          "1px solid #e2e8f0",

        marginBottom: "12px",
      }}
    />
  );
}