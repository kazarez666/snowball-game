(()=>{
  const mobile=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(!mobile) return;
  let s=window.__SNOWBALL_GAME_SRC||'';

  // IMPORTANT: keep the original prototype v2.6 visuals untouched.
  // On Babylon, hardwareScalingLevel < 1 means a larger internal render buffer.
  // 0.55 gives roughly 1.8x render resolution vs CSS pixels, removing the blocky iPhone look.
  s=s.replace("engine.setHardwareScalingLevel(Math.max(1, window.devicePixelRatio / 1.7));","engine.setHardwareScalingLevel(0.55);");
  s=s.replace("scene = new BABYLON.Scene(engine);","scene = new BABYLON.Scene(engine); scene.skipPointerMovePicking=true;");

  // Pure performance cuts: no visual model substitutions.
  s=s.replace("    reactWorldToPower(dt);","    // mobile: skip decorative per-frame world reaction only");
  s=s.replace("    if(snowTracks.length>105){","    if(snowTracks.length>34){");
  s=s.replace("state.powderTrackTimer=.14;","state.powderTrackTimer=.24;");
  s=s.replace("  function burst(pos,type,count=10){","  function burst(pos,type,count=10){ count=Math.min(count,7);");

  const cullCode=`
  let v26CullTimer=0;
  function updateV26MobileCulling(dt){
    v26CullTimer-=dt; if(v26CullTimer>0||!state||!scene) return; v26CullTimer=.32;
    const z0=state.z, back=55, front=220;
    const keepNames=['snowball','shadow','locator','trail','groove'];
    for(const m of scene.meshes){
      if(!m || m.isDisposed?.()) continue;
      const n=(m.name||'').toLowerCase();
      if(keepNames.some(k=>n.includes(k))){ if(!m.isEnabled())m.setEnabled(true); continue; }
      let bi;
      try{ bi=m.getBoundingInfo(); }catch(e){ continue; }
      if(!bi) continue;
      const ext=bi.boundingBox.extendSizeWorld;
      if(ext && ext.z>120){ if(!m.isEnabled())m.setEnabled(true); continue; }
      let z;
      try{ z=m.getAbsolutePosition().z; }catch(e){ continue; }
      const should=z>z0-back && z<z0+front;
      if(m.isEnabled()!==should) m.setEnabled(should);
    }
  }
`;
  s=s.replace("  function update(dt) {",cullCode+"\n  function update(dt) {");
  s=s.replace("    updateSectionMarker();","    updateSectionMarker();\n    updateV26MobileCulling(dt);");

  window.__SNOWBALL_GAME_SRC=s;
})();