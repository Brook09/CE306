class Account {
    constructor(id, type, name, category, amount) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.category = category;
        this.amount = amount;
    }
}

let data = [
    new Account(1, "income", "เงินเดือน", "เงินเดือน", 15000),
    new Account(2, "expense", "ซื้อข้าว", "อาหาร", 60)
];

function add() {
    let id = data.length + 1;
    data.push(new Account(
        id,
        type.value,
        name.value,
        category.value,
        Number(amount.value)
    ));

    name.value = "";
    amount.value = "";
    show();
}

function show() {
    let text = search.value.toLowerCase();
    list.innerHTML = "";

    data.filter(x => x.name.toLowerCase().includes(text))
        .forEach(x => {
            list.innerHTML += `
                <tr>
                    <td>${x.id}</td>
                    <td>${x.type == "income" ? "รายรับ" : "รายจ่าย"}</td>
                    <td>${x.name}</td>
                    <td>${x.category}</td>
                    <td>${x.amount} บาท</td>
                </tr>`;
        });

    let income = data
        .filter(x => x.type == "income")
        .reduce((a, x) => a + x.amount, 0);

    let expense = data
        .filter(x => x.type == "expense")
        .reduce((a, x) => a + x.amount, 0);

    summary.innerHTML =
        `รายรับ: ${income} บาท | รายจ่าย: ${expense} บาท | คงเหลือ: ${income - expense} บาท`;
}

function clearData() {
    if (confirm("ต้องการล้างข้อมูลทั้งหมดหรือไม่?")) {
        data = [];
        show();
    }
}

show();