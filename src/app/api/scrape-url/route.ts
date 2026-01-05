import { NextResponse } from "next/server";

export const runtime = "edge";

// Block dangerous URLs
function isBlockedUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // Block localhost and internal IPs
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.endsWith(".local")
    ) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
}

// Detect if page is a client-side rendered SPA
function isSpaPage(html: string): boolean {
  const lowerHtml = html.toLowerCase();

  // Check for common SPA patterns
  const spaPatterns = [
    /<div id="app"><\/div>/i,
    /<div id="root"><\/div>/i,
    /<div id="__next"><\/div>/i,
    /window\.__INITIAL_STATE__/,
    /type="module".*crossorigin.*src="\/assets\//,
  ];

  // Check if body has minimal content but lots of scripts
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1]
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();

    if (bodyContent.length < 100 && lowerHtml.includes('type="module"')) {
      return true;
    }
  }

  return spaPatterns.some(pattern => pattern.test(html));
}

// Extract text content from HTML
function extractTextFromHtml(html: string): string {
  // Remove script and style elements
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ");

  // Remove HTML tags but keep content
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");

  // Clean up whitespace
  text = text
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();

  return text;
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported" },
        { status: 400 }
      );
    }

    // Block dangerous URLs
    if (isBlockedUrl(url)) {
      return NextResponse.json(
        { error: "This URL cannot be accessed" },
        { status: 400 }
      );
    }

    // Check for LinkedIn (they block scraping)
    if (parsedUrl.hostname.includes("linkedin.com")) {
      return NextResponse.json(
        {
          error:
            "LinkedIn blocks automated access. Please copy your profile content manually and paste it in the text area.",
        },
        { status: 400 }
      );
    }

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; UnpluggedCV/1.0; +https://unplugged.cv)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        return NextResponse.json(
          {
            error:
              "This site blocks automated access. Please copy the content manually.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      return NextResponse.json(
        { error: "URL must point to a web page (HTML)" },
        { status: 400 }
      );
    }

    const html = await response.text();

    // Check if it's a SPA/client-rendered page
    if (isSpaPage(html)) {
      return NextResponse.json(
        {
          error:
            "This page uses JavaScript to load content (SPA). Please copy the text from the page manually and paste it in the text area.",
        },
        { status: 400 }
      );
    }

    // Extract text content
    const content = extractTextFromHtml(html);

    // Limit content length (max ~50KB of text)
    const maxLength = 50000;
    const trimmedContent =
      content.length > maxLength
        ? content.substring(0, maxLength) + "\n\n[Content truncated...]"
        : content;

    if (trimmedContent.length < 50) {
      return NextResponse.json(
        { error: "No meaningful content found on this page. If the page loads content dynamically, please copy the text manually." },
        { status: 400 }
      );
    }

    return NextResponse.json({ content: trimmedContent });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Failed to fetch URL. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
