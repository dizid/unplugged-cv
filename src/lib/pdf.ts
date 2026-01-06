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
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 16px;
    position: relative;
  }

  h2::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    background: #2563eb;
    border-radius: 2px;
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
    background: #9ca3af;
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
    @page { margin: 0; }
    body { padding: 48px; margin: 0; }
    h2 { page-break-after: avoid; }
    h3 { page-break-after: avoid; }
    li { page-break-inside: avoid; }
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
    @page { margin: 0; }
    body { padding: 56px; margin: 0; }
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
