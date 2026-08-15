(()=>{
  const mobile=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const run=()=>{
    try{ (0,eval)(window.__SNOWBALL_GAME_SRC); }
    finally{ window.__SNOWBALL_GAME_SRC=''; }
  };
  if(!mobile){ run(); return; }
  const arch=document.createElement('script');
  arch.src='mobile-arch-opt.js?v=4';
  arch.onload=()=>{
    const visual=document.createElement('script');
    visual.src='mobile-visual-opt.js?v=2';
    visual.onload=()=>{
      const retina=document.createElement('script');
      retina.src='mobile-retina-opt.js?v=1';
      retina.onload=run;
      retina.onerror=run;
      document.head.appendChild(retina);
    };
    visual.onerror=run;
    document.head.appendChild(visual);
  };
  arch.onerror=run;
  document.head.appendChild(arch);
})();