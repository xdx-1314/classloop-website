(() => {
  const script = document.currentScript;
  const root = new URL('.', script.src);
  const page = script.dataset.page;
  const current = document.documentElement.lang;
  const languages = ['zh-CN', 'zh-Hant', 'en'];
  const key = 'classloop-language';
  const url = new URL(location.href);
  const requested = url.searchParams.get('lang');

  let saved;
  try {
    saved = localStorage.getItem(key);
  } catch {
    // Language URLs also work in browsers that block storage.
  }

  function deviceLanguage() {
    for (const preference of navigator.languages || [navigator.language]) {
      const tag = preference.toLowerCase();
      if (/^zh(?:-|$)/.test(tag)) {
        if (/(?:^|-)hans(?:-|$)/.test(tag)) return 'zh-CN';
        return /(?:^|-)(?:hant|tw|hk|mo)(?:-|$)/.test(tag) ? 'zh-Hant' : 'zh-CN';
      }
      if (/^en(?:-|$)/.test(tag)) return 'en';
    }
    return 'zh-CN';
  }

  function pageUrl(language, mode) {
    const directory = language === 'zh-CN' ? '' : `${language}/`;
    const target = new URL(directory + page, root);
    target.search = url.search;
    target.searchParams.delete('lang');
    if (mode) target.searchParams.set('lang', mode);
    target.hash = url.hash;
    return target;
  }

  const explicit = languages.includes(requested) || requested === 'auto';
  const mode = explicit ? requested : languages.includes(saved) ? saved : 'auto';
  const automatic = deviceLanguage();
  const target = explicit || current === 'zh-CN'
    ? mode === 'auto' ? automatic : mode
    : current;

  if (target !== current) {
    location.replace(pageUrl(target, explicit ? mode : null));
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('.language-switch');
    const picker = control.querySelector('select');
    picker.value = (mode === 'auto' && current === automatic) ? 'auto' : current;
    control.hidden = false;

    // Preserve explicit choices in a local-file preview and with storage disabled.
    if (explicit) {
      for (const link of document.querySelectorAll('a[href]')) {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) continue;
        const destination = new URL(href, url);
        if (!destination.href.startsWith(root.href) || !destination.pathname.endsWith('/index.html')) continue;
        destination.searchParams.set('lang', mode);
        link.href = destination.href;
      }
    }

    picker.addEventListener('change', () => {
      const selection = picker.value;
      try {
        if (selection === 'auto') localStorage.removeItem(key);
        else localStorage.setItem(key, selection);
      } catch {
        // The explicit language in the URL remains available.
      }
      location.assign(pageUrl(selection === 'auto' ? automatic : selection, selection));
    });
  });
})();
