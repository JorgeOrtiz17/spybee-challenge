import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => boolean;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>()(
    persist(
      (set) => ({
        isAuthenticated: false,

        login: (
          email,
          password
        ) => {
          const valid =
            email ===
              "admin@spybee.com" &&
            password === "123456";

          if (valid) {
            set({
              isAuthenticated: true,
            });
          }

          return valid;
        },

        logout: () =>
          set({
            isAuthenticated: false,
          }),
      }),
      {
        name: "spybee-auth",
      }
    )
  );