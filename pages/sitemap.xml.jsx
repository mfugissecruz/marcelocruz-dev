const SITE_URL = "https://marcelocruz.dev";

function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const pages = [""];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}/${page}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default Sitemap;
