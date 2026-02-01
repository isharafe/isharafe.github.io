const CARD = {
  fullName: "Lumora Rrt",
  org: "Lumora",
  title: "rv pencil drawing",
  bio: "The magic of hand-drawn art to turn your beautiful memories into eternal souvenirs - LUMORA Art.",

  phone: "+94 71 101 7053",
  whatsappDigits: "94711017053",
  email: "lumoraart29@gmail.com",

  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/"
  },

  website: "https://YOURNAME.github.io/"
};

// ---------- helpers ----------
function el(id) {
  return document.getElementById(id);
}

// ---------- vCard ----------
function escapeVCF(v) {
  return String(v)
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function buildVCard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCF(CARD.fullName)}`,
    `N:${escapeVCF(CARD.fullName)};;;;`,
    `ORG:${escapeVCF(CARD.org)}`,
    `TITLE:${escapeVCF(CARD.title)}`,
    `TEL;TYPE=CELL:${escapeVCF(CARD.phone)}`,
    `EMAIL:${escapeVCF(CARD.email)}`,
    `URL:${escapeVCF(CARD.website)}`,
    `NOTE:${escapeVCF(CARD.bio)}`,
    "END:VCARD"
  ].join("\r\n");
}

function download(filename, text) {
  const blob = new Blob([text], { type: "text/vcard" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ---------- wire page ----------
function init() {
  // text
  el("displayName").textContent = CARD.fullName;
  el("roleLine").textContent = CARD.title;
  el("companyLine").textContent = CARD.org;
  el("bio").textContent = `“${CARD.bio}”`;
  el("year").textContent = new Date().getFullYear();

  // phone
  el("phoneText").textContent = CARD.phone;
  el("contactPhone").href = `tel:${CARD.phone.replace(/\s+/g, "")}`;
  el("btnCall").href = `tel:${CARD.phone.replace(/\s+/g, "")}`;

  // email
  el("emailText").textContent = CARD.email;
  el("contactEmail").href = `mailto:${CARD.email}`;

  // whatsapp
  el("btnWhatsApp").href = `https://wa.me/${CARD.whatsappDigits}`;

  // social
  el("facebookLink").href = CARD.social.facebook;
  el("instagramLink").href = CARD.social.instagram;

  // save contact
  el("btnSave").onclick = () => {
    const name = CARD.fullName.replace(/\s+/g, "_");
    download(`${name}.vcf`, buildVCard());
  };

  // share
  el("btnShare").onclick = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: CARD.fullName, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  };
}

init();
