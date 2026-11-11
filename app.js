(function () {
  var TZ = "Australia/Sydney";
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var mons = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
    var p = new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
    return p;
  }

  function weekdayInTz(date) {
    return new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "short" }).format(date);
  }

  function fillChips(root) {
    if (!root) return;
    root.innerHTML = "";
    var start = new Date();
    var first = 0;
    for (var i = 0; i < 14; i++) {
      var d = new Date(start.getTime() + i * 86400000);
      var wd = weekdayInTz(d);
      var weekend = wd === "Sat" || wd === "Sun";
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute("data-date", ymdInTz(d));
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
      if (weekend) {
        b.disabled = true;
        b.classList.add("is-off");
        b.setAttribute("aria-disabled", "true");
      } else if (first === 0) {
        b.classList.add("is-on");
        first = 1;
      }
      root.appendChild(b);
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
  groupSelect(".job-chips", ".pill");
  groupSelect(".crane-pick", ".pick");

  document.querySelectorAll(".pick").forEach(function (el) {
    el.classList.add("is-on");
    el.setAttribute("aria-pressed", "true");
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
    var plant = selectedText(form, ".pick.is-on h3") || "Proline crane and borer on a Scania";
    var chip = form.querySelector(".chip.is-on");
    var day = chipLabel(chip);
    var win = selectedText(form, ".time-pills .pill.is-on");
    var job = selectedText(form, ".job-chips .pill.is-on");
    var line = [plant, day, win, job].filter(Boolean).join(" · ");
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
        t.textContent = "Request saved. " + line;
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
