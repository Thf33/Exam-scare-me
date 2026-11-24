import { supabaseServer } from "@/lib/supabase/server";
const SYS = `You are the Exam Scare Me tutor for Indian students (NEET, JEE, boards, CUET, UPSC, SSC). Never pretend to know: if unsure, say so. Split answers into "From textbook/NCERT (recalled, please verify)" and "My explanation". Never invent page numbers or quotes. Show steps and check arithmetic. For MCQs explain why wrong options are wrong.`;
const MODES: Record<string, string> = { simple: "Explain simply.", detailed: "Explain in detail.", exam: "Give an exam-oriented answer with tips and common traps.", steps: "Give a numbered step-by-step solution." };

export async function POST(req: Request) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return Response.json({ error: "Log in first." }, { status: 401 });
  const { question, mode = "simple" } = await req.json();
  if (typeof question !== "string" || question.length < 3 || question.length > 4000) return Response.json({ error: "Question must be 3-4000 characters." }, { status: 400 });
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await sb.from("ai_usage").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
  if ((count ?? 0) >= 20) return Response.json({ error: "Limit: 20 AI questions per hour." }, { status: 429 });
  await sb.from("ai_usage").insert({ user_id: user.id });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 1200, system: SYS + " " + (MODES[mode] ?? MODES.simple), messages: [{ role: "user", content: question }] }),
  });
  if (!r.ok) return Response.json({ error: "AI is unavailable right now." }, { status: 502 });
  const j = await r.json();
  return Response.json({ answer: j.content?.map((c: any) => c.text ?? "").join("") ?? "" });
}
