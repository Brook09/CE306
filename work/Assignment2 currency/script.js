const amountOne = document.getElementById("amount-one");
const amountTwo = document.getElementById("amount-two");
const currencyOne = document.getElementById("currency-one");
const currencyTwo = document.getElementById("currency-two");
const rateText = document.getElementById("rate");

let history = [];

// อัตราแลกเปลี่ยนตัวอย่าง
const rates = {
    "THB-USD": 0.02817,
    "USD-THB": 35.50
};

// แปลงจากช่องที่ 1 → ช่องที่ 2
function convertOne() {
    const key = currencyOne.value + "-" + currencyTwo.value;
    const rate = rates[key];

    if (!amountOne.value || !rate) return;

    amountTwo.value = (amountOne.value * rate).toFixed(2);
    showRate(rate);
    saveHistory();
}

// แปลงจากช่องที่ 2 → ช่องที่ 1
function convertTwo() {
    const key = currencyTwo.value + "-" + currencyOne.value;
    const rate = rates[key];

    if (!amountTwo.value || !rate) return;

    amountOne.value = (amountTwo.value * rate).toFixed(2);
    showRate(rate);
    saveHistory();
}

// แสดงอัตราแลกเปลี่ยน
function showRate(rate) {
    rateText.textContent =
        `อัตราแลกเปลี่ยน: 1 ${currencyOne.value} = ${rates[currencyOne.value + "-" + currencyTwo.value]} ${currencyTwo.value}`;
}

// บันทึกประวัติ
function saveHistory() {
    const text =
        `${amountOne.value} ${currencyOne.value} → ${amountTwo.value} ${currencyTwo.value}`;

    if (history[0] === text) return;

    history.unshift(text);
    history = history.slice(0, 10);

    showHistory();
}

// แสดงประวัติ
function showHistory() {
    const list = document.getElementById("history-list");
    list.innerHTML = "";

    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });
}

// ปุ่มล้างข้อมูล
document.getElementById("clear").onclick = function () {
    amountOne.value = "";
    amountTwo.value = "";
    rateText.textContent = "อัตราแลกเปลี่ยน: -";
};

// ปุ่มล้างประวัติ
document.getElementById("clear-history").onclick = function () {
    history = [];
    showHistory();
};

// เมื่อกรอกช่องที่ 1
amountOne.addEventListener("input", convertOne);

// เมื่อกรอกช่องที่ 2
amountTwo.addEventListener("input", convertTwo);

// เปลี่ยนสกุลเงิน
currencyOne.addEventListener("change", convertOne);
currencyTwo.addEventListener("change", convertOne);

// แสดงเวลาที่อัปเดต
document.getElementById("update-time").textContent =
    "อัปเดตล่าสุด: " + new Date().toLocaleString("th-TH");