// ===== Home hero: one form, two meanings (homonymy) =====
(function () {
  const word = document.getElementById("flip-word");
  const sense = document.getElementById("flip-sense");
  if (!word || !sense) return;
  const senses = ["a small flying mammal", "a wooden club used to hit a ball"];
  let i = 0;
  word.addEventListener("click", () => {
    i = (i + 1) % senses.length;
    sense.classList.add("fading");
    setTimeout(() => {
      sense.textContent = senses[i];
      sense.classList.remove("fading");
    }, 220);
  });
})();

// ===== Semantics: entailment quiz =====
(function () {
  const root = document.getElementById("quiz");
  if (!root) return;

  const items = [
    { p: "Fluffy is a poodle.", c: "Fluffy is a dog.", yes: true,
      why: "Poodle is a hyponym of dog. Every poodle is in the set of dogs, so if the first is true, the second must be true." },
    { p: "Fluffy is a dog.", c: "Fluffy is a poodle.", yes: false,
      why: "Not all dogs are poodles. Fluffy could be a beagle." },
    { p: "I have a female sibling.", c: "I have a sister.", yes: true,
      why: "\u201cFemale sibling\u201d and \u201csister\u201d are synonyms: they have the same reference." },
    { p: "I have a sibling.", c: "I have a sister.", yes: false,
      why: "A sibling could be a brother. Sister is a hyponym of sibling, so the entailment only works in the other direction." },
    { p: "In a possible world, all cats are aliens.", c: "In that world, my cat Luna is an alien.", yes: true,
      why: "Luna is a cat, and in that world every cat is an alien, so Luna must be one too." },
    { p: "In a possible world, all cats are aliens.", c: "In that world, Luna is an alien.", yes: false,
      why: "We don\u2019t know that Luna is a cat. Without that, the first sentence tells us nothing about her." },
    { p: "My sister speaks Chinese.", c: "We live in Canada.", yes: false,
      why: "The two propositions are unrelated. One being true says nothing about the other." },
    { p: "Cows are vegetarian.", c: "Cows don\u2019t eat meat.", yes: true,
      why: "Being vegetarian means not eating meat, so the second must be true if the first is." }
  ];

  let idx = 0, score = 0, answered = false;

  function render() {
    if (idx >= items.length) {
      root.innerHTML = `
        <p class="quiz-progress">Finished</p>
        <p class="quiz-premise">${score} of ${items.length} correct</p>
        <p class="quiz-question">${score === items.length ? "Perfect. Entailment mastered." : "Review the ones you missed and try again."}</p>
        <div class="choices"><button class="btn" id="q-restart">Start again</button></div>`;
      document.getElementById("q-restart").onclick = () => { idx = 0; score = 0; render(); };
      return;
    }
    const q = items[idx];
    answered = false;
    root.innerHTML = `
      <p class="quiz-progress">Question ${idx + 1} of ${items.length}</p>
      <p class="quiz-premise">${q.p}</p>
      <p class="quiz-arrow" aria-hidden="true">entails?</p>
      <p class="quiz-conclusion">${q.c}</p>
      <p class="quiz-question">Does the first sentence entail the second?</p>
      <div class="choices">
        <button class="btn ghost" data-a="yes" aria-pressed="false">Yes, entailment</button>
        <button class="btn ghost" data-a="no" aria-pressed="false">No entailment</button>
      </div>
      <div class="feedback" aria-live="polite"></div>`;
    root.querySelectorAll("[data-a]").forEach(b => b.addEventListener("click", () => answer(b)));
  }

  function answer(btn) {
    if (answered) return;
    answered = true;
    const q = items[idx];
    const saidYes = btn.dataset.a === "yes";
    const correct = saidYes === q.yes;
    if (correct) score++;
    btn.setAttribute("aria-pressed", "true");
    const fb = root.querySelector(".feedback");
    fb.innerHTML = `
      <p><span class="verdict ${correct ? "right" : "wrong"}">${correct ? "Correct." : "Not quite."}</span> ${q.why}</p>
      <button class="btn" id="q-next">${idx === items.length - 1 ? "See score" : "Next question"}</button>`;
    document.getElementById("q-next").onclick = () => { idx++; render(); };
    document.getElementById("q-next").focus();
  }

  render();
})();

// ===== Segmented switchers (pragmatics contexts, speech styles) =====
// Each button's data-ctx is the id of the panel it shows.
document.querySelectorAll(".seg[data-ctx-group]").forEach(seg => {
  const buttons = seg.querySelectorAll("button[data-ctx]");
  const ids = [...buttons].map(b => b.dataset.ctx);
  function show(id) {
    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.ctx === id)));
    ids.forEach(pid => { const p = document.getElementById(pid); if (p) p.hidden = pid !== id; });
  }
  buttons.forEach(b => b.addEventListener("click", () => show(b.dataset.ctx)));
  if (ids.length) show(ids[0]);
});

// ===== Variety switches (British/American spelling, Spanish/Portuguese morphemes) =====
// A [data-switch] block holds a .seg whose buttons have data-variety="uk" etc.
// Each .spell inside has one attribute per variety, e.g. data-uk="col[our]".
// The part in [brackets] is highlighted.
document.querySelectorAll("[data-switch]").forEach(block => {
  const buttons = block.querySelectorAll(".seg button[data-variety]");
  const words = block.querySelectorAll(".spell");
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  function render(variety) {
    buttons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.variety === variety)));
    words.forEach(w => {
      const v = w.dataset[variety] || "";
      w.innerHTML = esc(v).replace(/\[([^\]]*)\]/g, '<span class="end">$1</span>');
    });
  }
  buttons.forEach(b => b.addEventListener("click", () => render(b.dataset.variety)));
  if (buttons.length) render(buttons[0].dataset.variety);
});

// ===== Slide galleries =====
document.querySelectorAll(".gallery-wrap").forEach(wrap => {
  const track = wrap.querySelector(".gallery");
  const slides = track.querySelectorAll("figure");
  const count = wrap.querySelector(".gallery-count");
  function current() {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  }
  function go(i) {
    const s = slides[Math.max(0, Math.min(slides.length - 1, i))];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: "smooth" });
  }
  function update() { if (count) count.textContent = `${current() + 1} / ${slides.length}`; }
  wrap.querySelector("[data-dir='prev']").addEventListener("click", () => go(current() - 1));
  wrap.querySelector("[data-dir='next']").addEventListener("click", () => go(current() + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();
});

// ===== Mobile nav: keep the current page's link in view =====
(function () {
  const cur = document.querySelector(".nav ul a[aria-current='page']");
  if (!cur) return;
  const ul = cur.closest("ul");
  if (ul.scrollWidth > ul.clientWidth) ul.scrollLeft = cur.offsetLeft - (ul.clientWidth - cur.offsetWidth) / 2;
})();

// ===== Portfolio: show one linguistic area across every source =====
(function () {
  const bar = document.querySelector("[data-area-filter]");
  if (!bar) return;
  const chips = bar.querySelectorAll(".chip");
  const areas = document.querySelectorAll(".area[data-area]");
  function show(area) {
    chips.forEach(c => c.setAttribute("aria-pressed", String(c.dataset.area === area)));
    areas.forEach(a => { a.hidden = area !== "all" && a.dataset.area !== area; });
    document.body.classList.toggle("filtered", area !== "all");
  }
  chips.forEach(c => c.addEventListener("click", () => show(c.dataset.area)));
  show("all");
})();
