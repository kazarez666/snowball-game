(()=>{
  const mobile=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(!mobile) return;
  let s=window.__SNOWBALL_GAME_SRC||'';

  s=s.replace("  'use strict';\n","  'use strict';\n\n  const MOBILE_MODE=true;\n");
  s=s.replace("engine = new BABYLON.Engine($('game'), true, { preserveDrawingBuffer:false, stencil:false, adaptToDeviceRatio:true });","engine = new BABYLON.Engine($('game'), true, { preserveDrawingBuffer:false, stencil:false, adaptToDeviceRatio:false });");
  s=s.replace("engine.setHardwareScalingLevel(Math.max(1, window.devicePixelRatio / 1.7));","engine.setHardwareScalingLevel(1.35);");
  s=s.replace("scene = new BABYLON.Scene(engine);","scene = new BABYLON.Scene(engine); scene.skipPointerMovePicking=true;");
  s=s.replace("scene.fogStart = 86;\n    scene.fogEnd = 235;","scene.fogStart = 58;\n    scene.fogEnd = 145;");

  s=s.replace("    createCourseEdges();\n    createScenery();","    createCourseEdgesMobile();\n    createSceneryMobile();");
  s=s.replace("\n\nfunction createScenery() {","\n\n  function createCourseEdgesMobile(){\n    const edgeMat=new BABYLON.StandardMaterial('edgeMatM',scene); edgeMat.diffuseColor=new BABYLON.Color3(.51,.69,.81); edgeMat.specularColor=BABYLON.Color3.Black(); edgeMat.alpha=.68;\n    for(let z=8;z<CFG.finishZ;z+=26){ const c=trackCenterX(z),turn=trackTurn(z); for(const side of [-1,1]){ const bank=BABYLON.MeshBuilder.CreateBox('bankM',{width:.34,height:.20,depth:25},scene); bank.position.set(c+side*(CFG.trackHalfWidth+.55),terrainY(z)+.10,z); bank.rotation.x=SLOPE_ANGLE; bank.rotation.y=Math.atan(turn); bank.material=edgeMat; } }\n  }\n\n  function createSceneryMobile(){\n    const mm=new BABYLON.StandardMaterial('mountM',scene); mm.diffuseColor=new BABYLON.Color3(.43,.61,.75); mm.specularColor=BABYLON.Color3.Black();\n    for(let i=0;i<18;i++){ const z=30+i*68,side=i%2?-1:1; const m=BABYLON.MeshBuilder.CreateCylinder('mountM',{diameterTop:0,diameterBottom:10,height:15,tessellation:5},scene); m.position.set(trackCenterX(z)+side*18,terrainY(z)+5,z); m.material=mm; }\n    for(let z=30;z<CFG.finishZ+40;z+=62){ createScenicFir(trackCenterX(z)-11.3,z,.95); createScenicFir(trackCenterX(z)+11.3,z+9,.95); }\n    [280,650,1030].forEach((z,i)=>createScenicCabin(trackCenterX(z)+(i%2?-12:12),z,.82,.07));\n  }\n\nfunction createScenery() {");

  const powderOld="    // Raised lips help the powder field read as a distinct snow bank while moving.\n    for (const sx of [-1,1]) {\n      const lip=BABYLON.MeshBuilder.CreateBox('powderLip',{width:.18,height:.16,depth:depth*.96},scene);\n      lip.position.set(sx*width*.49,.11,0); lip.parent=root; lip.material=mat;\n    }\n\n    // Low, irregular mounds make it read as terrain rather than a collectible strip.\n    const count=Math.max(8,Math.round(width*depth/18));\n    for(let i=0;i<count;i++){\n      const mound=BABYLON.MeshBuilder.CreateSphere('powderMound',{diameter:1.4+Math.random()*1.4,segments:6},scene);\n      mound.scaling.set(1,.18+Math.random()*.10,1.15);\n      mound.position.set((Math.random()-.5)*(width*.86),.12,(Math.random()-.5)*(depth*.88));\n      mound.parent=root; mound.material=mat;\n    }";
  s=s.replace(powderOld,"    // Mobile: the powder zone is one flat mesh; decorative lips/mounds are omitted.\n");
  s=s.replace("for(let z=zStart; z<=zEnd; z+=2.15){","for(let z=zStart; z<=zEnd; z+=4.6){");
  s=s.replace("ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:16 }, scene);","ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:10 }, scene);");
  s=s.replace("shadowDisc = BABYLON.MeshBuilder.CreateDisc('shadow', { radius:1, tessellation:32 }, scene);","shadowDisc = BABYLON.MeshBuilder.CreateDisc('shadow', { radius:1, tessellation:14 }, scene);");
  s=s.replace("    reactWorldToPower(dt);","    // Mobile: skip per-frame decorative leaning of every obstacle.\n");
  s=s.replace("    if(snowTracks.length>105){","    if(snowTracks.length>18){");
  s=s.replace("state.powderTrackTimer=.14;","state.powderTrackTimer=.38;");
  s=s.replace("  function burst(pos,type,count=10){","  function burst(pos,type,count=10){ count=Math.min(count,5);");

  // Reduce low-value pickup geometry cost while keeping collision/gameplay identical.
  s=s.replaceAll("tessellation:12","tessellation:6");
  s=s.replaceAll("tessellation:10","tessellation:6");
  s=s.replaceAll("tessellation:8","tessellation:6");
  s=s.replaceAll("segments:8","segments:6");

  window.__SNOWBALL_GAME_SRC=s;
})();
