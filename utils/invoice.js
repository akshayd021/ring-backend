const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoice = async (order, filename) => {
  return new Promise((resolve, reject) => {
    const folderPath = path.dirname(filename);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filename);
    doc.pipe(stream);

    doc
      .fontSize(20)
      .text("Your Company Name Pvt Ltd", { align: "center" })
      .fontSize(12)
      .text("123 Business Street, Tech City, India", { align: "center" })
      .text("GSTIN: 29ABCDE1234F1Z5 | CIN: U12345IN", { align: "center" })
      .moveDown(2);

    // ✅ Invoice Info
    doc.fontSize(16).text("Invoice", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice #: ${order._id}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // ✅ Customer Info
    const { userId } = order;
    doc.text(`Customer: ${userId.firstname} ${userId.lastname}`);
    doc.text(`Email: ${userId.email}`);
    doc.text(`Phone: ${userId.mobileNumber}`);
    doc.text(
      `Address: ${userId.address}, ${userId.city}, ${userId.country} - ${userId.pincode}`
    );
    doc.moveDown();

    // ✅ Product Table
    doc
      .font("Helvetica-Bold")
      .text("Items Purchased:", { underline: true })
      .moveDown();
    order.products.forEach((p, i) => {
      const product = p.product;
      const name = product?.name || "Unknown Product";
      const line = `${i + 1}. ${name} | Qty: ${p.quantity} | Price: ₹${
        p.price
      }`;
      doc.font("Helvetica").text(line);
    });

    doc.moveDown();

    const taxRate = 0.18; // 18% GST
    const tax = order.subtotal * taxRate;
    const net = order.subtotal + tax + order.shippingCost - order.discount;

    doc
      .font("Helvetica-Bold")
      .text(`Subtotal: ₹${order.subtotal.toFixed(2)}`)
      .text(`Tax (18% GST): ₹${tax.toFixed(2)}`)
      .text(`Shipping Cost: ₹${order.shippingCost.toFixed(2)}`)
      .text(`Discount: -₹${order.discount.toFixed(2)}`)
      .text(`Total Payable: ₹${net.toFixed(2)}`)
      .moveDown();

    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Status: ${order.status}`);

    doc.end();

    stream.on("finish", () => resolve(filename));
    stream.on("error", reject);
  });
};
