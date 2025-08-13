// PDF generation utility functions

/**
 * Generate PDF by triggering browser print dialog
 * Users can then select "Save as PDF" option
 */
export function generatePDF(): void {
  // Add print-specific class to body for styling
  document.body.classList.add("print-mode");

  // Trigger print dialog
  window.print();

  // Remove print-specific class after print dialog closes
  // Note: This cleanup happens when print dialog is cancelled or completed
  setTimeout(() => {
    document.body.classList.remove("print-mode");
  }, 100);
}

/**
 * Initialize PDF download button functionality
 */
export function initPDFDownload(): void {
  const pdfBtn = document.getElementById("pdfDownloadBtn");

  if (pdfBtn) {
    pdfBtn.addEventListener("click", e => {
      e.preventDefault();
      generatePDF();
    });
  }
}

/**
 * Auto-initialize PDF functionality when DOM is ready
 */
document.addEventListener("DOMContentLoaded", () => {
  initPDFDownload();
});
