// This script runs in page context and registers a listener.
// Note that the page may override/hook things like addEventListener...
(() => {
  const el = document.currentScript;
  const {evtToPage, evtFromPage} = JSON.parse(el.dataset.args);
  el.remove();
  addEventListener(evtToPage, () => {
    console.log("evtToPage: "+evtToPage);
    dispatchEvent(new CustomEvent(evtFromPage, {
      // stringifying strips nontranferable things like functions or DOM elements
      detail: JSON.stringify(window.config),
    }));
  });
})();
