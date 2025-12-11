// app/[slug]/page.tsx
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

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

async function fetchPage(slug: string): Promise<{
  row: PageRow | null;
  error: any;
}> {
  const { data, error } = await supabase
    .from("seed_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return {
    row: (data as PageRow | null) ?? null,
    error,
  };
}

export default async function Page({ params }: PageProps) {
  const { row, error } = await fetchPage(params.slug);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "undefined";

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 16px 80px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#e5e7eb",
        backgroundColor: "#020617",
      }}
    >
      <h1
        style={{
          fontSize: 26,
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        SEO Debug Page
      </h1>

      <p style={{ marginBottom: 12 }}>
        這是暫時用來 debug 的頁面，不會再顯示 Next.js 的 404。
      </p>

      <section
        style={{
          marginTop: 24,
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#111827",
          border: "1px solid #374151",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          基本資訊
        </h2>
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>
          <div>
            <strong>目前網址的 slug：</strong> {params.slug}
          </div>
          <div>
            <strong>使用的 Supabase URL：</strong> {supabaseUrl}
          </div>
        </div>
      </section>

      <section
        style={{
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#111827",
          border: "1px solid #4b5563",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          Supabase error
        </h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: 13,
            backgroundColor: "#020617",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {JSON.stringify(error, null, 2)}
        </pre>
      </section>

      <section
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#111827",
          border: "1px solid #4b5563",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            marginBottom: 8,
            fontWeight: 500,
          }}
        >
          Supabase row
        </h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: 13,
            backgroundColor: "#020617",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {JSON.stringify(row, null, 2)}
        </pre>
      </section>
    </main>
  );
}
