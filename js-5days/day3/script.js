"use strict";

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rs = (n) => "Rs. " + Number(n).toLocaleString("en-PK");
const table = (headers, rows) => `<div class="tbl"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const block = (title, html) => `<div class="blk"><h3>${title}</h3>${html}</div>`;
const logGroup = (title, fn) => { console.group("%c" + title, "color:#17202a;font-weight:bold"); fn(); console.groupEnd(); };
const flagBad = (ids, bad) => ids.forEach((id) => $(id).classList.toggle("bad", bad.includes(id)));

/* =====================================================
   TASK 1 – Product Catalog
   ===================================================== */
let products = [];
const MIN_PRODUCTS = 8;

function addProduct(name, price, category, inStock) {
    products.push({ name, price, category, inStock });
}

function analyzeProducts(list) {
    const names = list.map((p) => p.name);                                         // map
    const inStockNames = list.filter((p) => p.inStock).map((p) => p.name);          // filter
    const inventoryValue = list.filter((p) => p.inStock).reduce((s, p) => s + p.price, 0); // reduce
    const cheapest = list.reduce((a, b) => (b.price < a.price ? b : a));
    const costliest = list.reduce((a, b) => (b.price > a.price ? b : a));
    const sortedDesc = [...list].sort((a, b) => b.price - a.price);                 // copy, original untouched
    const byCategory = list.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});
    return { names, inStockNames, inventoryValue, cheapest, costliest, sortedDesc, byCategory };
}

function renderProducts(log) {
    const out = $("prodOut");
    if (!products.length) { out.innerHTML = `<p class="muted">Add at least ${MIN_PRODUCTS} products to see the analysis.</p>`; return; }
    const list = table(["#", "Name", "Price", "Category", "In stock"],
        products.map((p, i) => [i + 1, esc(p.name), rs(p.price), esc(p.category), p.inStock ? `<span class="pill">Yes</span>` : `<span class="pill no">No</span>`]));
    if (products.length < MIN_PRODUCTS) {
        out.innerHTML = block(`Products added (${products.length} / ${MIN_PRODUCTS})`, list) +
            `<p class="muted" style="margin-top:14px">Add ${MIN_PRODUCTS - products.length} more to run the analysis.</p>`;
        return;
    }
    const a = analyzeProducts(products);
    out.innerHTML =
        block(`Original array (${products.length} products)`, list) +
        block("Summary", `<div class="stats">
      <div class="stat"><span>Inventory value (in stock)</span><b>${rs(a.inventoryValue)}</b></div>
      <div class="stat"><span>Cheapest</span><b>${esc(a.cheapest.name)} · ${rs(a.cheapest.price)}</b></div>
      <div class="stat"><span>Most expensive</span><b>${esc(a.costliest.name)} · ${rs(a.costliest.price)}</b></div></div>`) +
        block("Product names only (map)", `<div class="chips">${a.names.map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</div>`) +
        block("In-stock items only (filter)", a.inStockNames.length ? `<div class="chips">${a.inStockNames.map((n) => `<span class="chip">${esc(n)}</span>`).join("")}</div>` : `<p class="muted">Nothing in stock.</p>`) +
        block("Sorted by price, high to low", table(["Rank", "Name", "Price"], a.sortedDesc.map((p, i) => [i + 1, esc(p.name), rs(p.price)]))) +
        block("Products per category (reduce)", `<div class="chips">${Object.entries(a.byCategory).map(([c, n]) => `<span class="chip">${esc(c)}<b>${n}</b></span>`).join("")}</div>`);

    if (log) logGroup("Task 1 – Product Catalog", () => {
        console.log("Original array (unchanged):"); console.table(products);
        console.log("Names:", a.names);
        console.log("In-stock names:", a.inStockNames);
        console.log("Total inventory value (in stock):", rs(a.inventoryValue));
        console.log("Cheapest:", a.cheapest);
        console.log("Most expensive:", a.costliest);
        console.log("Sorted by price (desc):"); console.table(a.sortedDesc);
        console.log("Category-wise count:"); console.table(a.byCategory);
    });
}

$("prodForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("pName").value.trim(), cat = $("pCat").value.trim();
    const priceRaw = $("pPrice").value.trim(), price = Number(priceRaw), stock = $("pStock").value;
    const bad = [];
    if (!name) bad.push("pName");
    if (priceRaw === "" || !Number.isFinite(price) || price < 0) bad.push("pPrice");
    if (!cat) bad.push("pCat");
    if (!stock) bad.push("pStock");
    flagBad(["pName", "pPrice", "pCat", "pStock"], bad);
    if (bad.length) return;
    addProduct(name, price, cat, stock === "yes");
    $("prodForm").reset();
    renderProducts(true);
});
$("prodSample").addEventListener("click", () => {
    [["Laptop", 185000, "Electronics", true], ["Mouse", 1500, "Electronics", true], ["Desk", 32000, "Furniture", false], ["Chair", 18500, "Furniture", true],
    ["Notebook", 250, "Stationery", true], ["Pen Pack", 400, "Stationery", true], ["Monitor", 45000, "Electronics", false], ["Lamp", 3200, "Furniture", true]]
        .forEach((p) => addProduct(...p));
    renderProducts(true);
});
$("prodClear").addEventListener("click", () => { products = []; renderProducts(false); });

/* =====================================================
   TASK 2 – Student Record Manager
   ===================================================== */
let students = [];
const PASS_AVG = 40;

function addStudent(id, name, marks) {
    if (students.some((s) => s.id.toLowerCase() === id.toLowerCase())) return { error: `ID "${id}" already exists.` };
    const student = { id, name, marks };
    students.push(student);
    return { student };
}
function findStudentById(id) { return students.find((s) => s.id.toLowerCase() === id.trim().toLowerCase()) || null; }
function getAverage(student) { return student.marks.reduce((a, b) => a + b, 0) / student.marks.length; }
function getTopper() { return students.length ? students.reduce((a, b) => (getAverage(b) > getAverage(a) ? b : a)) : null; }
function getPassedStudents() { return students.filter((s) => getAverage(s) >= PASS_AVG); }

function renderStudents(log) {
    const out = $("stuOut");
    if (!students.length) { out.innerHTML = `<p class="muted">No students added yet.</p>`; renderFind(); return; }
    const topper = getTopper(), passed = getPassedStudents();
    out.innerHTML =
        block(`All students (${students.length})`, table(["ID", "Name", "Marks", "Average", "Result"],
            students.map((s) => [esc(s.id), esc(s.name), s.marks.join(", "), getAverage(s).toFixed(2),
            getAverage(s) >= PASS_AVG ? `<span class="pill">Pass</span>` : `<span class="pill no">Fail</span>`]))) +
        block("Topper", `<div class="stats"><div class="stat"><span>${esc(topper.id)}</span><b>${esc(topper.name)} · ${getAverage(topper).toFixed(2)}</b></div></div>`) +
        block(`Passed students (${passed.length})`, passed.length ? `<div class="chips">${passed.map((s) => `<span class="chip">${esc(s.name)}</span>`).join("")}</div>` : `<p class="muted">No one has passed yet.</p>`);
    renderFind();
    if (log) logGroup("Task 2 – Student Record Manager", () => {
        console.log("All students:"); console.table(students.map((s) => ({ ID: s.id, Name: s.name, Marks: s.marks.join(", "), Average: +getAverage(s).toFixed(2), Result: getAverage(s) >= PASS_AVG ? "Pass" : "Fail" })));
        console.log("Topper:"); console.table([{ ID: topper.id, Name: topper.name, Average: +getAverage(topper).toFixed(2) }]);
        console.log("Passed students:"); console.table(passed.map((s) => ({ ID: s.id, Name: s.name, Average: +getAverage(s).toFixed(2) })));
    });
}

function renderFind() {
    const q = $("findId").value.trim(), box = $("findOut");
    if (!q) { box.innerHTML = ""; return; }
    const s = findStudentById(q);
    box.innerHTML = s
        ? table(["ID", "Name", "Marks", "Average"], [[esc(s.id), esc(s.name), s.marks.join(", "), getAverage(s).toFixed(2)]])
        : `<p class="muted">No student found with ID "${esc(q)}".</p>`;
}
$("findId").addEventListener("input", renderFind);
$("findId").addEventListener("change", () => {
    const q = $("findId").value.trim(); if (!q) return;
    logGroup(`Task 2 – findStudentById("${q}")`, () => { const s = findStudentById(q); s ? console.table([{ ID: s.id, Name: s.name, Marks: s.marks.join(", "), Average: +getAverage(s).toFixed(2) }]) : console.log("Not found"); });
});

$("stuForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = $("sId").value.trim(), name = $("sName").value.trim(), raw = $("sMarks").value.trim();
    const marks = raw.split(",").map((m) => m.trim()).filter((m) => m !== "").map(Number);
    const bad = [];
    if (!id) bad.push("sId");
    if (!name) bad.push("sName");
    if (!marks.length || marks.some((m) => !Number.isFinite(m) || m < 0 || m > 100)) bad.push("sMarks");
    flagBad(["sId", "sName", "sMarks"], bad);
    if (bad.length) return;
    const res = addStudent(id, name, marks);
    if (res.error) { flagBad(["sId", "sName", "sMarks"], ["sId"]); alert(res.error); return; }
    $("stuForm").reset();
    renderStudents(true);
});
$("stuSample").addEventListener("click", () => {
    [["S1", "Ayesha", [78, 85, 92]], ["S2", "Bilal", [35, 40, 28]], ["S3", "Hina", [88, 91, 79]], ["S4", "Usman", [55, 60, 48]]]
        .forEach(([id, n, m]) => { if (!findStudentById(id)) addStudent(id, n, m); });
    renderStudents(true);
});
$("stuClear").addEventListener("click", () => { students = []; renderStudents(false); });

/* =====================================================
   TASK 3 – Sentence Analyzer
   ===================================================== */
function analyzeSentence(sentence) {
    const words = sentence.split(/\s+/).map((w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")).filter(Boolean);
    const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), "");
    const capitalized = words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
    const reversed = [...words].reverse();
    const frequency = words.reduce((acc, w) => { const k = w.toLowerCase(); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
    return { wordCount: words.length, longestWord, capitalized, reversed, frequency };
}

function runSentence(log) {
    const text = $("sentence").value.trim(), out = $("senOut");
    if (!text) { out.innerHTML = `<p class="muted">Your analysis will appear here.</p>`; return; }
    const r = analyzeSentence(text);
    if (!r.wordCount) { out.innerHTML = `<p class="err">No words found. Type some letters or numbers.</p>`; return; }
    out.innerHTML =
        block("Summary", `<div class="stats"><div class="stat"><span>Word count</span><b>${r.wordCount}</b></div>
      <div class="stat"><span>Longest word</span><b>${esc(r.longestWord)} (${r.longestWord.length})</b></div></div>`) +
        block("Capitalized words", `<p>${esc(r.capitalized.join(" "))}</p>`) +
        block("Reversed words", `<p>${esc(r.reversed.join(" "))}</p>`) +
        block("Word frequency", `<div class="chips">${Object.entries(r.frequency).map(([w, n]) => `<span class="chip">${esc(w)}<b>×${n}</b></span>`).join("")}</div>`);
    if (log) logGroup("Task 3 – Sentence Analyzer", () => {
        console.log("Input         :", text);
        console.log("Word count    :", r.wordCount);
        console.log("Longest word  :", r.longestWord);
        console.log("Capitalized   :", r.capitalized.join(" "));
        console.log("Reversed words:", r.reversed.join(" "));
        console.log("Frequency:"); console.table(r.frequency);
    });
}
$("sentence").addEventListener("input", () => runSentence(false));
$("senForm").addEventListener("submit", (e) => { e.preventDefault(); runSentence(true); });