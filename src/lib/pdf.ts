"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generatePDF(elementId: string, filename: string = "cv.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  // Capture the element as canvas
  const canvas = await html2canvas(element, {
    scale: 2, // Higher quality
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  // Calculate dimensions for A4
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );
  heightLeft -= pageHeight;

  // Add additional pages if needed
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
