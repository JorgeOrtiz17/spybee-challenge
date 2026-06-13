"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();

  const login = useAuthStore(
    (state) => state.login
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const success = login(
      email,
      password
    );

    if (!success) {
      setError(
        "Credenciales incorrectas"
      );
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          background: "white",
          padding: "32px",
          borderRadius: "20px",
        }}
      >
        <h1
          style={{
            marginBottom: "24px",
          }}
        >
          Spybee Login
        </h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
          }}
        />

        {error && (
          <p
            style={{
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background:
              "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
          }}
        >
          Ingresar
        </button>
      </form>
    </main>
  );
}