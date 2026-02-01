// Edit these values once and the whole page + vCard will match.
const CARD = {
  fullName: "Lumora Rrt",
  org: "Lumora",
  title: "rv pencil drawing",
  note: "The magic of hand-drawn art to turn your beautiful memories into eternal souvenirs - LUMORA Art.",
  phone: "+94 71 101 7053",
  // For WhatsApp link you need digits only (country code + number, no +, no spaces)
  whatsappDigits: "94711017053",
  email: "lumoraart29@gmail.com",
  website: "https://YOURNAME.github.io/",     // change this
  facebook: "https://www.facebook.com/",      // change this
  instagram: "https://www.instagram.com/",    // change this
};

function escapeVCF(text) {
  // vCard escaping rules (basic)
  return String(text)
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function buildVCard() {
  // vCard 3.0 is widely supported
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCF(CARD.fullName)}`,
    `N:${escapeVCF(CARD.fullName)};;;;`,
    CARD.org ? `ORG:${escapeVCF(CARD.org)}` : null,
    CARD.title ? `TITLE:${escapeVCF(CARD.title)}` : null,
    CARD.phone ? `TEL;TYPE=CELL,VOICE:${escapeVCF(CARD.phone)}` : null,
    CARD.email ? `EMAIL;TYPE=INTERNET:${escapeVCF(CARD.email)}` : null,
    CARD.website ? `URL:${escapeVCF(CARD.website)}` : null,
    CARD.note ? `NOTE:${escapeVCF(CARD.note)}` : null,
    "END:VCARD",
  ].filter(Boolean);

  // Use CRLF for best compatibility
  return lines.join("\r\n");
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function wireUI() {
  // Fill UI text (optional, but nice)
  document.getElementById("displayName").textContent = CARD.fullName;
  document.getElementById("roleLine").textContent = CARD.title;
  document.getElementById("companyLine").textContent = CARD.org;
  document.getElementById("bio").textContent = `“${CARD.note}”`;
  document.getElementById("year").textContent = new Date().getFullYear();

  // Buttons
  const btnSave = document.getElementById("btnSave");
  btnSave.addEventListener("click", () => {
    const vcf = buildVCard();
    const safeName = CARD.fullName.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "_");
    download(`${safeName || "contact"}.vcf`, vcf, "text/vcard");
  });

  const btnShare = document.getElementById("btnShare");
  btnShare.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, text: CARD.fullName, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      }
    } catch {
      // user cancelled share or clipboard denied
    }
  });

  // Update call/whatsapp links based on config
  const call = document.getElementById("btnCall");
  call.href = `tel:${CARD.phone.replace(/\s+/g, "")}`;

  const wa = document.getElementById("btnWhatsApp");
  wa.href = `https://wa.me/${CARD.whatsappDigits}`;

  // You can optionally wire social links in the HTML list too
  // (keeping it simple: edit the hrefs in index.html for now)
}

wireUI();
