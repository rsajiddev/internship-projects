"use strict";

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rs = (n) => "Rs. " + n.toLocaleString("en-PK");

// Live update on typing; console output only when the form is submitted.
function bind(formId, handler) {
  const form = $(formId);
  form.addEventListener("input", () => handler(false));
  form.addEventListener("submit", (e) => { e.preventDefault(); handler(true); });
  handler(false);
}

// Structured console output
function logGroup(title, fn) {
  console.group("%c" + title, "color:#0f766e;font-weight:bold");
  fn();
  console.groupEnd();
}

/* ---------- Tabs ---------- */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    $(tab.dataset.target).classList.add("active");
  });
});

/* =====================================================
   TASK 1 – Grade Calculator
   ===================================================== */
const SUBJECTS = ["English", "Urdu", "Mathematics", "Science", "Islamiyat"];
const PASS_MARK = 33;

function getGrade(marks) {
  if (marks >= 80) return "A+";
  if (marks >= 70) return "A";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  return "F";
}

$("marksFields").innerHTML = SUBJECTS.map((s, i) =>
  `<label class="field">${s}<input type="number" id="m${i}" min="0" max="100" placeholder="0-100" value="${[78, 85, 64, 91, 29][i]}"></label>`
).join("");

function runGrade(log) {
  const out = $("gradeOut");
  const inputs = SUBJECTS.map((_, i) => $("m" + i));
  let valid = true;
  const marks = inputs.map((inp) => {
    const v = inp.value.trim() === "" ? NaN : Number(inp.value);
    const ok = Number.isFinite(v) && v >= 0 && v <= 100;
    inp.classList.toggle("bad", !ok && inp.value !== "");
    if (!ok) valid = false;
    return v;
  });
  if (!valid) {
    out.innerHTML = `<p class="err">Enter marks between 0 and 100 for all 5 subjects.</p>`;
    return;
  }
  const name = $("studentName").value.trim() || "Student";
  const total = marks.reduce((a, b) => a + b, 0);
  const percentage = total / SUBJECTS.length;
  const grade = getGrade(percentage);
  const failed = SUBJECTS.filter((_, i) => marks[i] < PASS_MARK);
  const result = failed.length ? "Fail" : "Pass";
  const cls = result === "Pass" ? "pass" : "fail";

  const rows = SUBJECTS.map((s, i) => `
    <tr class="${marks[i] < PASS_MARK ? "failrow" : ""}">
      <td>${s}</td><td class="num">${marks[i]}</td><td class="num">${getGrade(marks[i])}</td>
      <td class="num">${marks[i] < PASS_MARK ? "Fail" : "Pass"}</td></tr>`).join("");

  out.innerHTML = `
    <h2>${esc(name)}'s result <span class="badge ${cls}">${result}</span></h2>
    <div class="stats">
      <div class="stat"><span>Total</span><b>${total} / ${SUBJECTS.length * 100}</b></div>
      <div class="stat"><span>Percentage</span><b>${percentage.toFixed(1)}%</b></div>
      <div class="stat"><span>Grade</span><b>${grade}</b></div>
      <div class="stat"><span>Result</span><b>${result}</b></div>
    </div>
    <table><thead><tr><th>Subject</th><th class="num">Marks</th><th class="num">Grade</th><th class="num">Status</th></tr></thead>
    <tbody>${rows}</tbody></table>
    ${failed.length ? `<p class="verdict fail">Failed in: ${failed.join(", ")} (below ${PASS_MARK}).</p>` : `<p class="verdict pass">Passed all subjects.</p>`}`;

  if (log) {
    logGroup(`Task 1 – Grade Calculator: ${name}`, () => {
      console.table(SUBJECTS.map((s, i) => ({ Subject: s, Marks: marks[i], Grade: getGrade(marks[i]), Status: marks[i] < PASS_MARK ? "Fail" : "Pass" })));
      console.log("Total      :", `${total} / ${SUBJECTS.length * 100}`);
      console.log("Percentage :", percentage.toFixed(2) + "%");
      console.log("Grade      :", grade);
      console.log("Result     :", result + (failed.length ? ` (failed: ${failed.join(", ")})` : ""));
    });
  }
}
bind("gradeForm", runGrade);

/* =====================================================
   TASK 2 – Number Games
   ===================================================== */
function multiplicationTable(n, upto = 10) {
  const rows = [];
  for (let i = 1; i <= upto; i++) rows.push({ n, i, product: n * i });
  return rows;
}
function evenNumbers(limit) {
  const list = [];
  for (let i = 1; i <= limit; i++) if (i % 2 === 0) list.push(i);
  return list;
}
function sumTo(limit) {
  let sum = 0;
  for (let i = 1; i <= limit; i++) sum += i;
  return sum;
}
function fizzBuzz(limit) {
  const list = [];
  for (let i = 1; i <= limit; i++) {
    let label = i, type = "";
    if (i % 15 === 0) { label = "FizzBuzz"; type = "fizzbuzz"; }
    else if (i % 3 === 0) { label = "Fizz"; type = "fizz"; }
    else if (i % 5 === 0) { label = "Buzz"; type = "buzz"; }
    list.push({ n: i, label, type });
  }
  return list;
}
function isPalindrome(text) {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean.length > 0 && clean === clean.split("").reverse().join("");
}

const intIn = (id, min, max) => {
  const el = $(id), v = Number(el.value);
  const ok = el.value.trim() !== "" && Number.isInteger(v) && v >= min && v <= (max ?? Infinity);
  el.classList.toggle("bad", !ok);
  return ok ? v : null;
};
const errMsg = (box, text) => { $(box).innerHTML = `<p class="err">${text}</p>`; };

// Multiplication table
bind("tableForm", (log) => {
  const n = Number($("tableNum").value), upto = intIn("tableUpto", 1, 100);
  if ($("tableNum").value.trim() === "" || !Number.isFinite(n)) return errMsg("tableOut", "Enter a number.");
  if (upto === null) return errMsg("tableOut", "“Up to” must be a whole number from 1 to 100.");
  const rows = multiplicationTable(n, upto);
  $("tableOut").innerHTML = `<table><tbody>${rows.map((r) => `<tr><td>${r.n} × ${r.i}</td><td class="num"><b>${r.product}</b></td></tr>`).join("")}</tbody></table>`;
  if (log) logGroup(`Task 2 – Multiplication table of ${n}`, () => {
    rows.forEach((r) => console.log(`${r.n} x ${r.i} = ${r.product}`));
  });
});

// Even numbers
bind("evenForm", (log) => {
  const limit = intIn("evenLimit", 1, 1000);
  if (limit === null) return errMsg("evenOut", "Enter a whole number from 1 to 1000.");
  const list = evenNumbers(limit);
  $("evenOut").innerHTML = `<p class="empty">${list.length} even numbers found</p><div class="chips">${list.map((n) => `<span class="chip">${n}</span>`).join("")}</div>`;
  if (log) logGroup(`Task 2 – Even numbers (1 to ${limit})`, () => { console.log(list.join(", ")); console.log("Count:", list.length); });
});

// Sum
bind("sumForm", (log) => {
  const limit = intIn("sumLimit", 1, 100000);
  if (limit === null) return errMsg("sumOut", "Enter a whole number from 1 to 100000.");
  const sum = sumTo(limit);
  $("sumOut").innerHTML = `<p class="empty">Sum of 1 to ${limit}</p><p class="big">${sum.toLocaleString("en-PK")}</p>`;
  if (log) logGroup(`Task 2 – Sum (1 to ${limit})`, () => console.log("Sum =", sum));
});

// FizzBuzz
bind("fizzForm", (log) => {
  const limit = intIn("fizzLimit", 1, 200);
  if (limit === null) return errMsg("fizzOut", "Enter a whole number from 1 to 200.");
  const list = fizzBuzz(limit);
  $("fizzOut").innerHTML = `<div class="chips">${list.map((x) => `<span class="chip ${x.type}">${x.label}</span>`).join("")}</div>`;
  if (log) logGroup(`Task 2 – FizzBuzz (1 to ${limit})`, () => list.forEach((x) => console.log(x.n + ":", x.label)));
});

// Palindrome
bind("palForm", (log) => {
  const text = $("palText").value.trim();
  if (!text) return errMsg("palOut", "Type a word or phrase.");
  const yes = isPalindrome(text);
  $("palOut").innerHTML = `<p class="verdict ${yes ? "pass" : "fail"}">“${esc(text)}” is ${yes ? "" : "not "}a palindrome.</p>`;
  if (log) logGroup("Task 2 – Palindrome checker", () => console.log(`"${text}" ->`, yes ? "Palindrome" : "Not a palindrome"));
});

/* =====================================================
   TASK 3 – Electricity Bill (practice rates)
   ===================================================== */
function calculateBill(units) {
  const slabs = [
    { label: "First 100 units", rate: 10, cap: 100 },
    { label: "Next 100 units", rate: 15, cap: 100 },
    { label: "Above 200 units", rate: 20, cap: Infinity },
  ];
  let left = units, total = 0;
  const breakdown = slabs.map((s) => {
    const used = Math.min(left, s.cap);
    left -= used;
    const amount = used * s.rate;
    total += amount;
    return { Slab: s.label, Units: used, Rate: s.rate, Amount: amount };
  });
  return { units, breakdown, total };
}

function billTable(bill) {
  return `<table><thead><tr><th>Slab</th><th class="num">Units</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead><tbody>
    ${bill.breakdown.map((b) => `<tr><td>${b.Slab}</td><td class="num">${b.Units}</td><td class="num">${rs(b.Rate)}</td><td class="num">${rs(b.Amount)}</td></tr>`).join("")}
    <tr class="total"><td>Total (${bill.units} units)</td><td></td><td></td><td class="num">${rs(bill.total)}</td></tr></tbody></table>`;
}

bind("billForm", (log) => {
  const out = $("billOut"), el = $("units"), v = Number(el.value);
  const ok = el.value.trim() !== "" && Number.isFinite(v) && v >= 0;
  el.classList.toggle("bad", !ok);
  if (!ok) { out.innerHTML = `<p class="err">Enter units as 0 or more.</p>`; return; }
  const bill = calculateBill(v);
  out.innerHTML = `<h2>Bill for ${v} units</h2>${billTable(bill)}`;
  if (log) logGroup(`Task 3 – Electricity bill (${v} units)`, () => {
    console.table(bill.breakdown);
    console.log("Total bill:", rs(bill.total));
  });
});

$("testBtn").addEventListener("click", () => {
  const tests = [80, 150, 350].map(calculateBill);
  const box = $("testOut");
  box.hidden = false;
  box.innerHTML = `<h2>Test results</h2><table><thead><tr><th>Units</th><th class="num">Total bill</th></tr></thead><tbody>
    ${tests.map((t) => `<tr><td>${t.units}</td><td class="num">${rs(t.total)}</td></tr>`).join("")}</tbody></table>`;
  logGroup("Task 3 – Test cases (80, 150, 350 units)", () => {
    console.table(tests.map((t) => ({ Units: t.units, "Total (Rs.)": t.total })));
  });
});
