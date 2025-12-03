(function () {
  "use strict";

  // ===== CONFIG =====
  const CONFIG = {
    GLOBAL_INIT: "__tossInvestPlusInit",
    POLL_MS: 700,
    UPDATE_INTERVAL_MS: 50,
    VERSION: "1.1.0",
  };

  const FEATURES = {
    FLOAT_PANEL: true,
    CURSOR_TOOLTIP: true,
  };

  const STORAGE_KEYS = {
    FLOAT_PANEL_POS: "tv-float-panel-pos",
    USER_SETTINGS: "toss-invest-plus-settings",
  };

  // ===== UTILS =====
  function fmtPrice(x) {
    if (x == null || Number.isNaN(x)) return "-";
    const n = Number(x);
    const str = n.toFixed(6);
    return str.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
  }

  function fmtPct(x) {
    if (x == null || Number.isNaN(x)) return "-";
    const sign = x >= 0 ? "+" : "";
    return sign + x.toFixed(2) + "%";
  }

  function findTradingViewIframe() {
    const iframes = Array.from(document.querySelectorAll("iframe"));
    return (
      iframes.find(
        (f) =>
          /^tradingview_/i.test(f.id || "") ||
          /^tradingview_/i.test(f.name || "") ||
          f.hasAttribute("data-widget-options") ||
          f.getAttribute("title") === "Financial Chart"
      ) || null
    );
  }

  // ===== PRICE DATA =====
  function getCursorPrice(model) {
    try {
      const src = model.crossHairSource();
      const price = src ? src.price : null;
      const flooredPrice = Math.floor(price);
      return flooredPrice;
    } catch {
      return null;
    }
  }

  function getLastPrice(model) {
    try {
      const panes = model.panes && model.panes();
      if (!panes || !panes.length) return null;

      const pane = panes[0];
      if (!pane || !pane.defaultPriceScale) return null;

      const priceScale = pane.defaultPriceScale();
      if (!priceScale || !priceScale.mainSource) return null;

      const mainSource = priceScale.mainSource();
      if (!mainSource || typeof mainSource.lastValueData !== "function") {
        return null;
      }

      const lv = mainSource.lastValueData();
      if (!lv || lv.noData) return null;

      const str = lv.formattedPriceAbsolute ?? lv.text ?? null;

      if (!str) return null;

      const num = parseFloat(String(str).replace(/[^\d.\-]/g, ""));
      if (Number.isNaN(num)) return null;

      return num;
    } catch {
      return null;
    }
  }

  // ===== FLOAT PANEL =====
  function setupDragAndDrop(panel, idoc, w) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    panel.addEventListener("mousedown", (e) => {
      isDragging = true;

      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      startX = e.clientX;
      startY = e.clientY;

      panel.style.cursor = "grabbing";
      panel.style.transition = "none";
    });

    idoc.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      panel.style.left = `${initialLeft + dx}px`;
      panel.style.top = `${initialTop + dy}px`;
      panel.style.right = "auto";
    });

    idoc.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      panel.style.cursor = "move";

      try {
        w.localStorage.setItem(
          STORAGE_KEYS.FLOAT_PANEL_POS,
          JSON.stringify({
            left: panel.style.left,
            top: panel.style.top,
          })
        );
      } catch (e) {
        console.error("Storage save failed", e);
      }
    });
  }

  function createFloatPanel(widget, idoc, w) {
    const PANEL_ID = "tv-custom-float-panel";
    const model = widget._model;

    const old = idoc.getElementById(PANEL_ID);
    if (old) old.remove();

    const panel = idoc.createElement("div");
    panel.id = PANEL_ID;
    panel.textContent = "loading...";

    const chartRoot = widget._mainDiv || idoc.body;

    let savedPos = null;
    try {
      const raw = w.localStorage.getItem(STORAGE_KEYS.FLOAT_PANEL_POS);
      if (raw) savedPos = JSON.parse(raw);
    } catch (e) {}

    Object.assign(panel.style, {
      position: "fixed",
      zIndex: 999999,
      padding: "6px 10px",
      borderRadius: "6px",
      background: "rgba(0, 0, 0, 0.65)",
      color: "#ffffff",
      fontSize: "12px",
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      whiteSpace: "nowrap",
      boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      cursor: "move",
      userSelect: "none",
      pointerEvents: "auto",
      top: savedPos && savedPos.top ? savedPos.top : "12px",
      left: savedPos && savedPos.left ? savedPos.left : "auto",
      right: savedPos && savedPos.left ? "auto" : "12px",
    });

    chartRoot.appendChild(panel);
    setupDragAndDrop(panel, idoc, w);

    function updatePanel() {
      const cursor = getCursorPrice(model);
      const last = getLastPrice(model);

      let diffAbs = null;
      let diffPct = null;

      if (
        cursor != null &&
        last != null &&
        !Number.isNaN(cursor) &&
        !Number.isNaN(last) &&
        last !== 0
      ) {
        diffAbs = cursor - last;
        diffPct = (diffAbs / last) * 100;
      }

      const cursorStr = fmtPrice(cursor);
      const lastStr = fmtPrice(last);
      const diffAbsStr = diffAbs == null ? "-" : fmtPrice(diffAbs);
      const diffPctStr = diffPct == null ? "-" : fmtPct(diffPct);

      let color = "#ffffff";
      if (diffPct != null) {
        if (diffPct > 0) color = "#f04452";
        else if (diffPct < 0) color = "#1f6fff";
      }

      panel.innerHTML =
        `<span>커서: ${cursorStr}</span>` +
        `&nbsp;&nbsp;|&nbsp;&nbsp;` +
        `<span>현재가: ${lastStr}</span>` +
        `&nbsp;&nbsp;|&nbsp;&nbsp;` +
        `<span>가격차: ${diffAbsStr}</span>` +
        `&nbsp;&nbsp;|&nbsp;&nbsp;` +
        `<span style="color:${color}">퍼센트: ${diffPctStr}</span>`;
    }

    return updatePanel;
  }

  // ===== CURSOR TOOLTIP =====
  function createCursorTooltip(widget, idoc, w) {
    const TOOLTIP_ID = "tv-cursor-tooltip";
    const model = widget._model;

    const old = idoc.getElementById(TOOLTIP_ID);
    if (old) old.remove();

    const tooltip = idoc.createElement("div");
    tooltip.id = TOOLTIP_ID;

    const chartRoot = widget._mainDiv || idoc.body;

    Object.assign(tooltip.style, {
      position: "fixed",
      zIndex: 999999,
      padding: "4px 8px",
      borderRadius: "4px",
      background: "rgba(0, 0, 0, 0.8)",
      color: "#ffffff",
      fontSize: "13px",
      fontWeight: "600",
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      whiteSpace: "nowrap",
      pointerEvents: "none",
      userSelect: "none",
      display: "none",
      transform: "translate(12px, -50%)",
    });

    chartRoot.appendChild(tooltip);

    let mouseX = 0;
    let mouseY = 0;
    let isInChart = false;

    idoc.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isInChart = true;

      tooltip.style.left = mouseX + "px";
      tooltip.style.top = mouseY + "px";
    });

    idoc.addEventListener("mouseleave", () => {
      isInChart = false;
      tooltip.style.display = "none";
    });

    function updateTooltip() {
      if (!isInChart) {
        tooltip.style.display = "none";
        return;
      }

      const cursor = getCursorPrice(model);
      const last = getLastPrice(model);

      let diffPct = null;

      if (
        cursor != null &&
        last != null &&
        !Number.isNaN(cursor) &&
        !Number.isNaN(last) &&
        last !== 0
      ) {
        const diffAbs = cursor - last;
        diffPct = (diffAbs / last) * 100;
      }

      if (diffPct == null) {
        tooltip.style.display = "none";
        return;
      }

      const diffPctStr = fmtPct(diffPct);

      let color = "#ffffff";
      if (diffPct > 0) color = "#f04452";
      else if (diffPct < 0) color = "#1f6fff";

      tooltip.innerHTML = `<span style="color:${color}">${diffPctStr}</span>`;
      tooltip.style.display = "block";
    }

    return updateTooltip;
  }

  // ===== IFRAME INIT =====
  const IFRAME_INIT = "__tvPlusIframeInit";
  const TIMER_KEY = "__tvPlusTimer";

  function initForIframe(iframe, enabledFeatures) {
    let w, idoc;
    try {
      w = iframe.contentWindow;
      idoc = iframe.contentDocument || w.document;
    } catch (e) {
      return false;
    }

    if (!w || !idoc) {
      return false;
    }

    if (w[IFRAME_INIT]) {
      return true;
    }

    const collection = w.chartWidgetCollection;
    if (!collection || typeof collection.getAll !== "function") {
      return false;
    }

    const widgets = collection.getAll();
    if (!widgets || !widgets.length) {
      return false;
    }

    const widget = widgets[0];
    const model = widget._model;
    if (!model) {
      return false;
    }

    const updateFns = [];

    if (enabledFeatures.floatPanel) {
      const updatePanel = createFloatPanel(widget, idoc, w);
      updateFns.push(updatePanel);
    }

    if (enabledFeatures.cursorTooltip) {
      const updateTooltip = createCursorTooltip(widget, idoc, w);
      updateFns.push(updateTooltip);
    }

    if (updateFns.length === 0) {
      return false;
    }

    if (w[TIMER_KEY]) {
      clearInterval(w[TIMER_KEY]);
    }

    w[TIMER_KEY] = setInterval(() => {
      for (const fn of updateFns) {
        try {
          fn();
        } catch (e) {
          // 개별 업데이트 에러는 무시
        }
      }
    }, CONFIG.UPDATE_INTERVAL_MS);

    w[IFRAME_INIT] = true;
    return true;
  }

  // ===== MAIN =====
  if (window[CONFIG.GLOBAL_INIT]) return;
  window[CONFIG.GLOBAL_INIT] = true;

  console.log(`[Toss Invest Plus] v${CONFIG.VERSION} 초기화 시작`);

  const storageKey = "tossInvestPlusFeatures";
  let enabledFeatures = { floatPanel: true, cursorTooltip: true }; // 기본값

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      enabledFeatures = {
        floatPanel: parsed.floatPanel ?? true,
        cursorTooltip: parsed.cursorTooltip ?? true,
      };
    }
  } catch (e) {
    console.log("[Toss Invest Plus] 설정 로드 실패, 기본값 사용");
  }

  window.addEventListener("storage", (e) => {
    if (e.key === storageKey && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        enabledFeatures = {
          floatPanel: parsed.floatPanel ?? true,
          cursorTooltip: parsed.cursorTooltip ?? true,
        };
        console.log(
          "[Toss Invest Plus] 설정 업데이트됨, 페이지를 새로고침하세요."
        );
      } catch (err) {}
    }
  });

  function loop() {
    try {
      const iframe = findTradingViewIframe();
      if (!iframe) {
        setTimeout(loop, CONFIG.POLL_MS);
        return;
      }

      initForIframe(iframe, enabledFeatures);
      setTimeout(loop, CONFIG.POLL_MS);
    } catch (e) {
      console.error("[Toss Invest Plus] FloatPanel/CursorTooltip 오류:", e);
      setTimeout(loop, CONFIG.POLL_MS);
    }
  }

  if (enabledFeatures.floatPanel || enabledFeatures.cursorTooltip) {
    console.log("[Toss Invest Plus] 기능 로드 중...");
    loop();
  }

  console.log("[Toss Invest Plus] 초기화 완료");
})();
