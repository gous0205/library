// Storage + business rules. Every page talks to this file only, so replacing it with real API calls
// (fetch to a backend) later does not require touching the UI.
const K = { users: "library_users", books: "library_books", tx: "library_transactions", notes: "library_notifications", settings: "library_settings" };
export const DAY = 864e5;
export const MAX_BOOKS = 3;
export const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const save = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { throw new Error("Browser storage is full or blocked."); }
  window.dispatchEvent(new Event("lib:change"));
};
export const getUsers = () => read(K.users, []);
export const getBooks = () => read(K.books, []);
export const getTx = () => read(K.tx, []);
export const getNotes = () => read(K.notes, []);
export const getSettings = () => ({ libraryName: "Central College Library", loanDays: 14, baseUrl: "", ...read(K.settings, {}) });

/** Link placed inside QR codes: only a route + record id, never personal data. */
export const link = (s, path) => `${(s.baseUrl || window.location.origin + window.location.pathname).replace(/\/+$/, "")}/#${path}`;

function seed() {
  const now = Date.now();
  const B = [["Introduction to Algorithms", "T. Cormen", "9780262033848", "Computer Science", "MIT Press", 2009, 3],
    ["Clean Code", "Robert C. Martin", "9780132350884", "Computer Science", "Prentice Hall", 2008, 2],
    ["Eloquent JavaScript", "Marijn Haverbeke", "9781593279509", "Computer Science", "No Starch Press", 2018, 4],
    ["The Alchemist", "Paulo Coelho", "9780062315007", "Fiction", "HarperOne", 1988, 3],
    ["To Kill a Mockingbird", "Harper Lee", "9780061120084", "Fiction", "Harper", 1960, 2],
    ["A Brief History of Time", "Stephen Hawking", "9780553380163", "Science", "Bantam", 1988, 2],
    ["Sapiens", "Yuval N. Harari", "9780062316097", "History", "Harper", 2011, 3],
    ["Zero to One", "Peter Thiel", "9780804139298", "Business", "Crown", 2014, 2],
    ["Atomic Habits", "James Clear", "9780735211292", "Self-Help", "Avery", 2018, 4]];
  const books = B.map((b, i) => ({ id: `BK-${String(i + 1).padStart(3, "0")}`, title: b[0], author: b[1], isbn: b[2], category: b[3], publisher: b[4], year: b[5], total: b[6], available: b[6], cover: "" }));
  const mk = (id, name, roll, mail) => ({ id, role: "student", name, roll, email: mail, dept: "Computer Science", year: "3rd Year", phone: "9876543210", createdAt: now });
  const users = [{ id: "ADM-0001", role: "admin", name: "Librarian", email: "admin@college.edu", password: "admin123", createdAt: now },
    mk("MEM-1001", "Asha Rao", "21CS001", "asha@college.edu"), mk("MEM-1002", "Ravi Kumar", "21CS002", "ravi@college.edu")];
  const tx = [{ id: "TXN-DEMO01", memberId: "MEM-1001", bookId: "BK-001", issuedAt: now - 20 * DAY, dueAt: now - 6 * DAY, returnedAt: null },
    { id: "TXN-DEMO02", memberId: "MEM-1002", bookId: "BK-004", issuedAt: now - 3 * DAY, dueAt: now + 11 * DAY, returnedAt: null }];
  books[0].available--; books[3].available--;
  localStorage.setItem(K.users, JSON.stringify(users)); localStorage.setItem(K.books, JSON.stringify(books));
  localStorage.setItem(K.tx, JSON.stringify(tx)); localStorage.setItem(K.notes, "[]"); localStorage.setItem(K.settings, JSON.stringify(getSettings()));
}
export const init = () => { try { if (localStorage.getItem(K.users) === null) seed(); } catch { /* storage blocked */ } };
export const resetData = () => { Object.values(K).forEach((k) => localStorage.removeItem(k)); seed(); window.dispatchEvent(new Event("lib:change")); };
export const backup = () => JSON.stringify(Object.fromEntries(Object.entries(K).map(([n, k]) => [n, read(k, null)])), null, 2);
export const saveSettings = (s) => save(K.settings, { ...getSettings(), ...s });

const token = (t) => String(t || "").trim().split(/[#/]/).filter(Boolean).pop()?.toLowerCase();
export const findMember = (t) => { const k = token(t); return getUsers().find((u) => u.role === "student" && (u.id.toLowerCase() === k || u.roll.toLowerCase() === k)) || null; };
export const findBook = (t) => { const k = token(t); return getBooks().find((b) => b.id.toLowerCase() === k || b.isbn === k) || null; };
export const isOverdue = (t) => !t.returnedAt && Date.now() > t.dueAt;
export const activeOf = (memberId) => getTx().filter((t) => t.memberId === memberId && !t.returnedAt);

export function notify(userId, message, type = "info") {
  save(K.notes, [{ id: uid("NT"), userId, message, type, at: Date.now(), read: false }, ...getNotes()].slice(0, 200));
}
export const markRead = (userId) => save(K.notes, getNotes().map((n) => (n.userId === userId ? { ...n, read: true } : n)));

export function registerStudent(f) {
  const d = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, String(v).trim()]));
  if (!d.name || !d.roll || !d.email || !d.dept || !d.year || !d.phone) throw new Error("All fields are required.");
  if (!/^\S+@\S+\.\S+$/.test(d.email)) throw new Error("Enter a valid college email.");
  if (!/^\d{10}$/.test(d.phone)) throw new Error("Phone number must be 10 digits.");
  if (getUsers().some((u) => u.roll?.toLowerCase() === d.roll.toLowerCase())) throw new Error("This Student ID / Roll Number is already registered.");
  const user = { ...d, id: uid("MEM"), role: "student", createdAt: Date.now() };
  save(K.users, [...getUsers(), user]);
  notify(user.id, "Registration successful. Your library ID card is ready.", "success");
  return user;
}

export function saveBook(b) {
  const title = String(b.title || "").trim(), author = String(b.author || "").trim(), total = parseInt(b.total, 10);
  if (!title || !author) throw new Error("Title and author are required.");
  if (!(total >= 1)) throw new Error("Total copies must be at least 1.");
  const books = getBooks(), old = books.find((x) => x.id === b.id);
  const rec = { ...b, title, author, total, year: parseInt(b.year, 10) || "", cover: b.cover || "" };
  if (old) {
    const out = old.total - old.available;
    if (total < out) throw new Error(`${out} copies are currently issued; total cannot be lower.`);
    save(K.books, books.map((x) => (x.id === old.id ? { ...rec, available: total - out } : x)));
  } else save(K.books, [...books, { ...rec, id: uid("BK"), available: total }]);
}
export function deleteBook(id) {
  if (getTx().some((t) => t.bookId === id && !t.returnedAt)) throw new Error("Cannot delete: copies of this book are currently issued.");
  save(K.books, getBooks().filter((b) => b.id !== id));
}

export function issueBook(memberId, bookId) {
  const m = getUsers().find((u) => u.id === memberId && u.role === "student"), b = getBooks().find((x) => x.id === bookId);
  if (!m || !b) throw new Error("Student or book not found.");
  const mine = activeOf(memberId);
  if (b.available < 1) throw new Error("No copies of this book are available.");
  if (mine.length >= MAX_BOOKS) throw new Error(`Borrowing limit reached (${MAX_BOOKS} active books).`);
  if (mine.some((t) => t.bookId === bookId)) throw new Error("This student already has this book.");
  const t = { id: uid("TXN"), memberId, bookId, issuedAt: Date.now(), dueAt: Date.now() + getSettings().loanDays * DAY, returnedAt: null };
  save(K.books, getBooks().map((x) => (x.id === bookId ? { ...x, available: x.available - 1 } : x)));
  save(K.tx, [...getTx(), t]);
  notify(memberId, `“${b.title}” issued. Due on ${new Date(t.dueAt).toLocaleDateString("en-IN")}.`, "success");
  return t;
}
export function returnBook(memberId, bookId) {
  const t = getTx().find((x) => x.memberId === memberId && x.bookId === bookId && !x.returnedAt);
  if (!t) throw new Error("No active borrowing record for this student and book (already returned?).");
  const done = { ...t, returnedAt: Date.now() };
  save(K.tx, getTx().map((x) => (x.id === t.id ? done : x)));
  save(K.books, getBooks().map((x) => (x.id === bookId ? { ...x, available: x.available + 1 } : x)));
  notify(memberId, `“${getBooks().find((b) => b.id === bookId)?.title}” returned. Thank you!`, "success");
  return done;
}
