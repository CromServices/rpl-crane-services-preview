(function () {
  var TZ = "Australia/Sydney";

  function partsInTz(date) {
    var fmt = new Intl.DateTimeFormat("en-AU", {
      timeZone: TZ,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
    var map = {};
    fmt.formatToParts(date).forEach(function (p) {
      map[p.type] = p.value;
    });
    return map;
  }

  function ymdInTz(date) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function weekdayInTz(date) {
    return new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "short" }).format(date);
  }

  function fillChips(root) {
    if (!root) return;
    root.innerHTML = "";
    var start = new Date();
    var added = 0;
    var i = 0;
    while (added < 14 && i < 28) {
      var d = new Date(start.getTime() + i * 86400000);
      i++;
      var wd = weekdayInTz(d);
      if (wd === "Sun") continue;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (added === 0 ? " is-on" : "");
      b.setAttribute("data-date", ymdInTz(d));
      if (added === 0) b.setAttribute("aria-pressed", "true");
      var p = partsInTz(d);
      var mon = (p.month || "").slice(0, 3);
      b.innerHTML =
        '<span class="dow">' +
        wd +
        '</span><span class="dom">' +
        p.day +
        '</span><span class="mon">' +
        mon +
        "</span>";
      root.appendChild(b);
      added++;
    }
  }

  document.querySelectorAll(".day-chips").forEach(fillChips);

  function groupSelect(containerSelector, itemSelector) {
    document.querySelectorAll(containerSelector).forEach(function (box) {
      box.addEventListener("click", function (e) {
        var el = e.target.closest(itemSelector);
        if (!el || !box.contains(el) || el.disabled) return;
        box.querySelectorAll(itemSelector).forEach(function (n) {
          n.classList.remove("is-on");
          n.setAttribute("aria-pressed", "false");
        });
        el.classList.add("is-on");
        el.setAttribute("aria-pressed", "true");
        updateSummaries();
      });
    });
  }

  groupSelect(".day-chips", ".chip");
  groupSelect(".time-pills", ".pill");

  document.querySelectorAll(".job-chips").forEach(function (box) {
    box.addEventListener("click", function (e) {
      var el = e.target.closest(".job-chip");
      if (!el || !box.contains(el)) return;
      box.querySelectorAll(".job-chip").forEach(function (n) {
        n.classList.remove("is-on");
        n.setAttribute("aria-pressed", "false");
      });
      el.classList.add("is-on");
      el.setAttribute("aria-pressed", "true");
      var kind = el.getAttribute("data-job");
      var form = el.closest("form") || document;
      form.querySelectorAll(".spec-block").forEach(function (b) {
        if (b.getAttribute("data-job") === kind) b.removeAttribute("hidden");
        else b.setAttribute("hidden", "");
      });
      updateSummaries();
    });
  });

  function selectedText(root, sel) {
    var n = root.querySelector(sel);
    return n ? n.textContent.trim() : "";
  }

  function chipLabel(chip) {
    if (!chip) return "";
    var d = chip.querySelector(".dow");
    var n = chip.querySelector(".dom");
    var m = chip.querySelector(".mon");
    return ((d && d.textContent) || "") + " " + ((n && n.textContent) || "") + " " + ((m && m.textContent) || "");
  }

  function updateOne(form) {
    var job = selectedText(form, ".job-chip.is-on");
    var chip = form.querySelector(".chip.is-on");
    var day = chipLabel(chip);
    var win = selectedText(form, ".time-pills .pill.is-on");
    var line = [job, day, win].filter(Boolean).join(" · ");
    var sum = form.querySelector(".summary");
    if (sum) sum.textContent = line;
    return line;
  }

  function updateSummaries() {
    document.querySelectorAll("form").forEach(updateOne);
  }
  updateSummaries();

  document.querySelectorAll("form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var line = updateOne(f);
      var t = f.querySelector(".thanks");
      if (t) {
        t.textContent = line ? "Request saved. " + line : "Request saved.";
        t.classList.add("is-on");
        t.style.display = "block";
      }
    });
  });

  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("rpl-theme", next);
      } catch (err) {}
    });
  }
})();
