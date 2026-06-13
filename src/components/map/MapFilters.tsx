interface Props {
  priority: string;
  status: string;

  setPriority: (
    value: string
  ) => void;

  setStatus: (
    value: string
  ) => void;
}

export default function MapFilters({
  priority,
  status,
  setPriority,
  setStatus,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",

        gap: "12px",

        marginBottom: "16px",
      }}
    >
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="all">
          Todas las prioridades
        </option>

        <option value="high">
          Alta
        </option>

        <option value="medium">
          Media
        </option>

        <option value="low">
          Baja
        </option>
      </select>

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <option value="all">
          Todos los estados
        </option>

        <option value="open">
          Abiertas
        </option>

        <option value="closed">
          Cerradas
        </option>

        <option value="on_pause">
          En pausa
        </option>
      </select>
    </div>
  );
}