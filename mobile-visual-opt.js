(()=>{
  let s=window.__SNOWBALL_GAME_SRC||'';
  const replaceFunction=(src,name,repl)=>{
    const marker='function '+name+'(';
    const start=src.indexOf(marker); if(start<0) return src;
    const brace=src.indexOf('{',start); if(brace<0) return src;
    let depth=0,q=null,esc=false;
    for(let i=brace;i<src.length;i++){
      const ch=src[i];
      if(q){ if(esc){esc=false;continue;} if(ch==='\\'){esc=true;continue;} if(ch===q)q=null; continue; }
      if(ch==='"'||ch==="'"||ch==='`'){q=ch;continue;}
      if(ch==='{')depth++; else if(ch==='}'&&--depth===0)return src.slice(0,start)+repl+src.slice(i+1);
    }
    return src;
  };

  s=s.replace('engine.setHardwareScalingLevel(1.18);','engine.setHardwareScalingLevel(1.06);');
  s=s.replace('scene.fogStart = 72;\n    scene.fogEnd = 175;','scene.fogStart = 95;\n    scene.fogEnd = 230;');
  s=s.replace("scene.clearColor = new BABYLON.Color4(.67,.82,.92,1);","scene.clearColor = new BABYLON.Color4(.49,.71,.88,1);");

  const sceneryFn=`function createSceneryMobile(){
    const mat=(key,c,em=null)=>{ createSceneryMobile._m=createSceneryMobile._m||{}; if(createSceneryMobile._m[key])return createSceneryMobile._m[key]; const m=new BABYLON.StandardMaterial('vm_'+key,scene); m.diffuseColor=c; m.ambientColor=c.scale(.55); m.specularColor=new BABYLON.Color3(.04,.06,.08); if(em)m.emissiveColor=em; m.freeze(); return createSceneryMobile._m[key]=m; };
    const snow=mat('snow',new BABYLON.Color3(.91,.96,1));
    const pine=mat('pine',new BABYLON.Color3(.08,.31,.22));
    const pine2=mat('pine2',new BABYLON.Color3(.11,.40,.27));
    const trunk=mat('trunk',new BABYLON.Color3(.25,.14,.08));
    const mountain=mat('mountain',new BABYLON.Color3(.35,.55,.70));
    const farMountain=mat('mountainFar',new BABYLON.Color3(.53,.68,.78));
    for(let i=0;i<10;i++){
      const z=90+i*125, side=i%2?-1:1;
      const m=BABYLON.MeshBuilder.CreateCylinder('mountV',{diameterTop:0,diameterBottom:14+(i%3)*3,height:18+(i%2)*4,tessellation:5},scene);
      m.position.set(trackCenterX(z)+side*(22+(i%3)*3),terrainY(z)+6,z); m.material=i%3===0?farMountain:mountain; m.rotation.y=i*.31;
    }
    const firAt=(x,z,scale=1)=>{
      const root=new BABYLON.TransformNode('firV',scene); root.position.set(x,terrainY(z),z);
      const t=BABYLON.MeshBuilder.CreateCylinder('firTrunkV',{diameter:.30*scale,height:1.2*scale,tessellation:5},scene); t.parent=root; t.position.y=.6*scale; t.material=trunk;
      for(let j=0;j<3;j++){
        const c=BABYLON.MeshBuilder.CreateCylinder('firLayerV',{diameterTop:0,diameterBottom:(2.7-j*.45)*scale,height:(2.25-j*.2)*scale,tessellation:7},scene);
        c.parent=root; c.position.y=(1.45+j*.85)*scale; c.material=j===1?pine2:pine;
        const cap=BABYLON.MeshBuilder.CreateCylinder('firSnowV',{diameterTop:0,diameterBottom:(2.48-j*.43)*scale,height:.28*scale,tessellation:7},scene);
        cap.parent=root; cap.position.y=(2.45+j*.85)*scale; cap.material=snow;
      }
    };
    for(let z=35;z<CFG.finishZ+20;z+=58){
      const c=trackCenterX(z); firAt(c-12.6,z,.92+(z%116)/580); firAt(c+12.8,z+11,1.0);
      if((Math.floor(z/58)%3)===0) firAt(c-16.5,z+25,.72);
    }
    const wood=mat('wood',new BABYLON.Color3(.47,.23,.11)); const roof=mat('roof',new BABYLON.Color3(.25,.13,.10)); const glass=mat('glass',new BABYLON.Color3(.25,.55,.70),new BABYLON.Color3(.025,.06,.08));
    const cabinAt=(x,z)=>{
      const root=new BABYLON.TransformNode('cabV',scene); root.position.set(x,terrainY(z),z);
      const b=BABYLON.MeshBuilder.CreateBox('cabBodyV',{width:4.2,height:2.5,depth:3.5},scene); b.parent=root; b.position.y=1.25; b.material=wood;
      const r=BABYLON.MeshBuilder.CreateCylinder('cabRoofV',{diameter:5.3,height:4.0,tessellation:3},scene); r.parent=root; r.position.y=3.0; r.rotation.z=Math.PI/2; r.scaling.z=.72; r.material=roof;
      const sn=BABYLON.MeshBuilder.CreateBox('cabSnowV',{width:4.7,height:.16,depth:3.9},scene); sn.parent=root; sn.position.y=3.62; sn.rotation.z=.02; sn.material=snow;
      for(const sx of [-1,1]){ const w=BABYLON.MeshBuilder.CreateBox('cabWinV',{width:.72,height:.78,depth:.05},scene); w.parent=root; w.position.set(sx*1.2,1.45,-1.78); w.material=glass; }
    };
    [[-13,285],[13,650],[-14,1010]].forEach(([dx,z])=>cabinAt(trackCenterX(z)+dx,z));
  }`;
  s=replaceFunction(s,'createSceneryMobile',sceneryFn);

  const edgeFn=`function createCourseEdgesMobile(){
    const snowMat=new BABYLON.StandardMaterial('edgeSnowV',scene); snowMat.diffuseColor=new BABYLON.Color3(.88,.95,1); snowMat.ambientColor=new BABYLON.Color3(.38,.52,.64); snowMat.specularColor=new BABYLON.Color3(.08,.12,.16); snowMat.freeze();
    const iceMat=new BABYLON.StandardMaterial('edgeIceV',scene); iceMat.diffuseColor=new BABYLON.Color3(.48,.79,.95); iceMat.emissiveColor=new BABYLON.Color3(.02,.08,.12); iceMat.specularColor=new BABYLON.Color3(.42,.63,.72); iceMat.freeze();
    for(let z=14;z<CFG.finishZ;z+=26){ const c=trackCenterX(z),turn=trackTurn(z); for(const side of [-1,1]){
      const bank=BABYLON.MeshBuilder.CreateCylinder('bankV',{diameter:1.15,height:25,tessellation:7},scene); bank.scaling.set(1,.52,1); bank.position.set(c+side*(CFG.trackHalfWidth+.68),terrainY(z)+.22,z); bank.rotation.x=Math.PI/2+SLOPE_ANGLE; bank.rotation.z=Math.atan(turn); bank.material=snowMat;
      if((Math.floor(z/26)%5)===2){ const shard=BABYLON.MeshBuilder.CreateCylinder('edgeIceV',{diameterTop:0,diameterBottom:.72,height:1.5,tessellation:5},scene); shard.position.set(c+side*(CFG.trackHalfWidth+1.05),terrainY(z)+.75,z+5); shard.material=iceMat; }
    }}
  }`;
  s=replaceFunction(s,'createCourseEdgesMobile',edgeFn);

  const spawnFn=`function spawnObject(type,x,z) {
    const d=typeData[type]; const root=new BABYLON.TransformNode(type+'RootV',scene); const worldX=trackCenterX(z)+x; root.position.set(worldX,terrainY(z),z);
    const mats=spawnObject._vm||(spawnObject._vm={});
    const mat=(key,c,spec=.06,em=null)=>{ if(mats[key])return mats[key]; const m=new BABYLON.StandardMaterial('v_'+key,scene); m.diffuseColor=c; m.ambientColor=c.scale(.48); m.specularColor=new BABYLON.Color3(spec,spec,spec); if(em)m.emissiveColor=em; m.freeze(); return mats[key]=m; };
    const snow=mat('snow',new BABYLON.Color3(.94,.985,1),.12); const snowShade=mat('snowShade',new BABYLON.Color3(.72,.86,.96),.04); const dark=mat('dark',new BABYLON.Color3(.055,.075,.09),.08); const wood=mat('wood',new BABYLON.Color3(.50,.27,.12),.03); const woodLight=mat('woodLight',new BABYLON.Color3(.67,.39,.18),.03); const pine=mat('pine',new BABYLON.Color3(.07,.34,.22),.03); const pine2=mat('pine2',new BABYLON.Color3(.10,.45,.28),.03); const glass=mat('glass',new BABYLON.Color3(.16,.37,.50),.22,new BABYLON.Color3(.015,.045,.06)); const lamp=mat('lamp',new BABYLON.Color3(1,.70,.18),.1,new BABYLON.Color3(.32,.14,.01));
    const add=(mesh,px,py,pz,m)=>{mesh.parent=root; mesh.position.set(px,py,pz); mesh.material=m; return mesh;};
    let body;
    if(type==='snow'){
      body=add(BABYLON.MeshBuilder.CreateSphere('snowV',{diameter:1.08,segments:7},scene),0,.18,0,snow); body.scaling.set(1.2,.34,1.05);
      const sh=add(BABYLON.MeshBuilder.CreateDisc('snowShadowV',{radius:.46,tessellation:10},scene),0,.025,.08,snowShade); sh.rotation.x=Math.PI/2;
    } else if(type==='snowman'){
      body=add(BABYLON.MeshBuilder.CreateSphere('snowBodyV',{diameter:1.28,segments:8},scene),0,.62,0,snow);
      add(BABYLON.MeshBuilder.CreateSphere('snowHeadV',{diameter:.78,segments:8},scene),0,1.55,-.02,snow);
      add(BABYLON.MeshBuilder.CreateCylinder('hatV',{diameter:.62,height:.34,tessellation:8},scene),0,2.02,-.02,dark);
      add(BABYLON.MeshBuilder.CreateCylinder('brimV',{diameter:.88,height:.07,tessellation:8},scene),0,1.86,-.02,dark);
      const carrot=add(BABYLON.MeshBuilder.CreateCylinder('carrotV',{diameterTop:0,diameterBottom:.17,height:.48,tessellation:6},scene),0,1.55,-.57,mat('orange',new BABYLON.Color3(.95,.34,.06),.04)); carrot.rotation.x=Math.PI/2;
      const scarf=add(BABYLON.MeshBuilder.CreateTorus('scarfV',{diameter:.73,thickness:.11,tessellation:9},scene),0,1.28,0,mat('scarf',new BABYLON.Color3(.72,.08,.09),.05)); scarf.rotation.x=Math.PI/2;
    } else if(type==='fence'){
      body=add(BABYLON.MeshBuilder.CreateBox('fenceRailV',{width:2.55,height:.18,depth:.20},scene),0,.73,0,woodLight);
      add(BABYLON.MeshBuilder.CreateBox('fenceRail2V',{width:2.55,height:.16,depth:.18},scene),0,1.12,0,wood);
      for(const sx of [-1,1]){ add(BABYLON.MeshBuilder.CreateBox('fencePostV',{width:.22,height:1.45,depth:.24},scene),sx*1.03,.72,0,wood); const cap=add(BABYLON.MeshBuilder.CreateSphere('fenceSnowV',{diameter:.42,segments:6},scene),sx*1.03,1.49,0,snow); cap.scaling.y=.35; }
    } else if(type==='tree'){
      body=add(BABYLON.MeshBuilder.CreateCylinder('treeTrunkV',{diameter:.34,height:1.30,tessellation:6},scene),0,.65,0,wood);
      for(let j=0;j<3;j++){ add(BABYLON.MeshBuilder.CreateCylinder('treeLayerV',{diameterTop:0,diameterBottom:2.55-j*.38,height:1.95-j*.16,tessellation:7},scene),0,1.25+j*.73,0,j===1?pine2:pine); add(BABYLON.MeshBuilder.CreateCylinder('treeSnowV',{diameterTop:0,diameterBottom:2.28-j*.35,height:.22,tessellation:7},scene),0,2.12+j*.73,0,snow); }
    } else {
      const carMat=mat('car_'+Math.round(d.color.r*9)+'_'+Math.round(d.color.g*9),d.color,.18); body=add(BABYLON.MeshBuilder.CreateBox('carBodyV',{width:2.18,height:.55,depth:3.15},scene),0,.55,0,carMat);
      add(BABYLON.MeshBuilder.CreateBox('carHoodV',{width:2.03,height:.25,depth:.83},scene),0,.91,-1.02,carMat);
      const cabin=add(BABYLON.MeshBuilder.CreateBox('carCabinV',{width:1.72,height:.65,depth:1.43},scene),0,1.12,.10,glass); cabin.scaling.x=.92;
      for(const sx of [-1,1]) for(const zz of [-1.02,.98]){ const w=add(BABYLON.MeshBuilder.CreateCylinder('wheelV',{diameter:.53,height:.22,tessellation:8},scene),sx*1.08,.42,zz,dark); w.rotation.z=Math.PI/2; }
      for(const sx of [-1,1]) add(BABYLON.MeshBuilder.CreateBox('headlightV',{width:.35,height:.18,depth:.05},scene),sx*.68,.66,-1.60,lamp);
      add(BABYLON.MeshBuilder.CreateBox('bumperV',{width:1.8,height:.14,depth:.16},scene),0,.38,-1.62,dark);
    }
    const obstacle={type,root,x:worldX,z,req:d.req,gain:d.gain,size:type==='snow'?.52:d.size,active:true}; obstacles.push(obstacle); return obstacle;
  }`;
  s=replaceFunction(s,'spawnObject',spawnFn);

  s=s.replace("ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:10 }, scene);","ball = BABYLON.MeshBuilder.CreateSphere('snowball', { diameter:2, segments:14 }, scene);");
  s=s.replace("shadowDisc = BABYLON.MeshBuilder.CreateDisc('shadow', { radius:1, tessellation:12 }, scene);","shadowDisc = BABYLON.MeshBuilder.CreateDisc('shadow', { radius:1, tessellation:20 }, scene);");

  window.__SNOWBALL_GAME_SRC=s;
})();
