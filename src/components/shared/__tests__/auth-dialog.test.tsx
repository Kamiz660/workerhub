import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock useAuth & Language context
const mockLogin = vi.fn();
const mockSignup = vi.fn();

vi.mock("@/context/auth-context", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: mockLogin,
    signup: mockSignup,
    logout: vi.fn(),
  }),
}));

vi.mock("@/context/language-context", () => ({
  useLanguage: () => ({
    language: "en",
    t: (key: string) => {
      const translations: Record<string, string> = {
        "auth.welcomeBack": "Welcome back",
        "auth.loginTitle": "Log in to WorkerHub",
        "auth.signupTitle": "Create your free account",
        "auth.loginSubtext": "Enter your credentials to log in.",
        "auth.contextAddWorker": "Create an account to manage and verify your worker profile.",
        "auth.contextGeneral": "Log in or create an account to access all features.",
        "auth.intentCustomer": "Hire a worker",
        "auth.intentWorker": "Offer services",
        "auth.customerBenefit1": "Post job requests & connect directly",
        "auth.workerBenefit1": "Receive direct customer enquiries",
        "auth.emailLabel": "Email Address",
        "auth.passwordLabel": "Password",
        "auth.nameLabel": "Full Name",
        "auth.loginSubmit": "Log In",
        "auth.signupSubmit": "Create Account",
        "auth.noAccount": "Don't have an account?",
        "auth.alreadyAccount": "Already have an account?",
        "auth.switchToSignup": "Sign Up",
        "auth.switchToLogin": "Log In",
        "auth.togglePassword": "Toggle password visibility",
        "auth.termsNotice": "By continuing, you agree to WorkerHub's terms.",
      };
      return translations[key] || key;
    },
  }),
}));

import { AuthDialog } from "@/components/shared/auth-dialog";

describe("AuthDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders zero-clutter Log In mode when initialMode is set to login", () => {
    render(<AuthDialog open={true} onOpenChange={vi.fn()} initialMode="login" />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password");

    // Marketing benefits should NOT be visible on Log In mode (eliminates cognitive load)
    expect(screen.queryByText("Post job requests & connect directly")).not.toBeInTheDocument();
  });

  it("renders contextual header explanation when contextReason is provided", () => {
    render(
      <AuthDialog
        open={true}
        onOpenChange={vi.fn()}
        initialMode="login"
        contextReason="add_worker"
      />
    );

    expect(
      screen.getByText("Create an account to manage and verify your worker profile.")
    ).toBeInTheDocument();
  });

  it("shows intent selector and benefits card in signup mode by default", async () => {
    const user = userEvent.setup();
    render(<AuthDialog open={true} onOpenChange={vi.fn()} initialMode="signup" />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Post job requests & connect directly")).toBeInTheDocument();

    // Click "Offer services" intent button
    const workerIntentBtn = screen.getByRole("button", { name: "Offer services" });
    await user.click(workerIntentBtn);

    expect(screen.getByText("Receive direct customer enquiries")).toBeInTheDocument();
  });

  it("toggles password visibility when Eye button is clicked", async () => {
    const user = userEvent.setup();
    render(<AuthDialog open={true} onOpenChange={vi.fn()} initialMode="login" />);

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: "Toggle password visibility" });
    await user.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("displays error message and remains open on auth failure", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ success: false, error: "Incorrect email or password." });

    render(<AuthDialog open={true} onOpenChange={vi.fn()} initialMode="login" />);

    await user.type(screen.getByLabelText("Email Address"), "wrong@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpass");

    const submitBtn = screen.getByRole("button", { name: "Log In" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Incorrect email or password.");
    });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("executes onSuccess callback and closes dialog on successful authentication", async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();
    const handleSuccess = vi.fn();
    mockLogin.mockResolvedValue({ success: true, user: { id: "1" } });

    render(
      <AuthDialog
        open={true}
        onOpenChange={handleOpenChange}
        onSuccess={handleSuccess}
        initialMode="login"
      />
    );

    await user.type(screen.getByLabelText("Email Address"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "securepass");

    const submitBtn = screen.getByRole("button", { name: "Log In" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
