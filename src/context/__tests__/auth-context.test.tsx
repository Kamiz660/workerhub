import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";

// Mock auth-service methods only (testing boundary rule)
vi.mock("@/features/auth/auth-service", () => ({
  getCurrentUser: vi.fn(),
  logIn: vi.fn(),
  signUp: vi.fn(),
  logOut: vi.fn(),
}));

import { AuthProvider, useAuth } from "@/context/auth-context";
import { getCurrentUser, logIn, signUp, logOut } from "@/features/auth/auth-service";

function TestConsumer() {
  const { user, loading, login, signup, logout } = useAuth();

  if (loading) {
    return <div data-testid="loading">Restoring session...</div>;
  }

  return (
    <div>
      <div data-testid="user-info">{user ? `${user.name} (${user.email})` : "Logged Out"}</div>
      <button
        onClick={async () => {
          await login("alice@example.com", "securepass");
        }}
      >
        Trigger Login
      </button>
      <button
        onClick={async () => {
          await signup("Bob", "bob@example.com", "securepass");
        }}
      >
        Trigger Signup
      </button>
      <button
        onClick={async () => {
          await logout();
        }}
      >
        Trigger Logout
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("restores active user session on mount", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "user",
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("user-info")).toHaveTextContent("Alice (alice@example.com)");
    });
  });

  it("sets user to null when no active session exists", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-info")).toHaveTextContent("Logged Out");
    });
  });

  it("updates user state on successful login", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    vi.mocked(logIn).mockResolvedValue({
      success: true,
      user: { id: "uuid-1", email: "alice@example.com", name: "Alice", role: "user" },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-info")).toHaveTextContent("Logged Out");
    });

    await act(async () => {
      screen.getByText("Trigger Login").click();
    });

    expect(screen.getByTestId("user-info")).toHaveTextContent("Alice (alice@example.com)");
  });

  it("clears user state on logout", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "user",
    });
    vi.mocked(logOut).mockResolvedValue({ success: true });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-info")).toHaveTextContent("Alice (alice@example.com)");
    });

    await act(async () => {
      screen.getByText("Trigger Logout").click();
    });

    expect(screen.getByTestId("user-info")).toHaveTextContent("Logged Out");
  });
});
