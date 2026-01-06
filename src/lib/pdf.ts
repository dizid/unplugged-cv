"use client";

type DocumentType = "cv" | "letter";

const cvStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 48px;
    max-width: 720px;
    margin: 0 auto;
    color: #171717;
    background: white;
  }

  /* Name - Bold visual anchor */
  h1 {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: #111827;
    padding-bottom: 12px;
    border-bottom: 2px solid #111827;
    margin-bottom: 12px;
  }

  /* Contact info - First paragraph after name */
  h1 + p {
    font-size: 13px;
    color: #6b7280;
    letter-spacing: 0.02em;
    margin-bottom: 32px;
  }

  /* Section headers - Uppercase with blue accent bar */
  h2 {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7280;
    padding-top: 24px;
    padding-bottom: 8px;
    padding-left: 12px;
    border-left: 3px solid #2563eb;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 16px;
  }

  /* Job titles */
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    letter-spacing: -0.01em;
    margin-top: 20px;
    margin-bottom: 2px;
  }

  h2 + h3 { margin-top: 0; }

  /* Company/dates line */
  h3 + p {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  /* Body paragraphs */
  p {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.65;
    margin-top: 8px;
    margin-bottom: 8px;
  }

  /* Professional summary */
  h2:first-of-type + p {
    font-size: 15px;
    color: #374151;
    line-height: 1.7;
  }

  /* Bullet lists */
  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 8px;
    margin-bottom: 12px;
  }

  li {
    font-size: 14px;
    color: #4b5563;
    line-height: 1.6;
    padding-left: 16px;
    margin-bottom: 4px;
    position: relative;
  }

  li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 5px;
    height: 5px;
    background-color: #9ca3af;
    border-radius: 50%;
  }

  strong {
    font-weight: 600;
    color: #1f2937;
  }

  a {
    color: #2563eb;
    text-decoration: none;
  }

  @media print {
    @page {
      margin: 0.5in;
      size: letter;
    }
    body {
      padding: 0;
      margin: 0;
      orphans: 3;
      widows: 3;
    }
    h2 {
      break-after: avoid;
      page-break-after: avoid;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    h3 {
      break-after: avoid;
      page-break-after: avoid;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    h3 + p {
      break-before: avoid;
      page-break-before: avoid;
    }
    ul {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    li {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    /* Prevent orphaned content */
    p {
      orphans: 2;
      widows: 2;
    }
  }
`;

const letterStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    padding: 56px;
    max-width: 680px;
    margin: 0 auto;
    color: #171717;
    background: white;
  }

  /* Base paragraph styles */
  p {
    font-size: 15px;
    color: #374151;
    line-height: 1.8;
    margin-top: 0;
    margin-bottom: 20px;
  }

  /* Greeting line - "Dear Hiring Team," */
  p:first-child {
    font-size: 15px;
    color: #6b7280;
    margin-bottom: 24px;
  }

  /* Opening paragraph - emphasized with blue accent */
  p:nth-child(2) {
    font-size: 16px;
    font-weight: 500;
    color: #1f2937;
    line-height: 1.75;
    padding-left: 16px;
    border-left: 3px solid #2563eb;
    margin-bottom: 24px;
  }

  /* Sign-off paragraph */
  p:last-child {
    color: #6b7280;
    margin-top: 32px;
    margin-bottom: 0;
  }

  /* Strong text (name in sign-off) */
  strong {
    font-weight: 600;
    color: #111827;
  }

  a {
    color: #2563eb;
    text-decoration: none;
  }

  @media print {
    @page {
      margin: 1in 0.75in;
      size: letter;
    }
    body { padding: 0; margin: 0; }
    p { page-break-inside: avoid; }
  }
`;

export async function generatePDF(
  elementId: string,
  _filename: string = "cv.pdf",
  documentType: DocumentType = "cv"
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  // Create a print-friendly version
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Could not open print window. Please allow popups.");
  }

  const doc = printWindow.document;

  // Create head with styles based on document type
  const style = doc.createElement("style");
  style.textContent = documentType === "cv" ? cvStyles : letterStyles;
  doc.head.appendChild(style);

  // Set title
  const title = doc.createElement("title");
  title.textContent = documentType === "cv" ? "CV" : "Cover Letter";
  doc.head.appendChild(title);

  // Clone and append content safely
  const clonedContent = element.cloneNode(true) as HTMLElement;
  while (clonedContent.firstChild) {
    doc.body.appendChild(clonedContent.firstChild);
  }

  // Print after brief delay
  setTimeout(() => {
    printWindow.print();
  }, 300);
}

// Helper function to print CV from markdown content
export function printCV(markdown: string) {
  printMarkdownDocument(markdown, "cv.pdf", "cv");
}

// Helper function to print cover letter from markdown content
export function printCoverLetter(markdown: string) {
  printMarkdownDocument(markdown, "cover-letter.pdf", "letter");
}

// Print markdown document by converting to HTML safely
function printMarkdownDocument(
  markdown: string,
  filename: string,
  documentType: DocumentType
) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Could not open print window. Please allow popups.");
  }

  const doc = printWindow.document;

  // Create head with styles based on document type
  const style = doc.createElement("style");
  style.textContent = documentType === "cv" ? cvStyles : letterStyles;
  doc.head.appendChild(style);

  // Set title
  const title = doc.createElement("title");
  title.textContent = documentType === "cv" ? "CV" : "Cover Letter";
  doc.head.appendChild(title);

  // Convert markdown to DOM elements safely
  const elements = markdownToElements(markdown, doc);
  elements.forEach((el) => doc.body.appendChild(el));

  // Print after brief delay
  setTimeout(() => {
    printWindow.print();
  }, 300);
}

// Convert markdown to DOM elements safely (no innerHTML)
function markdownToElements(markdown: string, doc: Document): HTMLElement[] {
  const lines = markdown.split("\n");
  const elements: HTMLElement[] = [];
  let currentList: HTMLUListElement | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      currentList = null;
      continue;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      currentList = null;
      const h3 = doc.createElement("h3");
      h3.textContent = trimmed.slice(4);
      elements.push(h3);
    } else if (trimmed.startsWith("## ")) {
      currentList = null;
      const h2 = doc.createElement("h2");
      h2.textContent = trimmed.slice(3);
      elements.push(h2);
    } else if (trimmed.startsWith("# ")) {
      currentList = null;
      const h1 = doc.createElement("h1");
      h1.textContent = trimmed.slice(2);
      elements.push(h1);
    }
    // List items
    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!currentList) {
        currentList = doc.createElement("ul");
        elements.push(currentList);
      }
      const li = doc.createElement("li");
      appendFormattedText(li, trimmed.slice(2), doc);
      currentList.appendChild(li);
    }
    // Regular paragraph
    else {
      currentList = null;
      const p = doc.createElement("p");
      appendFormattedText(p, trimmed, doc);
      elements.push(p);
    }
  }

  return elements;
}

// Append text with basic formatting (bold, links) safely
function appendFormattedText(
  parent: HTMLElement,
  text: string,
  doc: Document
) {
  // Process bold (**text**) and links [text](url)
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = doc.createElement("strong");
      strong.textContent = part.slice(2, -2);
      parent.appendChild(strong);
    } else if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const a = doc.createElement("a");
        a.textContent = match[1];
        a.href = match[2];
        parent.appendChild(a);
      }
    } else if (part) {
      parent.appendChild(doc.createTextNode(part));
    }
  }
}
