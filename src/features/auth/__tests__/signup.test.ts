import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase before importing the module under test
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  },
}));

import { signUp } from "@/features/auth/auth-service";
import { supabase } from "@/lib/supabase";

describe("signUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid email format", async () => {
    const result = await signUp({
      name: "Test",
      email: "not-an-email",
      password: "12345678",
    });

    expect(result).toEqual({
      success: false,
      error: "Please enter a valid email address.",
    });
  });

  it("rejects password shorter than 8 characters", async () => {
    const result = await signUp({
      name: "Test",
      email: "test@example.com",
      password: "short",
    });

    expect(result).toEqual({
      success: false,
      error: "Password must be at least 8 characters.",
    });
  });

  it("successful signup creates auth user, inserts profile with role 'user', returns user", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: {
        user: { id: "uuid-1", email: "alice@example.com" },
        session: {},
      },
      error: null,
    } as any);
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any);

    const result = await signUp({
      name: "Alice",
      email: "alice@example.com",
      password: "securepass",
    });

    // Assert Supabase auth was called correctly
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "securepass",
      options: {
        data: {
          name: "Alice",
        },
      },
    });

    // Assert profile was inserted with role "user"
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(mockInsert).toHaveBeenCalledWith({
      id: "uuid-1",
      name: "Alice",
      role: "user",
    });

    // Assert return value
    expect(result).toEqual({
      success: true,
      user: {
        id: "uuid-1",
        email: "alice@example.com",
        name: "Alice",
        role: "user",
      },
    });
  });

  it("duplicate email returns friendly error", async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User already registered" },
    } as any);

    const result = await signUp({
      name: "Bob",
      email: "taken@example.com",
      password: "securepass",
    });

    expect(result).toEqual({
      success: false,
      error: "An account with this email already exists.",
    });
  });

  it("profile insert failure signs out user and returns recoverable error", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: { message: "insert failed" } });
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: {
        user: { id: "uuid-2", email: "charlie@example.com" },
        session: {},
      },
      error: null,
    } as any);
    vi.mocked(supabase.from).mockReturnValue({ insert: mockInsert } as any);
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);

    const result = await signUp({
      name: "Charlie",
      email: "charlie@example.com",
      password: "securepass",
    });

    // Assert signOut was called to clean up session
    expect(supabase.auth.signOut).toHaveBeenCalled();

    // Assert recoverable error message
    expect(result).toEqual({
      success: false,
      error: "Account created but profile setup failed. Please try logging in — your profile will be completed automatically.",
    });
  });

  it("unexpected Supabase auth error returns friendly message", async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "internal server error" },
    } as any);

    const result = await signUp({
      name: "Dana",
      email: "dana@example.com",
      password: "securepass",
    });

    expect(result).toEqual({
      success: false,
      error: "Something went wrong. Please try again.",
    });

    // Assert no profile insert was attempted
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
