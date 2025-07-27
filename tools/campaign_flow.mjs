#!/usr/bin/env node
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import Fuse from "fuse.js";

function generateBrief({ brandName, objective, audience, values }) {
  return `Campaign Brief for ${brandName}\n\nObjective: ${objective}\nTarget Audience: ${audience}\nValues: ${values}`;
}

function loadPersonas() {
  const file = path.join(process.cwd(), "db", "personas.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function matchPersonas(personas, text) {
  const fuse = new Fuse(personas, {
    keys: ["category", "description", "audience"],
  });
  return fuse
    .search(text)
    .slice(0, 3)
    .map((r) => r.item);
}

function createPdf(briefText, personas) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream("campaign_brief.pdf"));
  doc.fontSize(20).text("Campaign Brief", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(briefText);
  doc.moveDown();
  doc.fontSize(16).text("Recommended Personas");
  personas.forEach((p) => {
    doc.moveDown();
    doc.fontSize(12).text(`${p.name} - ${p.category}`);
    doc.fontSize(10).text(p.description);
  });
  doc.end();
}

function createEmailTemplate(brand, persona) {
  return `Subject: ${brand.brandName} x ${persona.name}\n\nHi ${persona.name},\n\nWe're preparing a new campaign: ${brand.objective}.\nYour focus on ${persona.category.toLowerCase()} makes you a great fit.\nLet us know if you're interested!\n`;
}

function main() {
  const brand = {
    brandName: "Demo Brand",
    objective: "Launch eco-friendly product line",
    audience: "Environmentally conscious consumers",
    values: "sustainability, ethical production",
  };

  const briefText = generateBrief(brand);
  const personas = loadPersonas();
  const matches = matchPersonas(personas, brand.values + " " + brand.objective);
  createPdf(briefText, matches);

  const emails = matches
    .map((p) => createEmailTemplate(brand, p))
    .join("\n---\n");
  fs.writeFileSync("sample_emails.txt", emails);
}

main();
