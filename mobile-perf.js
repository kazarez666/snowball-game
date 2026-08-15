(() => {
  const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  if (!mobile || !window.BABYLON) return;

  // Render fewer physical pixels on high-DPI phones. This is the biggest GPU win.
  const originalScaling = BABYLON.Engine.prototype.setHardwareScalingLevel;
  BABYLON.Engine.prototype.setHardwareScalingLevel = function(level) {
    return originalScaling.call(this, Math.max(2.6, level || 1));
  };

  // Lower polygon counts for procedural primitives on mobile while keeping silhouettes readable.
  const MB = BABYLON.MeshBuilder;
  const sphere = MB.CreateSphere;
  MB.CreateSphere = function(name, options, scene) {
    options = Object.assign({}, options || {});
    if (options.segments) options.segments = Math.min(options.segments, 6);
    return sphere.call(MB, name, options, scene);
  };
  const cylinder = MB.CreateCylinder;
  MB.CreateCylinder = function(name, options, scene) {
    options = Object.assign({}, options || {});
    if (options.tessellation) options.tessellation = Math.min(options.tessellation, 6);
    return cylinder.call(MB, name, options, scene);
  };
  const torus = MB.CreateTorus;
  MB.CreateTorus = function(name, options, scene) {
    options = Object.assign({}, options || {});
    if (options.tessellation) options.tessellation = Math.min(options.tessellation, 16);
    return torus.call(MB, name, options, scene);
  };

  const sceneryNames = /^(mountain|scenic|fir|lift|cabin|roadBank|section|outcrop|lamp|courseBank|trackMark)/i;
  const originalRender = BABYLON.Scene.prototype.render;
  let frame = 0;
  BABYLON.Scene.prototype.render = function(...args) {
    frame++;
    if (!this.__snowballMobileOptimized) {
      this.__snowballMobileOptimized = true;
      this.skipPointerMovePicking = true;
      this.constantlyUpdateMeshUnderPointer = false;
      if (BABYLON.ScenePerformancePriority) this.performancePriority = BABYLON.ScenePerformancePriority.Aggressive;
      this.fogStart = Math.min(this.fogStart || 70, 62);
      this.fogEnd = Math.min(this.fogEnd || 180, 170);
    }
    if (frame % 8 === 0 && this.activeCamera) {
      const z = this.activeCamera.position.z;
      for (const m of this.meshes) {
        if (!m || m.isDisposed() || !sceneryNames.test(m.name || '')) continue;
        const mz = m.getAbsolutePosition ? m.getAbsolutePosition().z : m.position.z;
        m.isVisible = mz > z - 45 && mz < z + 185;
      }
    }
    return originalRender.apply(this, args);
  };

  // Let iOS prioritize the canvas rather than text selection/scroll gestures.
  const canvas = document.getElementById('game');
  if (canvas) canvas.style.touchAction = 'none';
  document.documentElement.dataset.mobilePerf = '1';
})();
