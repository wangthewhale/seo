// app/[slug]/page.tsx
import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
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

// 共用：從 Supabase 抓一筆 page 資料
async function getPageData(slug: string): Promise<PageRow | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data as PageRow;
}

/**
 * SEO 用：依據資料庫內容動態設定 <title> & meta description
 */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const row = await getPageData(params.slug);

  if (!row) {
    return {
      title: "The Weekend Club",
      description: "Meet 5 new friends over brunch every weekend."
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SEO_CANONICAL_PREFIX ||
    "https://guide.the-wknd.club"; // 你之後可以改成實際 SEO 網域

  return {
    title: row.title,
    description: row.meta_description ?? undefined,
    openGraph: {
      title: row.title,
      description: row.meta_description ?? undefined,
      url: `${siteUrl}/${row.slug}`,
      type: "article"
    }
  };
}

/**
 * 主頁面：顯示內容 + CTA
 */
export default async function Page({ params }: PageProps) {
  const row = await getPageData(params.slug);

  if (!row) {
    notFound();
  }

  const cityLabel = row.city ?? "";
  const personaLabel = row.persona ?? "";
  const themeLabel = row.theme ?? "";

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "40px auto",
        padding: "0 16px 64px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* 頁首 */}
      <header
        style={{
          paddingBottom: 16,
          marginBottom: 24,
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <p style={{ fontSize: 13, color: "#777" }}>
          The Weekend Club
          {cityLabel && ` · ${cityLabel}`}
          {personaLabel && ` · ${personaLabel}`}
          {themeLabel && ` · ${themeLabel}`}
        </p>
        <h1
          style={{
            marginTop: 8,
            fontSize: 30,
            lineHeight: 1.25,
            fontWeight: 650,
          }}
        >
          {row.title}
        </h1>
      </header>

      {/* 內文（從 Supabase content 欄位來） */}
      <article
        style={{
          lineHeight: 1.8,
          fontSize: 16,
          color: "#222",
        }}
        dangerouslySetInnerHTML={{ __html: row.content ?? "" }}
      />

      {/* CTA 區塊 */}
      <CTASection city={row.city ?? undefined} />
    </main>
  );
}

/**
 * CTA 區塊：統一把人導到
 * - 官方網站（MARKETING_SITE）
 * - Web App（WEB_APP）
 * - iOS App（IOS_UNIVERSAL_LINK / IOS_APP_STORE）
 */
type CTAProps = {
  city?: string;
};

function CTASection({ city }: CTAProps) {
  const marketingSite =
    process.env.NEXT_PUBLIC_MARKETING_SITE || "https://the-wknd.club";
  const webApp =
    process.env.NEXT_PUBLIC_WEB_APP || "https://app.the-wknd.club";

  // 優先用 Universal Link，沒有的話改用 App Store 連結
  const iosLink =
    process.env.NEXT_PUBLIC_IOS_UNIVERSAL_LINK ||
    process.env.NEXT_PUBLIC_IOS_APP_STORE ||
    "";

  const cityQuery = city ? `?city=${encodeURIComponent(city)}` : "";

  return (
    <section
      style={{
        marginTop: 40,
        padding: 24,
        borderRadius: 16,
        border: "1px solid #e5e5e5",
        background: "#fafafa",
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 8,
        }}
      >
        想在{city || "你的城市"}試一次 The Weekend Club 嗎？
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "#555",
          marginBottom: 16,
        }}
      >
        每個週末，我們都會在不同城市安排六人早午餐桌。報名與付款都在官方
        web app 或 iOS app 完成。
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {/* Web App：查看可報名桌次 */}
        <a
          href={`${webApp}/weekend${cityQuery}`}
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid #111",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            color: "#111",
          }}
        >
          查看本週可報名桌次（Web）
        </a>

        {/* iOS App（若有填環境變數才顯示） */}
        {iosLink && (
          <a
            href={iosLink}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid #111",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            color: "#111",
            }}
          >
            在 iOS App 開啟
          </a>
        )}

        {/* 回官方網站 */}
        <a
          href={marketingSite}
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid #ccc",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            color: "#444",
          }}
        >
          回到官方網站
        </a>
      </div>
    </section>
  );
}
