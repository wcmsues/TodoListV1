/* ============================================================
   卡片待办清单 — 逻辑
   1. 图标库  2. 工具函数  3. 状态  4. 默认数据  5. 持久化
   6. 查询  7. 导航  8. 渲染  9. Sheet  10. 编辑页
   11. 数据操作  12. 事件  13. 表单  14. 拖拽  15. 导入导出  16. 启动
   ============================================================ */

(function(){
'use strict';

/* ============================================================
   1. 图标库（内联 SVG，分组）
   ============================================================ */
const ICONS = {
  list:'<path d="M8.5 6h12M8.5 12h12M8.5 18h12"/><circle cx="3.8" cy="6" r="1.3"/><circle cx="3.8" cy="12" r="1.3"/><circle cx="3.8" cy="18" r="1.3"/>',
  inbox:'<path d="M3.5 12.5h4l1.6 2.6h5.8l1.6-2.6h4"/><path d="M4.8 5.5h14.4L21 12.5v6.2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.2z"/>',
  checkCircle:'<circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.4l2.6 2.6 5-5.2"/>',
  calendar:'<rect x="3.6" y="5" width="16.8" height="15.4" rx="3.2"/><path d="M8 3v3.4M16 3v3.4M3.6 10h16.8"/>',
  clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.4v5l3.2 1.9"/>',
  bell:'<path d="M6.2 9.4a5.8 5.8 0 1 1 11.6 0c0 4 1.5 5.4 1.5 5.4H4.7s1.5-1.4 1.5-5.4z"/><path d="M9.9 17.8a2.2 2.2 0 0 0 4.2 0"/>',
  folder:'<path d="M3.4 8.2a2 2 0 0 1 2-2h3.4l2 2.6h7.8a2 2 0 0 1 2 2v7.4a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z"/>',
  box:'<path d="M3.4 8.4h17.2v9.2a2 2 0 0 1-2 2H5.4a2 2 0 0 1-2-2z"/><path d="M3.4 8.4L5.6 4.6h12.8l2.2 3.8"/><path d="M9.4 12.4h5.2"/>',
  tag:'<path d="M20.3 13.1l-7.4 7.4a2 2 0 0 1-2.8 0l-7.4-7.4a2 2 0 0 1-.6-1.4V5.4a2 2 0 0 1 2-2h6.3a2 2 0 0 1 1.4.6l8.5 6.3a2 2 0 0 1 0 2.8z"/><circle cx="8.2" cy="8.2" r="1.4"/>',
  heart:'<path d="M12 20s-7.6-4.6-7.6-9.4A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.6 3c0 4.8-7.6 9.4-7.6 9.4z"/>',
  flag:'<path d="M5.4 20V4.6h9.2l-.8 2.6 5 0v7.4H6.6"/>',
  bookmark:'<path d="M6.4 4.6h11.2v15.8L12 16.2l-5.6 4.2z"/>',
  star:'<path d="M12 3.4l2.7 5.5 6 .9-4.4 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.3 9.8l6-.9z"/>',
  pin:'<path d="M9 3h6l-1 6 3.4 3.4H6.6L10 9z"/><path d="M12 12.4V21"/>',
  briefcase:'<rect x="3.2" y="7.2" width="17.6" height="12.6" rx="2.6"/><path d="M9 7.2V5.6A1.6 1.6 0 0 1 10.6 4h2.8A1.6 1.6 0 0 1 15 5.6v1.6"/><path d="M3.2 12.4h17.6"/>',
  building:'<rect x="4.4" y="3.4" width="9.6" height="17.2" rx="1.6"/><path d="M14 8.6h4.6a1 1 0 0 1 1 1v11"/><path d="M7.4 7.4h3.6M7.4 11.2h3.6M7.4 15h3.6"/>',
  bank:'<path d="M3.2 10.2L12 4.4l8.8 5.8"/><path d="M5.4 10.6v7.6M18.6 10.6v7.6M9.7 10.6v7.6M14.3 10.6v7.6"/><path d="M3.4 20.6h17.2"/>',
  monitor:'<rect x="3.2" y="4.4" width="17.6" height="11.6" rx="2.2"/><path d="M9 20.4h6M12 16v4.4"/>',
  laptop:'<rect x="4.4" y="5" width="15.2" height="10.2" rx="2"/><path d="M2.4 18.4h19.2"/>',
  keyboard:'<rect x="2.4" y="7" width="19.2" height="10" rx="2.6"/><path d="M6 11h1M10 11h1M14 11h1M18 11h1M7.4 14h9.2"/>',
  clipboard:'<rect x="5" y="4.4" width="14" height="16.6" rx="2.6"/><path d="M9.2 3h5.6v3.2H9.2z"/><path d="M9 10.4h6M9 14h4"/>',
  doc:'<path d="M6.2 3.4h7.4l4.2 4.2v12.4a1.6 1.6 0 0 1-1.6 1.6H7.8a1.6 1.6 0 0 1-1.6-1.6z"/><path d="M13.4 3.4v4.4h4.4"/><path d="M9 12.4h6M9 16h4"/>',
  note:'<rect x="4.4" y="4" width="15.2" height="16" rx="2.6"/><path d="M8 9h8M8 13h5"/>',
  clip:'<path d="M20.6 11.6l-8.8 8.8a5.4 5.4 0 0 1-7.6-7.6l8.8-8.8a3.6 3.6 0 0 1 5.1 5.1l-8.8 8.8a1.8 1.8 0 0 1-2.5-2.5l8-8"/>',
  mail:'<rect x="3.2" y="5.2" width="17.6" height="13.6" rx="2.6"/><path d="M3.8 7.4l8.2 5.8 8.2-5.8"/>',
  chart:'<path d="M4.6 20V11M10 20V4.6M15.4 20v-6.4M20.8 20H3"/>',
  trend:'<path d="M3.4 17l6-6 3.6 3.6L20.6 7"/><path d="M15.8 7h4.8v4.8"/>',
  book:'<path d="M12 6.4C10.4 5.1 8.4 4.4 6.4 4.4H3.6v13.9h3.2c2 0 3.6.6 5.2 1.5 1.6-.9 3.2-1.5 5.2-1.5h3.2V4.4h-2.8c-2 0-4 .7-5.6 2z"/><path d="M12 6.4v13.4"/>',
  notebook:'<rect x="5" y="3.4" width="14" height="17.2" rx="2.2"/><path d="M9 3.4v17.2"/><path d="M12 8.4h4M12 12.2h4"/>',
  pen:'<path d="M4.2 20.2l4.2-1 10.6-10.6a2.2 2.2 0 0 0-3.1-3.1L5.2 16z"/><path d="M14 6.6l3.4 3.4"/>',
  cap:'<path d="M2.4 9L12 5l9.6 4L12 13z"/><path d="M6.6 11.2v4.6c0 1.5 2.4 2.8 5.4 2.8s5.4-1.3 5.4-2.8v-4.6"/>',
  bulb:'<path d="M9.4 18h5.2M10.4 21h3.2"/><path d="M12 3.2a5.8 5.8 0 0 0-3.5 10.4c.5.4.8 1 .9 1.6h5.2c.1-.6.4-1.2.9-1.6A5.8 5.8 0 0 0 12 3.2z"/>',
  hourglass:'<path d="M7 3.4h10v3.2a5 5 0 0 1-10 0z"/><path d="M7 20.6h10v-3.2a5 5 0 0 0-10 0z"/><path d="M8.4 8.4h7.2"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.6"/><path d="M15.8 15.8L21 21"/>',
  globe:'<circle cx="12" cy="12" r="8.6"/><path d="M3.6 12h16.8"/><path d="M12 3.4c2.6 2.6 2.6 14.6 0 17.2M12 3.4c-2.6 2.6-2.6 14.6 0 17.2"/>',
  coffee:'<path d="M4 8.4h12v6.2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 9.4h2.4a2.4 2.4 0 0 1 0 4.8H16"/><path d="M3.4 21h13.6"/>',
  cutlery:'<path d="M7 3.4v7.2a2 2 0 0 0 4 0V3.4"/><path d="M9 10.6v10"/><path d="M17 3.4c-1.6 1.2-2.2 3-2.2 5s.6 3 2.2 3v9.2"/>',
  cart:'<path d="M3 4.4h2.2l2.6 10.8h9.6L19.8 7H6"/><circle cx="9.4" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  gift:'<rect x="3.4" y="9.2" width="17.2" height="11" rx="2"/><path d="M3.4 13.2h17.2M12 9.2v11"/><path d="M12 9.2S9.6 3.6 7.4 4.8 9.4 9.2 12 9.2zM12 9.2s2.4-5.6 4.6-4.4S14.6 9.2 12 9.2z"/>',
  wallet:'<rect x="3.4" y="6" width="17.2" height="13" rx="2.6"/><path d="M3.4 10.4h17.2"/><circle cx="16.6" cy="14.8" r="1.1"/>',
  home:'<path d="M4.2 10.2L12 4l7.8 6.2v8.8a1.6 1.6 0 0 1-1.6 1.6H5.8a1.6 1.6 0 0 1-1.6-1.6z"/><path d="M9.6 20.6v-5.8h4.8v5.8"/>',
  pill:'<rect x="3" y="9.4" width="18" height="5.6" rx="2.8" transform="rotate(-45 12 12.2)"/><path d="M8.6 8.6l6.8 6.8"/>',
  run:'<circle cx="14.6" cy="4.8" r="1.8"/><path d="M10.4 21l2.2-5.6-3-2.8 1-4 3 2.8 3.2 1"/><path d="M7.6 21l2.8-5"/>',
  plane:'<path d="M3 13.4l18-8.6-6.2 18.2-3-7z"/>',
  car:'<path d="M4 14l1.6-5.2A2 2 0 0 1 7.5 7.4h9a2 2 0 0 1 1.9 1.4L20 14"/><rect x="3" y="14" width="18" height="4.6" rx="2"/><circle cx="7.2" cy="18.8" r="1.3"/><circle cx="16.8" cy="18.8" r="1.3"/>',
  clapper:'<path d="M3.2 9.4h17.6v9.2a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2z"/><path d="M3.2 9.4l1.7-4.2 14.8 3.2-.9 1z"/><path d="M8.6 5.9l1.4 2.4M13.6 7l1.4 2.4"/>',
  music:'<path d="M9.2 18V6.4l10-2v11.2"/><circle cx="6.6" cy="18" r="2.6"/><circle cx="16.6" cy="16.4" r="2.6"/>',
  camera:'<rect x="3.2" y="7.2" width="17.6" height="12.6" rx="2.6"/><circle cx="12" cy="13.4" r="3.4"/><path d="M9 7.2l1.4-2.4h3.2L15 7.2"/>',
  gamepad:'<rect x="2.4" y="8.2" width="19.2" height="8.6" rx="4.3"/><path d="M7 12.5h3M8.5 11v3"/><circle cx="16" cy="11.8" r="1"/><circle cx="18.2" cy="14" r="1"/>',
  mic:'<rect x="9.2" y="3" width="5.6" height="10.6" rx="2.8"/><path d="M5.4 11.4a6.6 6.6 0 0 0 13.2 0"/><path d="M12 18v3"/>',
  ball:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2l3.6 2.6-1.4 4.2H9.8L8.4 9.8z"/>',
  megaphone:'<path d="M3.4 10.4v3.4a1 1 0 0 0 1 1h2.2l4.4 4V5.4l-4.4 4H4.4a1 1 0 0 0-1 1z"/><path d="M15.4 8.8a5 5 0 0 1 0 6.4"/><path d="M18.4 6.2a9 9 0 0 1 0 11.6"/>',
  dots:'<circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/>',
  grip:'<circle cx="9" cy="7" r="1.3"/><circle cx="15" cy="7" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  minus:'<path d="M5 12h14"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  close:'<path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4"/>',
  arrowUp:'<path d="M12 19V5M6 11l6-6 6 6"/>',
  arrowDown:'<path d="M12 5v14M6 13l6 6 6-6"/>',
  sort:'<path d="M7 4v16M4 7l3-3 3 3M17 20V4M14 17l3 3 3-3"/>',
  trash:'<path d="M4.4 7h15.2M9.6 11v6.4M14.4 11v6.4"/><path d="M6.4 7l.9 12.4a1.4 1.4 0 0 0 1.4 1.3h6.6a1.4 1.4 0 0 0 1.4-1.3L18 7"/><path d="M9.4 7V4.4h5.2V7"/>',
  download:'<path d="M12 3.6v11.2M7.6 10.4L12 14.8l4.4-4.4"/><path d="M4.4 17v2a1.6 1.6 0 0 0 1.6 1.6h12a1.6 1.6 0 0 0 1.6-1.6v-2"/>',
  upload:'<path d="M12 15V3.8M7.6 8.2L12 3.8l4.4 4.4"/><path d="M4.4 17v2a1.6 1.6 0 0 0 1.6 1.6h12a1.6 1.6 0 0 0 1.6-1.6v-2"/>'
};

const ICON_GROUPS = [
  { label:'常用', items:['list','inbox','checkCircle','calendar','clock','bell','folder','box','tag','heart','flag','bookmark','pin'] },
  { label:'工作', items:['briefcase','building','bank','monitor','laptop','keyboard','clipboard','doc','note','clip','mail','chart','trend'] },
  { label:'学习', items:['book','notebook','pen','cap','bulb','hourglass','search','globe'] },
  { label:'生活', items:['coffee','cutlery','cart','gift','wallet','home','pill','run','plane','car'] },
  { label:'娱乐', items:['clapper','music','camera','gamepad','mic','ball'] }
];

/* ============================================================
   2. 常量与工具
   ============================================================ */
const KEY = 'todolist.v2';
const UIKEY = 'todolist.v2.ui';
const LEGACY = 'todolist.v1';
const PALETTE = ['#4A78B5','#A34E4E','#E08A3C','#C9A227','#5FB35F','#8FC24A','#3FB6C4',
                 '#2E7C8F','#3B82F6','#4F5BD5','#9B4FBF','#E8505B','#8B6B4A','#4B4F54'];

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
function svg(name, cls){
  const body = ICONS[name] || ICONS.list;
  return '<svg viewBox="0 0 24 24"' + (cls ? ' class="' + cls + '"' : '') + '>' + body + '</svg>';
}
function hexRgba(hex, a){
  let h = String(hex || '#888888').replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16) || 0;
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}
const pad2 = n => (n < 10 ? '0' : '') + n;
const toISO = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
const todayISO = () => toISO(new Date());
function isoOffset(n){ const d = new Date(); d.setDate(d.getDate() + n); return toISO(d); }
function parseISO(iso){ const p = String(iso).split('-'); return new Date(+p[0], (+p[1]) - 1, +p[2]); }
function fmtDate(iso){
  if (!iso) return '';
  const d = parseISO(iso);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return (sameYear ? '' : d.getFullYear() + '年') + (d.getMonth() + 1) + '月' + d.getDate() + '日';
}
const yearOf = iso => (iso ? String(iso).slice(0, 4) : '');
const isOverdue = t => !!t.date && !t.done && t.date < todayISO();

/* ============================================================
   3. 状态
   ============================================================ */
let DB = { version:2, lists:[], tags:[], todos:[] };
let UI = { tab:'home', cols:2, doneList:'all', doneYear:'all', editing:false, sorting:false, hideEmpty:false,
           calRange:'week', calHideDone:false };
let stack = [{ name:'root', params:{} }];
let canHistory = true;
let SHEET = null;
let EDIT = null;
let dragState = null;
let suppressClickUntil = 0;

/* ============================================================
   4. 默认数据
   ============================================================ */
function seed(){
  const L = [
    { id:'l1', name:'工作', icon:'clipboard', color:PALETTE[10] },
    { id:'l2', name:'学习', icon:'cap',       color:PALETTE[6] },
    { id:'l3', name:'生活', icon:'home',      color:PALETTE[4] },
    { id:'l4', name:'购物', icon:'cart',      color:PALETTE[12] },
    { id:'l5', name:'电影', icon:'clapper',   color:PALETTE[2] }
  ];
  /* 日期用相对今天的偏移，保证任何时候打开都能看到
     今日 / 本周 / 本月 / 逾期 / 无日期 / 已完成 等状态 */
  const T = [
    /* 工作：置顶、今天、逾期、本周、本月、无日期、已完成 */
    { list:'l1', title:'写本周周报', date:isoOffset(0), time:'10:00', progress:60,
      note:'汇总进度、风险与下周计划' },
    { list:'l1', title:'回复客户需求邮件', date:isoOffset(-1), time:'09:30' },
    { list:'l1', title:'整理产品需求文档', progress:35,
      note:'先补充核心流程与边界情况' },
    { list:'l1', title:'准备下周评审材料', date:isoOffset(4), time:'14:00', starred:true },
    { list:'l1', title:'提交季度预算表', date:isoOffset(10), time:'11:00' },
    { list:'l1', title:'提交上月报销单', date:isoOffset(-2), done:true, doneAt:isoOffset(-1) },

    /* 学习 */
    { list:'l2', title:'读完《深度工作》第 3 章', progress:45,
      note:'每天 20 页，读完写三句总结' },
    { list:'l2', title:'英语听力练习 30 分钟', date:isoOffset(0), time:'20:00' },
    { list:'l2', title:'整理笔记到知识库', date:isoOffset(3), time:'21:00', progress:20,
      note:'按主题归档，补上标签页目录' },
    { list:'l2', title:'完成 CSS 布局课程', date:isoOffset(-4), done:true, doneAt:isoOffset(-3) },

    /* 生活 */
    { list:'l3', title:'缴纳水电费', date:isoOffset(-1), time:'20:00',
      note:'月底前缴清，避免滞纳金' },
    { list:'l3', title:'预约一次牙医', date:isoOffset(2), time:'09:30' },
    { list:'l3', title:'周末大扫除', date:isoOffset(5), time:'15:00',
      note:'厨房、卫生间、阳台三个区域' },
    { list:'l3', title:'预约年度体检', date:isoOffset(12), time:'10:30' },
    { list:'l3', title:'换洗床单被套', date:isoOffset(0), done:true, doneAt:isoOffset(0) },

    /* 购物 */
    { list:'l4', title:'买牛奶和鸡蛋', date:isoOffset(0), time:'18:30' },
    { list:'l4', title:'买一个收纳盒' },
    { list:'l4', title:'补货洗衣液', date:isoOffset(7) },
    { list:'l4', title:'买酱油', date:isoOffset(-3), done:true, doneAt:isoOffset(-2) },

    /* 电影 */
    { list:'l5', title:'看《星际穿越》', date:isoOffset(6), time:'19:30' },
    { list:'l5', title:'看《让子弹飞》', note:'周末和朋友一起看' },
    { list:'l5', title:'看《肖申克的救赎》', date:isoOffset(-380), done:true, doneAt:isoOffset(-366) }
  ];
  const todos = T.map((o, i) => ({
    id: 's' + (i + 1),
    listId: o.list,
    title: o.title,
    date: o.date || '',
    time: o.time || '',
    note: o.note || '',
    progress: o.progress || 0,
    starred: !!o.starred,
    done: !!o.done,
    doneAt: o.doneAt || '',
    createdAt: Date.now() - (T.length - i) * 60000
  }));
  return { version:2, lists:L, tags:[], todos };
}

function normalizeDB(raw){
  const out = { version:2, lists:[], tags:[], todos:[] };
  if (!raw || typeof raw !== 'object') return out;
  (Array.isArray(raw.lists) ? raw.lists : []).forEach(l => {
    if (!l || typeof l !== 'object') return;
    out.lists.push({
      id: l.id || uid(),
      name: String(l.name || '未命名').slice(0, 40),
      icon: ICONS[l.icon] ? l.icon : 'list',
      color: /^#[0-9a-fA-F]{3,8}$/.test(l.color || '') ? l.color : PALETTE[0]
    });
  });
  const listIds = out.lists.map(l => l.id);
  (Array.isArray(raw.todos) ? raw.todos : []).forEach(t => {
    if (!t || typeof t !== 'object') return;
    const title = String(t.title || t.text || t.content || '').trim();
    if (!title) return;
    out.todos.push({
      id: t.id || uid(),
      listId: listIds.indexOf(t.listId) >= 0 ? t.listId : (listIds[0] || ''),
      title: title.slice(0, 200),
      date: /^\d{4}-\d{2}-\d{2}$/.test(t.date || '') ? t.date : '',
      time: /^([01]\d|2[0-3]):[0-5]\d$/.test(t.time || '') ? t.time : '',
      note: typeof t.note === 'string' ? t.note.slice(0, 500) : '',
      progress: Math.max(0, Math.min(100, Math.round(Number(t.progress) || 0))),
      starred: !!t.starred,
      done: !!t.done,
      doneAt: /^\d{4}-\d{2}-\d{2}$/.test(t.doneAt || '') ? t.doneAt : (t.done ? todayISO() : ''),
      createdAt: Number(t.createdAt) || Date.now()
    });
  });
  return out;
}

function migrateLegacy(){
  try {
    const raw = localStorage.getItem(LEGACY);
    if (!raw) return null;
    let arr = JSON.parse(raw);
    if (!Array.isArray(arr)) arr = (arr && (arr.todos || arr.items)) || [];
    const items = arr.filter(t => t && String(t.title || '').trim());
    if (!items.length) return null;
    if (!DB.lists.length) DB.lists.push({ id:'l1', name:'收集箱', icon:'box', color:PALETTE[0] });
    const lid = DB.lists[0].id;
    items.forEach(t => {
      DB.todos.push({
        id: uid(), listId: lid, title: String(t.title).trim().slice(0, 200),
        date:'', tags:[], done: !!t.done, doneAt: t.done ? todayISO() : '', createdAt: Date.now()
      });
    });
    return items.length;
  } catch (e) { return null; }
}

/* ============================================================
   5. 持久化
   ============================================================ */
let saveTimer = null;
function save(){
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  try {
    localStorage.setItem(KEY, JSON.stringify(DB));
    saveUI();
  } catch (e) { toast('保存失败：存储空间不足'); }
}
function saveDebounced(){
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 220);
}
function saveUI(){
  try {
    localStorage.setItem(UIKEY, JSON.stringify({
      cols: UI.cols, hideEmpty: !!UI.hideEmpty,
      calRange: UI.calRange, calHideDone: !!UI.calHideDone
    }));
  } catch (e) {}
}
function loadAll(){
  let data = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) data = normalizeDB(JSON.parse(raw));
  } catch (e) { console.warn('[todo] 本地数据损坏，已重置', e); }
  if (data) {
    DB = data;
  } else {
    // 首次打开保持空白，仅尝试迁移上一版数据
    DB = { version:2, lists:[], tags:[], todos:[] };
    const legacy = (function(){ try { return localStorage.getItem(LEGACY); } catch (e) { return null; } })();
    if (legacy) { migrateLegacy(); save(); }
  }
  try {
    const ui = JSON.parse(localStorage.getItem(UIKEY) || '{}');
    if (ui && ui.cols === 1) UI.cols = 1;
    if (ui && ui.hideEmpty === true) UI.hideEmpty = true;
    if (ui && (ui.calRange === 'day' || ui.calRange === 'week' || ui.calRange === 'month')) UI.calRange = ui.calRange;
    if (ui && ui.calHideDone === true) UI.calHideDone = true;
  } catch (e) {}
}

/* ============================================================
   6. 查询
   ============================================================ */
const findList = id => DB.lists.find(l => l.id === id);
const findTodo = id => DB.todos.find(t => t.id === id);
const openTodos = listId => DB.todos.filter(t => t.listId === listId && !t.done);

/* 与今日相差的天数（过去为负、未来为正），无日期返回 null */
function dayGap(iso){
  if (!iso) return null;
  const d = parseISO(iso);
  const n = new Date();
  const a = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const b = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
  return Math.round((a - b) / 86400000);
}
/* 排序：星标置顶 → 日期越接近今日越靠前 → 同距离时逾期优先 → 创建时间 */
function todoOrder(a, b){
  const sa = a.starred ? 1 : 0, sb = b.starred ? 1 : 0;
  if (sa !== sb) return sb - sa;
  const ga = dayGap(a.date), gb = dayGap(b.date);
  if (ga === null && gb === null) return (a.createdAt || 0) - (b.createdAt || 0);
  if (ga === null) return 1;
  if (gb === null) return -1;
  const da = Math.abs(ga), db = Math.abs(gb);
  if (da !== db) return da - db;
  if (ga !== gb) return ga - gb;
  // 同一天：有时间的在前，时间早的在前
  const ta = a.time || '', tb = b.time || '';
  if (ta !== tb) {
    if (!ta) return 1;
    if (!tb) return -1;
    return ta.localeCompare(tb);
  }
  return (a.createdAt || 0) - (b.createdAt || 0);
}
/* 列表内展示顺序：排序模式保留手动顺序，其余按日期 + 星标自动排列 */
function sortedOpenTodos(listId){
  const items = openTodos(listId);
  if (UI.sorting) return items;
  return items.slice().sort(todoOrder);
}
function todoColor(t, fallback){
  return fallback || PALETTE[0];
}
function noteHTML(t, cls){
  if (!t.note) return '';
  return '<div class="' + (cls || 'lc-note') + '">' + esc(t.note) + '</div>';
}
function progressHTML(t, color){
  if (t.done || !t.progress) return '';
  const p = Math.max(0, Math.min(100, t.progress));
  return '<div class="pbar-row"><div class="pbar"><i style="width:' + p + '%;background:' + color + '"></i></div>' +
    '<span class="pbar-num">' + p + '%</span></div>';
}
function metaHTML(t, cls){
  if (!t.date) return '';
  return '<div class="' + (cls || 'lc-meta') + '">' + svg('calendar') +
    '<span class="' + (isOverdue(t) ? 'is-overdue' : '') + '">' +
      fmtDate(t.date) + (t.time ? ' ' + t.time : '') + '</span></div>';
}

/* ============================================================
   7. 导航
   ============================================================ */
function current(){ return stack[stack.length - 1]; }
function push(name, params){
  stack.push({ name: name, params: params || {} });
  if (canHistory) {
    try { history.pushState({ i: stack.length }, ''); } catch (e) { canHistory = false; }
  }
  renderApp();
}
function back(){
  if (stack.length <= 1) return;
  if (canHistory) { history.back(); }
  else { stack.pop(); renderApp(); }
}
window.addEventListener('popstate', function(){
  if (stack.length > 1) stack.pop();
  renderApp();
});

function activateView(name){
  $$('.view').forEach(v => v.classList.toggle('is-active', v.dataset.view === name));
}

/* ============================================================
   8. 主渲染
   ============================================================ */
function renderApp(){
  const cur = current();
  let base = cur, sheetState = null;
  if (cur.name === 'sheet') {
    sheetState = cur;
    base = stack[stack.length - 2] || { name:'root', params:{} };
  }

  if (base.name === 'root') {
    if (UI.tab === 'done') { activateView('done'); renderDone(); }
    else if (UI.tab === 'calendar') { activateView('calendar'); renderCalendar(); }
    else { activateView('home'); renderHome(); }
    syncSegment();
  } else if (base.name === 'list') {
    activateView('list'); renderList(base.params.listId);
  } else if (base.name === 'editList') {
    activateView('editList'); renderEditList(base.params);
  }

  if (sheetState) renderSheet(sheetState.params);
  else hideSheet();
}

function syncSegment(){
  $$('.segment-item').forEach(b => b.classList.toggle('is-active', b.dataset.tab === UI.tab));
}

/* ---------- 首页 ---------- */
function renderHome(){
  const board = $('#board');
  // 默认展示所有列表；在设置里开启「隐藏空列表」后，只显示还有未完成待办的列表
  const lists = UI.hideEmpty
    ? DB.lists.filter(function(l){
        return DB.todos.some(function(t){ return t.listId === l.id && !t.done; });
      })
    : DB.lists;
  $('#homeEmpty').hidden = lists.length > 0;
  const hasLists = DB.lists.length > 0;
  const emptyTitle = $('#emptyTitle');
  const emptyHint = $('#emptyHint');
  if (emptyTitle) {
    emptyTitle.textContent = hasLists ? '暂时没有列表或列表为空' : '暂时没有列表，请添加列表';
  }
  if (emptyHint) {
    emptyHint.textContent = hasLists
      ? '新建一个列表，或到设置里关闭「隐藏空列表」'
      : '新建列表后，就可以往里面添加待办了';
  }
  if (!lists.length) { board.innerHTML = ''; return; }

  const cards = lists.map(listCardHTML);
  if (UI.cols === 1) {
    board.innerHTML = '<div class="board-col">' + cards.join('') + '</div>';
  } else {
    const left = [], right = [];
    cards.forEach((c, i) => (i % 2 === 0 ? left : right).push(c));
    board.innerHTML =
      '<div class="board-col">' + left.join('') + '</div>' +
      '<div class="board-col">' + right.join('') + '</div>';
  }
}

function listCardHTML(list){
  const all = DB.todos.filter(t => t.listId === list.id);
  const open = sortedOpenTodos(list.id);
  let items = open.map(t => cardItemHTML(t, list)).join('');
  if (!open.length) items = '<div class="lc-empty">暂无待办</div>';

  return '<article class="list-card" data-list="' + list.id + '">' +
    '<div class="lc-head" data-act="open-list" data-id="' + list.id + '" style="--c:' + list.color + '">' +
      svg(list.icon) +
      '<span class="lc-name">' + esc(list.name) + '</span>' +
      '<span class="lc-count">' + open.length + '/' + all.length + '</span>' +
      '<svg class="lc-arrow" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>' +
    '</div>' +
    '<div class="lc-body">' + items +
      '<button class="lc-add" data-act="add-todo" data-list="' + list.id + '" ' +
        'style="--c:' + list.color + ';--c-10:' + hexRgba(list.color, .1) + '">' +
        '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>添加待办</button>' +
    '</div></article>';
}

function cardItemHTML(t, list){
  const c = todoColor(t, list.color);
  return '<div class="lc-item">' +
    '<button class="lc-check" data-act="toggle" data-id="' + t.id + '" style="--c:' + c + '" aria-label="标记完成"></button>' +
    '<div class="lc-main" data-act="edit-todo" data-id="' + t.id + '">' +
      '<div class="lc-title">' + esc(t.title) + '</div>' +
      noteHTML(t) +
      progressHTML(t, c) +
      metaHTML(t) +
    '</div>' +
    starHTML(t) + '</div>';
}

function starHTML(t){
  return t.starred
    ? '<span class="star-mark" aria-label="已加星">' + svg('star') + '</span>'
    : '';
}

/* ---------- 日历 ---------- */
function calRangeBounds(range){
  const now = new Date();
  if (range === 'day') { const d = todayISO(); return { start: d, end: d }; }
  if (range === 'month') {
    return {
      start: toISO(new Date(now.getFullYear(), now.getMonth(), 1)),
      end: toISO(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    };
  }
  // 本周：周一到周日
  const wd = (now.getDay() + 6) % 7;
  const mon = new Date(now); mon.setDate(now.getDate() - wd);
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  return { start: toISO(mon), end: toISO(sun) };
}
const CAL_LABEL = { day:'今日', week:'本周', month:'本月' };

function calOrder(a, b){
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  if (!!a.done !== !!b.done) return a.done ? 1 : -1;
  const ta = a.time || '', tb = b.time || '';
  if (ta !== tb) {
    if (!ta) return 1;
    if (!tb) return -1;
    return ta.localeCompare(tb);
  }
  return (a.createdAt || 0) - (b.createdAt || 0);
}

function renderCalendar(){
  const range = UI.calRange;
  const bounds = calRangeBounds(range);
  const label = $('#calRangeLabel');
  if (label) label.textContent = CAL_LABEL[range];
  $$('#calRange .cal-range-item').forEach(b =>
    b.classList.toggle('is-active', b.dataset.range === range));
  const sw = $('#calHideSwitch');
  if (sw) sw.classList.toggle('is-on', !!UI.calHideDone);

  const items = DB.todos
    .filter(t => t.date && t.date >= bounds.start && t.date <= bounds.end)
    .filter(t => !(UI.calHideDone && t.done))
    .sort(calOrder);

  $('#calCount').textContent = items.length;

  const groups = [];
  let cur = null;
  items.forEach(t => {
    if (!cur || cur.date !== t.date) { cur = { date: t.date, items: [] }; groups.push(cur); }
    cur.items.push(t);
  });
  $('#calBody').innerHTML = groups.map(calDayHTML).join('');
  $('#calEmpty').hidden = items.length > 0;
  const emptyText = $('#calEmptyText');
  if (emptyText) {
    emptyText.textContent = UI.calHideDone ? '这段时间没有未完成的安排' : '这段时间没有安排';
  }
}

function calDayHTML(group){
  const d = parseISO(group.date);
  const wd = '日一二三四五六'[d.getDay()];
  const isToday = group.date === todayISO();
  return '<div class="cal-day">' +
    '<div class="cal-day-head">' +
      '<span class="cal-day-date' + (isToday ? ' is-today' : '') + '">' +
        (d.getMonth() + 1) + '月' + d.getDate() + '日</span>' +
      '<span class="cal-day-wd">周' + wd + (isToday ? ' · 今天' : '') + '</span>' +
      '<span class="cal-day-num">' + group.items.length + '</span>' +
    '</div>' +
    '<div class="cal-day-body">' + group.items.map(calItemHTML).join('') + '</div>' +
  '</div>';
}

function calItemHTML(t){
  const list = findList(t.listId);
  const color = list ? list.color : PALETTE[0];
  return '<div class="cal-item' + (t.done ? ' is-done' : '') + '" ' +
      'style="--c:' + color + ';background:' + hexRgba(color, .1) + '">' +
    '<span class="cal-stripe" style="background:' + color + '"></span>' +
    '<div class="cal-time">' + (t.time ? esc(t.time) : '全天') + '</div>' +
    '<div class="cal-main" data-act="edit-todo" data-id="' + t.id + '">' +
      '<div class="cal-title">' +
        (t.starred ? '<span class="cal-star" aria-label="已加星">' + svg('star') + '</span>' : '') +
        esc(t.title) + '</div>' +
      (t.note ? '<div class="cal-note">' + esc(t.note) + '</div>' : '') +
      (list ? '<div class="cal-list" style="color:' + color + '">' + svg(list.icon) + esc(list.name) + '</div>' : '') +
    '</div>' +
    '<button class="cal-check' + (t.done ? ' is-done' : '') + '" data-act="toggle" data-id="' + t.id + '" ' +
      'style="--c:' + color + '" aria-label="' + (t.done ? '恢复为未完成' : '标记完成') + '">' +
      '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></button>' +
  '</div>';
}

/* ---------- 已完成 ---------- */
function renderDone(){
  const chips = [];
  const allOn = UI.doneList === 'all';
  chips.push('<button class="chip' + (allOn ? ' is-active' : '') + '" data-act="done-filter" data-id="all" ' +
    'style="' + (allOn ? 'background:#0A84FF' : '') + '">' + svg('list') + '全部</button>');
  DB.lists.forEach(l => {
    const on = UI.doneList === l.id;
    chips.push('<button class="chip' + (on ? ' is-active' : '') + '" data-act="done-filter" data-id="' + l.id + '" ' +
      'style="' + (on ? 'background:' + l.color : 'color:' + l.color) + '">' + svg(l.icon) + esc(l.name) + '</button>');
  });
  $('#doneChips').innerHTML = chips.join('');

  $('#btnYearFilter').classList.toggle('is-active', UI.doneYear !== 'all');

  const items = DB.todos.filter(t =>
    t.done &&
    (UI.doneList === 'all' || t.listId === UI.doneList) &&
    (UI.doneYear === 'all' || yearOf(t.doneAt) === UI.doneYear)
  ).sort((a, b) => String(b.doneAt).localeCompare(String(a.doneAt)));

  $('#doneCount').textContent = items.length;
  const card = $('#doneCard');
  card.innerHTML = items.map(doneRowHTML).join('');
  card.style.display = items.length ? 'block' : 'none';
  $('#doneEmpty').hidden = items.length > 0;
}

function doneRowHTML(t){
  const list = findList(t.listId);
  return '<div class="todo-row" data-todo="' + t.id + '">' +
    '<button class="check is-done" data-act="toggle" data-id="' + t.id + '" aria-label="恢复为未完成">' +
      '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></button>' +
    '<div class="tr-main" data-act="edit-todo" data-id="' + t.id + '" style="padding-top:2px">' +
      '<div class="tr-meta" style="margin-top:0">' + svg('calendar') +
        '<span>' + fmtDate(t.doneAt || t.date) + '</span></div>' +
      '<div class="tr-title" style="margin-top:3px">' + esc(t.title) + '</div>' +
      noteHTML(t, 'tr-note') +
    '</div>' +
    '<div class="tr-side is-done-side">' +
      '<span class="tr-list-icon" style="color:var(--text2)">' +
        svg(list ? list.icon : 'list') + '</span>' +
      '<span class="tr-list-name">' + esc(list ? list.name : '') + '</span></div>' +
  '</div>';
}

/* ---------- 列表详情 ---------- */
function renderList(listId){
  const list = findList(listId);
  if (!list) { back(); return; }
  $('#listTitle').innerHTML =
    '<span class="nt-icon" style="color:' + list.color + '">' + svg(list.icon) + '</span>' +
    '<span>' + esc(list.name) + '</span>';

  const open = sortedOpenTodos(listId);
  $('#listCount').textContent = open.length;
  $('#sortHint').hidden = !UI.sorting;
  const card = $('#listCard');
  card.classList.toggle('is-sorting', UI.sorting);
  card.innerHTML = open.map((t, i) => listRowHTML(t, list, i, open.length)).join('');
  card.style.display = open.length ? 'block' : 'none';
  $('#listEmpty').hidden = open.length > 0;
}

function listRowHTML(t, list, i, total){
  const c = todoColor(t, list.color);
  return '<div class="todo-row' + (UI.sorting ? ' is-sorting' : '') + '" data-todo="' + t.id + '">' +
    '<button class="check" data-act="toggle" data-id="' + t.id + '" style="--c:' + c + '" aria-label="标记完成">' +
      '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></button>' +
    '<div class="tr-main" data-act="edit-todo" data-id="' + t.id + '">' +
      '<div class="tr-title">' + esc(t.title) + '</div>' +
      noteHTML(t, 'tr-note') +
      progressHTML(t, c) +
      metaHTML(t, 'tr-meta') +
      '<div class="tr-tools">' +
        '<button class="mini-btn" data-act="up" data-id="' + t.id + '"' + (i === 0 ? ' disabled' : '') + '>' + svg('arrowUp') + '</button>' +
        '<button class="mini-btn" data-act="down" data-id="' + t.id + '"' + (i === total - 1 ? ' disabled' : '') + '>' + svg('arrowDown') + '</button>' +
      '</div>' +
    '</div>' +
    starHTML(t) +
  '</div>';
}

/* ============================================================
   9. Sheet
   ============================================================ */
function grab(){ return '<div class="sheet-grab"></div>'; }

function renderSheet(p){
  const host = $('#sheetHost');
  const sheet = $('#sheet');
  host.hidden = false;

  if (p.kind === 'todo' && (!SHEET || SHEET._t !== p._t)) {
    const t = p.todoId ? findTodo(p.todoId) : null;
    let form;
    if (t) {
      form = {
        title: t.title, note: t.note || '', progress: t.progress || 0,
        date: t.date, time: t.time || '', listId: t.listId, starred: !!t.starred
      };
    } else {
      // 所属列表只能从已有列表里选，默认选中第一个
      const lid = (p.listId && findList(p.listId)) ? p.listId : ((DB.lists[0] && DB.lists[0].id) || '');
      form = { title:'', note:'', progress:0, date:'', time:'', listId: lid, starred:false };
    }
    SHEET = { _t: p._t, kind:'todo', todoId: p.todoId || null, form: form };
  }
  if (p.kind !== 'todo' && SHEET && SHEET.kind === 'todo' && SHEET._t !== p._t) SHEET = null;

  sheet.className = 'sheet' + (p.full ? ' is-full' : '') +
    (p.kind === 'settings' && UI.editing ? ' is-editing' : '');

  if (p.kind === 'settings') sheet.innerHTML = settingsHTML();
  else if (p.kind === 'todo') sheet.innerHTML = todoSheetHTML(p);
  else if (p.kind === 'todoView') sheet.innerHTML = todoViewHTML(p);
  else if (p.kind === 'year') sheet.innerHTML = yearSheetHTML();
  else if (p.kind === 'listMenu') sheet.innerHTML = listMenuHTML(p);
  else if (p.kind === 'import') sheet.innerHTML = importSheetHTML();

  // 新建待办时自动聚焦标题（每次打开只聚焦一次）
  if (p.kind === 'todo' && p._t !== focusToken) {
    focusToken = p._t;
    if (!SHEET.todoId) {
      setTimeout(function(){
        const el = $('#todoTitle');
        if (el) { try { el.focus({ preventScroll:true }); } catch (e) { el.focus(); } }
      }, 60);
    }
  }
}
let focusToken = null;

function hideSheet(){
  $('#sheetHost').hidden = true;
  $('#sheet').innerHTML = '';
  SHEET = null;
  DTP = null;
}

/* ---------- 设置面板 ---------- */
function settingsHTML(){
  const listRows = DB.lists.map(l => {
    const n = DB.todos.filter(t => t.listId === l.id).length;
    return gRow({
      id: l.id,
      attrs:'data-act="open-edit-list" data-id="' + l.id + '"',
      icon:l.icon, color:l.color, name:l.name, num:n,
      del:'data-act="del-list" data-id="' + l.id + '"',
      handle:true
    });
  }).join('') || '<div class="g-row"><div class="g-main" style="color:#C7C7CC;font-size:14px">暂无列表，点右上角 + 新建</div></div>';

  return grab() +
    '<div class="sheet-head">' +
      '<h2 class="sheet-title">设置</h2>' +
      '<button class="circle-btn" data-act="close-sheet" aria-label="关闭">' + svg('close') + '</button>' +
    '</div>' +
    '<div class="sheet-body">' +
      '<div class="group"><div class="group-head"><span>管理</span></div>' +
        '<div class="group-card">' +
          '<button class="menu-item" data-act="toggle-edit">' + svg('pen') +
            '<span>' + (UI.editing ? '完成编辑' : '编辑列表') + '</span></button>' +
          '<button class="menu-item" data-act="toggle-hide-empty">' + svg('list') +
            '<span>隐藏空列表</span>' +
            '<span class="switch' + (UI.hideEmpty ? ' is-on' : '') + '"></span></button>' +
        '</div></div>' +
      '<div class="group"><div class="group-head"><span>我的列表</span>' +
        '<button class="group-add" data-act="new-list" aria-label="新建列表">' + svg('plus') + '</button></div>' +
        '<div class="group-card" data-reorder="list">' + listRows + '</div></div>' +
      '<div class="group"><div class="group-head"><span>数据</span></div>' +
        '<div class="group-card">' +
          '<button class="menu-item" data-act="load-demo">' + svg('bulb') + '<span>加载示例数据</span></button>' +
          '<button class="menu-item" data-act="export">' + svg('download') + '<span>导出 JSON</span></button>' +
          '<button class="menu-item" data-act="import">' + svg('upload') + '<span>导入 JSON</span></button>' +
          '<button class="menu-item is-danger" data-act="reset-all">' + svg('trash') + '<span>清空所有数据</span></button>' +
        '</div></div>' +
    '</div>';
}

function gRow(o){
  return '<div class="g-row" data-id="' + (o.id || '') + '">' +
    (o.del ? '<button class="g-del" ' + o.del + ' aria-label="删除">' + svg('minus') + '</button>' : '') +
    '<div class="g-main" ' + o.attrs + '>' +
      '<span class="g-icon" style="--c:' + o.color + '">' + svg(o.icon) + '</span>' +
      '<span class="g-name">' + esc(o.name) + '</span>' +
      '<span class="g-num">' + o.num + '</span>' +
      '<svg class="g-arrow" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>' +
    '</div>' +
    (o.handle ? '<span class="g-handle" data-handle="1">' + svg('grip') + '</span>' : '') +
  '</div>';
}

/* ---------- 待办详情（点开待办后的操作面板） ---------- */
function todoViewHTML(p){
  const t = findTodo(p.todoId);
  const head = grab() +
    '<div class="sheet-head">' +
      '<h2 class="sheet-title">待办详情</h2>' +
      '<button class="circle-btn" data-act="close-sheet" aria-label="关闭">' + svg('close') + '</button>' +
    '</div>';

  if (!t) {
    return head + '<div class="sheet-body">' +
      '<div class="todo-detail"><div class="todo-detail-title">该待办已被删除</div></div>' +
      '</div>';
  }

  return head +
    '<div class="sheet-body">' +
      '<div class="todo-detail">' +
        '<div class="todo-detail-title' + (t.done ? ' is-done' : '') + '">' + esc(t.title) + '</div>' +
        '<div class="todo-detail-date">' + svg('calendar') +
          '<span class="' + (isOverdue(t) ? 'is-overdue' : '') + '">' +
            (t.date ? esc(fmtDate(t.date)) + (t.time ? ' ' + esc(t.time) : '') : '未设置日期') +
          '</span></div>' +
      '</div>' +
      '<div class="menu-card" style="margin-top:16px">' +
        '<button class="menu-item" data-act="todo-edit" data-id="' + t.id + '">' + svg('pen') +
          '<span>编辑这个待办</span></button>' +
        '<button class="menu-item is-danger" data-act="todo-remove" data-id="' + t.id + '">' + svg('trash') +
          '<span>删除这个待办</span></button>' +
      '</div>' +
    '</div>';
}

/* ---------- 待办编辑 ---------- */
function todoSheetHTML(p){
  const f = SHEET.form;
  const isNew = !SHEET.todoId;
  return grab() +
    '<div class="sheet-head">' +
      '<h2 class="sheet-title">' + (isNew ? '新建待办' : '编辑待办') + '</h2>' +
      '<button class="circle-btn" data-act="close-sheet" aria-label="关闭">' + svg('close') + '</button>' +
    '</div>' +
    '<div class="sheet-body">' +
      '<input class="title-field" id="todoTitle" placeholder="要做什么？" maxlength="120" value="' + esc(f.title) + '" />' +
      '<div class="field-label">备注</div>' +
      '<textarea class="note-field" id="todoNote" placeholder="补充说明、链接或参考…" maxlength="500">' + esc(f.note) + '</textarea>' +
      '<div class="field-label">日期</div>' +
      '<div id="dateRowHost">' + dateRowHTML() + '</div>' +
      '<div class="field-label">加星</div>' +
      '<div class="form-card"><button class="form-row star-row' + (f.starred ? ' is-on' : '') + '" data-act="toggle-star" ' +
        'role="switch" aria-checked="' + (f.starred ? 'true' : 'false') + '">' +
        svg('star', 'ri') +
        '<span class="lbl">是否置顶</span>' +
        '<span class="switch' + (f.starred ? ' is-on' : '') + '"></span></button></div>' +
      '<div class="field-label">进度</div>' +
      '<div class="form-card"><div class="progress-edit">' +
        '<input type="range" id="todoProgress" min="0" max="100" step="5" value="' + f.progress + '" style="--p:' + f.progress + '%" />' +
        '<span class="progress-val" id="progressVal">' + f.progress + '%</span>' +
      '</div></div>' +
      '<div class="field-label">所属列表</div>' +
      '<div class="form-card"><div class="picker" id="listPicker">' + listPickerHTML() + '</div></div>' +
      '<div class="sheet-actions">' +
        '<button class="ghost-btn" data-act="close-sheet">取消</button>' +
        '<button class="primary-btn" data-act="todo-save">' + (isNew ? '保存' : '保存修改') + '</button>' +
      '</div>' +
      '<div class="dp-host" id="dpHost"></div>' +
    '</div>';
}

/* ---------- 日期行（点击后由自定义选择器填写） ---------- */
function dateRowHTML(){
  const f = SHEET.form;
  const dateVal = f.date || '';
  const text = dateVal ? (fmtDate(dateVal) + (f.time ? ' ' + f.time : '')) : '未设置，点击选择';
  return '<div class="form-card"><div class="form-row date-row">' + svg('calendar', 'ri') +
    '<button class="date-cell-btn" data-act="open-date">' +
      '<span class="date-value' + (dateVal ? '' : ' is-empty') + '">' + esc(text) + '</span>' +
    '</button>' +
    (dateVal ? '<button class="clear-inline" data-act="clear-date" aria-label="清除日期">' +
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8.6 8.6l6.8 6.8M15.4 8.6l-6.8 6.8" stroke="#fff" stroke-width="1.8" fill="none"/></svg></button>' : '') +
  '</div></div>';
}

function refreshDateRow(){
  const host = $('#dateRowHost');
  if (host && SHEET && SHEET.form) host.innerHTML = dateRowHTML();
}

/* ---------- 日期时间选择器（选完点确认才填入） ---------- */
let DTP = null;

function openDatePicker(){
  if (!SHEET || !SHEET.form) return;
  const f = SHEET.form;
  const base = f.date ? parseISO(f.date) : new Date();
  const parts = String(f.time || '').split(':');
  DTP = {
    y: base.getFullYear(), m: base.getMonth(),
    date: f.date || '',
    hh: f.time ? parts[0] : '',
    mm: f.time ? parts[1] : ''
  };
  const host = $('#dpHost');
  if (host) host.innerHTML = datePickerHTML();
}

function closeDatePicker(){
  DTP = null;
  const host = $('#dpHost');
  if (host) host.innerHTML = '';
}

function dpRefresh(){
  const host = $('#dpHost');
  if (host) host.innerHTML = datePickerHTML();
}

function datePickerHTML(){
  if (!DTP) return '';
  const y = DTP.y, m = DTP.m;
  const lead = (new Date(y, m, 1).getDay() + 6) % 7;   // 周一为首列
  const days = new Date(y, m + 1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();
  const today = todayISO();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push('<span class="dp-cell is-out">' + (prevDays - lead + i + 1) + '</span>');
  for (let d = 1; d <= days; d++) {
    const iso = toISO(new Date(y, m, d));
    const cls = 'dp-cell' + (DTP.date === iso ? ' is-sel' : '') + (iso === today ? ' is-today' : '');
    cells.push('<button class="' + cls + '" data-act="dp-day" data-date="' + iso + '">' + d + '</button>');
  }
  while (cells.length % 7 !== 0) cells.push('<span class="dp-cell is-out"></span>');

  const hours = ['<option value="">--</option>'];
  for (let h = 0; h < 24; h++) {
    const v = pad2(h);
    hours.push('<option value="' + v + '"' + (DTP.hh === v ? ' selected' : '') + '>' + v + '</option>');
  }
  const mins = ['<option value="">--</option>'];
  for (let i = 0; i < 60; i += 5) {
    const v = pad2(i);
    mins.push('<option value="' + v + '"' + (DTP.mm === v ? ' selected' : '') + '>' + v + '</option>');
  }

  return '<div class="dp-mask" data-act="dp-cancel"></div>' +
    '<div class="dp-panel">' +
      '<div class="dp-head">' +
        '<button class="dp-nav" data-act="dp-prev" aria-label="上个月">' + svg('arrowUp') + '</button>' +
        '<div class="dp-ym">' + y + ' 年 ' + (m + 1) + ' 月</div>' +
        '<button class="dp-nav is-next" data-act="dp-next" aria-label="下个月">' + svg('arrowUp') + '</button>' +
      '</div>' +
      '<div class="dp-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>' +
      '<div class="dp-grid">' + cells.join('') + '</div>' +
      '<div class="dp-time">' +
        '<span class="dp-time-lbl">时分</span>' +
        '<select class="dp-select" id="dpHour">' + hours.join('') + '</select>' +
        '<span class="dp-colon">:</span>' +
        '<select class="dp-select" id="dpMin">' + mins.join('') + '</select>' +
      '</div>' +
      '<div class="dp-actions">' +
        '<button class="ghost-btn" data-act="dp-cancel">取消</button>' +
        '<button class="primary-btn" data-act="dp-confirm">确认</button>' +
      '</div>' +
    '</div>';
}

function listPickerHTML(){
  const f = SHEET.form;
  if (!DB.lists.length) return '<span style="font-size:13px;color:#8E8E93">还没有列表，请先在设置中新建</span>';
  return DB.lists.map(l => {
    const on = f.listId === l.id;
    return '<button class="pick-chip' + (on ? ' is-on' : '') + '" data-act="pick-list" data-id="' + l.id + '" ' +
      'style="' + (on ? 'background:' + l.color + ';color:#fff' : 'color:' + l.color) + '">' +
      svg(l.icon) + esc(l.name) + '</button>';
  }).join('');
}

/* ---------- 年份筛选 ---------- */
function yearSheetHTML(){
  const years = Array.from(new Set(
    DB.todos.filter(t => t.done && t.doneAt).map(t => yearOf(t.doneAt))
  )).sort().reverse();
  const opts = ['all'].concat(years);
  return grab() +
    '<div class="sheet-head"><h2 class="sheet-title">年份</h2></div>' +
    '<div class="sheet-body"><div class="menu-card">' +
    opts.map(y => {
      const on = UI.doneYear === y;
      return '<button class="menu-item" data-act="pick-year" data-year="' + y + '">' +
        '<span style="flex:1">' + (y === 'all' ? '全部年份' : y + ' 年') + '</span>' +
        (on ? '<span style="color:#0A84FF">' + svg('check') + '</span>' : '') + '</button>';
    }).join('') +
    '</div></div>';
}

/* ---------- 列表更多菜单 ---------- */
function listMenuHTML(p){
  const list = findList(p.listId);
  if (!list) return '';
  const doneN = DB.todos.filter(t => t.listId === p.listId && t.done).length;
  return grab() +
    '<div class="sheet-head"><h2 class="sheet-title">' + esc(list.name) + '</h2></div>' +
    '<div class="sheet-body"><div class="menu-card">' +
      '<button class="menu-item" data-act="menu-edit-list" data-id="' + list.id + '">' + svg('pen') + '<span>编辑列表</span></button>' +
      '<button class="menu-item" data-act="menu-sort">' + svg('sort') + '<span>' + (UI.sorting ? '退出排序模式' : '排序模式') + '</span></button>' +
      '<button class="menu-item" data-act="menu-clear-done" data-id="' + list.id + '">' + svg('checkCircle') +
        '<span>清除已完成（' + doneN + '）</span></button>' +
      '<button class="menu-item is-danger" data-act="menu-del-list" data-id="' + list.id + '">' + svg('trash') +
        '<span>删除列表</span></button>' +
    '</div></div>';
}

/* ---------- 导入 ---------- */
function importSheetHTML(){
  const n = SHEET && SHEET.importData ? SHEET.importData.todos.length : 0;
  return grab() +
    '<div class="sheet-head"><h2 class="sheet-title">导入数据</h2></div>' +
    '<div class="sheet-body">' +
      '<p style="margin:6px 4px 16px;font-size:14px;color:#8E8E93">检测到 ' + n + ' 条待办，当前有 ' + DB.todos.length + ' 条。请选择导入方式：</p>' +
      '<button class="primary-btn" data-act="import-append" style="margin-top:0">追加（保留当前数据）</button>' +
      '<button class="danger-btn" data-act="import-replace">覆盖（替换当前数据）</button>' +
    '</div>';
}

/* ============================================================
   10. 编辑列表 / 编辑标签
   ============================================================ */
function renderEditList(p){
  const isNew = !!p.isNew;
  const list = isNew ? null : findList(p.listId);
  if (!isNew && !list) { setTimeout(back, 0); return; }
  const key = isNew ? '__new__' : p.listId;

  if (!EDIT || EDIT.key !== key) {
    EDIT = {
      key: key, isNew: isNew, listId: p.listId || null,
      name: list ? list.name : '',
      color: list ? list.color : PALETTE[0],
      icon: list ? list.icon : 'list'
    };
  }

  const iconBlocks = ICON_GROUPS.map(g =>
    '<div class="icon-group-label">' + g.label + '</div>' +
    '<div class="icon-grid">' + g.items.map(name =>
      '<button class="icon-cell' + (EDIT.icon === name ? ' is-active' : '') + '" ' +
      'data-act="pick-icon" data-icon="' + name + '" style="--c:' + EDIT.color + ';--c-12:' + hexRgba(EDIT.color, .12) + '" ' +
      'aria-label="' + name + '">' + svg(name) + '</button>').join('') + '</div>'
  ).join('');

  const dots = PALETTE.map(c =>
    '<button class="color-dot' + (EDIT.color === c ? ' is-active' : '') + '" data-act="pick-color" ' +
    'data-color="' + c + '" style="--c:' + c + ';--c-35:' + hexRgba(c, .35) + '" aria-label="颜色">' +
    '<i></i></button>').join('');

  $('#editListBody').innerHTML =
    '<div class="name-card">' +
      '<span class="icon-preview" style="--c:' + EDIT.color + ';--c-12:' + hexRgba(EDIT.color, .12) + '">' + svg(EDIT.icon) + '</span>' +
      '<div class="name-field-wrap">' +
        '<input class="name-field" id="listName" placeholder="列表名称" maxlength="20" value="' + esc(EDIT.name) + '" />' +
        (EDIT.name ? '<button class="clear-btn" data-act="clear-name" aria-label="清空"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2" stroke="#F2F2F6" stroke-width="2" fill="none"/></svg></button>' : '') +
      '</div>' +
    '</div>' +
    '<div class="field-label">列表颜色</div>' +
    '<div class="pick-card"><div class="colors">' + dots + '</div></div>' +
    '<div class="field-label">列表图标</div>' +
    '<div class="pick-card">' + iconBlocks + '</div>' +
    (isNew ? '' : '<button class="danger-btn" data-act="del-current-list">删除此列表</button>');
}

/* ============================================================
   11. 数据操作
   ============================================================ */
function toggleTodo(id){
  const t = findTodo(id);
  if (!t) return;
  t.done = !t.done;
  t.doneAt = t.done ? todayISO() : '';
  if (t.done) t.progress = 100;
  save();
  renderApp();
}
function moveTodoWithinList(listId, from, to){
  const items = openTodos(listId);
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return;
  const moved = items[from], target = items[to];
  const gi = DB.todos.indexOf(moved);
  if (gi < 0) return;
  DB.todos.splice(gi, 1);
  const ti = DB.todos.indexOf(target);
  if (from > to) DB.todos.splice(ti, 0, moved);
  else DB.todos.splice(ti + 1, 0, moved);
}
function deleteTodo(id){
  const i = DB.todos.findIndex(t => t.id === id);
  if (i < 0) return;
  DB.todos.splice(i, 1);
  save(); renderApp();
  toast('已删除');
}
function deleteList(id){
  const list = findList(id);
  if (!list) return;
  const n = DB.todos.filter(t => t.listId === id).length;
  const msg = '删除列表「' + list.name + '」？' + (n ? '其中 ' + n + ' 条待办会一并删除。' : '');
  if (!window.confirm(msg)) return;
  DB.lists = DB.lists.filter(l => l.id !== id);
  DB.todos = DB.todos.filter(t => t.listId !== id);
  if (UI.doneList === id) UI.doneList = 'all';
  save(); renderApp();
  toast('列表已删除');
}

/* ============================================================
   12. 事件：点击
   ============================================================ */
document.addEventListener('click', function(e){
  if (Date.now() < suppressClickUntil) { e.stopPropagation(); e.preventDefault(); return; }
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  const id = el.dataset.id;

  switch (act) {
    /* 导航 */
    case 'back': back(); break;
    case 'open-list':
      UI.sorting = false;
      push('list', { listId: id });
      break;

    /* 首页 / 列表 */
    case 'add-todo': openTodoSheet(null, el.dataset.list); break;
    case 'edit-todo':
      if (UI.sorting) break;
      openTodoView(id); break;
    case 'toggle': toggleTodo(id); break;
    case 'up': {
      const lid = id ? (findTodo(id) || {}).listId : '';
      const items = openTodos(lid);
      const idx = items.findIndex(t => t.id === id);
      if (idx > 0) { moveTodoWithinList(lid, idx, idx - 1); save(); renderApp(); }
      break;
    }
    case 'down': {
      const lid = id ? (findTodo(id) || {}).listId : '';
      const items = openTodos(lid);
      const idx = items.findIndex(t => t.id === id);
      if (idx >= 0 && idx < items.length - 1) { moveTodoWithinList(lid, idx, idx + 1); save(); renderApp(); }
      break;
    }

    /* Tab */
    case 'done-filter':
      UI.doneList = id; renderDone(); break;
    case 'pick-year':
      UI.doneYear = el.dataset.year; back(); break;

    /* 设置面板 */
    case 'toggle-edit': {
      UI.editing = !UI.editing;
      renderSheet({ kind:'settings' });
      // 进入编辑后回到顶部，避免看不到列表行上出现的删除 / 拖拽按钮
      const body = $('#sheet .sheet-body');
      if (body) body.scrollTop = 0;
      break;
    }
    case 'smart':
      UI.tab = id === 'done' ? 'done' : 'home';
      UI.doneList = 'all';
      UI.sorting = false;
      back();
      break;
    case 'new-list': EDIT = null; push('editList', { isNew:true }); break;
    case 'open-edit-list': EDIT = null; push('editList', { listId:id }); break;
    case 'del-list': deleteList(id); break;
    case 'toggle-hide-empty':
      UI.hideEmpty = !UI.hideEmpty;
      saveUI();
      renderSheet({ kind:'settings' });
      renderHome();
      break;
    case 'export': exportJSON(); break;
    case 'import': pickFile(); break;
    case 'load-demo': loadDemo(); break;
    case 'reset-all': resetAll(); break;
    case 'import-append': applyImport('append'); break;
    case 'import-replace': applyImport('replace'); break;

    /* 编辑列表 / 标签 */
    case 'pick-color': if (EDIT) { EDIT.color = el.dataset.color; rerenderEdit(); } break;
    case 'pick-icon':  if (EDIT) { EDIT.icon = el.dataset.icon; rerenderEdit(); } break;
    case 'clear-name': if (EDIT) { EDIT.name = ''; rerenderEdit(); focusName(); } break;
    case 'save-list': saveList(); break;
    case 'del-current-list': if (EDIT && !EDIT.isNew) deleteList(EDIT.listId); break;

    /* 待办表单 */
    case 'pick-list': {
      SHEET.form.listId = id;
      const lp = $('#listPicker');
      if (lp) lp.innerHTML = listPickerHTML();
      break;
    }
    case 'clear-date':
      if (!SHEET || !SHEET.form) break;
      SHEET.form.date = '';
      SHEET.form.time = '';
      refreshDateRow();
      break;
    case 'toggle-star':
      if (!SHEET || !SHEET.form) break;
      SHEET.form.starred = !SHEET.form.starred;
      renderSheet({ kind:'todo', _t: SHEET._t, todoId: SHEET.todoId });
      break;

    /* 日期时间选择器 */
    case 'open-date': openDatePicker(); break;
    case 'dp-prev':
      if (DTP) { DTP.m--; if (DTP.m < 0) { DTP.m = 11; DTP.y--; } dpRefresh(); }
      break;
    case 'dp-next':
      if (DTP) { DTP.m++; if (DTP.m > 11) { DTP.m = 0; DTP.y++; } dpRefresh(); }
      break;
    case 'dp-day':
      if (DTP) { DTP.date = el.dataset.date || ''; dpRefresh(); }
      break;
    case 'dp-cancel': closeDatePicker(); break;
    case 'dp-confirm':
      if (!DTP || !SHEET || !SHEET.form) break;
      if (!DTP.date) { toast('请先选择日期'); break; }
      SHEET.form.date = DTP.date;
      SHEET.form.time = (DTP.hh || DTP.mm) ? ((DTP.hh || '00') + ':' + (DTP.mm || '00')) : '';
      closeDatePicker();
      refreshDateRow();
      break;

    case 'todo-save': saveTodoSheet(); break;
    case 'todo-edit': {
      // 详情面板 → 编辑表单，替换当前弹层，关闭后直接回到原页面
      const cur = current();
      if (!cur || cur.name !== 'sheet') break;
      cur.params = { kind:'todo', todoId:id, _t: uid() };
      SHEET = null;
      renderApp();
      break;
    }
    case 'todo-remove': {
      const todo = findTodo(id);
      if (!todo) break;
      if (!window.confirm('删除待办「' + todo.title + '」？')) break;
      SHEET = null;
      back();
      setTimeout(function(){ deleteTodo(id); }, 30);
      break;
    }

    /* 列表菜单 */
    case 'menu-edit-list': EDIT = null; push('editList', { listId:id }); break;
    case 'menu-sort': UI.sorting = !UI.sorting; back(); setTimeout(renderApp, 20); break;
    case 'menu-clear-done': {
      const n = DB.todos.filter(t => t.listId === id && t.done).length;
      if (!n) { toast('该列表没有已完成的待办'); break; }
      if (!window.confirm('清除 ' + n + ' 条已完成待办？')) break;
      DB.todos = DB.todos.filter(t => !(t.listId === id && t.done));
      save(); back(); setTimeout(renderApp, 20); toast('已清除 ' + n + ' 条');
      break;
    }
    case 'menu-del-list': deleteList(id); break;

    /* 日历 */
    case 'cal-range':
      UI.calRange = el.dataset.range || 'week';
      saveUI();
      renderCalendar();
      break;
    case 'toggle-cal-done':
      UI.calHideDone = !UI.calHideDone;
      saveUI();
      renderCalendar();
      break;

    /* 其他 */
    case 'toggle-cols':
      UI.cols = UI.cols === 2 ? 1 : 2; saveUI(); renderHome(); syncColsIcon(); break;
    case 'close-sheet': back(); break;
  }
});

/* ============================================================
   13. 事件：输入
   ============================================================ */
document.addEventListener('input', function(e){
  const el = e.target;
  if (el.id === 'todoTitle' && SHEET) { SHEET.form.title = el.value; return; }
  if (el.id === 'todoNote' && SHEET) { SHEET.form.note = el.value; return; }
  if (el.id === 'todoProgress' && SHEET) {
    SHEET.form.progress = Number(el.value) || 0;
    el.style.setProperty('--p', el.value + '%');
    const pv = $('#progressVal');
    if (pv) pv.textContent = el.value + '%';
    return;
  }
  if (el.id === 'listName' && EDIT) { EDIT.name = el.value; return; }
});
document.addEventListener('change', function(e){
  const el = e.target;
  if (!DTP) return;
  if (el.id === 'dpHour') { DTP.hh = el.value; return; }
  if (el.id === 'dpMin') { DTP.mm = el.value; return; }
});

/* ============================================================
   14. 待办表单动作
   ============================================================ */
function openTodoSheet(todoId, listId){
  push('sheet', { kind:'todo', todoId: todoId || null, listId: listId || null, _t: uid() });
}
function openTodoView(todoId){
  if (!findTodo(todoId)) return;
  push('sheet', { kind:'todoView', todoId: todoId, _t: uid() });
}
function saveTodoSheet(){
  if (!SHEET) return;
  const f = SHEET.form;
  const title = String(f.title || '').trim();
  if (!title) { toast('请输入待办内容'); return; }
  const listId = f.listId && findList(f.listId) ? f.listId : '';
  if (!listId) { toast('请选择所属列表'); return; }
  const note = String(f.note || '').trim().slice(0, 500);
  const progress = Math.max(0, Math.min(100, Math.round(Number(f.progress) || 0)));
  const date = f.date;
  const time = f.time || '';
  const starred = !!f.starred;
  if (SHEET.todoId) {
    const t = findTodo(SHEET.todoId);
    if (t) {
      t.title = title; t.note = note; t.progress = progress;
      t.date = date; t.time = time; t.listId = listId; t.starred = starred;
    }
  } else {
    DB.todos.unshift({
      id: uid(), listId: listId, title: title,
      note: note, progress: progress, date: date, time: time, starred: starred,
      done: false, doneAt: '', createdAt: Date.now()
    });
  }
  save();
  const addAnother = SHEET && !SHEET.todoId;
  SHEET = null;
  back();
  toast(addAnother ? '已添加' : '已保存');
}

/* ============================================================
   15. 编辑列表 / 标签保存
   ============================================================ */
function rerenderEdit(){
  const cur = current();
  if (cur.name === 'editList') renderEditList(cur.params);
}
function focusName(){
  setTimeout(function(){
    const el = $('#listName');
    if (el) { el.focus(); el.select(); }
  }, 10);
}
function saveList(){
  if (!EDIT) return;
  const name = String(EDIT.name || '').trim();
  if (!name) { toast('请输入列表名称'); return; }
  if (EDIT.isNew) {
    DB.lists.push({ id: uid(), name: name.slice(0, 20), icon: EDIT.icon, color: EDIT.color });
  } else {
    const l = findList(EDIT.listId);
    if (!l) return;
    l.name = name.slice(0, 20); l.icon = EDIT.icon; l.color = EDIT.color;
  }
  save();
  EDIT = null;
  back();
  toast('已保存');
}

/* ============================================================
   16. 拖拽排序（列表详情行 / 设置面板行）
   ============================================================ */
document.addEventListener('pointerdown', function(e){
  const card = $('#listCard');
  if (!card || !card.classList.contains('is-sorting')) return;
  const row = e.target.closest('.todo-row');
  if (!row || !card.contains(row)) return;
  if (e.target.closest('button')) return;
  startRowDrag(row, card, e);
});

function startRowDrag(row, card, e){
  e.preventDefault();
  const rows = $$('.todo-row', card);
  const idx = rows.indexOf(row);
  if (idx < 0) return;
  const listId = current().params.listId;
  const rects = rows.map(r => ({ top: r.offsetTop, h: r.offsetHeight }));
  const startY = e.pageY;
  let target = idx;

  dragState = { row: row, rows: rows, idx: idx, target: idx, rects: rects, startY: startY, h: rects[idx].h };
  row.classList.add('is-dragging');
  document.body.classList.add('is-dragging');
  suppressClickUntil = Date.now() + 600;
  if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) {} }

  try { row.setPointerCapture(e.pointerId); } catch (err) {}

  function onMove(ev){
    if (!dragState) return;
    const dy = ev.pageY - startY;
    row.style.transform = 'translateY(' + dy + 'px)';
    const viewY = ev.pageY - window.scrollY;
    if (viewY < 90) window.scrollBy(0, -8);
    else if (viewY > window.innerHeight - 90) window.scrollBy(0, 8);

    const center = rects[idx].top + rects[idx].h / 2 + dy;
    let t = idx;
    for (let k = 0; k < rects.length; k++) {
      if (k === idx) continue;
      const mid = rects[k].top + rects[k].h / 2;
      if (k < idx && center < mid) { t = k; break; }
      if (k > idx && center > mid) t = k;
    }
    target = t;
    dragState.target = t;

    const step = dragState.h;
    rows.forEach(function(r, k){
      if (r === row) return;
      let shift = 0;
      if (t > idx && k > idx && k <= t) shift = -step;
      else if (t < idx && k >= t && k < idx) shift = step;
      r.style.transform = shift ? 'translateY(' + shift + 'px)' : '';
    });
  }
  function onUp(){
    row.removeEventListener('pointermove', onMove);
    row.removeEventListener('pointerup', onUp);
    row.removeEventListener('pointercancel', onUp);
    rows.forEach(r => { r.style.transform = ''; });
    row.classList.remove('is-dragging');
    document.body.classList.remove('is-dragging');
    suppressClickUntil = Date.now() + 320;
    const movedTo = dragState ? dragState.target : idx;
    dragState = null;
    if (movedTo !== idx) {
      moveTodoWithinList(listId, idx, movedTo);
      save();
    }
    renderApp();
  }
  row.addEventListener('pointermove', onMove);
  row.addEventListener('pointerup', onUp);
  row.addEventListener('pointercancel', onUp);
}

/* 设置面板：手柄拖拽排序 */
let gDrag = null;
document.addEventListener('pointerdown', function(e){
  const handle = e.target.closest('.g-handle');
  if (!handle) return;
  const row = handle.closest('.g-row');
  const card = handle.closest('.group-card');
  if (!row || !card || !card.dataset.reorder) return;
  e.preventDefault();

  const rows = $$('.g-row', card);
  const idx = rows.indexOf(row);
  const type = card.dataset.reorder;
  const rects = rows.map(r => ({ top: r.offsetTop, h: r.offsetHeight }));
  const startY = e.pageY;
  let target = idx;
  const h = rects[idx].h;

  gDrag = { row: row, rows: rows, idx: idx, target: idx, type: type };
  row.classList.add('is-dragging');
  try { handle.setPointerCapture(e.pointerId); } catch (err) {}

  function onMove(ev){
    const dy = ev.pageY - startY;
    row.style.transform = 'translateY(' + dy + 'px)';
    const center = rects[idx].top + rects[idx].h / 2 + dy;
    let t = idx;
    for (let k = 0; k < rects.length; k++) {
      if (k === idx) continue;
      const mid = rects[k].top + rects[k].h / 2;
      if (k < idx && center < mid) { t = k; break; }
      if (k > idx && center > mid) t = k;
    }
    target = t;
    rows.forEach(function(r, k){
      if (r === row) return;
      let shift = 0;
      if (t > idx && k > idx && k <= t) shift = -h;
      else if (t < idx && k >= t && k < idx) shift = h;
      r.style.transform = shift ? 'translateY(' + shift + 'px)' : '';
    });
  }
  function onUp(){
    handle.removeEventListener('pointermove', onMove);
    handle.removeEventListener('pointerup', onUp);
    handle.removeEventListener('pointercancel', onUp);
    rows.forEach(r => { r.style.transform = ''; });
    row.classList.remove('is-dragging');
    gDrag = null;
    if (target !== idx) {
      const arr = DB.lists;
      const id = row.dataset.id;
      const from = arr.findIndex(x => x.id === id);
      if (from >= 0) {
        const moved = arr.splice(from, 1)[0];
        arr.splice(target, 0, moved);
        save();
      }
    }
    renderApp();
  }
  handle.addEventListener('pointermove', onMove);
  handle.addEventListener('pointerup', onUp);
  handle.addEventListener('pointercancel', onUp);
});

/* ============================================================
   17. 导入 / 导出
   ============================================================ */
function exportJSON(){
  const data = { app:'todolist', version:2, exportedAt:new Date().toISOString(), lists:DB.lists, todos:DB.todos };
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos-' + todayISO().replace(/-/g, '') + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast('已导出 ' + DB.todos.length + ' 条待办');
  } catch (err) { toast('导出失败：' + err.message); }
}

function pickFile(){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json,text/plain';
  input.addEventListener('change', function(){
    const f = input.files && input.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(){
      // 去掉记事本等工具写入的 BOM，否则 JSON.parse 会失败
      const text = String(reader.result == null ? '' : reader.result).replace(/^\uFEFF/, '').trim();
      if (!text) { toast('文件是空的'); return; }
      let parsed;
      try { parsed = JSON.parse(text); }
      catch (err) { toast('文件解析失败：不是有效的 JSON'); return; }
      // 兼容早期导出的「待办数组」格式
      if (Array.isArray(parsed)) parsed = { lists: [], todos: parsed };
      const next = normalizeDB(parsed);
      if (!next.lists.length && !next.todos.length) {
        toast('文件里没有可识别的列表或待办');
        return;
      }
      // 只有待办没有列表时补一个列表，避免导入后看不到内容
      if (!next.lists.length) {
        const lid = 'import-list';
        next.lists.push({ id: lid, name: '导入', icon: 'inbox', color: PALETTE[0] });
        next.todos.forEach(t => { t.listId = lid; });
      }
      SHEET = { importData: next };
      push('sheet', { kind:'import', _t: uid() });
    };
    reader.onerror = function(){ toast('文件读取失败，请重试'); };
    reader.readAsText(f, 'utf-8');
  });
  input.click();
}

function mergeDataset(next){
  const listMap = {};
  next.lists.forEach(l => {
    const exist = DB.lists.find(x => x.name === l.name);
    if (exist) listMap[l.id] = exist.id;
    else { DB.lists.push(l); listMap[l.id] = l.id; }
  });
  next.todos.forEach(t => {
    DB.todos.push({
      id: uid(),
      listId: listMap[t.listId] || (DB.lists[0] && DB.lists[0].id) || '',
      title: t.title, date: t.date, time: t.time || '', note: t.note || '', progress: t.progress || 0,
      starred: !!t.starred,
      done: t.done, doneAt: t.doneAt, createdAt: t.createdAt
    });
  });
}

function applyImport(mode){
  const next = SHEET && SHEET.importData;
  if (!next) { back(); return; }
  if (mode === 'replace') DB = next;
  else mergeDataset(next);
  const n = next.todos.length;
  SHEET = null;
  save();
  back();
  setTimeout(renderApp, 20);
  toast('已导入 ' + n + ' 条待办');
}

function loadDemo(){
  const demo = seed();
  const hasData = DB.lists.length > 0 || DB.todos.length > 0;
  if (hasData && !window.confirm('加载示例数据会追加到现有内容中，继续吗？')) return;
  if (hasData) mergeDataset(demo);
  else DB = demo;
  save();
  renderApp();
  toast('已加载示例数据');
}

function resetAll(){
  if (!window.confirm('清空所有列表和待办？该操作不可恢复，建议先导出备份。')) return;
  DB = { version:2, lists:[], tags:[], todos:[] };
  UI.doneList = 'all';
  UI.doneYear = 'all';
  UI.sorting = false;
  UI.editing = false;
  save();
  back();
  setTimeout(renderApp, 20);
  toast('已清空所有数据');
}

/* ============================================================
   18. 静态绑定
   ============================================================ */
function bindStatic(){
  $$('.segment-item').forEach(btn => {
    btn.addEventListener('click', function(){
      const tab = btn.dataset.tab;
      if (UI.tab === tab) return;
      UI.tab = tab;
      UI.sorting = false;
      renderApp();
    });
  });

  $('#btnCols').addEventListener('click', function(){
    UI.cols = UI.cols === 2 ? 1 : 2;
    saveUI();
    renderHome();
    syncColsIcon();
  });
  $('#btnSettings').addEventListener('click', function(){
    UI.editing = false;
    push('sheet', { kind:'settings' });
  });
  // 首页右上角只负责新建列表；待办在各列表卡片 / 列表详情里添加
  $('#btnAdd').addEventListener('click', function(){
    EDIT = null;
    push('editList', { isNew:true });
  });
  $('#btnAddList').addEventListener('click', function(){
    openTodoSheet(null, current().params.listId);
  });
  $('#btnYearFilter').addEventListener('click', function(){
    push('sheet', { kind:'year' });
  });
  $('#btnSettingsDone').addEventListener('click', function(){
    UI.editing = false;
    push('sheet', { kind:'settings' });
  });
  $('#btnSettingsCal').addEventListener('click', function(){
    UI.editing = false;
    push('sheet', { kind:'settings' });
  });
  $('#btnListMore').addEventListener('click', function(){
    push('sheet', { kind:'listMenu', listId: current().params.listId });
  });
  $('#sheetMask').addEventListener('click', function(){ back(); });

  $$('[data-act="back"]').forEach(b => b.addEventListener('click', function(e){
    e.stopPropagation(); back();
  }));
  $$('[data-act="save-list"]').forEach(b => b.addEventListener('click', function(e){
    e.stopPropagation(); saveList();
  }));

  window.addEventListener('storage', function(e){
    if (e.key === KEY) { loadAll(); renderApp(); }
  });
  window.addEventListener('pagehide', function(){ save(); });
  document.addEventListener('visibilitychange', function(){ if (document.hidden) save(); });
}

function syncColsIcon(){
  $('#iconCols').innerHTML = UI.cols === 2
    ? '<rect x="3" y="3" width="7" height="7" rx="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.8"/>'
    : '<rect x="3" y="3" width="18" height="7" rx="1.8"/><rect x="3" y="14" width="18" height="7" rx="1.8"/>';
}

/* Toast */
let toastTimer = null;
function toast(msg){
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ el.classList.remove('show'); }, 2000);
}

/* ============================================================
   19. 启动
   ============================================================ */
loadAll();
bindStatic();
syncColsIcon();
renderApp();

})();
