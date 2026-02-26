/* ===================================================
   JANSEVA – SHARED APP LOGIC
   =================================================== */

/* ---------- AUTH STATE ---------- */
const AUTH_KEY = 'janseva_user';

function getUser() {
  try { return JSON.parse(sessionStorage.getItem(AUTH_KEY)); } catch { return null; }
}
function setUser(u) { sessionStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function clearUser() { sessionStorage.removeItem(AUTH_KEY); }
function isLoggedIn() { return !!getUser(); }

/* ---------- UPDATE NAV ON LOAD ---------- */
function updateNavAuth() {
  const loginBtn = document.getElementById('loginBtn');
  if (!loginBtn) return;
  const user = getUser();
  if (user) {
    loginBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>${user.name.split(' ')[0]}</span>`;
    loginBtn.style.background = 'var(--green)';
    loginBtn.title = 'Logged in as ' + user.name;
    loginBtn.onclick = () => {
      if (confirm('Log out of JanSeva?')) { clearUser(); location.reload(); }
    };
  } else {
    loginBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Login with Aadhaar</span>`;
    loginBtn.style.background = '';
    loginBtn.onclick = () => openLoginModal();
  }
}

/* ---------- LOGIN MODAL ---------- */
function openLoginModal(afterLogin) {
  const existing = document.getElementById('loginModalOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'loginModalOverlay';
  overlay.className = 'modal-overlay';
  overlay.style.cssText = 'display:flex;z-index:20000';
  overlay.innerHTML = `
    <div class="modal-box login-modal-box" style="max-width:420px;padding:0;overflow:hidden">
      <!-- HEADER -->
      <div class="login-modal-header">
        <div class="login-modal-logo">
          <div class="brand-logo" style="width:40px;height:40px">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" stroke-width="2"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="white" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <div style="font-weight:800;font-size:1rem;color:#fff">JanSeva</div>
            <div style="font-size:0.65rem;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.4px">Government of India</div>
          </div>
        </div>
        <button class="login-modal-close" id="loginModalClose">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- BODY -->
      <div class="login-modal-body">
        <!-- METHOD TABS -->
        <div class="login-tabs" id="loginTabs">
          <button class="login-tab active" data-tab="aadhaar">Aadhaar OTP</button>
          <button class="login-tab" data-tab="digilocker">DigiLocker</button>
          <button class="login-tab" data-tab="demo">Demo Login</button>
        </div>

        <!-- AADHAAR TAB -->
        <div class="login-tab-panel active" id="tab-aadhaar">
          <div class="digilocker-trust">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="var(--green)" stroke-width="2"/><polyline points="9 12 11 14 15 10" stroke="var(--green)" stroke-width="2" stroke-linecap="round"/></svg>
            Aadhaar-based OTP login powered by UIDAI
          </div>
          <div class="form-group">
            <label class="form-label">Aadhaar Number</label>
            <input type="text" class="form-control" id="aadhaarInput" placeholder="XXXX XXXX XXXX" maxlength="14" />
          </div>
          <button class="btn-primary btn-full" id="sendOtpBtn" style="margin-bottom:16px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M22 2L15 22 11 13 2 9l20-7z" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
            Send OTP to Registered Mobile
          </button>
          <div id="otpSection" style="display:none">
            <div class="form-group">
              <label class="form-label">Enter 6-digit OTP</label>
              <input type="text" class="form-control otp-input" id="otpInput" placeholder="• • • • • •" maxlength="6" />
            </div>
            <button class="btn-primary btn-full" id="verifyOtpBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>
              Verify & Login
            </button>
          </div>
        </div>

        <!-- DIGILOCKER TAB -->
        <div class="login-tab-panel" id="tab-digilocker">
          <div class="digilocker-trust">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="var(--primary)" stroke-width="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="var(--primary)" stroke-width="2"/></svg>
            Secure login via DigiLocker — auto-fetches your documents
          </div>
          <p style="font-size:0.82rem;color:var(--text-2);line-height:1.6;margin-bottom:20px">
            Connect DigiLocker to securely share your Aadhaar, PAN, income certificate and land records with JanSeva for instant eligibility matching.
          </p>
          <div class="digilocker-perms">
            <div class="perm-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/></svg> Aadhaar Identity Card</div>
            <div class="perm-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/></svg> Income Certificate</div>
            <div class="perm-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/></svg> Caste / Category Certificate</div>
            <div class="perm-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/></svg> Land Records (7/12)</div>
          </div>
          <button class="btn-digilocker-connect" id="digilockerConnectBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" stroke-width="2"/></svg>
            Connect DigiLocker Account
          </button>
        </div>

        <!-- DEMO LOGIN TAB -->
        <div class="login-tab-panel" id="tab-demo">
          <div class="digilocker-trust" style="background:#fffbeb;border-color:rgba(217,119,6,.2);color:var(--accent)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Demo mode — not a real government login
          </div>
          <p style="font-size:0.82rem;color:var(--text-2);line-height:1.6;margin-bottom:18px">Select a demo profile to explore the platform with pre-filled data:</p>
          <div class="demo-profiles" id="demoProfiles">
            <div class="demo-profile-card" data-name="Ravi Kumar" data-cat="OBC" data-state="Telangana" data-occ="Farmer / Agriculture" data-income="₹50,000 – ₹1 Lakh" data-aadhaar="XXXX XXXX 7842" data-avt="👨‍🌾">
              <div class="dpc-avatar">👨‍🌾</div>
              <div><div class="dpc-name">Ravi Kumar</div><div class="dpc-role">Farmer · Telangana · OBC</div></div>
            </div>
            <div class="demo-profile-card" data-name="Meena Devi" data-cat="SC" data-state="Uttar Pradesh" data-occ="Daily Wage Labour" data-income="Below ₹50,000" data-aadhaar="XXXX XXXX 3391" data-avt="👩">
              <div class="dpc-avatar">👩</div>
              <div><div class="dpc-name">Meena Devi</div><div class="dpc-role">Street Vendor · Uttar Pradesh · SC</div></div>
            </div>
            <div class="demo-profile-card" data-name="Arjun Patil" data-cat="General" data-state="Maharashtra" data-occ="Student" data-income="₹1 Lakh – ₹2.5 Lakh" data-aadhaar="XXXX XXXX 5519" data-avt="🧑‍🎓">
              <div class="dpc-avatar">🧑‍🎓</div>
              <div><div class="dpc-name">Arjun Patil</div><div class="dpc-role">Student · Maharashtra · General</div></div>
            </div>
          </div>
        </div>

        <div class="login-dpdp">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Your data is processed under DPDP Act 2023. No data stored without explicit consent.
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  /* after-login callback store */
  overlay._afterLogin = afterLogin;

  /* close */
  document.getElementById('loginModalClose').onclick = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  /* tabs */
  overlay.querySelectorAll('.login-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
      overlay.querySelectorAll('.login-tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      overlay.querySelector('#tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  /* aadhaar OTP flow */
  document.getElementById('sendOtpBtn').addEventListener('click', () => {
    const val = document.getElementById('aadhaarInput').value.replace(/\s/g, '');
    if (val.length < 12) { showToast('Enter a valid 12-digit Aadhaar number.', 'error'); return; }
    document.getElementById('sendOtpBtn').innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" class="spin-icon" fill="none"><path d="M21 12a9 9 0 11-6-8.485" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg> Sending…';
    setTimeout(() => {
      document.getElementById('otpSection').style.display = 'block';
      showToast('OTP sent to registered mobile number ending in ••••32');
      document.getElementById('sendOtpBtn').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M22 2L15 22 11 13 2 9l20-7z" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Resend OTP`;
    }, 1800);
  });

  document.getElementById('verifyOtpBtn').addEventListener('click', () => {
    const otp = document.getElementById('otpInput').value;
    if (otp.length < 6) { showToast('Enter the 6-digit OTP.', 'error'); return; }
    doLogin({ name: 'Citizen User', aadhaar: document.getElementById('aadhaarInput').value, cat: 'General', state: 'India', occ: '', income: '' }, overlay);
  });

  /* DigiLocker connect */
  document.getElementById('digilockerConnectBtn').addEventListener('click', () => {
    document.getElementById('digilockerConnectBtn').innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" class="spin-icon" fill="none"><path d="M21 12a9 9 0 11-6-8.485" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Connecting…';
    setTimeout(() => {
      doLogin({ name: 'Ravi Kumar', aadhaar: 'XXXX XXXX 7842', cat: 'OBC', state: 'Telangana', occ: 'Farmer / Agriculture', income: '₹50,000 – ₹1 Lakh' }, overlay);
    }, 2000);
  });

  /* demo profiles */
  overlay.querySelectorAll('.demo-profile-card').forEach(card => {
    card.addEventListener('click', () => {
      overlay.querySelectorAll('.demo-profile-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const d = card.dataset;
      setTimeout(() => {
        doLogin({ name: d.name, aadhaar: d.aadhaar, cat: d.cat, state: d.state, occ: d.occ, income: d.income }, overlay);
      }, 600);
    });
  });
}

function doLogin(user, overlay) {
  setUser(user);
  overlay.remove();
  updateNavAuth();
  showToast(`Welcome, ${user.name}! Logged in successfully.`);
  if (overlay._afterLogin) overlay._afterLogin(user);
}

/* ---------- GUARD: require login ---------- */
function requireLogin(action) {
  if (isLoggedIn()) { action(getUser()); }
  else { openLoginModal(action); }
}

/* ---------- DOCUMENT UPLOAD MODAL ---------- */
function openUploadDocModal(schemeName, docs) {
  const existing = document.getElementById('uploadDocOverlay');
  if (existing) existing.remove();

  const docItems = (docs || ['Income Certificate', 'Aadhaar Card', 'Bank Passbook']).map(d => `
    <div class="doc-upload-row" id="drow-${d.replace(/\s/g, '')}">
      <div class="doc-upload-info">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" stroke-width="2"/><polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2"/></svg>
        <div>
          <div class="doc-upload-name">${d}</div>
          <div class="doc-upload-hint">PDF, JPG, PNG — max 2 MB</div>
        </div>
      </div>
      <label class="doc-upload-btn" for="file-${d.replace(/\s/g, '')}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Upload
        <input type="file" id="file-${d.replace(/\s/g, '')}" accept=".pdf,.jpg,.jpeg,.png" style="display:none" data-doc="${d}"/>
      </label>
    </div>`).join('');

  const overlay = document.createElement('div');
  overlay.id = 'uploadDocOverlay';
  overlay.className = 'modal-overlay';
  overlay.style.cssText = 'display:flex;z-index:20000';
  overlay.innerHTML = `
    <div class="modal-box" style="max-width:500px">
      <button class="modal-close upload-modal-close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
      </button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
        <div class="icon-chip chip-amber">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" stroke="currentColor" stroke-width="2"/><polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="2"/></svg>
        </div>
        <div>
          <h3 class="modal-title" style="margin:0 0 2px">Upload Required Documents</h3>
          <p style="font-size:0.75rem;color:var(--text-3);margin:0">for ${schemeName}</p>
        </div>
      </div>
      <div class="upload-progress-strip" id="uploadProgressStrip">
        <div class="ups-fill" id="upsBar" style="width:0%"></div>
      </div>
      <p style="font-size:0.8rem;color:var(--text-2);margin-bottom:20px;line-height:1.6">
        The following documents are required to verify your eligibility. Upload each document and click Submit when done.
      </p>
      <div class="doc-upload-list" id="docUploadList">
        ${docItems}
      </div>
      <div class="upload-digisync">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="var(--primary)" stroke-width="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="var(--primary)" stroke-width="2"/></svg>
        Or fetch directly from your DigiLocker
        <button class="link-btn" id="fetchDigilockerDocs">Fetch Now</button>
      </div>
      <button class="btn-primary btn-full" id="submitDocsBtn" style="margin-top:20px;opacity:.5;cursor:not-allowed" disabled>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M22 2L15 22 11 13 2 9l20-7z" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
        Submit Documents
      </button>
    </div>`;

  document.body.appendChild(overlay);

  /* close */
  overlay.querySelector('.upload-modal-close').onclick = () => overlay.remove();
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  /* track uploads */
  const totalDocs = docs ? docs.length : 3;
  let uploadedCount = 0;
  const uploadedSet = new Set();

  overlay.querySelectorAll('input[type=file]').forEach(input => {
    input.addEventListener('change', (e) => {
      if (!e.target.files.length) return;
      const docName = e.target.dataset.doc;
      const row = document.getElementById('drow-' + docName.replace(/\s/g, ''));
      const btn = row.querySelector('.doc-upload-btn');
      const file = e.target.files[0];

      /* simulate upload */
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" class="spin-icon" fill="none"><path d="M21 12a9 9 0 11-6-8.485" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg> Uploading…`;
      setTimeout(() => {
        btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/></svg> Uploaded`;
        btn.style.color = 'var(--green)';
        btn.style.borderColor = 'var(--green)';
        row.style.background = 'var(--green-light)';
        row.style.borderColor = 'rgba(10,124,78,.2)';
        row.querySelector('.doc-upload-name').innerHTML += ` <span style="font-size:.7rem;color:var(--text-3)">(${file.name})</span>`;
        if (!uploadedSet.has(docName)) { uploadedSet.add(docName); uploadedCount++; }
        const pct = Math.round((uploadedCount / totalDocs) * 100);
        document.getElementById('upsBar').style.width = pct + '%';
        if (uploadedCount === totalDocs) {
          const submitBtn = document.getElementById('submitDocsBtn');
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }
      }, 1200);
    });
  });

  /* DigiLocker fetch shortcut */
  document.getElementById('fetchDigilockerDocs').addEventListener('click', () => {
    document.getElementById('fetchDigilockerDocs').textContent = 'Fetching…';
    setTimeout(() => {
      overlay.querySelectorAll('input[type=file]').forEach(input => {
        const docName = input.dataset.doc;
        const row = document.getElementById('drow-' + docName.replace(/\s/g, ''));
        if (!uploadedSet.has(docName)) {
          const btn = row.querySelector('.doc-upload-btn');
          btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"/></svg> Fetched`;
          btn.style.color = 'var(--green)'; btn.style.borderColor = 'var(--green)';
          row.style.background = 'var(--green-light)'; row.style.borderColor = 'rgba(10,124,78,.2)';
          uploadedSet.add(docName); uploadedCount++;
        }
      });
      const pct = Math.round((uploadedCount / totalDocs) * 100);
      document.getElementById('upsBar').style.width = pct + '%';
      const submitBtn = document.getElementById('submitDocsBtn');
      submitBtn.disabled = false; submitBtn.style.opacity = '1'; submitBtn.style.cursor = 'pointer';
      document.getElementById('fetchDigilockerDocs').textContent = 'Fetched!';
      showToast('DigiLocker documents fetched successfully.');
    }, 2000);
  });

  /* submit */
  document.getElementById('submitDocsBtn').addEventListener('click', () => {
    overlay.remove();
    showToast('Documents submitted successfully. Application status updated.');
  });
}

/* ---------- NAV SCROLL & HAMBURGER ---------- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 10));
}
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* active nav link */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) link.classList.add('active');
});

/* ---------- TOAST ---------- */
function showToast(msg, type = 'success') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'success'
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  t.innerHTML = icon + msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}

/* ---------- VOICE FAB ---------- */
const voiceFab = document.getElementById('voiceFab');
if (voiceFab) {
  voiceFab.addEventListener('click', () => {
    requireLogin(() => { document.getElementById('voiceModal').style.display = 'flex'; });
  });
  const vmc = document.getElementById('voiceModalClose');
  if (vmc) vmc.addEventListener('click', () => { document.getElementById('voiceModal').style.display = 'none'; });
  const vm = document.getElementById('voiceModal');
  if (vm) vm.addEventListener('click', e => { if (e.target === vm) vm.style.display = 'none'; });
}

/* ---------- LOGIN BTN ---------- */
const loginBtn = document.getElementById('loginBtn');
if (loginBtn && !loginBtn._bound) {
  loginBtn._bound = true;
  updateNavAuth();
}

/* ---------- PROGRESS BARS ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-width]').forEach(el => { el.style.width = el.dataset.width; });
    document.querySelectorAll('.score-fill[data-width]').forEach(el => { el.style.width = el.dataset.width; });
  }, 350);
});

/* ---------- INTERSECTION OBSERVER ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; io.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.animate-in').forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  io.observe(el);
});

/* ---------- MODAL HELPERS ---------- */
window.openModal = id => { const m = document.getElementById(id); if (m) m.style.display = 'flex'; };
window.closeModal = id => { const m = document.getElementById(id); if (m) m.style.display = 'none'; };
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.style.display = 'none'; });
  const cb = m.querySelector('.modal-close');
  if (cb) cb.addEventListener('click', () => m.style.display = 'none');
});
