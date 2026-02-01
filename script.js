// =============================
// 1) Single source of truth
// =============================
const CARD = {
  fullName: "Lumora Art",
  title: "rv pencil drawing",
  company: "Lumora",
  bio: "The magic of hand-drawn art to turn your beautiful memories into eternal souvenirs — LUMORA Art.",

  avatar: "assets/avatar.jpg",

  phoneDisplay: "+94 71 101 7053",
  // digits for tel/wa links (no spaces, no +)
  phoneDigits: "+94711017053",

  whatsappDisplay: "+94 72 213 9530",
  whatsappDigits: "+94722139530",

  email: "lumoraart.rv@gmail.com",
  website: "https://lumora-art.github.io/",

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61584333012504",
    //instagram: "https://www.instagram.com/",
    //tiktok: "https://www.tiktok.com/",
  }
};

// =============================
// 2) DOM refs (explicit)
// =============================
const $ = (id) => document.getElementById(id);

const els = {
  themeToggle: $("themeToggle"),

  avatar: $("avatar"),
  displayName: $("displayName"),
  roleLine: $("roleLine"),
  companyLine: $("companyLine"),
  bio: $("bio"),

  btnSave: $("btnSave"),
  btnShare: $("btnShare"),

  phoneItem: $("phoneItem"),
  phoneLabel: $("phoneLabel"),
  whatsappItem: $("whatsappItem"),
  whatsappLabel: $("whatsappLabel"),
  emailItem: $("emailItem"),
  emailLabel: $("emailLabel"),
  websiteItem: $("websiteItem"),
  websiteLabel: $("websiteLabel"),

  facebookItem: $("facebookItem"),
  instagramItem: $("instagramItem"),
  tiktokItem: $("tiktokItem"),

  year: $("year"),
  footerName: $("footerName"),
};

// =============================
// 3) Theme toggle
// =============================
const THEME_KEY = "card-theme"; // "dark" | "light"
const THEMES = ["dark", "light", "pencil"];

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  els.themeToggle.textContent =
    theme === "dark"   ? "🌙" :
    theme === "light"  ? "☀️" : "✏️";
}


function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light" || saved === "pencil") {
    applyTheme(saved);
    return;
  }

  // default: follow system preference
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

// =============================
// 4) vCard builder
// =============================
function escapeVCF(text) {
  return String(text)
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function buildVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCF(CARD.fullName)}`,
    `N:${escapeVCF(CARD.fullName)};;;;`,
    CARD.company ? `ORG:${escapeVCF(CARD.company)}` : null,
    CARD.title ? `TITLE:${escapeVCF(CARD.title)}` : null,
    CARD.phoneDisplay ? `TEL;TYPE=CELL,VOICE:${escapeVCF(CARD.phoneDisplay)}` : null,
    CARD.whatsappDisplay ? `TEL;TYPE=WHATSAPP:${escapeVCF(CARD.whatsappDisplay)}` : null,
    CARD.email ? `EMAIL;TYPE=INTERNET:${escapeVCF(CARD.email)}` : null,
    CARD.website ? `URL:${escapeVCF(CARD.website)}` : null,
    CARD.bio ? `NOTE:${escapeVCF(CARD.bio)}` : null,
    "END:VCARD",
  ].filter(Boolean);

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
  setTimeout(() => URL.revokeObjectURL(url), 800);
}

// =============================
// 5) Wire UI from CARD
// =============================
function wireUI() {
  // Basic text
  els.displayName.textContent = CARD.fullName;
  els.roleLine.textContent = CARD.title;
  els.companyLine.textContent = CARD.company;
  els.bio.textContent = `“${CARD.bio}”`;

  // Avatar
  els.avatar.src = CARD.avatar;

  // Footer
  els.year.textContent = String(new Date().getFullYear());
  els.footerName.textContent = CARD.company || CARD.fullName;

  // Phone
  const telHref = CARD.phoneDigits ? `tel:${CARD.phoneDigits}` : "#";
  els.phoneItem.href = telHref;
  els.phoneLabel.textContent = CARD.phoneDisplay || "";

  // WhatsApp
  const waHref = CARD.whatsappDigits ? `https://wa.me/${CARD.whatsappDigits}` : "#";
  els.whatsappItem.href = waHref;
  els.whatsappLabel.textContent = CARD.whatsappDisplay || "";

  // Email
  const mailHref = CARD.email ? `mailto:${CARD.email}` : "#";
  els.emailItem.href = mailHref;
  els.emailLabel.textContent = CARD.email || "";

  // Website
  els.websiteItem.href = CARD.website || "#";
  els.websiteLabel.textContent = CARD.website || "";

  // Social (hide items if not provided)
  if (CARD.social?.facebook) els.facebookItem.href = CARD.social.facebook;
  else els.facebookItem.style.display = "none";

  if (CARD.social?.instagram) els.instagramItem.href = CARD.social.instagram;
  else els.instagramItem.style.display = "none";

  if (CARD.social?.tiktok) els.tiktokItem.href = CARD.social.tiktok;
  else els.tiktokItem.style.display = "none";

  // Save contact
  els.btnSave.addEventListener("click", () => {
    const safeName = (CARD.fullName || "contact")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "_");
    download(`${safeName}.vcf`, buildVCard(), "text/vcard");
  });

  // Share
  els.btnShare.addEventListener("click", async () => {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: CARD.fullName, text: CARD.company, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      } else {
        alert(url);
      }
    } catch {
      // user cancelled or blocked
    }
  });

  // Theme toggle click
  els.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const index = THEMES.indexOf(current);
    const nextIndex = (index + 1) % THEMES.length;
    applyTheme(THEMES[nextIndex]);
  });
}

// =============================
// 6) Init
// =============================
initTheme();
wireUI();
