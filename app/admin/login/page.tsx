

"use client";

import { useState, FormEvent } from "react";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetMode, setResetMode] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetchMutation(
        api.superAdmins.login,
        {
          email: email.trim(),
          passwordHash: password,
        }
      );

      document.cookie =
        "super_admin_token=" +
        res.token +
        "; path=/; SameSite=Strict";

      router.push("/admin");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetRequest(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await fetchMutation(
        api.superAdmins.requestPasswordReset,
        {
          email: email.trim(),
        }
      );

      setMessage(
        "If the email exists, a reset link has been sent."
      );
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h1 className="text-xl font-semibold mb-4">
          Super Admin {resetMode ? "Reset Password" : "Login"}
        </h1>

        {error !== "" && (
          <p className="text-red-600 text-sm mb-3">
            {error}
          </p>
        )}

        {message !== "" && (
          <p className="text-green-600 text-sm mb-3">
            {message}
          </p>
        )}

        <form
          onSubmit={
            resetMode
              ? handleResetRequest
              : handleLogin
          }
        >
          <input
            type="email"
            className="border p-2 w-full mb-3 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          {!resetMode && (
            <input
              type="password"
              className="border p-2 w-full mb-4 rounded"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : resetMode
              ? "Send Reset Link"
              : "Login"}
          </button>
        </form>

        <button
          onClick={() => {
            setResetMode(!resetMode);
            setError("");
            setMessage("");
          }}
          className="mt-4 text-sm text-indigo-600 underline"
        >
          {resetMode
            ? "Back to login"
            : "Forgot password?"}
        </button>
      </div>
    </div>
  );
}
