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

    // ✅ Company Header
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
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`);
    doc.moveDown();

    // ✅ Customer Info
    const { address, userId } = order;
    doc.font("Helvetica-Bold").text("Bill To:");
    doc.font("Helvetica").text(`${address.firstName || ""} ${address.lastName || ""}`);
    if (address.mobile) doc.text(`Mobile: ${address.mobile}`);
    if (address.street) doc.text(`${address.street}`);
    doc.text(`${address.city}, ${address.state}`);
    doc.text(`${address.country} - ${address.pincode}`);
    if (userId?.email) {
      doc.text(`Email: ${userId.email}`);
    }
    doc.moveDown(2);

    // ✅ Product Table
    doc.font("Helvetica-Bold").text("Items Purchased:", { underline: true });
    doc.moveDown();

    order.products.forEach((p, i) => {
      const product = p.product;
      const name = product?.name || "Unknown Product";
      const total = p.price * p.quantity;

      // 🔹 Main product line
      doc
        .font("Helvetica-Bold")
        .text(`${i + 1}. ${name}`)
        .font("Helvetica")
        .text(
          `Qty: ${p.quantity} | Price: ₹${p.price.toFixed(2)} | Total: ₹${total.toFixed(2)}`
        );

      // 🔹 Show size & variant if available
      if (p.size) doc.text(`Size: ${p.size}`);
      if (p.variant) doc.text(`Variant: ${p.variant}`);

      // 🔹 Diamond details if attached
      if (p.diamond) {
        const d = p.diamond;
        doc.moveDown(0.5).font("Helvetica-Bold").text("Diamond Details:");
        doc.font("Helvetica").fontSize(10);

        doc.text(
          `- ${d.Weight || "N/A"} Carat ${d.Shape || ""} | Color: ${d.Color || "N/A"} | Clarity: ${
            d.Clarity || "N/A"
          } | Cut: ${d["Cut Grade"] || "N/A"}`
        );
        doc.text(
          `- Cert: ${d.Lab || "N/A"} (${d["Certificate #"] || "N/A"}) | Stock ID: ${
            d["Stock #"] || "N/A"
          }`
        );
        doc.text(
          `- Polish: ${d.Polish || "N/A"} | Symmetry: ${d.Symmetry || "N/A"} | Fluorescence: ${
            d["Fluorescence Intensity"] || "N/A"
          }`
        );
        doc.text(`- Measurements: ${d.Measurements || "N/A"}`);
        doc.moveDown(1);
      }

      doc.moveDown(1);
    });

    // ✅ Totals
    const taxRate = 0.18; // 18% GST
    const tax = order.subtotal * taxRate;
    const net = order.subtotal + tax + order.shippingCost - order.discount;

    doc
      .moveDown(1)
      .font("Helvetica-Bold")
      .text(`Subtotal: ₹${order.subtotal.toFixed(2)}`)
      .text(`Tax (18% GST): ₹${tax.toFixed(2)}`)
      .text(`Shipping Cost: ₹${order.shippingCost.toFixed(2)}`)
      .text(`Discount: -₹${order.discount.toFixed(2)}`)
      .text(`Total Payable: ₹${net.toFixed(2)}`)
      .moveDown(2);

    // ✅ Payment & Status
    doc.font("Helvetica").text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Order Status: ${order.status}`);

    doc.end();

    stream.on("finish", () => resolve(filename));
    stream.on("error", reject);
  });
};
