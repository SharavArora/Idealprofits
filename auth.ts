// auth.ts
export interface AuthResponse {
  token: string;
  userId: number;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return await res.json();
}

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch("http://localhost:8000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("Signup failed");
  return await res.json();
}
