(()=>{
  const mobile=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const run=()=>{
    try{ (0,eval)(window.__SNOWBALL_GAME_SRC); }
    finally{ window.__SNOWBALL_GAME_SRC=''; }
  };
  if(!mobile){ run(); return; }
  const perf=document.createElement('script');
  perf.src='mobile-v26-perf.js?v=1';
  perf.onload=run;
  perf.onerror=run;
  document.head.appendChild(perf);
})();