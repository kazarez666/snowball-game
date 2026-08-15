(()=>{
  const mobile=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const run=()=>{
    try{ (0,eval)(window.__SNOWBALL_GAME_SRC); }
    finally{ window.__SNOWBALL_GAME_SRC=''; }
  };
  if(!mobile){ run(); return; }
  const patch=document.createElement('script');
  patch.src='mobile-arch-opt.js?v=2';
  patch.onload=run;
  patch.onerror=run;
  document.head.appendChild(patch);
})();
