const CARD = {
  fullName: "Lumora Rrt",
  title: "rv pencil drawing",
  company: "Lumora Art",
  bio: "The magic of hand-drawn art to turn your beautiful memories into eternal souvenirs — LUMORA Art.",

  avatar: "assets/avatar.jpg",

  phone: "+94 71 101 7053",
  phoneDigits: "94711017053",
  whatsapp: "94722139530",

  email: "lumoraart29@gmail.com",

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61584333012504",
    instagram: "https://www.instagram.com/"
  },

  website: "https://lumora-art.github.io/"
};

// -----------------------------

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
    `ORG:${escapeVCF(CARD.company)}`,
    `TITLE:${escapeVCF(CARD.title)}`,
    `TEL;TYPE=CELL:${escapeVCF(CARD.phone)}`,
    `EMAIL:${escapeVCF(CARD.email)}`,
    `URL:${escapeVCF(CARD.website)}`,
    `NOTE:${escapeVCF(CARD.bio)}`,
    "END:VCARD"
  ].join("\r\n");
}

function download(filename, content) {
  const blob = new Blob([content], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// -----------------------------

const $ = (id) => document.getElementById(id);

const els = {
  displayName: $("displayName"),
  roleLine: $("roleLine"),
  companyLine: $("companyLine"),
  bio: $("bio"),
  avatar: $("avatar"),
  year: $("year"),
  btnSave: $("btnSave"),
  btnCall: $("btnCall"),
  btnWhatsApp: $("btnWhatsApp"),
  btnShare: $("btnShare"),
  phoneItem: $("phoneItem"),
  phoneLabel: $("phoneLabel"),
  emailItem: $("emailItem"),
  emailLabel: $("emailLabel"),
  facebookItem: $("facebookItem"),
  instagramItem: $("instagramItem"),
};


function wireUI() {
  els.displayName.textContent = CARD.fullName;
  els.roleLine.textContent = CARD.title;
  els.companyLine.textContent = CARD.company;
  els.bio.textContent = `“${CARD.bio}”`;
  els.avatar.src = CARD.avatar;
  els.year.textContent = new Date().getFullYear();

  // Phone
  els.btnCall.href = `tel:${CARD.phoneDigits}`;
  els.phoneItem.href = `tel:${CARD.phoneDigits}`;
  els.phoneLabel.textContent = CARD.phone;

  // Email
  els.emailItem.href = `mailto:${CARD.email}`;
  els.emailLabel.textContent = CARD.email;

  // WhatsApp
  els.btnWhatsApp.href = `https://wa.me/${CARD.whatsapp}`;

  // Social
  els.facebookItem.href = CARD.social.facebook;
  els.instagramItem.href = CARD.social.instagram;

  // Save contact
  els.btnSave.onclick = () => {
    const safeName = CARD.fullName.replace(/\s+/g, "_");
    download(`${safeName}.vcf`, buildVCard());
  };

  // Share
  els.btnShare.onclick = async () => {
    const url = location.href;
    if (navigator.share) {
      await navigator.share({ title: CARD.fullName, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };
}

wireUI();
