"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
export default function Login() {
  const [email, setEmail] = useState(""), [pw, setPw] = useState(""), [user, setUser] = useState(""), [msg, setMsg] = useState("");
  const sb = supabaseBrowser();
  async function signUp() {
    const { error } = await sb.auth.signUp({ email, password: pw, options: { data: { username: user }, emailRedirectTo: location.origin } });
    setMsg(error ? error.message : "Check your email to verify your account.");
  }
  async function logIn() {
    const { error } = await sb.auth.signInWithPassword({ email, password: pw });
    if (error) setMsg(error.message); else location.href = "/";
  }
  async function reset() { const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin }); setMsg(error ? error.message : "Reset link sent."); }
  return <div className="card"><input placeholder="Username (sign up)" value={user} onChange={e => setUser(e.target.value)} />
    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
    <input type="password" placeholder="Password (8+ characters)" value={pw} onChange={e => setPw(e.target.value)} />
    <button onClick={logIn}>Log in</button><button onClick={signUp}>Create account</button><button onClick={reset}>Reset password</button><p>{msg}</p></div>;
}
