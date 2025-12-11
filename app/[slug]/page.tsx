// app/[slug]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

async function fetchPage(
  slug: string
): Promise<{ row: PageRow | null; error: any }> {
  const { data, error } = await supabase
    .from("seed_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle(); // 0 筆資料不要當錯誤

  return {
    row: (data as PageRow | null) ?? null,
    error,
  };
}

// 產生每個頁面的 <title> / <meta>
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { row } = await fetchPage(params.slug);

  if (!row) {
    return {
      title: "The Weekend Club · Weekend Social Guides",
      description:
        "Discover curated weekend brunch tables and social guides from The Weekend Club.",
    };
  }

  const titleParts = [
    row.title,
    row.city ?? undefined,
    "The Weekend Club",
  ].filter(Boolean);

  const description =
    row.meta_description ??
    (row.content ? row.content.slice(0, 160) : undefined);

  const canonicalUrl = `https://guide.the-wknd.club/${row.slug}`;

  return {
    title: titleParts.join(" · "),
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleParts.join(" · "),
      description: description ?? undefined,
      url: canonicalUrl,
      type: "article",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { row, error } = await fetchPage(params.slug);

  // 若 Supabase 出錯，直接顯示錯誤，方便 debug
  if (error) {
    return (
      <main
        style={{
          maxWidth: 800,
          margin: "40px auto",
          padding: "0 16px 64px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#f9fafb",
          backgroundColor: "#020617",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>
          Supabase 查詢發生錯誤
        </h1>
        <p style={{ marginBottom: 16 }}>
          請檢查 Vercel 上的 NEXT_PUBLIC_SUPABASE_URL /
          NEXT_PUBLIC_SUPABASE_ANON_KEY 是否正確，或 seed_pages 的權限設定。
        </p>
        <pre
          style={{
            background: "#111827",
            padding: 16,
            borderRadius: 8,
            fontSize: 13,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {JSON.stringify(error, null, 2)}
        </pre>
      </main>
    );
  }

  // 沒錯誤但沒有資料 → 真的不存在這個 slug
  if (!row) {
    notFound();
  }

  const subtitleParts = [
    row.city,
    row.persona,
    row.theme,
  ].filter(Boolean);

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: "0 16px 80px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#f9fafb",
        backgroundColor: "#020617",
      }}
    >
      {/* 上方 breadcrumb / subtitle */}
      <p
        style={{
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#9ca3af",
          marginBottom: 8,
        }}
      >
        The Weekend Club · Weekend Guides
      </p>

      {subtitleParts.length > 0 && (
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 4,
          }}
        >
          {subtitleParts.join(" · ")}
        </p>
      )}

      {/* 標題 */}
      <h1
        style={{
          fontSize: 30,
          fontWeight: 600,
          lineHeight: 1.2,
          marginBottom: 20,
        }}
      >
        {row.title}
      </h1>

      {/* 內文 */}
      {row.content && (
        <article
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: "#e5e7eb",
            whiteSpace: "pre-wrap",
            marginBottom: 40,
          }}
        >
          {row.content}
        </article>
      )}

      {/* CTA 區塊 */}
      <section
        style={{
          borderRadius: 24,
          border: "1px solid #374151",
          padding: 24,
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.16), transparent 60%) #020617",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          這個週末，直接來桌上見面
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "#d1d5db",
            marginBottom: 20,
          }}
        >
          The Weekend Club 每週在{" "}
          {row.city ?? "你的城市"}
          {" "}安排 6 人早午餐桌，由演算法幫你配對同樣在週末有空、頻率接近的新朋友。
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <a
            href="https://app.the-wknd.club"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              backgroundColor: "#f9fafb",
              color: "#020617",
              textDecoration: "none",
            }}
          >
            在 App 報名這一桌
          </a>

          <a
            href="https://the-wknd.club"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              border: "1px solid #4b5563",
              color: "#e5e7eb",
              textDecoration: "none",
            }}
          >
            認識 The Weekend Club
          </a>

          <a
            href="https://apps.apple.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 500,
              border: "1px solid #4b5563",
              color: "#e5e7eb",
              textDecoration: "none",
            }}
          >
            下載 iOS App
          </a>
        </div>
      </section>
    </main>
  );
}
