import { NextResponse } from "next/server";

export const runtime = "edge";

interface DocContent {
  body?: {
    content?: Array<{
      paragraph?: {
        elements?: Array<{
          textRun?: {
            content?: string;
          };
        }>;
      };
    }>;
  };
}

// Extract plain text from Google Docs API response
function extractTextFromDoc(doc: DocContent): string {
  const textParts: string[] = [];

  if (!doc.body?.content) {
    return "";
  }

  for (const element of doc.body.content) {
    if (element.paragraph?.elements) {
      for (const elem of element.paragraph.elements) {
        if (elem.textRun?.content) {
          textParts.push(elem.textRun.content);
        }
      }
    }
  }

  return textParts.join("").trim();
}

export async function POST(request: Request) {
  try {
    const { documentId, accessToken } = await request.json();

    if (!documentId || !accessToken) {
      return NextResponse.json(
        { error: "Document ID and access token are required" },
        { status: 400 }
      );
    }

    // Fetch document content from Google Docs API
    const response = await fetch(
      `https://docs.googleapis.com/v1/documents/${documentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Access token expired. Please reconnect your Google account." },
          { status: 401 }
        );
      }
      if (response.status === 403) {
        return NextResponse.json(
          { error: "You don't have permission to access this document." },
          { status: 403 }
        );
      }
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Document not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch document: ${response.status}` },
        { status: 400 }
      );
    }

    const doc = (await response.json()) as DocContent;
    const content = extractTextFromDoc(doc);

    if (!content || content.length < 10) {
      return NextResponse.json(
        { error: "Document appears to be empty or has very little content." },
        { status: 400 }
      );
    }

    // Limit content length (max ~50KB)
    const maxLength = 50000;
    const trimmedContent =
      content.length > maxLength
        ? content.substring(0, maxLength) + "\n\n[Content truncated...]"
        : content;

    return NextResponse.json({ content: trimmedContent });
  } catch (error) {
    console.error("Google Docs fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch document content. Please try again." },
      { status: 500 }
    );
  }
}
