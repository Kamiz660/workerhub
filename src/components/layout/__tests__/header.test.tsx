import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockLogout = vi.fn();
let mockAuthValue = {
  user: null as any,
  loading: false,
  login: vi.fn(),
  signup: vi.fn(),
  logout: mockLogout,
};

vi.mock("@/context/auth-context", () => ({
  useAuth: () => mockAuthValue,
}));

vi.mock("@/context/language-context", () => ({
  useLanguage: () => ({
    language: "en",
    setLanguage: vi.fn(),
    t: (key: string) => {
      const translations: Record<string, string> = {
        "common.login": "Log In",
        "common.logout": "Log Out",
        "common.loading": "Loading...",
      };
      return translations[key] || key;
    },
  }),
}));

import { Header } from "@/components/layout/header";

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthValue = {
      user: null,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: mockLogout,
    };
  });

  it("renders loading placeholder while session restoration is pending", () => {
    mockAuthValue.loading = true;
    render(<Header />);

    expect(screen.getByTestId("header-auth-loading")).toBeInTheDocument();
  });

  it("renders Log In button when user is logged out", () => {
    mockAuthValue.user = null;
    mockAuthValue.loading = false;
    render(<Header />);

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("opens AuthDialog when Log In button is clicked", async () => {
    const user = userEvent.setup();
    mockAuthValue.user = null;
    mockAuthValue.loading = false;

    render(<Header />);

    const loginBtn = screen.getByRole("button", { name: /log in/i });
    await user.click(loginBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders user name and Log Out button when user is logged in", () => {
    mockAuthValue.user = {
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "user",
    };
    mockAuthValue.loading = false;

    render(<Header />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
  });

  it("calls logout when Log Out button is clicked", async () => {
    const user = userEvent.setup();
    mockAuthValue.user = {
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "user",
    };
    mockAuthValue.loading = false;

    render(<Header />);

    const logoutBtn = screen.getByRole("button", { name: /log out/i });
    await user.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
  });
});
