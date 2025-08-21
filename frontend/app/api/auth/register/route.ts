// frontend/app/api/auth/register/route.ts
import { NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_BASE!; // ex: http://localhost:4000

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // On délègue entièrement au backend
    const r = await fetch(`${API}/api/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, name, password }),
    });

    const text = await r.text(); // on passe tel quel (conserve JSON/erreur backend)
    return new NextResponse(text, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e: any) {
    console.error("Registration error:", e);
    return NextResponse.json(
      { error: "Failed to create user", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
