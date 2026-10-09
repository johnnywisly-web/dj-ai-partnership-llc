(function(){
  var saved = null; try { saved = localStorage.getItem("djai_lang"); } catch(e) {}
  window.LANG = saved || ((navigator.language||"en").toLowerCase().startsWith("fr") ? "fr" : "en");
  window.applyLang = function(){
    document.documentElement.lang = window.LANG;
    document.querySelectorAll("[data-en]").forEach(function(el){ el.textContent = el.dataset[window.LANG] || el.dataset.en; });
    document.querySelectorAll("[data-ph-en]").forEach(function(el){ el.placeholder = window.LANG==="fr" ? el.dataset.phFr : el.dataset.phEn; });
    document.querySelectorAll(".lang button").forEach(function(b){ b.classList.toggle("on", b.dataset.l===window.LANG); });
  };
  document.addEventListener("click", function(e){
    var b = e.target.closest(".lang button"); if(!b) return;
    window.LANG = b.dataset.l; try { localStorage.setItem("djai_lang", window.LANG); } catch(e) {}
    window.applyLang(); document.dispatchEvent(new Event("langchange"));
  });
  window.applyLang();
})();
