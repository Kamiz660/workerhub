import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase before importing the module under test
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(),
        eq: vi.fn(),
      })),
      insert: vi.fn(),
    })),
  },
}));

import { logIn } from "@/features/auth/auth-service";
import { supabase } from "@/lib/supabase";

describe("logIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid email format", async () => {
    const result = await logIn({
      email: "invalid-email",
      password: "securepass",
    });

    expect(result).toEqual({
      success: false,
      error: "Please enter a valid email address.",
    });
  });

  it("rejects empty password", async () => {
    const result = await logIn({
      email: "test@example.com",
      password: "",
    });

    expect(result).toEqual({
      success: false,
      error: "Password cannot be empty.",
    });
  });

  it("successful login with existing profile returns user and does not attempt insert", async () => {
    const mockInsert = vi.fn();
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: "uuid-1", name: "Alice", role: "user" },
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: { id: "uuid-1", email: "alice@example.com" },
        session: {},
      },
      error: null,
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    } as any);

    const result = await logIn({
      email: "alice@example.com",
      password: "securepass",
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "securepass",
    });

    expect(result).toEqual({
      success: true,
      user: {
        id: "uuid-1",
        email: "alice@example.com",
        name: "Alice",
        role: "user",
      },
    });

    // Assert profile insert was NOT called
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("rejects incorrect credentials", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    } as any);

    const result = await logIn({
      email: "alice@example.com",
      password: "wrongpass",
    });

    expect(result).toEqual({
      success: false,
      error: "Incorrect email or password.",
    });
  });

  it("backfills profile using user_metadata name when profile is missing on login", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          id: "uuid-2",
          email: "charlie@example.com",
          user_metadata: { name: "Charlie" },
        },
        session: {},
      },
      error: null,
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    } as any);

    const result = await logIn({
      email: "charlie@example.com",
      password: "securepass",
    });

    // Assert profile insert was called with metadata name
    expect(supabase.from).toHaveBeenCalledWith("profiles");
    expect(mockInsert).toHaveBeenCalledWith({
      id: "uuid-2",
      name: "Charlie",
      role: "user",
    });

    expect(result).toEqual({
      success: true,
      user: {
        id: "uuid-2",
        email: "charlie@example.com",
        name: "Charlie",
        role: "user",
      },
    });
  });

  it("unexpected profile query error returns error and does not trigger backfill", async () => {
    const mockInsert = vi.fn();
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "Database error" },
    });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: { id: "uuid-5", email: "error@example.com" },
        session: {},
      },
      error: null,
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    } as any);

    const result = await logIn({
      email: "error@example.com",
      password: "securepass",
    });

    expect(result).toEqual({
      success: false,
      error: "Failed to retrieve user profile. Please try again.",
    });

    // Assert insert was NOT called
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("handles backfill insert failure by signing out and returning error", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: { message: "insert failed" } });
    const mockSingle = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          id: "uuid-3",
          email: "dana@example.com",
          user_metadata: { name: "Dana" },
        },
        session: {},
      },
      error: null,
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    } as any);

    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);

    const result = await logIn({
      email: "dana@example.com",
      password: "securepass",
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: "Authentication succeeded but profile setup failed. Please try again.",
    });
  });
});





