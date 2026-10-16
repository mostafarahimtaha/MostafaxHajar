
const w = (n, e, o, t, l, d) => {
  const u = document.createElement("div");
  u.className = `${n} ${d.sectionClass}`;
  const c = document.createElement("div"),
    a = document.createElement("span"),
    r = document.createElement("span");

  return (
    a.className = `${e} ${d.amountClass}`,
    r.className = `${o} ${d.wordClass}`,
    a.textContent = String(t),
    r.textContent = l,
    c.appendChild(a),
    c.appendChild(r),
    u.appendChild(c),
    u
  );
};

const b = (n, e, o) => {
  const t = n.querySelector(".simply-amount");
  const l = n.querySelector(".simply-word");

  t && (t.textContent = String(e));
  l && (l.textContent = o);
};

const E = (n, e) => {
  const o = "simply-amount";
  const t = "simply-word";

  const l = w("simply-section simply-days-section", o, t, 0, "day", e);
  const d = w("simply-section simply-hours-section", o, t, 0, "hour", e);
  const u = w("simply-section simply-minutes-section", o, t, 0, "minute", e);
  const c = w("simply-section simply-seconds-section", o, t, 0, "second", e);

  n.appendChild(l);
  n.appendChild(d);
  n.appendChild(u);
  n.appendChild(c);

  return {
    days: l,
    hours: d,
    minutes: u,
    seconds: c
  };
};

/*!
 * Project : simplyCountdown.js
 * Date : 2024-12-29
 * License : MIT
 * Version : 3.0.1
 * Author : Vincent Loy-Serre
 * Contributors :
 *  - Justin Beasley
 *  - Nathan Smith
 *  - Mehdi Rezaei
 *  - mira01
 */

const m = {
  // Wedding: November 6, 2026, 2:30 PM Cairo time (UTC+2).
  // Equivalent UTC target: November 6, 2026, 12:30 PM.
  year: 2026,
  month: 11,
  day: 6,
  hours: 12,
  minutes: 30,
  seconds: 0,
  enableUtc: true,

  words: {
    days: {
      lambda: (n, e) => e > 1 ? n + "s" : n,
      root: "day"
    },
    hours: {
      lambda: (n, e) => e > 1 ? n + "s" : n,
      root: "hour"
    },
    minutes: {
      lambda: (n, e) => e > 1 ? n + "s" : n,
      root: "minute"
    },
    seconds: {
      lambda: (n, e) => e > 1 ? n + "s" : n,
      root: "second"
    }
  },

  plural: true,
  inline: false,
  inlineSeparator: ", ",

  // UTC enabled so every visitor sees the same target instant.
  enableUtc: true,

  onEnd: () => {},
  refresh: 1000,
  inlineClass: "simply-countdown-inline",
  sectionClass: "simply-section",
  amountClass: "simply-amount",
  wordClass: "simply-word",
  zeroPad: false,
  countUp: false,
  removeZeroUnits: false,
  onStop: () => {},
  onResume: () => {},
  onUpdate: () => {}
};

const N = (n) => n instanceof NodeList;

function I(n, e) {
  return `${e.zeroPad ? String(n.value).padStart(2, "0") : n.value} ${
    e.words[n.word].lambda(e.words[n.word].root, n.value)
  }`;
}

function S(n, e, o) {
  return o.removeZeroUnits
    ? n.value !== 0 || e.some((t) => t.value !== 0)
    : true;
}

function M(n, e, o) {
  const t = n
    .filter((l, d) => S(l, n.slice(0, d), e))
    .map((l) => I(l, e))
    .join(e.inlineSeparator);

  o.innerHTML = t;
}

function $(n, e, o) {
  n.forEach((t, l) => {
    if (t.word === "seconds" || S(t, n.slice(0, l), e)) {
      b(
        o[t.word],
        e.zeroPad ? String(t.value).padStart(2, "0") : t.value,
        e.words[t.word].lambda(e.words[t.word].root, t.value)
      );

      o[t.word].style.display = "";
    } else {
      o[t.word].style.display = "none";
    }
  });
}

const y = (n, e) => {
  let o = {
    isPaused: false,
    interval: null,
    targetDate: new Date()
  };

  const t = (s) =>
    s.enableUtc
      ? new Date(
          Date.UTC(
            s.year,
            s.month - 1,
            s.day,
            s.hours,
            s.minutes,
            s.seconds
          )
        )
      : new Date(
          s.year,
          s.month - 1,
          s.day,
          s.hours,
          s.minutes,
          s.seconds
        );

  o.targetDate = t(e);

  let l = null;

  if (e.inline) {
    l = document.createElement("span");
    l.className = e.inlineClass;
    n.appendChild(l);
  }

  const d = e.inline
    ? null
    : E(n, {
        sectionClass: e.sectionClass,
        amountClass: e.amountClass,
        wordClass: e.wordClass
      });

  const u = () => {
    const s = e.enableUtc
      ? new Date(
          Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth(),
            new Date().getUTCDate(),
            new Date().getUTCHours(),
            new Date().getUTCMinutes(),
            new Date().getUTCSeconds()
          )
        )
      : new Date();

    let i = e.countUp
      ? s.getTime() - o.targetDate.getTime()
      : o.targetDate.getTime() - s.getTime();

    if (i <= 0 && !e.countUp) {
      i = 0;

      if (o.interval !== null) {
        clearInterval(o.interval);
      }

      if (e.onEnd) {
        e.onEnd();
      }
    }

    const f = Math.floor(i / (1000 * 60 * 60 * 24));
    i -= f * 1000 * 60 * 60 * 24;

    const C = Math.floor(i / (1000 * 60 * 60));
    i -= C * 1000 * 60 * 60;

    const v = Math.floor(i / (1000 * 60));
    i -= v * 1000 * 60;

    const g = Math.floor(i / 1000);

    const values = [
      { value: f, word: "days" },
      { value: C, word: "hours" },
      { value: v, word: "minutes" },
      { value: g, word: "seconds" }
    ];

    if (e.inline && l) {
      M(values, e, l);
    } else if (d) {
      $(values, e, d);
    }
  };

  const c = () => {
    o.interval = setInterval(u, e.refresh);
    u();
  };

  const a = () => {
    if (o.interval !== null) {
      clearInterval(o.interval);
      o.interval = null;
    }

    o.isPaused = true;
    e.onStop?.();
  };

  const r = () => {
    if (o.isPaused) {
      c();
      o.isPaused = false;
      e.onResume?.();
    }
  };

  const U = (s) => {
    Object.assign(e, s);

    if (
      s.year !== undefined ||
      s.month !== undefined ||
      s.day !== undefined ||
      s.hours !== undefined ||
      s.minutes !== undefined ||
      s.seconds !== undefined
    ) {
      o.targetDate = t(e);
    }

    e.onUpdate?.(s);

    if (!o.isPaused) {
      if (o.interval) {
        clearInterval(o.interval);
      }

      c();
    }
  };

  const p = () => ({ ...o });

  c();

  const h = new MutationObserver((s) => {
    s.forEach((i) => {
      i.removedNodes.forEach((f) => {
        if (f === n) {
          if (o.interval !== null) {
            clearInterval(o.interval);
          }

          h.disconnect();
        }
      });
    });
  });

  if (n.parentNode) {
    h.observe(n.parentNode, { childList: true });
  }

  return {
    stopCountdown: a,
    resumeCountdown: r,
    updateCountdown: U,
    getState: p
  };
};

const D = (n) => {
  const e = n;

  e.stopCountdown = () =>
    n.forEach((o) => o.stopCountdown());

  e.resumeCountdown = () =>
    n.forEach((o) => o.resumeCountdown());

  e.updateCountdown = (o) =>
    n.forEach((t) => t.updateCountdown(o));

  e.getState = () =>
    n.map((o) => o.getState());

  return e;
};

const x = (n, e = m) => {
  const o = { ...m, ...e };

  if (typeof n === "string") {
    const t = document.querySelectorAll(n);
    const l = Array.from(t).map((d) => y(d, o));

    return l.length === 1 ? l[0] : D(l);
  }

  if (N(n)) {
    const t = Array.from(n).map((l) => y(l, o));

    return t.length === 1 ? t[0] : D(t);
  }

  return y(n, o);
};

export {
  x as default
};

//# sourceMappingURL=simplyCountdown.js.map
