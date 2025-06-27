import jsPDF from "jspdf";

export function generateInvoicePDF(bookingData) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("MyCitiverse Booking Invoice", 20, 20);

  doc.setFontSize(12);
  doc.text(`Booking ID: ${bookingData.id}`, 20, 40);
  doc.text(`Name: ${bookingData.userName}`, 20, 50);
  doc.text(`Phone: ${bookingData.phone}`, 20, 60);
  doc.text(`Venue: ${bookingData.venueName}`, 20, 70);
  doc.text(`Date: ${bookingData.date}`, 20, 80);
  doc.text(`Amount: ₹${bookingData.amount}`, 20, 90);

  // Save as Blob
  const blob = doc.output("blob");
  return blob;
}
