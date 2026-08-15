(()=>{
  let s=window.__SNOWBALL_GAME_SRC||'';

  // Retina mobile render: optimized scene, but a genuinely high-resolution canvas.
  s=s.replace(
    "engine = new BABYLON.Engine($('game'), true, { preserveDrawingBuffer:false, stencil:false, adaptToDeviceRatio:false });",
    "engine = new BABYLON.Engine($('game'), true, { preserveDrawingBuffer:false, stencil:false }, false);"
  );

  // Babylon's hardware scaling level < 1 renders above CSS resolution.
  // 0.50 ~= 2x linear resolution, a good target for modern iPhones without going full 3x DPR.
  s=s.replace(/engine\.setHardwareScalingLevel\((?:1\.03|1\.06|1\.18|1\.35)\);/g,"engine.setHardwareScalingLevel(0.50);");

  // Preserve antialiasing and let Safari's canvas stay crisp rather than browser-scaled.
  s=s.replace("scene = new BABYLON.Scene(engine); scene.skipPointerMovePicking=true;","scene = new BABYLON.Scene(engine); scene.skipPointerMovePicking=true; engine.resize();");

  // Player ball is always close to camera, so spend a few more vertices here.
  s=s.replace("ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:16 }, scene);","ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:22 }, scene);");
  s=s.replace("ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:18 }, scene);","ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:22 }, scene);");
  s=s.replace("ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:14 }, scene);","ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:22 }, scene);");

  window.__SNOWBALL_GAME_SRC=s;
})();
