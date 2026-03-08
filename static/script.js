/* ═══════════════════════════════════════════════════════════
   Mental Health Classification — Master JavaScript
   Handles: Language, Session, Navigation, Alerts, Utils
   ═══════════════════════════════════════════════════════════ */

// ── Session State ────────────────────────────────────────────────────────────
const MHC = {
  session: {
    language: 'en',
    user: { name: '', age: 0, gender: '', birthdate: '' },
    basicAnswers: {},
    anxietyAnswers: [],
    depressionAnswers: [],
    anxietyScore: 0,
    depressionScore: 0,
    prediction: '',
    probabilities: {}
  },

  save() {
    try { localStorage.setItem('mhc', JSON.stringify(this.session)); } catch(e) {}
  },

  load() {
    try {
      const d = localStorage.getItem('mhc');
      if (d) this.session = { ...this.session, ...JSON.parse(d) };
    } catch(e) {}
  },

  clear() {
    localStorage.removeItem('mhc');
    this.session = { language:'en', user:{name:'',age:0,gender:'',birthdate:''}, basicAnswers:{}, anxietyAnswers:[], depressionAnswers:[], anxietyScore:0, depressionScore:0, prediction:'', probabilities:{} };
  }
};

MHC.load();

// ── Translations ─────────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "Mental Health Condition Classification",
    motive: "Your mind matters. This space was built with care — for those who need a quiet moment of reflection, a gentle check-in, or simply someone who listens without judgment. You are not alone.",
    selectLang: "Choose your language",
    begin: "Begin Your Journey →",
    namePlaceholder: "Your full name",
    agePlaceholder: "Your age",
    birthdate: "Date of Birth",
    gender: "Gender",
    male: "Male", female: "Female", other: "Other / Prefer not to say",
    loginBtn: "Continue →",
    proceedBtn: "Proceed →",
    helpBtn: "Help",
    nextBtn: "Next →",
    backBtn: "← Back",
    logoutBtn: "Logout",
    downloadPDF: "Download Report (PDF)",
    endMsg: "Thank you for trusting us with your wellbeing.",
    refreshWarning: "Are you sure you want to leave? Your progress will be lost.",
    stayBtn: "Stay Here", leaveBtn: "Leave Anyway",
    required: "Please answer this question to continue.",
    clickAnxiety: "Click Here to Test Anxiety Score →",
    clickDepression: "Check Depression Score →",
    checkResult: "Check My Result →",
    questionHeading: "Answer These Basic Questions",
    anxietyHeading: "Generalized Anxiety Disorder (GAD-7)",
    depressionHeading: "Patient Health Questionnaire (PHQ-9)",
    resultHeading: "Your Mental Health Report",
    endHeading: "Thank You",
    loading: "Analysing your responses...",
    modelAccuracy: "Model Accuracy",
    yourCondition: "Your Condition",
    anxietyScore: "Anxiety Score",
    depressionScore: "Depression Score",
    solutions: "Personalised Recommendations",
    welcomeBack: "Welcome back",
  },
  hi: {
    appName: "मानसिक स्वास्थ्य स्थिति वर्गीकरण",
    motive: "आपका मन महत्वपूर्ण है। यह स्थान आपके लिए बनाया गया है — एक शांत पल के लिए, बिना किसी निर्णय के। आप अकेले नहीं हैं।",
    selectLang: "अपनी भाषा चुनें",
    begin: "अपनी यात्रा शुरू करें →",
    namePlaceholder: "आपका पूरा नाम",
    agePlaceholder: "आपकी उम्र",
    birthdate: "जन्म तिथि",
    gender: "लिंग",
    male: "पुरुष", female: "महिला", other: "अन्य",
    loginBtn: "जारी रखें →",
    proceedBtn: "आगे बढ़ें →",
    helpBtn: "सहायता",
    nextBtn: "अगला →",
    backBtn: "← वापस",
    logoutBtn: "लॉगआउट",
    downloadPDF: "रिपोर्ट डाउनलोड करें (PDF)",
    endMsg: "हम आपके विश्वास के लिए आभारी हैं।",
    refreshWarning: "क्या आप वाकई जाना चाहते हैं? आपकी प्रगति खो जाएगी।",
    stayBtn: "यहाँ रहें", leaveBtn: "फिर भी जाएं",
    required: "कृपया जारी रखने के लिए इस प्रश्न का उत्तर दें।",
    clickAnxiety: "चिंता स्कोर परीक्षण के लिए क्लिक करें →",
    clickDepression: "अवसाद स्कोर जाँचें →",
    checkResult: "मेरा परिणाम देखें →",
    questionHeading: "इन बुनियादी सवालों के जवाब दें",
    anxietyHeading: "सामान्यीकृत चिंता विकार (GAD-7)",
    depressionHeading: "रोगी स्वास्थ्य प्रश्नावली (PHQ-9)",
    resultHeading: "आपकी मानसिक स्वास्थ्य रिपोर्ट",
    endHeading: "धन्यवाद",
    loading: "आपकी प्रतिक्रियाओं का विश्लेषण हो रहा है...",
    modelAccuracy: "मॉडल सटीकता",
    yourCondition: "आपकी स्थिति",
    anxietyScore: "चिंता स्कोर",
    depressionScore: "अवसाद स्कोर",
    solutions: "व्यक्तिगत अनुशंसाएं",
    welcomeBack: "वापस स्वागत है",
  },
  gu: {
    appName: "માનસિક સ્વાસ્થ્ય સ્થિતિ વર્ગીકરણ",
    motive: "તમારું મન મહત્વપૂર્ણ છે. આ જગ્યા તમારા માટે બનાવવામાં આવી છે — એક શાંત પળ માટે, કોઈ નિર્ણય વગર. તમે એકલા નથી.",
    selectLang: "તમારી ભાષા પસંદ કરો",
    begin: "તમારી યાત્રા શરૂ કરો →",
    namePlaceholder: "તમારું પૂર્ણ નામ",
    agePlaceholder: "તમારી ઉંમર",
    birthdate: "જન્મ તારીખ",
    gender: "જાતિ",
    male: "પુરુષ", female: "સ્ત્રી", other: "અન્ય",
    loginBtn: "ચાલુ રાખો →",
    proceedBtn: "આગળ વધો →",
    helpBtn: "સહાય",
    nextBtn: "આગળ →",
    backBtn: "← પાછળ",
    logoutBtn: "લૉગઆઉટ",
    downloadPDF: "રિપોર્ટ ડાઉનલોડ કરો (PDF)",
    endMsg: "તમારા વિશ્વાસ માટે અમે આભારી છીએ.",
    refreshWarning: "શું તમે ખરેખર જવા માંગો છો? તમારી પ્રગતિ ખોવાઈ જશે.",
    stayBtn: "અહીં રહો", leaveBtn: "છતાં જાઓ",
    required: "કૃપા કરીને ચાલુ રાખવા માટે આ પ્રશ્નનો જવાબ આપો.",
    clickAnxiety: "ચિંતા સ્કોર પરીક્ષણ માટે ક્લિક કરો →",
    clickDepression: "ડિપ્રેશન સ્કોર તપાસો →",
    checkResult: "મારું પરિણામ જુઓ →",
    questionHeading: "આ મૂળભૂત પ્રશ્નોના જવાબ આપો",
    anxietyHeading: "સામાન્ય ચિંતા વિકૃતિ (GAD-7)",
    depressionHeading: "દર્દી સ્વાસ્થ્ય પ્રશ્નાવળી (PHQ-9)",
    resultHeading: "તમારો માનસિક સ્વાસ્થ્ય અહેવાલ",
    endHeading: "આભાર",
    loading: "તમારા જવાબોનું વિશ્લેષણ થઈ રહ્યું છે...",
    modelAccuracy: "મૉડલ ચોકસાઈ",
    yourCondition: "તમારી સ્થિતિ",
    anxietyScore: "ચિંતા સ્કોર",
    depressionScore: "ડિપ્રેશન સ્કોર",
    solutions: "વ્યક્તિગત ભલામણો",
    welcomeBack: "પાછા સ્વાગત છે",
  }
};

// ── Helper: get translation ───────────────────────────────────────────────────
function t(key) {
  const lang = MHC.session.language || 'en';
  return (T[lang] && T[lang][key]) || T.en[key] || key;
}

// ── Apply translations to page ───────────────────────────────────────────────
function applyTranslations() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll('[data-t-ph]').forEach(el => {
    const key = el.getAttribute('data-t-ph');
    if (key) el.placeholder = t(key);
  });
  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    btn.classList.toggle('active', lang === MHC.session.language);
  });
}

// ── Language Selection ───────────────────────────────────────────────────────
function setLanguage(lang) {
  MHC.session.language = lang;
  MHC.save();
  applyTranslations();
}

// ── Navigation Guard (refresh / back) ───────────────────────────────────────
function setupNavigationGuard() {
  let guardActive = true;

  window.addEventListener('beforeunload', (e) => {
    if (guardActive) {
      e.preventDefault();
      e.returnValue = t('refreshWarning');
    }
  });

  // Custom in-page modal override
  window._disableGuard = () => { guardActive = false; };
}

// ── Alert Modal ──────────────────────────────────────────────────────────────
function showAlert(msg, onConfirm, onCancel) {
  let overlay = document.getElementById('alert-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'alert-overlay';
    overlay.className = 'alert-overlay';
    overlay.innerHTML = `
      <div class="alert-box">
        <div class="tagline">⚠ Confirmation Required</div>
        <p id="alert-msg" style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-dark);margin:16px 0 28px;"></p>
        <div style="display:flex;gap:12px;justify-content:center;">
          <button id="alert-stay" class="btn btn-outline" style="padding:10px 24px;"></button>
          <button id="alert-leave" class="btn btn-danger" style="padding:10px 24px;"></button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  document.getElementById('alert-msg').textContent = msg;
  document.getElementById('alert-stay').textContent  = t('stayBtn');
  document.getElementById('alert-leave').textContent = t('leaveBtn');
  overlay.classList.add('show');

  document.getElementById('alert-stay').onclick  = () => { overlay.classList.remove('show'); if(onCancel) onCancel(); };
  document.getElementById('alert-leave').onclick = () => { overlay.classList.remove('show'); if(onConfirm) onConfirm(); };
}

// ── Guarded navigate ─────────────────────────────────────────────────────────
function guardedNavigate(url) {
  showAlert(t('refreshWarning'), () => {
    window._disableGuard && window._disableGuard();
    window.location.href = url;
  });
}

// ── Age Group ────────────────────────────────────────────────────────────────
function getAgeGroup(age) {
  age = parseInt(age);
  if (age <= 12)  return 'child';
  if (age <= 19)  return 'teen';
  if (age <= 60)  return 'adult';
  return 'senior';
}

// ── Animated floating hearts (teen page) ────────────────────────────────────
function spawnHearts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const h = document.createElement('span');
    h.className = 'heart-float';
    h.textContent = '♡';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.animationDuration = (8 + Math.random() * 10) + 's';
    h.style.animationDelay = (Math.random() * 12) + 's';
    h.style.fontSize = (10 + Math.random() * 10) + 'px';
    container.appendChild(h);
  }
}

// ── Animate progress bar ─────────────────────────────────────────────────────
function setProgress(id, pct) {
  const el = document.getElementById(id);
  if (el) setTimeout(() => { el.style.width = pct + '%'; }, 100);
}

// ── Option card selection ─────────────────────────────────────────────────────
function initOptionCards() {
  document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('input') && card.querySelector('input').name;
      if (name) {
        document.querySelectorAll(`.option-card input[name="${name}"]`).forEach(inp => {
          inp.closest('.option-card').classList.remove('selected');
        });
      }
      card.classList.add('selected');
      const inp = card.querySelector('input[type="radio"]');
      if (inp) inp.checked = true;
    });
  });
}

// ── Animate counter ──────────────────────────────────────────────────────────
function animateCounter(id, target, duration=1200) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.round(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── Draw bar chart (pure canvas — no CDN needed) ─────────────────────────────
function drawBarChart(canvasId, labels, values, colors, maxVal) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = { top:20, right:20, bottom:50, left:44 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#FAFAF7';
  ctx.fillRect(0,0,W,H);

  // Grid lines
  ctx.strokeStyle = '#C8DEC4';
  ctx.lineWidth = 1;
  for (let i=0; i<=4; i++) {
    const y = pad.top + chartH - (i/4)*chartH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left+chartW, y);
    ctx.stroke();
    ctx.fillStyle = '#7A9475';
    ctx.font = '11px Jost, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((i/4)*maxVal), pad.left-6, y+4);
  }

  // Bars
  const bw = (chartW / labels.length) * 0.6;
  const gap = (chartW / labels.length) * 0.4;
  labels.forEach((lbl, i) => {
    const x = pad.left + (chartW/labels.length)*i + gap/2;
    const barH = (values[i]/maxVal)*chartH;
    const y = pad.top + chartH - barH;

    const grad = ctx.createLinearGradient(x, y, x, y+barH);
    grad.addColorStop(0, colors[i]);
    grad.addColorStop(1, colors[i]+'88');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, bw, barH);

    // Value on top
    ctx.fillStyle = '#2D3B2A';
    ctx.font = 'bold 12px Jost, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(values[i], x+bw/2, y-6);

    // Label
    ctx.fillStyle = '#4A6045';
    ctx.font = '11px Jost, sans-serif';
    ctx.fillText(lbl, x+bw/2, pad.top+chartH+20);
  });
}

// ── Draw donut chart ──────────────────────────────────────────────────────────
function drawDonut(canvasId, slices, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2, R = Math.min(W,H)*0.38, r = R*0.58;

  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = '#FAFAF7';
  ctx.fillRect(0,0,W,H);

  let angle = -Math.PI/2;
  slices.forEach(s => {
    const sweep = (s.value/100)*2*Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, angle, angle+sweep);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
    angle += sweep;
  });

  // Hole
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2*Math.PI);
  ctx.fillStyle = '#FAFAF7';
  ctx.fill();

  // Centre text
  ctx.fillStyle = '#2D3B2A';
  ctx.font = 'bold 18px Cormorant Garamond, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);
}

// ── PDF Download ─────────────────────────────────────────────────────────────
function downloadReportAsPDF() {
  const report = document.getElementById('pdf-report');
  if (!report) { alert('Report not ready yet.'); return; }

  const printWin = window.open('', '_blank');
  printWin.document.write(`
    <html><head><title>Mental Health Report</title>
    <style>
      body { font-family: 'Georgia', serif; padding: 40px; color: #2D3B2A; background: #FAFAF7; }
      h1 { font-size: 24px; margin-bottom: 8px; }
      .section { margin: 20px 0; padding: 16px; border-left: 3px solid #8FAF8A; background: #EEF7EC; }
      .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #C8DEC4; }
      .badge { display: inline-block; padding: 6px 16px; background: #D9EDD6; color: #2D3B2A; font-weight: bold; margin: 8px 0; }
      li { margin: 6px 0; }
    </style></head><body>
    ${report.innerHTML}
    </body></html>
  `);
  printWin.document.close();
  setTimeout(() => { printWin.print(); printWin.close(); }, 400);
}

// ── Init on every page ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  MHC.load();
  applyTranslations();
  initOptionCards();
});
