import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { createPost } from "./actions";
export const dynamic = "force-dynamic";
const CATS = ["Doubt","Theory","Discussion","Preparation Strategy","News","DPP","Previous Year Question","Notes"];
export default async function Home() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  const { data: comms } = await sb.from("communities").select("id,name").order("id");
  const { data: posts } = await sb.from("posts").select("id,title,body,category,created_at,profiles(username),communities(name)").order("created_at", { ascending: false }).limit(30);
  return <>
    {!user && <p><Link href="/login">Log in or sign up</Link> to post and ask the AI.</p>}
    {user && <form action={createPost} className="card"><select name="community">{comms?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select name="category">{CATS.map(c => <option key={c}>{c}</option>)}</select>
      <input name="title" placeholder="Title" maxLength={160} required /><textarea name="body" placeholder="Describe your doubt or idea" maxLength={4000} required /><button>Post</button></form>}
    {!posts?.length && <p>No posts yet. Be the first to ask a doubt.</p>}
    {posts?.map((p: any) => <article className="card" key={p.id}><small>{p.category} · {p.communities?.name} · {p.profiles?.username}</small><h3>{p.title}</h3><p style={{whiteSpace:"pre-wrap"}}>{p.body}</p></article>)}
  </>;
}
