/* =========================================================
   منصة التحقيق — app.js (النسخة الاسطورية v2)
   يحتوي: بيانات القضية، إدارة الحالة المحفوظة محليًا،
   مركز إشعارات حقيقي، نظام تلميحات متعدد، بحث/فلترة الأدلة،
   لوحة ربط تفاعلية، خط زمني قابل للتعديل، وتقييم نظرية حقيقي.
   ========================================================= */

/* ---------- بيانات القضية ---------- */
// كل دليل: [أيقونة, عنوان, بيانات وصفية, وصف تفصيلي, نوع الدليل, مرتبط بـ]
const evidence = [
  ['📷','صورة المختبر','صورة ثابتة · 14:18','صورة الطاولة رقم 4 بعد انقطاع الكاميرا. لاحظ أن الساعة الخلفية متوقفة عند 14:08.','صورة',['CASE #027']],
  ['▣','سجل بطاقة الدخول','سجل وصول · 14:17','تم استخدام بطاقة Sarah Miller للدخول إلى المختبر في 14:17، رغم أنها قالت إنها كانت في الكافتيريا.','سجل',['Sarah Miller','تناقض #03']],
  ['◉','انقطاع الكاميرا','سجل أمني · 14:12','الكاميرا B-12 توقفت عن التسجيل لمدة 6 دقائق. تم تشغيلها يدويًا من لوحة التحكم.','فيديو',['الخط الزمني','لوحة الربط']],
  ['✉','رسالة مجهولة','محادثة · أمس','"لا تفتح الخزانة قبل أن يغادر الجميع." الرسالة أرسلت من شبكة المختبر.','رسالة',['الخزانة 04']],
  ['▤','سجل المكالمات','هاتف · 13:50–14:30','مكالمة قصيرة بين Sarah ورقم غير محفوظ عند 14:09.','اتصال',['Sarah Miller']],
  ['▤','مذكرة Adam','ملاحظة مكتوبة · 14:24','يقول Adam إنه غادر المختبر الساعة 14:07، لكن لم يذكر إلى أين ذهب.','مذكرة',['Adam Brooks']],
  ['⌂','الخزانة 04','تفتيش موقع · 14:31','الخزانة مقفلة، ولا توجد آثار عبث. يوجد غبار مفقود على الحافة الداخلية.','أثر',['رسالة مجهولة','أثر قماش']],
  ['▥','تسجيل الدخول الثاني','سجل وصول · 13:50','Sarah استخدمت بطاقتها لدخول المختبر قبل 20 دقيقة من بداية المناوبة.','سجل',['Sarah Miller']],
  ['☏','شهادة الحارس','شهادة · اليوم','الحارس رأى شخصًا يرتدي معطفًا أبيض قرب باب الخدمة في 14:16.','شهادة',['صورة باب الخدمة']],
  ['✎','قائمة الجرد','مستند · 12:00','الهاتف التجريبي مسجل تحت رقم الأصل LAB-44، وكان على الطاولة رقم 4.','مستند',['CASE #027']],
  ['▧','صورة باب الخدمة','صورة · 14:20','باب الخدمة مفتوح 3 سم. نظام القفل لم يسجل فتحًا.','صورة',['شهادة الحارس']],
  ['⌁','أثر قماش','فحص جنائي · 14:45','ألياف زرقاء عالقة في مقبض الخزانة.','أثر',['الخزانة 04']],
  ['▣','جدول المناوبات','مستند · هذا الأسبوع','Sarah وAdam كانا الوحيدان المصرح لهما بدخول B-12 في فترة الظهيرة.','مستند',['Sarah Miller','Adam Brooks']],
  ['☷','إيميل المدير','بريد · 13:35','تم تأجيل شحن الهاتف يومًا واحدًا بسبب اختبار إضافي.','إيميل',['Michael Ross']],
  ['◷','نسخة احتياطية للكاميرا','فيديو · 14:12','نسخة منخفضة الجودة تظهر ظلًا قرب لوحة التحكم.','فيديو',['انقطاع الكاميرا']],
  ['⌑','إيصال الكافتيريا','إيصال · 14:11','شراء قهوة باسم Sarah عند 14:11، قبل انقطاع الكاميرا بدقيقة.','إيصال',['Sarah Miller','تناقض #03']],
  ['✦','ملاحظة مخفية','دليل مكتشف · سري','خلف إطار الصورة وُجد إيصال شراء شريط لاصق الساعة 14:08.','دليل مخفي',['الخزانة 04']]
];

const suspects = [
  ['SM','Sarah Miller','مساعدة مختبر','الدافع','الفرصة','⭐⭐⭐⭐','⭐⭐⭐⭐⭐','كنت في الكافتيريا من 14:10 حتى 14:20.','#9c684e',
    ['بطاقتي استُخدمت فعلًا، لكن أي شخص كان يعرف مكانها كان قادرًا على أخذها من درجي.','لم أكن الوحيدة التي تعرف رمز لوحة الكاميرا — أخبرت Adam به الأسبوع الماضي.']],
  ['AB','Adam Brooks','باحث أول','الدافع','الفرصة','⭐⭐⭐','⭐⭐⭐','غادرت المختبر عند 14:07 ولم أعد.','#496d82',
    ['لم أوقّع سجل الخروج لأن القارئ كان معطلًا في ذلك الوقت.','رأيت Sarah تتجه نحو المختبر مرة أخرى بعد مغادرتي مباشرة.']],
  ['JC','John Carter','فني صيانة','الدافع','الفرصة','⭐⭐','⭐⭐⭐⭐','كنت أصلح لوحة الكهرباء في الطابق الثاني.','#665680',
    ['لدي مفاتيح كل الأبواب في المبنى، لكن لم أقترب من B-12 اليوم.','سمعت صوت باب يُفتح من الطابق الأرضي حوالي الساعة 14:15.']],
  ['MR','Michael Ross','مدير المختبر','الدافع','الفرصة','⭐⭐⭐⭐⭐','⭐⭐','الهاتف ملك للمشروع، وليس لدي سبب لسرقته.','#755b42',
    ['أجّلت شحنة الهاتف بنفسي، وهذا موثق في إيميل رسمي.','كنت في اجتماع مع الإدارة من الساعة 13:45 حتى 14:30.']]
];

const baseEvents = [
  ['13:50','Sarah تدخل المختبر','سجل بطاقة الدخول يؤكد بداية مناوبتها.'],
  ['14:00','آخر مرة شوهد فيها الهاتف','تم تصوير الهاتف على الطاولة رقم 4.'],
  ['14:07','Adam يغادر المختبر','بحسب أقواله، لكنه لم يقدم دليلًا على ذلك.'],
  ['14:09','مكالمة Sarah','مكالمة قصيرة إلى رقم غير محفوظ.'],
  ['14:11','شراء قهوة','إيصال باسم Sarah من كافتيريا المبنى.'],
  ['14:12','انقطاع الكاميرا','توقفت الكاميرا B-12 لمدة ست دقائق.'],
  ['14:17','بطاقة Sarah تُستخدم','تم الدخول إلى المختبر أثناء انقطاع الكاميرا.'],
  ['14:23','اكتشاف الاختفاء','أبلغت مديرة المختبر عن الهاتف المفقود.']
];

const HINTS = [
  'تلميح #1: راجع سجل بطاقة الدخول — الدليل الصغير يقودك إلى التناقض الأكبر.',
  'تلميح #2: قارن وقت انقطاع الكاميرا (14:12–14:18) مع وقت استخدام البطاقة (14:17). ماذا يعني هذا؟',
  'تلميح #3: إيصال الكافتيريا يضع Sarah في مكانين مختلفين تقريبًا بنفس الوقت — تحقق من التناقض.',
  'تلميح #4: الجاني والطريقة والوقت كلها مطلوبة لحل النظرية، لا تكتفِ بالاسم فقط.'
];

const CARD_LABELS = {sarah:'Sarah Miller','badge-log':'سجل بطاقة الدخول','camera-gap':'انقطاع الكاميرا',contradiction:'التناقض #03'};
const LINK_TYPE_LABELS = {confirmed:'مؤكد', probable:'رابط محتمل', contradiction:'تناقض'};
const LINK_TYPE_COLORS = {confirmed:'var(--green)', probable:'var(--amber)', contradiction:'var(--red)'};

const ACHIEVEMENTS = [
  { id:'eagle-eye', icon:'👁️', title:'العين الثاقبة', desc:'اكتشف الدليل المخفي في غرفة الأدلة.', check: s => s.discoveredHidden },
  { id:'link-master', icon:'🔗', title:'صانع الروابط', desc:'أنشئ رابطين على الأقل في لوحة الربط.', check: s => s.userLinks.length >= 2 },
  { id:'patient-detective', icon:'⏳', title:'المحقق الصبور', desc:'استخدم تلميحين على الأقل قبل الحل.', check: s => s.hintsUsed >= 2 },
  { id:'case-closed', icon:'🏆', title:'كاسر القضية', desc:'حل القضية الحالية بنجاح.', check: s => s.caseSolved }
];

/* ---------- إدارة الحالة المحفوظة (localStorage) ---------- */
const STORAGE_KEY = 'detective_case_027_state_v2';
const defaultState = {
  xp: 1240,
  points: 100,          // نقاط الجلسة (تُستهلك بالتلميحات)
  hintsUsed: 0,
  progress: 64,
  solvedCases: 27,
  discoveredHidden: false,
  caseSolved: false,
  theoryAttempts: 0,
  customEvents: [],      // ملاحظات زمنية أضافها المستخدم
  userLinks: [],         // روابط أنشأها المستخدم في لوحة الربط [[a,b], ...]
  interrogations: {},    // عدد مرات استجواب كل مشتبه
  notifications: [],     // {id, text, time, read}
  motion: true,
  sound: false,
  sessionSeconds: 0,
  unlockedAchievements: []
};

let state = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return {...defaultState};
    const parsed = JSON.parse(raw);
    return {...defaultState, ...parsed};
  }catch(e){
    console.warn('تعذّرت قراءة التقدم المحفوظ، سيتم البدء من جديد.', e);
    return {...defaultState};
  }
}
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e){ console.warn('تعذّر حفظ التقدم.', e); }
}

/* ---------- أدوات مساعدة عامة ---------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function toast(msg, type){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('success','error');
  if(type) t.classList.add(type);
  t.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function notify(text){
  state.notifications.unshift({ id: uid(), text, time: nowLabel(), read: false });
  state.notifications = state.notifications.slice(0, 30); // حد أقصى للسجل
  saveState();
  renderNotifications();
}

function nowLabel(){
  const d = new Date();
  return d.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
}

/* ---------- نظام صوت بسيط (بدون ملفات خارجية) ---------- */
let audioCtx = null;
function playSound(kind){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const freqMap = { click: 440, success: 660, error: 220 };
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freqMap[kind] || 440;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  }catch(e){ /* الأصوات ثانوية، تجاهل أي خطأ بصمت */ }
}

/* ---------- عداد وقت التحقيق (الجلسة الحالية) ---------- */
function formatDuration(totalSeconds){
  const m = Math.floor(totalSeconds / 60).toString().padStart(2,'0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
function startSessionTimer(){
  const el = $('#session-timer');
  setInterval(() => {
    state.sessionSeconds += 1;
    if(el) el.textContent = `⏱ ${formatDuration(state.sessionSeconds)}`;
    if(state.sessionSeconds % 10 === 0) saveState(); // حفظ دوري بدون إثقال التخزين
  }, 1000);
}

/* ---------- نظام الإنجازات ---------- */
function checkAchievements(){
  let newlyUnlocked = [];
  ACHIEVEMENTS.forEach(a => {
    const already = state.unlockedAchievements.includes(a.id);
    if(!already && a.check(state)){
      state.unlockedAchievements.push(a.id);
      newlyUnlocked.push(a);
    }
  });
  if(newlyUnlocked.length){
    saveState();
    newlyUnlocked.forEach(a => {
      toast(`🎖 إنجاز جديد: ${a.title}`, 'success');
      notify(`فتحت إنجاز "${a.title}" — ${a.desc}`);
      playSound('success');
    });
  }
  renderAchievements();
}

function renderAchievements(){
  const grid = $('#achievements-grid');
  if(!grid) return;
  grid.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = state.unlockedAchievements.includes(a.id);
    return `<div class="badge ${unlocked ? 'unlocked' : ''}">
      <div class="badge-icon">${a.icon}</div>
      <strong>${a.title}</strong>
      <small>${unlocked ? a.desc : 'غير مفتوح بعد'}</small>
    </div>`;
  }).join('');
}


function renderLiveDate(){
  const d = new Date();
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const day = String(d.getDate()).padStart(2,'0');
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();
  const el = $('#live-date');
  if(el) el.textContent = `${weekday} · ${day} ${month} ${year}`;
}

/* ---------- التنقل بين الواجهات ---------- */
function showView(name){
  $$('.view').forEach(v => v.classList.remove('active-view'));
  const view = $(`#${name}-view`);
  if(view) view.classList.add('active-view');
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === name));
  const titles = { dashboard:'مركز التحقيق', case:'ملف القضية #027', evidence:'غرفة الأدلة', suspects:'المشتبه بهم', timeline:'الخط الزمني', board:'لوحة الربط' };
  $('#page-title').textContent = titles[name] || 'مركز التحقيق';
  window.scrollTo({ top: 0, behavior: state.motion ? 'smooth' : 'auto' });
  if(name === 'board') setTimeout(drawUserLinks, 60); // إعادة رسم الروابط بعد ظهور اللوحة فعليًا
}

/* ---------- غرفة الأدلة ---------- */
function renderEvidence(){
  const grid = $('#evidence-grid');
  grid.innerHTML = evidence.map((e,i) => `
    <article class="evidence-card ${i===16 && state.discoveredHidden ? 'discovered' : ''}" data-index="${i}" data-type="${e[4]}">
      <span class="tag">#${String(i+1).padStart(2,'0')}</span>
      <div class="evidence-icon">${e[0]}</div>
      <strong>${e[1]}</strong>
      <small>${e[2]}</small>
    </article>`).join('');
  $$('.evidence-card[data-index]').forEach(card => card.addEventListener('click', () => inspectEvidence(+card.dataset.index)));
  applyEvidenceFilter();
}

function inspectEvidence(i){
  const e = evidence[i];
  $$('.evidence-card[data-index]').forEach(c => c.classList.toggle('selected', +c.dataset.index === i));
  const links = e[5].map(l => `<span class="link-pill">${l}</span>`).join('');
  const hiddenNote = (i === 16 && !state.discoveredHidden)
    ? `<p style="color:var(--green)">✓ تم اكتشاف دليل مخفي جديد. +50 XP</p>` : '';
  $('#inspector').innerHTML = `
    <span class="eyebrow">EVIDENCE #${String(i+1).padStart(2,'0')} · ${e[4]}</span>
    <div class="inspector-content">
      <div class="big-icon">${e[0]}</div>
      <h3>${e[1]}</h3>
      <small class="muted">${e[2]}</small>
      <p>${e[3]}</p>
      <span class="eyebrow">CONNECTED TO</span>
      <div>${links}</div>
      ${hiddenNote}
    </div>`;
  if(i === 16 && !state.discoveredHidden){
    state.discoveredHidden = true;
    state.xp += 50;
    saveState();
    updateProfileXp();
    toast('تم اكتشاف دليل مخفي! حصلت على +50 XP', 'success');
    notify('اكتشفت دليلًا مخفيًا في غرفة الأدلة (+50 XP).');
    playSound('success');
    $$('.evidence-card[data-index="16"]').forEach(c => c.classList.add('discovered'));
    checkAchievements();
  }
}

function populateEvidenceFilter(){
  const select = $('#evidence-filter');
  const types = [...new Set(evidence.map(e => e[4]))];
  select.innerHTML = '<option value="">كل الأنواع</option>' + types.map(t => `<option value="${t}">${t}</option>`).join('');
}

function applyEvidenceFilter(){
  const q = ($('#evidence-search')?.value || '').trim().toLowerCase();
  const type = $('#evidence-filter')?.value || '';
  let visibleCount = 0;
  $$('.evidence-card[data-index]').forEach(card => {
    const i = +card.dataset.index;
    const e = evidence[i];
    const text = (e[1] + ' ' + e[3] + ' ' + e[4]).toLowerCase();
    const matches = (!q || text.includes(q)) && (!type || e[4] === type);
    card.classList.toggle('hidden-by-filter', !matches);
    if(matches) visibleCount++;
  });
  const empty = $('#evidence-empty');
  if(empty) empty.style.display = visibleCount === 0 ? 'block' : 'none';
}

/* ---------- نظام التلميحات المتعدد ---------- */
function updateHintButton(){
  const btn = $('#hint-btn');
  if(!btn) return;
  if(state.hintsUsed >= HINTS.length){
    btn.innerHTML = `💡 لا مزيد من التلميحات`;
    btn.disabled = true;
  } else {
    btn.innerHTML = `💡 طلب تلميح (${state.hintsUsed}/${HINTS.length}) <small>-10 نقاط · ${state.points} نقطة متبقية</small>`;
    btn.disabled = false;
  }
}

function requestHint(){
  if(state.hintsUsed >= HINTS.length){
    toast('لقد استخدمت كل التلميحات المتاحة لهذه القضية.');
    return;
  }
  const hint = HINTS[state.hintsUsed];
  state.hintsUsed += 1;
  state.points = Math.max(0, state.points - 10);
  saveState();
  toast(hint);
  playSound('click');
  notify(`طلبت تلميحًا جديدًا (${state.hintsUsed}/${HINTS.length}) — تبقّى ${state.points} نقطة.`);
  updateHintButton();
  checkAchievements();
}

/* ---------- المشتبه بهم ---------- */
function renderSuspects(){
  $('#suspects-grid').innerHTML = suspects.map(s => `
    <article class="panel suspect-card">
      <div class="suspect-top" style="background:linear-gradient(145deg,${s[8]},#18232d)">
        <div class="suspect-avatar" style="background:${s[8]}">${s[0]}</div>
      </div>
      <div class="suspect-body">
        <h3>${s[1]}</h3><small>${s[2]}</small>
        <div class="risk">
          <div class="risk-line"><span>${s[3]}</span><i style="--w:${s[5].length*17}%;--c:var(--red)"></i></div>
          <div class="risk-line"><span>${s[4]}</span><i style="--w:${s[6].length*17}%;--c:var(--amber)"></i></div>
        </div>
        <div class="suspect-quote">"${s[7]}"</div>
        <button class="ghost-btn full interrogate" data-name="${s[1]}">استجواب الشخص</button>
      </div>
    </article>`).join('');
  $$('.interrogate').forEach(b => b.addEventListener('click', () => interrogate(b.dataset.name)));
}

function interrogate(name){
  const suspect = suspects.find(s => s[1] === name);
  const count = state.interrogations[name] || 0;
  const followUps = suspect[9] || [];
  let line;
  if(count === 0) line = `طُلب من ${name} توضيح موقعه عند الساعة 14:17.`;
  else line = followUps[(count - 1) % followUps.length] || `${name} يكرر نفس الرواية دون تفاصيل جديدة.`;
  state.interrogations[name] = count + 1;
  saveState();
  playSound('click');
  toast(count === 0 ? `تم تسجيل جلسة استجواب ${name}. اسأل عن مكانه عند 14:17.` : `${name}: «${line}»`);
  if(count > 0) notify(`رد جديد من ${name} أثناء الاستجواب رقم ${count + 1}.`);
}

/* ---------- الخط الزمني ---------- */
function allEvents(){
  const merged = [...baseEvents.map(e => ({ time:e[0], title:e[1], desc:e[2], custom:false })),
                  ...state.customEvents.map(e => ({ ...e, custom:true }))];
  return merged.sort((a,b) => a.time.localeCompare(b.time));
}

function renderTimeline(){
  const events = allEvents();
  $('#timeline').innerHTML = events.map(e => `
    <div class="event ${e.time === '14:12' ? 'highlight' : ''} ${e.custom ? 'user-event' : ''}">
      <time>${e.time}</time>
      <div><strong>${e.title}</strong>${e.custom ? ' <small style="color:var(--amber)">· ملاحظتك</small>' : ''}<p>${e.desc}</p></div>
    </div>`).join('');
}

function isValidTime(t){ return /^([01]?\d|2[0-3]):[0-5]\d$/.test(t.trim()); }

function saveTimelineEvent(){
  const time = $('#event-time').value.trim();
  const title = $('#event-title').value.trim();
  const desc = $('#event-desc').value.trim();
  if(!isValidTime(time)){ toast('الرجاء إدخال وقت صحيح مثل 14:19'); return; }
  if(!title){ toast('الرجاء كتابة عنوان للملاحظة'); return; }
  state.customEvents.push({ time: time.length === 4 ? '0'+time : time, title, desc: desc || 'بدون تفاصيل إضافية.' });
  saveState();
  renderTimeline();
  closeModal($('#event-modal'));
  $('#event-time').value = ''; $('#event-title').value = ''; $('#event-desc').value = '';
  toast('تمت إضافة ملاحظتك إلى الخط الزمني.', 'success');
  notify(`أضفت ملاحظة زمنية جديدة: "${title}" عند ${time}.`);
}

/* ---------- لوحة الربط التفاعلية ---------- */
let linkMode = false;
let linkSelection = [];
let pendingLinkPair = null;

function toggleLinkMode(){
  linkMode = !linkMode;
  const btn = $('#connect-btn');
  $$('.board-card[data-card-id]').forEach(c => c.classList.toggle('linkable', linkMode));
  if(linkMode){
    btn.textContent = '× إلغاء وضع الربط';
    toast('وضع الربط مفعّل: اختر بطاقتين من اللوحة لإنشاء رابط بينهما.');
  } else {
    btn.textContent = '+ إنشاء رابط';
    linkSelection.forEach(id => document.querySelector(`[data-card-id="${id}"]`)?.classList.remove('link-selected'));
    linkSelection = [];
    hideLinkTypePicker();
  }
}

function handleBoardCardClick(el){
  if(!linkMode) return;
  const id = el.dataset.cardId;
  if(linkSelection.includes(id)){
    linkSelection = linkSelection.filter(x => x !== id);
    el.classList.remove('link-selected');
    return;
  }
  if(linkSelection.length >= 2) return;
  linkSelection.push(id);
  el.classList.add('link-selected');
  if(linkSelection.length === 2){
    const [a,b] = linkSelection;
    const exists = state.userLinks.some(l => (l[0]===a&&l[1]===b) || (l[0]===b&&l[1]===a));
    if(exists){
      toast('هذا الرابط موجود بالفعل بين هاتين البطاقتين.');
      linkSelection.forEach(x => document.querySelector(`[data-card-id="${x}"]`)?.classList.remove('link-selected'));
      linkSelection = [];
    } else {
      pendingLinkPair = [a,b];
      showLinkTypePicker();
    }
  }
}

function showLinkTypePicker(){ $('#link-type-picker').style.display = 'flex'; }
function hideLinkTypePicker(){ $('#link-type-picker').style.display = 'none'; pendingLinkPair = null; }

function confirmLinkType(type){
  if(type === 'cancel' || !pendingLinkPair){
    linkSelection.forEach(x => document.querySelector(`[data-card-id="${x}"]`)?.classList.remove('link-selected'));
    linkSelection = [];
    hideLinkTypePicker();
    return;
  }
  const [a,b] = pendingLinkPair;
  state.userLinks.push([a,b,type]);
  saveState();
  playSound('success');
  toast(`تم إنشاء رابط "${LINK_TYPE_LABELS[type]}": ${CARD_LABELS[a]} ↔ ${CARD_LABELS[b]}`, 'success');
  notify(`أضفت رابط "${LINK_TYPE_LABELS[type]}" بين "${CARD_LABELS[a]}" و"${CARD_LABELS[b]}".`);
  updateBoardCount();
  drawUserLinks();
  checkAchievements();
  linkSelection.forEach(x => document.querySelector(`[data-card-id="${x}"]`)?.classList.remove('link-selected'));
  linkSelection = [];
  hideLinkTypePicker();
}

function drawUserLinks(){
  const layer = $('#user-links-layer');
  const canvas = $('#board-canvas');
  if(!layer || !canvas) return;
  layer.innerHTML = '';
  const canvasRect = canvas.getBoundingClientRect();
  if(canvasRect.width === 0) return; // اللوحة غير ظاهرة حاليًا
  state.userLinks.forEach(([a,b,type]) => {
    const elA = canvas.querySelector(`[data-card-id="${a}"]`);
    const elB = canvas.querySelector(`[data-card-id="${b}"]`);
    if(!elA || !elB) return;
    const ra = elA.getBoundingClientRect(), rb = elB.getBoundingClientRect();
    const ax = ra.left + ra.width/2 - canvasRect.left, ay = ra.top + ra.height/2 - canvasRect.top;
    const bx = rb.left + rb.width/2 - canvasRect.left, by = rb.top + rb.height/2 - canvasRect.top;
    const dx = bx - ax, dy = by - ay;
    const length = Math.sqrt(dx*dx + dy*dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const line = document.createElement('div');
    line.className = 'user-line';
    line.style.width = length + 'px';
    line.style.left = ax + 'px';
    line.style.top = ay + 'px';
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = '0 0';
    line.style.background = LINK_TYPE_COLORS[type] || 'var(--green)';
    layer.appendChild(line);
  });
}

function updateBoardCount(){
  const total = 3 + state.userLinks.length;
  const heading = document.querySelector('#board-view .eyebrow');
  if(heading) heading.textContent = `EVIDENCE BOARD · ${String(total).padStart(2,'0')} CONNECTIONS`;
  const navBadge = $('.nav-item[data-view="board"] .nav-count');
  if(navBadge) navBadge.textContent = total;
  const tabBadge = document.querySelector('.tab[data-view="board"] b');
  if(tabBadge) tabBadge.textContent = total;
}

/* ---------- مركز الإشعارات ---------- */
function renderNotifications(){
  const list = $('#notif-list');
  const dot = $('#notif-dot');
  if(!list) return;
  if(state.notifications.length === 0){
    list.innerHTML = `<div class="notif-empty">لا توجد إشعارات بعد. تصرفاتك في التحقيق ستظهر هنا.</div>`;
  } else {
    list.innerHTML = state.notifications.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">${n.text}<small>${n.time}</small></div>`).join('');
  }
  const unread = state.notifications.some(n => !n.read);
  if(dot) dot.style.display = unread ? 'block' : 'none';
  if(dot) dot.classList.toggle('on', unread);
}

function toggleNotifications(){
  const panel = $('#notif-panel');
  panel.classList.toggle('open');
  if(panel.classList.contains('open')){
    state.notifications.forEach(n => n.read = true);
    saveState();
    setTimeout(renderNotifications, 400); // اترك النقطة تظهر لحظة قبل اختفائها
  }
}

/* ---------- المودالات ---------- */
function openModal(modal){ modal.classList.add('open'); }
function closeModal(modal){ modal.classList.remove('open'); }

/* ---------- تقديم النظرية وتقييمها ---------- */
function evaluateTheory(){
  const culprit = $('#culprit').value;
  const method = $('#method').value;
  const checks = $$('#theory-checklist input[type=checkbox]');
  const correctChecks = checks.filter(c => c.dataset.correct === 'true' && c.checked).length;
  const wrongChecks = checks.filter(c => c.dataset.correct === 'false' && c.checked).length;
  const totalCorrect = checks.filter(c => c.dataset.correct === 'true').length;

  state.theoryAttempts += 1;

  const culpritOk = culprit === 'sarah';
  const methodOk = method === 'camera';
  const evidenceScore = Math.max(0, correctChecks - wrongChecks) / totalCorrect; // 0..1

  closeModal($('#theory-modal'));

  if(culpritOk && methodOk){
    const accuracy = Math.round(70 + evidenceScore * 30); // من 70% إلى 100% حسب الأدلة المختارة
    const xpGain = 300 + Math.round(evidenceScore * 150);
    playSound('success');
    solveCase(accuracy, xpGain);
  } else {
    saveState();
    let msg = 'النظرية غير مكتملة. ';
    if(!culpritOk) msg += 'راجع من كان يملك «الفرصة» الحقيقية وقت انقطاع الكاميرا. ';
    if(!methodOk) msg += 'فكّر كيف استُغل انقطاع الكاميرا تحديدًا.';
    playSound('error');
    toast(msg.trim(), 'error');
    notify(`محاولة رقم ${state.theoryAttempts} لحل القضية لم تكتمل بعد.`);
  }
}

function solveCase(accuracy, xpGain){
  if(!state.caseSolved){
    state.caseSolved = true;
    state.solvedCases += 1;
    state.xp += xpGain;
    saveState();
    updateProfileXp();
    updateSolvedStat();
  } else {
    saveState();
  }
  state.progress = 100;
  saveState();
  $('#progress-bar').style.width = '100%';
  $('#progress-text').textContent = '100%';
  const archiveProgress = $('#archive-progress');
  if(archiveProgress) archiveProgress.textContent = 'محلولة ✓';
  toast(`تم حل القضية! دقة النظرية ${accuracy}% · +${xpGain} XP`, 'success');
  notify(`حللت القضية #027 بدقة ${accuracy}% وحصلت على +${xpGain} XP.`);
  $('#solve-detail').textContent = `دقة النظرية ${accuracy}% — حصلت على ${xpGain} نقطة خبرة إضافية.`;
  openModal($('#solve-overlay'));
  checkAchievements();
}

function updateProfileXp(){
  const el = $('#profile-xp');
  if(el) el.textContent = `محقق مبتدئ · ${state.xp.toLocaleString('en-US')} XP`;
}

function updateSolvedStat(){
  const cards = $$('.stat-card');
  if(cards[0]) cards[0].querySelector('strong').textContent = state.solvedCases;
}

/* ---------- استرجاع الحالة عند التحميل ---------- */
function restoreProgressUI(){
  updateProfileXp();
  updateSolvedStat();
  updateHintButton();
  updateBoardCount();
  if(state.caseSolved){
    state.progress = 100;
    $('#progress-bar').style.width = '100%';
    $('#progress-text').textContent = '100%';
    const archiveProgress = $('#archive-progress');
    if(archiveProgress) archiveProgress.textContent = 'محلولة ✓';
  }
  $('#setting-motion').checked = state.motion;
  $('#setting-sound').checked = state.sound;
  document.body.classList.toggle('no-motion', !state.motion);
  const timerEl = $('#session-timer');
  if(timerEl) timerEl.textContent = `⏱ ${formatDuration(state.sessionSeconds)}`;
  renderAchievements();
}

/* ---------- ربط أحداث الواجهة ---------- */
function bindEvents(){
  // التنقل بين الصفحات
  $$('[data-view]').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));

  // فتح/إغلاق نافذة النظرية وباقي المودالات
  $('#theory-open').addEventListener('click', () => openModal($('#theory-modal')));
  $$('.modal-close, [data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-backdrop')));
  });
  $$('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => { if(e.target === backdrop) closeModal(backdrop); });
  });
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      $$('.modal-backdrop.open').forEach(closeModal);
      $('#notif-panel')?.classList.remove('open');
    }
  });
  $('#submit-theory').addEventListener('click', evaluateTheory);
  $('#solve-close').addEventListener('click', () => closeModal($('#solve-overlay')));

  // التلميحات
  $('#hint-btn').addEventListener('click', requestHint);

  // بحث وفلترة الأدلة
  $('#evidence-search').addEventListener('input', applyEvidenceFilter);
  $('#evidence-filter').addEventListener('change', applyEvidenceFilter);

  // لوحة الربط
  $('#connect-btn').addEventListener('click', toggleLinkMode);
  $$('.board-card[data-card-id]').forEach(card => card.addEventListener('click', () => handleBoardCardClick(card)));
  $$('#link-type-picker .type-btn').forEach(btn => btn.addEventListener('click', () => confirmLinkType(btn.dataset.type)));
  window.addEventListener('resize', () => drawUserLinks());

  // الخط الزمني
  $('#add-event').addEventListener('click', () => openModal($('#event-modal')));
  $('#save-event').addEventListener('click', saveTimelineEvent);

  // الإشعارات
  $('#notif-btn').addEventListener('click', e => { e.stopPropagation(); toggleNotifications(); });
  document.addEventListener('click', e => {
    const panel = $('#notif-panel');
    if(panel && panel.classList.contains('open') && !panel.contains(e.target) && e.target.id !== 'notif-btn'){
      panel.classList.remove('open');
    }
  });
  $('#notif-clear').addEventListener('click', () => {
    state.notifications = [];
    saveState();
    renderNotifications();
  });

  // الإعدادات (زر القائمة الجانبية + زر الشريط العلوي للموبايل)
  $$('.open-settings-btn').forEach(btn => btn.addEventListener('click', () => openModal($('#settings-modal'))));
  $('#setting-motion').addEventListener('change', e => { state.motion = e.target.checked; saveState(); document.body.classList.toggle('no-motion', !state.motion); });
  $('#setting-sound').addEventListener('change', e => { state.sound = e.target.checked; saveState(); if(state.sound) playSound('click'); });
  $('#reset-progress').addEventListener('click', () => {
    if(confirm('هل أنت متأكد من إعادة تعيين كل تقدمك في هذه القضية؟ لا يمكن التراجع عن هذا الإجراء.')){
      localStorage.removeItem(STORAGE_KEY);
      state = {...defaultState};
      saveState();
      toast('تمت إعادة تعيين التقدم.');
      location.reload();
    }
  });

  // أرشيف القضايا
  $$('.case-row[data-case-state]').forEach(row => {
    row.addEventListener('click', () => {
      const rowState = row.dataset.caseState;
      if(rowState === 'active' && row.dataset.view){ showView(row.dataset.view); }
      else if(rowState === 'solved'){ toast('القضية #026 محلولة مسبقًا — سجل الحل متاح في أرشيفك.'); }
      else if(rowState === 'locked'){ toast('هذه القضية مقفلة. أكمل القضية الحالية #027 لفتحها.'); }
    });
  });
}

/* ---------- التشغيل ---------- */
renderLiveDate();
populateEvidenceFilter();
renderEvidence();
renderSuspects();
renderTimeline();
renderNotifications();
bindEvents();
restoreProgressUI();
startSessionTimer();
