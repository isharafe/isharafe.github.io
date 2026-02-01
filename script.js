const CARD = {
  fullName: "Lumora Rrt",
  title: "rv pencil drawing",
  company: "Lumora Art",
  bio: "The magic of hand-drawn art to turn your beautiful memories into eternal souvenirs — LUMORA Art.",

  avatar: "assets/avatar.jpg",

  phone: "+94 71 101 7053",
  phoneDigits: "94711017053",

  email: "lumoraart29@gmail.com",

  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/"
  },

  website: "https://YOURNAME.github.io/"
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

function wireUI() {
  // Text
  displayName.textContent = CARD.fullName;
  roleLine.textContent = CARD.title;
  companyLine.textContent = CARD.company;
  bio.textContent = `“${CARD.bio}”`;
  avatar.src = CARD.avatar;
  year.textContent = new Date().getFullYear();

  // Phone
  btnCall.href = `tel:${CARD.phoneDigits}`;
  phoneItem.href = `tel:${CARD.phoneDigits}`;
  phoneLabel.textContent = CARD.phone;

  // Email
  emailItem.href = `mailto:${CARD.email}`;
  emailLabel.textContent = CARD.email;

  // WhatsApp
  btnWhatsApp.href = `https://wa.me/${CARD.phoneDigits}`;

  // Social
  facebookItem.href = CARD.social.facebook;
  instagramItem.href = CARD.social.instagram;

  // Save Contact
  btnSave.onclick = () => {
    const safeName = CARD.fullName.replace(/\s+/g, "_");
    download(`${safeName}.vcf`, buildVCard());
  };

  // Share
  btnShare.onclick = async () => {
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
