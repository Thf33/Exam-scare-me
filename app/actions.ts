"use server";
import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
export async function createPost(fd: FormData) {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error("Log in first");
  const title = String(fd.get("title") ?? "").trim(), body = String(fd.get("body") ?? "").trim();
  if (title.length < 3 || title.length > 160 || !body || body.length > 4000) throw new Error("Invalid post");
  const { error } = await sb.from("posts").insert({ author: user.id, title, body, category: String(fd.get("category")), community_id: Number(fd.get("community")) });
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
