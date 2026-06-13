"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "420px",
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,.15)",
        }}
      >
        <h2
          style={{
            marginBottom: "12px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: "#64748b",
            marginBottom: "24px",
          }}
        >
          {message}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent:
              "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding:
                "10px 16px",
              border:
                "1px solid #e2e8f0",
              borderRadius:
                "10px",
              cursor:
                "pointer",
            }}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            style={{
              background:
                "#ef4444",
              color: "white",
              border: "none",
              padding:
                "10px 16px",
              borderRadius:
                "10px",
              cursor:
                "pointer",
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}