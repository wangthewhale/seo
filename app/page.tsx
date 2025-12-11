// app/[slug]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import type { Metadata } from "next";

type PageProps = {
  params: { slug: string };
};

type PageRow = {
  slug: string;
  title: string;
  city: string | null;
  persona: string | null;
  theme: string | null;
  meta_description: string | null;
  content: string | null;
};

// 先暫時不要 notFound()，純粹看 Supabase 回什麼
async function getPageData(slug: string): Promise<{
  row: PageRow | null;
  error: any;
}> {
  const { data, error } = await supabase
    .from("seed_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle(); // 0 筆資料不要直接當錯誤

  return {
    row: (data as PageRow | null) ?? null,
    error,
  };
}

// Metadata 先簡化，避免也依賴資料庫
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  return {
    title: `Debug – ${params.slug}`,
    description: "Debug SEO page for The Weekend Club",
  };
}

export default async function Page({ params }: PageProps) {
  const { row, error } = await getPageData(params.slug);

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "0 16px 64px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 24,
          marginBottom: 16,
          fontWeight: 600,
        }}
      >
        Debug: {params.slug}
      </h1>

      <p style={{ marginBottom: 16 }}>
        這個頁面只是暫時用來檢查 Supabase 回來的資料與錯誤。
      </p>

      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Error</h2>
      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 8,
          fontSize: 13,
          overflowX: "auto",
          marginBottom: 24,
        }}
      >
        {JSON.stringify(error, null, 2)}
      </pre>

      <h2 style={{ fontSize: 18, marginBottom: 8 }}>Row</h2>
      <pre
        style={{
          background: "#111",
          color: "#0ff",
          padding: 16,
          borderRadius: 8,
          fontSize: 13,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(row, null, 2)}
      </pre>
    </main>
  );
}
