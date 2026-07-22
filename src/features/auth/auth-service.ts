import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "user";
}

type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

type SignUpSuccess = {
  success: true;
  user: UserProfile;
};

type SignUpFailure = {
  success: false;
  error: string;
};

type SignUpResult = SignUpSuccess | SignUpFailure;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signUp(input: SignUpInput): Promise<SignUpResult> {
  if (!EMAIL_REGEX.test(input.email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (input.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const { data, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
      },
    },
  });

  if (authError) {
    if (authError.message?.toLowerCase().includes("already registered")) {
      return { success: false, error: "An account with this email already exists." };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }

  const user = data.user;
  if (!user) {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    name: input.name,
    role: "user",
  });

  if (profileError) {
    await supabase.auth.signOut();
    return {
      success: false,
      error:
        "Account created but profile setup failed. Please try logging in — your profile will be completed automatically.",
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email!,
      name: input.name,
      role: "user",
    },
  };
}

type LogInInput = {
  email: string;
  password: string;
};

type LogInSuccess = {
  success: true;
  user: UserProfile;
};

type LogInFailure = {
  success: false;
  error: string;
};

type LogInResult = LogInSuccess | LogInFailure;

export async function logIn(input: LogInInput): Promise<LogInResult> {
  if (!EMAIL_REGEX.test(input.email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!input.password) {
    return { success: false, error: "Password cannot be empty." };
  }

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

  if (authError || !authData.user) {
    return { success: false, error: "Incorrect email or password." };
  }

  const user = authData.user;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email!,
        name: profile.name,
        role: profile.role || "user",
      },
    };
  }

  if (profileError) {
    return {
      success: false,
      error: "Failed to retrieve user profile. Please try again.",
    };
  }

  // Profile missing -> attempt backfill using user metadata name
  const nameFromMetadata = user.user_metadata?.name || "";
  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    name: nameFromMetadata,
    role: "user",
  });

  if (insertError) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Authentication succeeded but profile setup failed. Please try again.",
    };
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email!,
      name: nameFromMetadata,
      role: "user",
    },
  };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return null;
  }

  const user = authData.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    name: profile.name,
    role: profile.role || "user",
  };
}

export async function logOut(): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
