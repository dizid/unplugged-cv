"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// Convert oklch colors to rgb for html2canvas compatibility
function convertOklchColors(element: HTMLElement) {
  const allElements = element.querySelectorAll("*");
  const elementsToProcess = [element, ...Array.from(allElements)] as HTMLElement[];

  elementsToProcess.forEach((el) => {
    const computed = window.getComputedStyle(el);
    const colorProps = ["color", "background-color", "border-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color"];

    colorProps.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (value && value.includes("oklch")) {
        // Create a temp element to get the computed rgb value
        const temp = document.createElement("div");
        temp.style.color = value;
        document.body.appendChild(temp);
        const rgb = window.getComputedStyle(temp).color;
        document.body.removeChild(temp);
        el.style.setProperty(prop, rgb);
      }
    });
  });
}

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
    onclone: (_doc, clonedElement) => {
      convertOklchColors(clonedElement);
    },
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
