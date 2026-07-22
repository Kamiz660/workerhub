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
      update: vi.fn(),
    })),
  },
}));

import { getCurrentUser } from "@/features/auth/auth-service";
import { supabase } from "@/lib/supabase";

describe("getCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user profile when session exists", async () => {
    const mockSingle = vi.fn().mockResolvedValue({
      data: { id: "uuid-1", name: "Alice", role: "user" },
      error: null,
    });
    const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
    const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });

    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: "uuid-1", email: "alice@example.com" } },
      error: null,
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      select: mockSelect,
    } as any);

    const result = await getCurrentUser();

    expect(result).toEqual({
      id: "uuid-1",
      email: "alice@example.com",
      name: "Alice",
      role: "user",
    });

    // Assert it is pure read-only
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
    expect(supabase.from).toHaveBeenCalledWith("profiles");
  });

  it("returns null when session does not exist", async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null,
    } as any);

    const result = await getCurrentUser();

    expect(result).toBeNull();
  });
});
