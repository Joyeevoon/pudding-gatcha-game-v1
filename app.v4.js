// ===== 奖品数据（已逐张核对：明信片5 / 立牌7 / 毛绒玩偶6 / 吧唧5，共23） =====
// 图片文件名按用户上传原名保留，不做修改
// 标价：明信片40 / 立牌55 / 毛绒玩偶89 / 吧唧25；霜糖作者大大玩偶为非卖品标价 99999999999
const prices = {
  "明信片": 40,
  "立牌": 55,
  "毛绒玩偶": 89,
  "吧唧": 25,
};
const prizes = [
  // 明信片（5）
  { id: 1,  name: "夜莺明信片",          type: "明信片", image: "assets/postcard-nightingale-min.png",         claimed: false },
  { id: 2,  name: "黑巧甜心派明信片",    type: "明信片", image: "assets/postcard-kuro-min.png",  claimed: false },
  { id: 3,  name: "布丁明信片",          type: "明信片", image: "assets/postcard-pudding-min.png",         claimed: false },
  { id: 4,  name: "霜糖琉璃明信片",      type: "明信片", image: "assets/postcard-ruri-min.png",     claimed: false },
  { id: 5,  name: "太妃糖伯爵明信片",    type: "明信片", image: "assets/postcard-toffee-min.png",   claimed: false },
  // 立牌（7）
  { id: 6,  name: "布丁立牌",            type: "立牌", image: "assets/stand-pudding-min.png",           claimed: false },
  { id: 7,  name: "莉莉丝立牌",          type: "立牌", image: "assets/stand-lilith-min.png",         claimed: false },
  { id: 8,  name: "冰糕立牌",            type: "立牌", image: "assets/stand-icecake-min.png",           claimed: false },
  { id: 9,  name: "夜莺立牌",            type: "立牌", image: "assets/stand-nightingale-min.png",           claimed: false },
  { id: 10, name: "太妃糖伯爵立牌",      type: "立牌", image: "assets/stand-toffee-min.png",     claimed: false },
  { id: 11, name: "霜糖琉璃立牌",        type: "立牌", image: "assets/stand-ruri-min.png",       claimed: false },
  { id: 12, name: "黑巧甜心派立牌",      type: "立牌", image: "assets/stand-kuro-min.png",     claimed: false },
  // 毛绒玩偶（6）
  { id: 13, name: "白巧 艾德姆毛绒玩偶", type: "毛绒玩偶", image: "assets/plush-shiroi-min.png", claimed: false },
  { id: 14, name: "霜糖作者大大玩偶",    type: "毛绒玩偶", image: "assets/plush-author-min.png",    price: 99999999999, claimed: false },
  { id: 15, name: "霜糖琉璃毛绒玩偶",    type: "毛绒玩偶", image: "assets/plush-ruri-min.png",    claimed: false },
  { id: 16, name: "黑巧甜心派玩偶",      type: "毛绒玩偶", image: "assets/plush-kuro-min.png",      claimed: false },
  { id: 17, name: "布丁毛绒玩偶",        type: "毛绒玩偶", image: "assets/plush-pudding-min.png",        claimed: false },
  { id: 18, name: "太妃糖伯爵毛绒玩偶",  type: "毛绒玩偶", image: "assets/plush-toffee-min.png",  claimed: false },
  // 吧唧（5）
  { id: 19, name: "霜糖琉璃吧唧",        type: "吧唧", image: "assets/badge-ruri-min.png",       claimed: false },
  { id: 20, name: "黑巧甜心派吧唧",      type: "吧唧", image: "assets/badge-kuro-min.png",     claimed: false },
  { id: 21, name: "布丁吧唧",            type: "吧唧", image: "assets/badge-pudding-min.png",           claimed: false },
  { id: 22, name: "太妃糖伯爵吧唧",      type: "吧唧", image: "assets/badge-toffee-min.png",     claimed: false },
  { id: 23, name: "夜莺吧唧",            type: "吧唧", image: "assets/badge-nightingale-min.png",           claimed: false },
];

// 给普通奖品按类型补上默认价（init 里执行一次）
function applyDefaultPrices() {
  prizes.forEach(p => { if (p.price == null) p.price = prices[p.type] || 0; });
}

// ===== DOM =====
const mainPage        = document.getElementById('main-page');
const warehousePage   = document.getElementById('warehouse-page');
const gachaBtn        = document.getElementById('gacha-btn');
const warehouseBtn    = document.getElementById('warehouse-btn');
const warehouseBadge  = document.getElementById('warehouse-badge');
const backBtn         = document.getElementById('back-btn');
const machineImg      = document.getElementById('machine-img');
const sparkleLayer    = document.getElementById('sparkle-layer');
const prizeOverlay    = document.getElementById('prize-overlay');
const prizeImg        = document.getElementById('prize-img');
const prizeNameEl     = document.getElementById('prize-name');
const prizePriceEl    = document.getElementById('prize-price');
const claimBtn        = document.getElementById('claim-btn');
const prizeList       = document.getElementById('prize-list');
const progressText    = document.getElementById('progress-text');
const warehouseContent= document.getElementById('warehouse-content');
const warehouseTotal  = document.getElementById('warehouse-total');
const musicBtn        = document.getElementById('music-btn');
const bgm             = document.getElementById('bgm');

// ===== 状态 =====
let isAnimating = false;
let currentPrize = null;
let musicOn = false;

// ===== 初始化 =====
function init() {
  if (prizes.length !== 23) {
    console.error('奖品数量异常：', prizes.length, '应为 23');
  }
  applyDefaultPrices();
  injectBgCandies();
  renderPrizeList();
  updateProgress();
  updateWarehouseBadge();
  setupEventListeners();
  setupTilt();
  setupMusic();
}

// ===== 背景漂浮甜品（纯装饰，不可交互） =====
function injectBgCandies() {
  const layer = document.createElement('div');
  layer.className = 'candy-bg';
  // 两侧 + 顶部点缀，避开中央机身与底部奖品栏
  const spots = [
    { e: '🍓', x: 6,  y: 12 }, { e: '🍬', x: 88, y: 10 }, { e: '🧁', x: 8,  y: 34 },
    { e: '🍭', x: 91, y: 32 }, { e: '🍰', x: 5,  y: 62 }, { e: '🫧', x: 93, y: 60 },
    { e: '🍪', x: 12, y: 88 }, { e: '🍓', x: 87, y: 86 }, { e: '🍬', x: 78, y: 5  },
    { e: '🫧', x: 20, y: 4  },
  ];
  spots.forEach((c, i) => {
    const d = document.createElement('div');
    d.className = 'candy';
    d.textContent = c.e;
    d.style.left = c.x + '%';
    d.style.top = c.y + '%';
    d.style.setProperty('--dur', (7 + Math.random() * 5).toFixed(2) + 's');
    d.style.setProperty('--delay', (i * 0.7).toFixed(2) + 's');
    layer.appendChild(d);
  });
  document.body.prepend(layer);
}

// ===== 音乐 =====
let userPaused = false;

function setupMusic() {
  bgm.volume = 0.5;

  // 按钮状态始终反映真实播放状态
  bgm.addEventListener('play', () => { musicOn = true; updateMusicBtn(); });
  bgm.addEventListener('pause', () => { musicOn = false; updateMusicBtn(); });

  // 1. 页面打开直接尝试自动播放
  bgm.play().catch(() => {});

  // 2. 被浏览器拦截：任何首次交互（触屏/点击）自动带起音乐
  const resume = () => { if (!userPaused) bgm.play().catch(() => {}); };
  document.addEventListener('touchstart', resume, { passive: true });
  document.addEventListener('click', resume);

  // 3. 页面切回前台再试一次
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && !userPaused) bgm.play().catch(() => {});
  });

  updateMusicBtn();
}

function updateMusicBtn() {
  musicBtn.classList.toggle('off', !musicOn);
}

function toggleMusic() {
  if (musicOn) {
    bgm.pause();
    userPaused = true;      // 用户主动关闭，不再自动拉起
  } else {
    bgm.play().catch(() => {});
    userPaused = false;
  }
}

// ===== 奖品预览列表 =====
function renderPrizeList() {
  prizeList.innerHTML = '';
  prizes.forEach(prize => {
    const item = document.createElement('div');
    item.className = `prize-item ${prize.claimed ? 'claimed' : ''}`;
    item.dataset.id = prize.id;

    const img = document.createElement('img');
    img.src = prize.image;
    img.alt = prize.name;
    img.draggable = false;

    const name = document.createElement('div');
    name.className = 'prize-item-name';
    name.textContent = prize.name;

    const price = document.createElement('div');
    price.className = 'prize-item-price';
    price.textContent = `¥${Number(prize.price).toLocaleString('zh-CN')}`;

    item.append(img, name, price);
    prizeList.appendChild(item);
  });
}

function updateProgress() {
  const claimed = prizes.filter(p => p.claimed).length;
  progressText.textContent = `${claimed} / ${prizes.length}`;
}

// ===== 仓库徽章 =====
function updateWarehouseBadge() {
  const count = prizes.filter(p => p.claimed).length;
  if (count > 0) {
    warehouseBadge.textContent = count;
    warehouseBadge.classList.remove('hidden');
  } else {
    warehouseBadge.classList.add('hidden');
  }
}

// ===== 抽奖 =====
async function performGacha() {
  if (isAnimating) return;
  const available = prizes.filter(p => !p.claimed);
  if (available.length === 0) return;

  isAnimating = true;
  gachaBtn.disabled = true;

  // 1. 摇晃 + 闪光
  startSparkle();
  machineImg.classList.add('shaking');
  await sleep(1750);
  machineImg.classList.remove('shaking');
  stopSparkle();

  // 2. 随机出奖（不立即标记，等"收下"）
  const idx = Math.floor(Math.random() * available.length);
  currentPrize = available[idx];

  // 3. 遮罩 + 奖品展示（3D 浮动挂在这张图上）
  prizeImg.src = currentPrize.image;
  prizeNameEl.textContent = currentPrize.name;
  prizePriceEl.innerHTML = `<span class="rmb">¥</span>${Number(currentPrize.price).toLocaleString('zh-CN')}`;
  prizeOverlay.classList.remove('hidden');
  // 重新触发入场动画
  prizeImg.style.animation = 'none';
  void prizeImg.offsetHeight;
  prizeImg.style.animation = '';
}

// ===== 收下 =====
async function claimPrize() {
  if (!currentPrize) return;

  currentPrize.claimed = true;
  prizeOverlay.classList.add('hidden');
  currentPrize = null;

  renderPrizeList();
  updateProgress();
  updateWarehouseBadge();

  if (prizes.filter(p => !p.claimed).length === 0) {
    gachaBtn.textContent = '奖品已抽完';
    gachaBtn.disabled = true;
  } else {
    gachaBtn.disabled = false;
  }
  isAnimating = false;
}

// ===== 摇晃闪光 =====
function startSparkle() {
  sparkleLayer.innerHTML = '';
  const positions = [
    [8, 12], [30, 6], [55, 10], [78, 16], [92, 40],
    [85, 70], [60, 85], [35, 80], [12, 55], [45, 45], [70, 55], [22, 35]
  ];
  positions.forEach(([x, y], i) => {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = x + '%';
    s.style.top = y + '%';
    s.style.setProperty('--dur', (0.7 + Math.random() * 0.5).toFixed(2) + 's');
    s.style.setProperty('--delay', (i * 0.12).toFixed(2) + 's');
    s.style.width = s.style.height = (10 + Math.random() * 8) + 'px';
    sparkleLayer.appendChild(s);
  });
  sparkleLayer.classList.add('active');
}

function stopSparkle() {
  sparkleLayer.classList.remove('active');
  sparkleLayer.innerHTML = '';
}

// ===== 仓库 =====
function renderWarehouse() {
  const claimed = prizes.filter(p => p.claimed);
  if (claimed.length === 0) {
    warehouseContent.innerHTML = '<div class="warehouse-empty">还没有抽到任何奖品哦</div>';
    warehouseTotal.textContent = '';
    return;
  }

  warehouseContent.innerHTML = '';
  claimed.forEach(prize => {
    const item = document.createElement('div');
    item.className = 'warehouse-item';
    item.dataset.prizeId = prize.id;

    const box = document.createElement('div');
    box.className = 'img-box';
    const img = document.createElement('img');
    img.src = prize.image;
    img.alt = prize.name;
    img.draggable = false;
    box.appendChild(img);

    const name = document.createElement('div');
    name.className = 'warehouse-item-name';
    name.textContent = prize.name;

    const price = document.createElement('div');
    price.className = 'warehouse-item-price';
    price.textContent = `¥${Number(prize.price).toLocaleString('zh-CN')}`;

    item.append(box, name, price);
    warehouseContent.appendChild(item);
  });
  const total = claimed.reduce((sum, p) => sum + Number(p.price), 0);
  warehouseTotal.textContent = `合计 ¥${total.toLocaleString('zh-CN')}`;
  bindTiltTargets();   // 重新绑定并立即应用当前角度
}

// ===== 页面切换 =====
function showMainPage() {
  mainPage.classList.add('active');
  warehousePage.classList.remove('active');
  window.scrollTo(0, 0);
}

function showWarehousePage() {
  mainPage.classList.remove('active');
  warehousePage.classList.add('active');
  renderWarehouse();
  window.scrollTo(0, 0);
}

// ===== 3D 浮动：陀螺仪（手机）+ 鼠标（网页端）+ 触摸拖动兜底 =====
let tiltTargets = [];   // 当前要应用 3D 的元素
let curRx = 0, curRy = 0;

function setupTilt() {
  // —— 手机陀螺仪 ——
  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+：必须在用户点击手势内同步请求，弹出底部按钮让用户点
      showTiltPermissionBtn();
    } else {
      // Android：直接监听
      window.addEventListener('deviceorientation', onOrient);
      tiltOn = true;
    }
  }

  // —— 网页端鼠标 ——
  window.addEventListener('mousemove', (e) => {
    if (gyroLive && isMobileLike()) return;   // 陀螺仪真正出数据后才在手机上忽略鼠标
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    setTilt(-ny * TILT_MAX, nx * TILT_MAX);
  });

  // —— 手机拖动兜底（网页模式浏览器里也能玩） ——
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const nx = (t.clientX / window.innerWidth) * 2 - 1;
    const ny = (t.clientY / window.innerHeight) * 2 - 1;
    setTilt(-ny * TILT_MAX, nx * TILT_MAX);
  }, { passive: true });
}

const TILT_MAX = 25;      // 最大摆角（度），想更夸张改这里
let tiltOn = false;       // 陀螺仪监听已挂载
let gyroLive = false;     // 真正收到过陀螺仪事件才置真（防止触屏桌面端没有传感器时卡死）
let lastBeta = 45, lastGamma = 0;

function isMobileLike() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function showTiltPermissionBtn() {
  const btn = document.getElementById('tilt-permission-btn');
  btn.classList.remove('hidden');
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    try {
      const res = await DeviceOrientationEvent.requestPermission();
      if (res === 'granted') {
        window.addEventListener('deviceorientation', onOrient);
        tiltOn = true;
        btn.textContent = '✓ 体感已开启';
        setTimeout(() => btn.classList.add('hidden'), 1200);
      } else {
        btn.textContent = '被拒绝，可用手指拖动代替';
        setTimeout(() => btn.classList.add('hidden'), 2000);
      }
    } catch (err) {
      btn.textContent = '此设备不支持，可拖动代替';
      setTimeout(() => btn.classList.add('hidden'), 2000);
    }
  }, { once: true });
}

function onOrient(ev) {
  // iPhone 竖屏握持 beta≈45-90，以自然握持角为中心，前后左右 ±30° 满幅映射到 ±TILT_MAX
  gyroLive = true;
  const beta  = (ev.beta  != null) ? ev.beta  : lastBeta;
  const gamma = (ev.gamma != null) ? ev.gamma : lastGamma;
  lastBeta = beta; lastGamma = gamma;
  const cBeta  = Math.max(-30, Math.min(30, beta - 45));
  const cGamma = Math.max(-30, Math.min(30, gamma));
  setTilt(-cBeta * (TILT_MAX / 30), cGamma * (TILT_MAX / 30));
}

function setTilt(rx, ry) {
  curRx = rx; curRy = ry;
  applyTilt();
}

function applyTilt() {
  tiltTargets.forEach(el => {
    el.style.transform = `rotateX(${curRx.toFixed(2)}deg) rotateY(${curRy.toFixed(2)}deg)`;
  });
}

// 出奖时挂到奖品大图；绑完立即应用当前角度
function bindTiltTargets() {
  const t = [];
  if (!prizeOverlay.classList.contains('hidden')) {
    t.push(prizeImg);
  }
  tiltTargets = t;
  applyTilt();
}

// 遮罩出现/消失时自动刷新 3D 绑定
const tiltMO = new MutationObserver(bindTiltTargets);
tiltMO.observe(prizeOverlay, { attributes: true, attributeFilter: ['class'] });

// ===== 事件 =====
let lastTapTs = 0;
function isDoubleTap(e) {
  const now = Date.now();
  const gap = now - lastTapTs;
  lastTapTs = now;
  // 300ms 内的快速连点：可能是双击缩放手势的另一半，忽略
  return gap < 300;
}

function setupEventListeners() {
  gachaBtn.addEventListener('click', performGacha);
  claimBtn.addEventListener('click', claimPrize);
  warehouseBtn.addEventListener('click', showWarehousePage);
  backBtn.addEventListener('click', showMainPage);
  musicBtn.addEventListener('click', toggleMusic);
  // 双击缩放防线：双击零放大（配合 CSS touch-action: manipulation）
  document.addEventListener('dblclick', e => e.preventDefault());
}

// ===== 工具 =====
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ===== 启动 =====
init();
