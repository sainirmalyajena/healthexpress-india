const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');

// Fix CityPricingTable cities
content = content.replace(
  "const rows = cities",
  "const rows = (cities || [])"
);

// Fix faqs map
content = content.replace(
  "faqs.map(faq =>",
  "(Array.isArray(faqs) ? faqs : []).map(faq =>"
);

// Fix symptoms map
content = content.replace(
  "surgery.symptoms.map",
  "(surgery.symptoms || []).map"
);

// Fix getCategoryImage
content = content.replace(
  "getCategoryImage(surgery.category)",
  "getCategoryImage(surgery?.category)"
);

// Remove the try-catch we injected earlier
content = content.replace(
  "export default async function SurgeryDetailPage({ params }: PageProps) {\n  try {",
  "export default async function SurgeryDetailPage({ params }: PageProps) {"
);
const lastBracketIndex = content.lastIndexOf("  } catch (e: any) {");
if (lastBracketIndex !== -1) {
  content = content.substring(0, lastBracketIndex) + "}";
}

fs.writeFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', content, 'utf8');
