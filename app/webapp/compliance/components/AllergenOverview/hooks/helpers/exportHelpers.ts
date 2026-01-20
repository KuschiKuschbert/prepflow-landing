export async function handlePdfExport(url: string, showSuccess: (msg: string) => void) {
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
    showSuccess("PDF export opened in new window. Use your browser's print dialog to save as PDF.");
  } else {
    // Fallback to download if popup blocked
    const a = document.createElement('a');
    a.href = url;
    a.download = 'allergen_overview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showSuccess('HTML file downloaded. Open it and use Print > Save as PDF.');
  }
}

export function handleFileDownload(url: string, format: string, showSuccess: (msg: string) => void) {
  const a = document.createElement('a');
  a.href = url;
  a.download = `allergen_overview.${format === 'csv' ? 'csv' : 'html'}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showSuccess(`Allergen overview exported as ${format.toUpperCase()}`);
}
