/* Dialectica's static pages (schools, thinkers, fact-check, credits): the analytics consent bar and the page view.
   GA itself is set up inline in each page, on the production domain only, exactly as in index.html. The consent
   choice is shared with the atlas through the same localStorage key. */
(function () {
  "use strict";
  const KEY = "dialectica-consent";
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* storage blocked */ } };
  const bar = document.getElementById("consent"), reopen = document.getElementById("consent-open");
  if (typeof window.gtag !== "function") return;
  /* Page view without query or hash, sent once the page is on screen */
  window.gtag("event", "page_view", { page_title: document.title, page_location: location.origin + location.pathname });
  reopen.hidden = false;
  if (!get()) bar.hidden = false;
  reopen.addEventListener("click", () => { bar.hidden = false; bar.querySelector("[data-consent]").focus(); });
  bar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-consent]");
    if (!b) return;
    const value = b.dataset.consent;
    set(value);
    window.gtag("consent", "update", { analytics_storage: value });
    /* Withdrawing consent also removes GA cookies (host-only, plus any older ones set on a domain) */
    if (value === "denied") {
      const parent = "." + location.hostname.split(".").slice(-2).join(".");
      document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => /^_ga/.test(n)).forEach((n) => {
        for (const domain of ["", `; domain=${location.hostname}`, `; domain=${parent}`]) document.cookie = `${n}=; Max-Age=0; path=/${domain}`;
      });
    }
    bar.hidden = true;
  });
})();
