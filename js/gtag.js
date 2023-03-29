function loadGtagScript() {
  if (!window.gtagScriptLoaded) {
    var script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-GDCEBH1ZZZ';
    script.async = true;
    document.head.appendChild(script);
    window.gtagScriptLoaded = true;
  }
}
loadGtagScript();

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-GDCEBH1ZZZ');
