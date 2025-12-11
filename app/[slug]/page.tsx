// app/[slug]/page.tsx

type PageProps = {
  params: { slug: string };
};

export default function Page({ params }: PageProps) {
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
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        動態路由測試頁面
      </h1>
      <p style={{ marginBottom: 8 }}>
        如果你看到這個畫面，代表 <code>app/[slug]/page.tsx</code>{" "}
        有被 Next.js 正確載入。
      </p>
      <p style={{ marginBottom: 24 }}>
        目前網址的 slug 是：
      </p>
      <pre
        style={{
          background: "#111",
          color: "#0ff",
          padding: 16,
          borderRadius: 8,
          fontSize: 16,
        }}
      >
        {params.slug}
      </pre>
    </main>
  );
}

