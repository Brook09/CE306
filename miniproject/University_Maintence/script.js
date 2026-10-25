const STORAGE_KEY = "uniFixRepairRequests";
const seedRequests = [
  {id:"UR-1001",title:"หลอดไฟในห้องเรียนไม่ติด",category:"ไฟฟ้า",building:"อาคารเรียน 1",room:"ห้อง 204 ชั้น 2",reporter:"นายสมชาย ใจดี",phone:"",description:"หลอดไฟบริเวณหน้าห้องเรียนไม่ติด 2 หลอด",date:"2026-10-18",status:"รอรับเรื่อง"},
  {id:"UR-1002",title:"ก๊อกน้ำรั่วในห้องน้ำ",category:"ประปา",building:"อาคารกิจกรรม",room:"ห้องน้ำชั้น 1",reporter:"นางสาวพิมพ์ชนก",phone:"",description:"ก๊อกน้ำอ่างล้างมือมีน้ำหยดตลอดเวลา",date:"2026-10-17",status:"กำลังดำเนินการ"},
  {id:"UR-1003",title:"คอมพิวเตอร์เปิดไม่ติด",category:"อุปกรณ์คอมพิวเตอร์",building:"อาคารปฏิบัติการ",room:"ห้อง Lab 3",reporter:"นายกิตติ",phone:"",description:"เครื่องคอมพิวเตอร์หมายเลข 08 เปิดไม่ติด",date:"2026-10-16",status:"ซ่อมเสร็จแล้ว"},
  {id:"UR-1004",title:"สัญญาณอินเทอร์เน็ตไม่เสถียร",category:"อินเทอร์เน็ต",building:"อาคารเรียน 2",room:"ห้อง 301 ชั้น 3",reporter:"นางสาวอรทัย",phone:"",description:"เชื่อมต่อ Wi-Fi แล้วหลุดบ่อย",date:"2026-10-15",status:"กำลังดำเนินการ"}
];

let requests = loadRequests();
let selectedRequestId = null;
let toastTimer;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadRequests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? [...seedRequests] : JSON.parse(saved);
  } catch (error) {
    return [...seedRequests];
  }
}
function saveRequests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[char]);
}
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("th-TH", {day:"numeric", month:"short", year:"numeric"});
}
function statusClass(status) {
  if (status === "กำลังดำเนินการ") return "progress";
  if (status === "ซ่อมเสร็จแล้ว") return "done";
  if (status === "ยกเลิกคำร้อง") return "cancelled";
  if (status === "รับเรื่องแล้ว") return "received";
  return "pending";
}
function statusBadge(status) {
  return `<span class="status ${statusClass(status)}">${escapeHTML(status)}</span>`;
}
function rowHTML(item) {
  return `<tr>
    <td><span class="request-name">${escapeHTML(item.title)}</span><span class="request-id">${escapeHTML(item.id)}</span></td>
    <td><span class="location-main">${escapeHTML(item.building)}</span><span class="location-sub">${escapeHTML(item.room)}</span></td>
    <td>${escapeHTML(item.category)}</td>
    <td>${formatDate(item.date)}</td>
    <td>${statusBadge(item.status)}</td>
    <td><div class="row-actions"><button class="small-btn" data-action="detail" data-id="${escapeHTML(item.id)}">ดูรายละเอียด</button></div></td>
  </tr>`;
}
function renderStats() {
  $("#stat-total").textContent = requests.length;
  $("#stat-pending").textContent = requests.filter(item => item.status === "รอรับเรื่อง").length;
  $("#stat-progress").textContent = requests.filter(item => item.status === "กำลังดำเนินการ").length;
  $("#stat-done").textContent = requests.filter(item => item.status === "ซ่อมเสร็จแล้ว").length;
}
function renderDashboard() {
  const recent = [...requests].sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);
  $("#recent-table-body").innerHTML = recent.map(rowHTML).join("");
  $("#recent-empty").classList.toggle("hidden", recent.length !== 0);
}
function renderAllRequests() {
  const term = $("#search-input").value.trim().toLowerCase();
  const status = $("#status-filter").value;
  const category = $("#category-filter").value;
  const filtered = [...requests].filter(item => {
    const haystack = [item.id,item.title,item.building,item.room,item.reporter,item.category].join(" ").toLowerCase();
    return (!term || haystack.includes(term)) && (!status || item.status === status) && (!category || item.category === category);
  }).sort((a,b) => b.date.localeCompare(a.date));
  $("#all-table-body").innerHTML = filtered.map(rowHTML).join("");
  $("#all-empty").classList.toggle("hidden", filtered.length !== 0);
}
function render() {
  renderStats();
  renderDashboard();
  renderAllRequests();
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function showView(viewName) {
  $$(".view").forEach(view => view.classList.toggle("active", view.id === `${viewName}-view`));
  $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === viewName));
  const titles = {dashboard:"ภาพรวมระบบ", requests:"รายการแจ้งซ่อม", "new-request":"แจ้งซ่อมใหม่"};
  $("#page-title").textContent = titles[viewName] || "ภาพรวมระบบ";
  if (viewName === "requests") renderAllRequests();
  window.scrollTo({top:0,behavior:"smooth"});
}
function openDetails(id) {
  const item = requests.find(request => request.id === id);
  if (!item) return;
  selectedRequestId = id;
  if (!Array.isArray(item.statusHistory)) item.statusHistory = [{status:item.status, at:item.date ? `${item.date}T00:00:00.000Z` : new Date().toISOString()}];
  $("#detail-content").innerHTML = `
    <div class="detail-grid">
      <div class="detail-field"><small>รหัสรายการ</small><strong>${escapeHTML(item.id)}</strong></div>
      <div class="detail-field"><small>วันที่แจ้ง</small><strong>${formatDate(item.date)}</strong></div>
      <div class="detail-field wide"><small>หัวข้อปัญหา</small><strong>${escapeHTML(item.title)}</strong></div>
      <div class="detail-field"><small>ประเภทงาน</small><strong>${escapeHTML(item.category)}</strong></div>
      <div class="detail-field"><small>สถานะปัจจุบัน</small><div class="detail-status">${statusBadge(item.status)}</div>
        <select id="detail-status-select" aria-label="เปลี่ยนสถานะ">
          ${["รอรับเรื่อง","รับเรื่องแล้ว","กำลังดำเนินการ","ซ่อมเสร็จแล้ว","ยกเลิกคำร้อง"].map(s => `<option ${item.status===s?"selected":""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="detail-field"><small>อาคาร</small><strong>${escapeHTML(item.building)}</strong></div>
      <div class="detail-field"><small>ห้อง / ตำแหน่ง</small><strong>${escapeHTML(item.room)}</strong></div>
      <div class="detail-field"><small>ชื่อผู้แจ้ง</small><strong>${escapeHTML(item.reporter)}</strong></div>
      <div class="detail-field"><small>เบอร์ติดต่อ</small><strong>${escapeHTML(item.phone || "-")}</strong></div>
      <div class="detail-field wide"><small>รายละเอียด</small><strong>${escapeHTML(item.description)}</strong></div>
      ${item.image ? `<div class="detail-field wide"><small>รูปภาพปัญหา</small><img class="detail-image" src="${item.image}" alt="รูปภาพปัญหา"></div>` : ""}
      <div class="detail-field wide"><small>ประวัติสถานะ</small><div class="history-list">${(item.statusHistory || []).map(entry => `<div class="history-item"><strong>${escapeHTML(entry.status)}</strong><span>${escapeHTML(new Date(entry.at || entry.date || Date.now()).toLocaleString("th-TH"))}</span></div>`).join("")}</div></div>
    </div>`;
  $("#detail-dialog").showModal();
}
function deleteRequest(id) {
  const item = requests.find(request => request.id === id);
  if (!item) return;
  if (!confirm(`ต้องการลบรายการ ${item.id} ใช่หรือไม่?`)) return;
  requests = requests.filter(request => request.id !== id);
  saveRequests();
  render();
  $("#detail-dialog").close();
  showToast("ลบรายการแจ้งซ่อมแล้ว");
}

$$(".nav-link").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
["#top-new-btn","#welcome-new-btn","#list-new-btn"].forEach(selector => $(selector).addEventListener("click", () => showView("new-request")));
["#view-all-btn","#recent-view-btn"].forEach(selector => $(selector).addEventListener("click", () => showView("requests")));
$("#search-input").addEventListener("input", renderAllRequests);
$("#status-filter").addEventListener("change", renderAllRequests);
$("#category-filter").addEventListener("change", renderAllRequests);

document.addEventListener("click", event => {
  const button = event.target.closest("[data-action='detail']");
  if (button) openDetails(button.dataset.id);
});

$("#repair-form").addEventListener("reset", () => {
  window.pendingRepairImage = "";
  if (imageInput) { imageInput.value = ""; $("#image-preview").classList.add("hidden"); $("#image-preview").removeAttribute("src"); }
});

$("#repair-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const item = {
    id: `UR-${String(Date.now()).slice(-6)}`,
    title: data.get("title").trim(),
    category: data.get("category"),
    building: data.get("building").trim(),
    room: data.get("room").trim(),
    reporter: data.get("reporter").trim(),
    phone: data.get("phone").trim(),
    description: data.get("description").trim(),
    date: new Date().toISOString().slice(0,10),
    status: "รอรับเรื่อง",
    statusHistory: [{status:"รอรับเรื่อง", at:new Date().toISOString()}],
    image: window.pendingRepairImage || ""
  };
  window.pendingRepairImage = "";
  requests.unshift(item);
  saveRequests();
  render();
  form.reset();
  showView("requests");
  showToast(`ส่งรายการ ${item.id} เรียบร้อยแล้ว`);
});

$("#close-dialog").addEventListener("click", () => $("#detail-dialog").close());
$("#close-detail-btn").addEventListener("click", () => $("#detail-dialog").close());
$("#delete-detail-btn").addEventListener("click", () => {
  if (selectedRequestId) deleteRequest(selectedRequestId);
});
$("#detail-content").addEventListener("change", event => {
  if (event.target.id !== "detail-status-select" || !selectedRequestId) return;
  const item = requests.find(request => request.id === selectedRequestId);
  if (!item) return;
  const newStatus = event.target.value;
  if (item.status !== newStatus) {
    item.status = newStatus;
    if (!Array.isArray(item.statusHistory)) item.statusHistory = [];
    item.statusHistory.push({status:newStatus, at:new Date().toISOString()});
  }
  saveRequests();
  render();
  openDetails(selectedRequestId);
  showToast("อัปเดตสถานะเรียบร้อยแล้ว");
});
// Image attachment: resize and compress before saving to localStorage.
window.pendingRepairImage = "";
const imageInput = $("#repair-image");
if (imageInput) {
  imageInput.addEventListener("change", () => {
    const file = imageInput.files && imageInput.files[0];
    const preview = $("#image-preview");
    window.pendingRepairImage = "";
    if (!file) { preview.classList.add("hidden"); preview.removeAttribute("src"); return; }
    if (!file.type.startsWith("image/")) { showToast("กรุณาเลือกไฟล์รูปภาพ"); imageInput.value = ""; return; }
    if (file.size > 12 * 1024 * 1024) { showToast("รูปภาพมีขนาดใหญ่เกิน 12 MB"); imageInput.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const source = new Image();
      source.onload = () => {
        const maxDimension = 1200;
        const scale = Math.min(1, maxDimension / Math.max(source.width, source.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(source.width * scale));
        canvas.height = Math.max(1, Math.round(source.height * scale));
        canvas.getContext("2d").drawImage(source, 0, 0, canvas.width, canvas.height);
        window.pendingRepairImage = canvas.toDataURL("image/jpeg", 0.72);
        preview.src = window.pendingRepairImage;
        preview.classList.remove("hidden");
      };
      source.onerror = () => showToast("ไม่สามารถอ่านรูปภาพนี้ได้");
      source.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Keep data current when Admin and User are open in separate tabs of the same site.
window.addEventListener("storage", event => {
  if (event.key !== STORAGE_KEY) return;
  requests = loadRequests();
  render();
  if (selectedRequestId && $("#detail-dialog").open) openDetails(selectedRequestId);
});

$("#today-label").textContent = new Date().toLocaleDateString("th-TH", {weekday:"short",day:"numeric",month:"short",year:"numeric"});
render();


// Demo authentication and role-based permissions (frontend prototype only).
const DEMO_USERS = {
  admin: {password:"admin123", role:"admin", name:"ผู้ดูแลระบบ", label:"Administrator"},
  user: {password:"user123", role:"user", name:"ผู้ใช้งาน", label:"End User"}
};
let currentUser = null;

function applyRolePermissions() {
  const isAdmin = currentUser?.role === "admin";
  $("#profile-avatar").textContent = isAdmin ? "AD" : "US";
  $("#profile-name").textContent = currentUser?.name || "";
  $("#profile-role").textContent = currentUser?.label || "";
  $("#role-pill").textContent = isAdmin ? "ADMIN" : "USER";
  $("#role-note").textContent = isAdmin
    ? "สิทธิ์ผู้ดูแล: ดูและจัดการรายการทั้งหมด"
    : "สิทธิ์ผู้ใช้: แจ้งซ่อมและติดตามสถานะ";
  // Only Admin can access the all-requests management list.
  const requestsNav = document.querySelector('[data-view="requests"]');
  requestsNav.classList.toggle("hidden", !isAdmin);
  $("#view-all-btn").classList.toggle("hidden", !isAdmin);
  $("#recent-view-btn").classList.toggle("hidden", !isAdmin);
  $("#list-new-btn").classList.toggle("hidden", !isAdmin);
  $("#dashboard-view .section-heading").classList.toggle("hidden", !isAdmin);
  $("#dashboard-view .stats-grid").classList.toggle("hidden", !isAdmin);
  // End users see only the requests they submitted in this browser demo.
  render();
}
function login(username, password) {
  const account = DEMO_USERS[username.trim().toLowerCase()];
  if (!account || account.password !== password) {
    $("#login-error").classList.remove("hidden");
    return;
  }
  currentUser = {username: username.trim().toLowerCase(), role:account.role, name:account.name, label:account.label};
  $("#login-error").classList.add("hidden");
  $("#login-screen").classList.add("hidden");
  $("#app-shell").classList.remove("hidden");
  applyRolePermissions();
  showView("dashboard");
  showToast(`เข้าสู่ระบบในสิทธิ์ ${account.label} สำเร็จ`);
}
$("#login-form").addEventListener("submit", event => {
  event.preventDefault();
  login($("#login-username").value, $("#login-password").value);
});
$$("[data-demo-user]").forEach(button => button.addEventListener("click", () => {
  const username = button.dataset.demoUser;
  $("#login-username").value = username;
  $("#login-password").value = DEMO_USERS[username].password;
  $("#login-error").classList.add("hidden");
}));
$("#logout-btn").addEventListener("click", () => {
  currentUser = null;
  $("#app-shell").classList.add("hidden");
  $("#login-screen").classList.remove("hidden");
  $("#login-form").reset();
  showToast("ออกจากระบบแล้ว");
});

// Replace the original rendering functions' visibility to respect user role.
const originalRenderDashboard = renderDashboard;
renderDashboard = function() {
  if (currentUser?.role === "user") {
    const mine = requests.filter(item => item.reporter === currentUser.name);
    $("#recent-table-body").innerHTML = mine.map(rowHTML).join("");
    $("#recent-empty").classList.toggle("hidden", mine.length !== 0);
    return;
  }
  originalRenderDashboard();
};
const originalRenderAllRequests = renderAllRequests;
renderAllRequests = function() {
  if (currentUser?.role === "user") {
    const term = $("#search-input").value.trim().toLowerCase();
    const mine = requests.filter(item => item.reporter === currentUser.name &&
      [item.id,item.title,item.building,item.room,item.category].join(" ").toLowerCase().includes(term));
    $("#all-table-body").innerHTML = mine.map(rowHTML).join("");
    $("#all-empty").classList.toggle("hidden", mine.length !== 0);
    return;
  }
  originalRenderAllRequests();
};

// A user can only change or delete their own submitted requests in this demo.
const originalOpenDetails = openDetails;
openDetails = function(id) {
  const item = requests.find(request => request.id === id);
  if (currentUser?.role === "user" && item && item.reporter !== currentUser.name) {
    showToast("คุณไม่มีสิทธิ์ดูรายการนี้");
    return;
  }
  originalOpenDetails(id);
  if (currentUser?.role === "user") {
    $("#detail-status-select").disabled = true;
    $("#delete-detail-btn").classList.add("hidden");
  } else {
    $("#detail-status-select").disabled = false;
    $("#delete-detail-btn").classList.remove("hidden");
  }
};
const originalDeleteRequest = deleteRequest;
deleteRequest = function(id) {
  if (currentUser?.role !== "admin") {
    showToast("เฉพาะ Admin เท่านั้นที่ลบรายการได้");
    return;
  }
  originalDeleteRequest(id);
};

// Override submission to associate each new request with the logged-in user.
$("#repair-form").removeEventListener("submit", () => {});
// Capture the submit event before the original handler to ensure reporter matches the signed-in account.
$("#repair-form").addEventListener("submit", event => {
  if (!currentUser) {
    event.preventDefault();
    showToast("กรุณาเข้าสู่ระบบก่อนแจ้งซ่อม");
    return;
  }
  const reporterInput = $("#repair-form [name='reporter']");
  if (currentUser.role === "user") {
    reporterInput.value = currentUser.name;
    reporterInput.readOnly = true;
  } else {
    reporterInput.readOnly = false;
  }
}, true);

// Start at login instead of showing the dashboard without authentication.
$("#app-shell").classList.add("hidden");
$("#login-screen").classList.remove("hidden");
