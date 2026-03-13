const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ============================================================
// CONFIG — Update these if product or warranty terms change
// ============================================================
const CONFIG = {
  brand: "WATERSEVEN",
  productName:
    "Suction Grab Bars for Shower 2-Pack, Extra-Strong Suction Cup Bathroom Grab Bar Handle w/Green Safety Indicator",
  modelNumber: "B0GG5XSFKT",
  upc: "726872151700",
  warrantyDuration: "1 Year",
  supportEmail: "support@waterseven.com",
  website: "https://waterseven.com",
  outputFile: "WaterSeven-Warranty.pdf",
};

const COLORS = {
  brand: "#0a7e8c",
  brandDark: "#065a64",
  black: "#1a1a1a",
  darkGray: "#333333",
  medGray: "#555555",
  lightGray: "#888888",
  bgLight: "#f0f8f9",
  white: "#ffffff",
  divider: "#d0d0d0",
  red: "#c0392b",
};

const TOTAL_PAGES = 2;

// ============================================================
// Helpers
// ============================================================
function drawLine(doc, y, opts = {}) {
  const left = opts.left || 50;
  const right = opts.right || doc.page.width - 50;
  doc.save();
  doc
    .moveTo(left, y)
    .lineTo(right, y)
    .lineWidth(opts.width || 0.5)
    .strokeColor(opts.color || COLORS.divider)
    .stroke();
  doc.restore();
}

function drawFooter(doc, pageNum) {
  const savedY = doc.y;
  const contentW = doc.page.width - 100;
  const footY = doc.page.height - 30;

  drawLine(doc, footY - 6, { color: COLORS.divider });

  doc.fontSize(8).font("Helvetica").fillColor(COLORS.lightGray);

  // Use low-level _fragment to avoid triggering auto-pagination
  // Instead, we'll just position carefully and restore y
  doc.text(
    `\u00A9 ${new Date().getFullYear()} ${CONFIG.brand}. All rights reserved.`,
    50,
    footY,
    { width: contentW * 0.7, align: "left", lineBreak: false, height: 10 }
  );

  doc.text(`Page ${pageNum} of ${TOTAL_PAGES}`, 50, footY, {
    width: contentW,
    align: "right",
    lineBreak: false,
    height: 10,
  });

  // Restore y so the footer doesn't push content or trigger a new page
  doc.y = savedY;
}

function sectionTitle(doc, text) {
  doc.moveDown(0.5);
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(COLORS.brand)
    .text(text.toUpperCase(), 50, doc.y, { width: doc.page.width - 100 });
  const lineY = doc.y + 4;
  drawLine(doc, lineY, { color: COLORS.brand, width: 1.5, right: 200 });
  doc.moveDown(0.6);
}

function bodyText(doc, text, opts = {}) {
  doc
    .font(opts.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(opts.size || 10)
    .fillColor(opts.color || COLORS.darkGray)
    .text(text, opts.x || 50, opts.y || doc.y, {
      width: opts.width || doc.page.width - 100,
      align: opts.align || "left",
      lineGap: 3,
    });
}

function bulletPoint(doc, text, opts = {}) {
  const bulletX = opts.x || 60;
  const textX = bulletX + 14;
  const width = opts.width || doc.page.width - 100 - 14;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.brand)
    .text("\u2022", bulletX, doc.y, { continued: false });
  doc.moveUp();
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.darkGray)
    .text(text, textX, doc.y, { width, lineGap: 2 });
  doc.moveDown(0.15);
}

// ============================================================
// Build the PDF
// ============================================================
function generateWarrantyPDF() {
  const doc = new PDFDocument({
    size: "letter",
    autoFirstPage: false,
    margins: { top: 40, bottom: 45, left: 50, right: 50 },
    info: {
      Title: `${CONFIG.brand} Product Warranty`,
      Author: CONFIG.brand,
      Subject: "Limited Warranty Certificate",
      Creator: CONFIG.brand,
    },
  });

  const outputPath = path.join(__dirname, CONFIG.outputFile);
  doc.pipe(fs.createWriteStream(outputPath));

  // ==========================================================
  // PAGE 1
  // ==========================================================
  doc.addPage();
  const pageW = doc.page.width;
  const contentW = pageW - 100;

  // Header bar
  doc.save();
  doc.rect(0, 0, pageW, 100).fill(COLORS.brand);
  doc.restore();

  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor(COLORS.white)
    .text(CONFIG.brand, 50, 25, { width: contentW, align: "left" });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#b0e0e6")
    .text("Redefining Home Safety", 50, 60, { width: contentW, align: "left" });

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor(COLORS.white)
    .text(CONFIG.warrantyDuration.toUpperCase(), pageW - 200, 28, {
      width: 150,
      align: "right",
    });
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#b0e0e6")
    .text("LIMITED WARRANTY", pageW - 200, 48, {
      width: 150,
      align: "right",
    });

  // Title
  doc.y = 120;
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(COLORS.black)
    .text("Limited Warranty Certificate", 50, doc.y, {
      width: contentW,
      align: "center",
    });

  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.lightGray)
    .text("Effective for products purchased on or after January 1, 2025", 50, doc.y, {
      width: contentW,
      align: "center",
    });

  doc.moveDown(0.5);
  drawLine(doc, doc.y);

  // Product Information
  sectionTitle(doc, "Product Information");

  const infoFields = [
    ["Product", CONFIG.productName],
    ["Brand", CONFIG.brand],
    ["Model / ASIN", CONFIG.modelNumber],
    ["UPC", CONFIG.upc],
    ["Materials", "Plastic, Rubber"],
    ["Dimensions", '16.85"L x 4.8"W'],
    ["Package Contents", "2x Grab Bars, 2x Suction Cups, Mounting Hardware, Installation Instructions"],
  ];

  for (const [label, value] of infoFields) {
    const startY = doc.y;
    doc
      .font("Helvetica-Bold")
      .fontSize(9.5)
      .fillColor(COLORS.medGray)
      .text(label + ":", 60, startY, { width: 120 });
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(COLORS.darkGray)
      .text(value, 185, startY, { width: contentW - 145 });
    doc.moveDown(0.15);
  }

  // Warranty Coverage
  sectionTitle(doc, "Warranty Coverage");

  bodyText(
    doc,
    `${CONFIG.brand} ("Company") warrants to the original purchaser ("Customer") that this product will be free from defects in materials and workmanship under normal use for a period of one (1) year from the original date of purchase ("Warranty Period").`
  );
  doc.moveDown(0.4);
  bodyText(doc, "During the Warranty Period, if the product is found to be defective, the Company will, at its sole discretion:");
  doc.moveDown(0.3);

  for (const item of [
    "Repair the defective product at no charge",
    "Replace the defective product with a new or refurbished equivalent",
    "Issue a full or partial refund of the original purchase price",
  ]) {
    bulletPoint(doc, item);
  }

  // What Is Covered
  sectionTitle(doc, "What Is Covered");

  for (const item of [
    "Defects in materials or manufacturing that affect functionality",
    "Failure of the suction mechanism under recommended use on compatible surfaces",
    "Breakage of the handle or structural components during normal use",
    "Malfunction of the green/red safety indicator under normal conditions",
    "Premature degradation of suction cups when used and maintained as directed",
  ]) {
    bulletPoint(doc, item);
  }

  // What Is Not Covered
  sectionTitle(doc, "What Is Not Covered");

  for (const item of [
    "Damage resulting from misuse, abuse, negligence, or failure to follow installation instructions",
    "Use on surfaces that are not smooth, flat, and non-porous (e.g., textured tile, painted drywall, natural stone with rough finish, wallpaper)",
    "Normal wear and tear, including cosmetic changes such as scratches or discoloration",
    "Damage caused by exposure to chemicals, abrasive cleaners, or solvents not recommended for use with the product",
    "Modification, alteration, or unauthorized repair of the product",
    "Use of the product for purposes other than its intended use as a bathroom safety grab bar",
    "Damage resulting from accidents, impacts, or events beyond the Company's control",
    "Products purchased from unauthorized resellers or obtained through fraudulent means",
  ]) {
    bulletPoint(doc, item);
  }

  // Page 1 footer
  drawFooter(doc, 1);

  // ==========================================================
  // PAGE 2
  // ==========================================================
  doc.addPage();

  // Small header bar
  doc.save();
  doc.rect(0, 0, pageW, 50).fill(COLORS.brand);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(COLORS.white)
    .text(`${CONFIG.brand}  |  Limited Warranty`, 50, 18, { width: contentW });
  doc.restore();

  doc.y = 70;

  // How to Make a Warranty Claim
  sectionTitle(doc, "How to Make a Warranty Claim");
  bodyText(doc, "To request warranty service, please follow these steps:");
  doc.moveDown(0.4);

  const steps = [
    ["Contact Us", `Send an email to ${CONFIG.supportEmail} with the subject line "Warranty Claim". Include your full name, order number or proof of purchase, and a brief description of the issue.`],
    ["Provide Documentation", "Attach clear photos or a short video showing the defect. Include a photo of the product label or packaging if available."],
    ["Receive Instructions", "Our support team will respond within 2 business days with next steps. We may request additional information or ask you to return the product."],
    ["Resolution", "Once the claim is verified, we will process your replacement, repair, or refund as applicable. Replacement products are covered for the remainder of the original Warranty Period."],
  ];

  for (let i = 0; i < steps.length; i++) {
    const [title, desc] = steps[i];
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.brand)
      .text(`${i + 1}.  ${title}`, 60, doc.y, { width: contentW - 20 });
    doc.moveDown(0.15);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.darkGray)
      .text(desc, 78, doc.y, { width: contentW - 38, lineGap: 2 });
    doc.moveDown(0.5);
  }

  // Important Safety Notice
  sectionTitle(doc, "Important Safety Notice");

  doc.save();
  doc.roundedRect(50, doc.y, contentW, 105, 6).fillAndStroke("#fff5f5", COLORS.red);
  doc.restore();

  const boxTop = doc.y + 10;
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(COLORS.red)
    .text("PLEASE READ CAREFULLY", 65, boxTop, { width: contentW - 30 });
  doc.moveDown(0.3);
  doc
    .font("Helvetica")
    .fontSize(9.5)
    .fillColor(COLORS.darkGray)
    .text(
      "This product is designed as a supplementary support aid only. It is NOT a primary weight-bearing device and should NOT be used as a substitute for professionally installed, permanent grab bars. Always check the green safety indicator before each use. If the indicator shows red or if the bar feels loose, do not use it \u2014 remove, clean the surface and suction cups, and reinstall. Never exceed the product's rated capacity. The Company is not liable for injuries resulting from failure to follow these safety guidelines.",
      65,
      doc.y,
      { width: contentW - 30, lineGap: 2 }
    );

  doc.y = doc.y + 20;

  // General Terms
  sectionTitle(doc, "General Terms");

  for (const term of [
    "This warranty is non-transferable and applies only to the original purchaser from an authorized retailer.",
    "This warranty gives you specific legal rights. You may also have other rights that vary by state, province, or country.",
    "Some jurisdictions do not allow limitations on implied warranties or exclusion of incidental or consequential damages. In such jurisdictions, the above limitations may not apply to you.",
    "The Company's total liability under this warranty shall not exceed the original purchase price of the product.",
    "This warranty does not cover shipping costs for returning the product unless otherwise required by applicable law.",
    "Proof of purchase (order confirmation, receipt, or invoice) is required for all warranty claims.",
  ]) {
    bulletPoint(doc, term);
  }

  // Contact Information
  doc.moveDown(0.5);
  sectionTitle(doc, "Contact Information");

  doc.save();
  doc.roundedRect(50, doc.y, contentW, 40, 6).fillAndStroke(COLORS.bgLight, COLORS.brand);
  doc.restore();

  let cY = doc.y + 12;
  for (const [label, value] of [
    ["Email", CONFIG.supportEmail],
  ]) {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.brandDark)
      .text(label + ":", 70, cY, { continued: false, width: 80 });
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.darkGray)
      .text(value, 160, cY, { width: contentW - 120 });
    cY += 18;
  }

  // Page 2 footer
  drawFooter(doc, 2);

  doc.end();
  console.log(`\n  Warranty PDF generated: ${outputPath}\n`);
}

generateWarrantyPDF();
