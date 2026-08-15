(()=>{
  const mobile=matchMedia('(pointer:coarse)').matches||/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(!mobile) return;
  let s=window.__SNOWBALL_GAME_SRC||'';

  const replaceFunction=(src,name,repl)=>{
    const marker='function '+name+'(';
    const start=src.indexOf(marker);
    if(start<0) return src;
    const brace=src.indexOf('{',start);
    if(brace<0) return src;
    let depth=0, quote=null, esc=false;
    for(let i=brace;i<src.length;i++){
      const ch=src[i];
      if(quote){
        if(esc){esc=false; continue;}
        if(ch==='\\'){esc=true; continue;}
        if(ch===quote) quote=null;
        continue;
      }
      if(ch==='"'||ch==="'"||ch==='`'){quote=ch; continue;}
      if(ch==='{') depth++;
      else if(ch==='}'){
        depth--;
        if(depth===0) return src.slice(0,start)+repl+src.slice(i+1);
      }
    }
    return src;
  };

  s=s.replace("  'use strict';\n","  'use strict';\n\n  const MOBILE_MODE=true;\n");
  s=s.replace("engine = new BABYLON.Engine($('game'), true, { preserveDrawingBuffer:false, stencil:false, adaptToDeviceRatio:true });","engine = new BABYLON.Engine($('game'), true, { preserveDrawingBuffer:false, stencil:false, adaptToDeviceRatio:false });");
  s=s.replace("engine.setHardwareScalingLevel(Math.max(1, window.devicePixelRatio / 1.7));","engine.setHardwareScalingLevel(1.18);");
  s=s.replace("scene = new BABYLON.Scene(engine);","scene = new BABYLON.Scene(engine); scene.skipPointerMovePicking=true; scene.performancePriority=BABYLON.ScenePerformancePriority?.Aggressive ?? scene.performancePriority;");
  s=s.replace("scene.fogStart = 86;\n    scene.fogEnd = 235;","scene.fogStart = 72;\n    scene.fogEnd = 175;");
  s=s.replace("    createCourseEdges();\n    createScenery();","    createCourseEdgesMobile();\n    createSceneryMobile();");

  const courseFn=`function createCourseEdgesMobile(){
    const edgeMat=new BABYLON.StandardMaterial('edgeMatM',scene); edgeMat.diffuseColor=new BABYLON.Color3(.51,.69,.81); edgeMat.specularColor=BABYLON.Color3.Black(); edgeMat.alpha=.68;
    for(let z=12;z<CFG.finishZ;z+=38){ const c=trackCenterX(z),turn=trackTurn(z); for(const side of [-1,1]){ const bank=BABYLON.MeshBuilder.CreateBox('bankM',{width:.32,height:.18,depth:37},scene); bank.position.set(c+side*(CFG.trackHalfWidth+.55),terrainY(z)+.10,z); bank.rotation.x=SLOPE_ANGLE; bank.rotation.y=Math.atan(turn); bank.material=edgeMat; } }
  }`;
  s=s.replace("\n\nfunction createScenery() {","\n\n  "+courseFn+"\n\nfunction createScenery() {");

  const sceneryFn=`function createSceneryMobile(){
    const mm=new BABYLON.StandardMaterial('mountM',scene); mm.diffuseColor=new BABYLON.Color3(.43,.61,.75); mm.specularColor=BABYLON.Color3.Black();
    for(let i=0;i<8;i++){ const z=70+i*145,side=i%2?-1:1; const m=BABYLON.MeshBuilder.CreateCylinder('mountM',{diameterTop:0,diameterBottom:12,height:17,tessellation:4},scene); m.position.set(trackCenterX(z)+side*20,terrainY(z)+5.5,z); m.material=mm; }
    const fm=new BABYLON.StandardMaterial('firM',scene); fm.diffuseColor=new BABYLON.Color3(.14,.38,.22); fm.specularColor=BABYLON.Color3.Black();
    for(let z=55;z<CFG.finishZ+30;z+=105){ for(const side of [-1,1]){ const fir=BABYLON.MeshBuilder.CreateCylinder('firM',{diameterTop:0,diameterBottom:2.8,height:4.6,tessellation:5},scene); fir.position.set(trackCenterX(z)+side*12.5,terrainY(z)+2.3,z+(side>0?9:0)); fir.material=fm; } }
  }`;
  s=s.replace("\n\nfunction createScenery() {","\n\n  "+sceneryFn+"\n\nfunction createScenery() {");

  const spawnFn=`function spawnObject(type,x,z) {
    const d=typeData[type];
    const root=new BABYLON.TransformNode(type+'RootM',scene);
    const worldX=trackCenterX(z)+x; root.position.set(worldX,terrainY(z),z);
    if(!spawnObject._mats){ spawnObject._mats={}; }
    const mats=spawnObject._mats;
    const mat=(key,color)=>{ if(mats[key]) return mats[key]; const m=new BABYLON.StandardMaterial('mm_'+key,scene); m.diffuseColor=color; m.specularColor=BABYLON.Color3.Black(); mats[key]=m; return m; };
    let body;
    if(type==='snow'){
      body=BABYLON.MeshBuilder.CreateSphere('snowM',{diameter:1.02,segments:5},scene); body.scaling.set(1.08,.30,1); body.position.y=.15; body.material=mat('snow',new BABYLON.Color3(.95,.98,1));
    } else if(type==='snowman'){
      body=BABYLON.MeshBuilder.CreateSphere('snowmanM',{diameter:1.30,segments:6},scene); body.position.y=.64; body.material=mat('snowman',new BABYLON.Color3(.95,.98,1));
      const head=BABYLON.MeshBuilder.CreateSphere('snowmanHeadM',{diameter:.72,segments:6},scene); head.position.y=1.55; head.material=body.material; head.parent=root;
    } else if(type==='fence'){
      body=BABYLON.MeshBuilder.CreateBox('fenceM',{width:2.15,height:.72,depth:.15},scene); body.position.y=.49; body.material=mat('fence',new BABYLON.Color3(.54,.31,.16));
    } else if(type==='tree'){
      body=BABYLON.MeshBuilder.CreateCylinder('treeM',{diameterTop:0,diameterBottom:2.05,height:3.1,tessellation:5},scene); body.position.y=1.62; body.material=mat('tree',new BABYLON.Color3(.14,.36,.20));
      const trunk=BABYLON.MeshBuilder.CreateCylinder('trunkM',{diameter:.28,height:.9,tessellation:5},scene); trunk.position.y=.45; trunk.material=mat('trunk',new BABYLON.Color3(.28,.17,.09)); trunk.parent=root;
    } else {
      body=BABYLON.MeshBuilder.CreateBox('carM',{width:2.18,height:.66,depth:3.0},scene); body.position.y=.58; body.material=mat('car',d.color);
      const cabin=BABYLON.MeshBuilder.CreateBox('cabinM',{width:1.55,height:.48,depth:1.35},scene); cabin.position.set(0,1.03,.1); cabin.material=mat('glass',new BABYLON.Color3(.18,.28,.34)); cabin.parent=root;
    }
    body.parent=root;
    const obstacle={type,root,x:worldX,z,req:d.req,gain:d.gain,size:type==='snow'?.52:d.size,active:true}; obstacles.push(obstacle); return obstacle;
  }`;
  s=replaceFunction(s,'spawnObject',spawnFn);

  s=s.replace("for(let z=zStart; z<=zEnd; z+=2.15){","for(let z=zStart; z<=zEnd; z+=9.5){");
  s=s.replace("for(let i=0;i<(width>14?8:5);i++){","for(let i=0;i<1;i++){");
  s=s.replace("ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:16 }, scene);","ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:10 }, scene);");
  s=s.replace("shadowDisc = BABYLON.MeshBuilder.CreateDisc('shadow', { radius:1, tessellation:32 }, scene);","shadowDisc = BABYLON.MeshBuilder.CreateDisc('shadow', { radius:1, tessellation:12 }, scene);");
  s=s.replace("    reactWorldToPower(dt);","    // mobile: decorative world reactions disabled");
  s=s.replace("    if(snowTracks.length>105){","    if(snowTracks.length>12){");
  s=s.replace("state.powderTrackTimer=.14;","state.powderTrackTimer=.42;");
  s=s.replace("state.trailTimer=Math.max(.045,.095-ball.scaling.x*.012);","state.trailTimer=.28;");
  s=s.replace("  function burst(pos,type,count=10){","  function burst(pos,type,count=10){ count=Math.min(count,4);");

  const cull=`\n  let mobileCullTimer=0;\n  function updateMobileCulling(dt){\n    mobileCullTimer-=dt; if(mobileCullTimer>0||!state) return; mobileCullTimer=.24;\n    const z0=state.z, back=40, front=155;\n    for(const o of obstacles){ if(o.root) o.root.setEnabled(o.active && o.z>z0-back && o.z<z0+front); }\n    for(const g of progressionGates){ if(g.root) g.root.setEnabled(g.active!==false && g.z>z0-back && g.z<z0+front); }\n    for(const t of finishTargets){ if(t.root) t.root.setEnabled(t.active!==false && t.z>z0-back && t.z<z0+front); }\n  }\n`;
  s=s.replace("  function update(dt) {",cull+"\n  function update(dt) {");
  s=s.replace("    updateSectionMarker();","    updateSectionMarker();\n    updateMobileCulling(dt);");

  s=s.replace(/\n\s*\/\/ Raised lips help[\s\S]*?powderZones\.push\(/,"\n    powderZones.push(");

  window.__SNOWBALL_GAME_SRC=s;
})();
