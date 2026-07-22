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
      select: vi.fn(),
      insert: vi.fn(),
    })),
  },
}));

import { logOut } from "@/features/auth/auth-service";
import { supabase } from "@/lib/supabase";

describe("logOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears session on successful logout", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);

    const result = await logOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("returns error message when logout fails", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: { message: "Signout failed" },
    } as any);

    const result = await logOut();

    expect(result).toEqual({
      success: false,
      error: "Signout failed",
    });
  });
});
