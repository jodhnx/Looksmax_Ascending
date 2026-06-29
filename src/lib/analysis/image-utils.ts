"use client";

export function compressImage(
  dataUrl: string,
  maxSize = 1024,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = dataUrl;
  });
}

export function measureSharpness(dataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(0);
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let sum = 0;
      let sumSq = 0;
      const gray: number[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        gray.push(g);
      }
      for (let y = 1; y < size - 1; y++) {
        for (let x = 1; x < size - 1; x++) {
          const i = y * size + x;
          const lap =
            -gray[i - size] -
            gray[i - 1] +
            4 * gray[i] -
            gray[i + 1] -
            gray[i + size];
          sum += lap;
          sumSq += lap * lap;
        }
      }
      const n = (size - 2) * (size - 2);
      const mean = sum / n;
      resolve(sumSq / n - mean * mean);
    };
    img.onerror = () => resolve(0);
    img.src = dataUrl;
  });
}

export function measureBrightness(dataUrl: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(128);
        return;
      }
      ctx.drawImage(img, 0, 0, 64, 64);
      const { data } = ctx.getImageData(0, 0, 64, 64);
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }
      resolve(sum / (data.length / 4));
    };
    img.onerror = () => resolve(128);
    img.src = dataUrl;
  });
}

export function sampleSkinTexture(
  dataUrl: string,
  regions: { x: number; y: number }[]
): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(50);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const variances: number[] = [];
      const patch = 12;

      for (const r of regions) {
        const px = Math.floor(r.x * img.naturalWidth);
        const py = Math.floor(r.y * img.naturalHeight);
        const x0 = Math.max(0, px - patch);
        const y0 = Math.max(0, py - patch);
        const w = Math.min(patch * 2, img.naturalWidth - x0);
        const h = Math.min(patch * 2, img.naturalHeight - y0);
        const { data } = ctx.getImageData(x0, y0, w, h);
        let sum = 0;
        let sumSq = 0;
        const n = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          sum += g;
          sumSq += g * g;
        }
        const mean = sum / n;
        variances.push(sumSq / n - mean * mean);
      }

      const avgVar = variances.reduce((a, b) => a + b, 0) / (variances.length || 1);
      resolve(Math.min(100, Math.max(0, 100 - avgVar / 3)));
    };
    img.onerror = () => resolve(50);
    img.src = dataUrl;
  });
}

export function estimateUnderEyeDarkness(
  dataUrl: string,
  leftEye: { x: number; y: number },
  rightEye: { x: number; y: number }
): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(30);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const cheeks: number[] = [];
      for (const eye of [leftEye, rightEye]) {
        const px = Math.floor(eye.x * img.naturalWidth);
        const py = Math.floor((eye.y + 0.04) * img.naturalHeight);
        const { data } = ctx.getImageData(px - 5, py - 3, 10, 6);
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
        cheeks.push(sum / (data.length / 4));
      }
      const cheekBright = cheeks.reduce((a, b) => a + b, 0) / cheeks.length;
      resolve(Math.min(100, Math.max(0, ((140 - cheekBright) / 80) * 100)));
    };
    img.onerror = () => resolve(30);
    img.src = dataUrl;
  });
}
