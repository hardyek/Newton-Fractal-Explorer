function newtonFractal(x, y) {
  let zx = x;
  let zy = y;
  let iterations = 0;

  while (iterations < maxIterations) {
    let zx2 = zx * zx;
    let zy2 = zy * zy;

    // Compute f(z) = z^3 + 1
    let fzRe = zx2 * zx - 3 * zx * zy2 + 1;
    let fzIm = 3 * zx2 * zy - zy2 * zy;

    // Compute f'(z) = 3z^2
    let fprimezRe = 3 * zx2 - 3 * zy2;
    let fprimezIm = 6 * zx * zy;


    // Calculate the magnitude of f'(z)
    let fprimezMagnitude = fprimezRe * fprimezRe + fprimezIm * fprimezIm;

    // Check for convergence
    if (Math.abs(fzRe) < tolerance && Math.abs(fzIm) < tolerance) {
      break;
    }

    // Compute the next z: z = z - f(z) / f'(z)
    let deltaZRe = (fzRe * fprimezRe + fzIm * fprimezIm) / fprimezMagnitude;
    let deltaZIm = (fzIm * fprimezRe - fzRe * fprimezIm) / fprimezMagnitude;

    zx -= deltaZRe;
    zy -= deltaZIm;

    iterations++;
  }

  return {iterations, zx, zy};
}

function mapValue(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

function getColor(iterations, zx, zy) {
  if (iterations === maxIterations) {
    return 'rgba(0, 0, 0, 1)'; // Black for points that did not converge
  }

  // Calculate angle of the complex number in radians
  let angle = Math.atan2(zy, zx);

  // Map the angle to HSL color space (0-360)
  let hue = mapValue(angle, -Math.PI, Math.PI, 0, 360);
  let saturation = 100;
  let lightness = mapValue(Math.log(iterations + 1), 0, Math.log(maxIterations + 1), 0, 100);

  return `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
}

function drawFractal() {
  for (let x = 0; x < canvasWidth; x += resolutionMultiplier) {
    for (let y = 0; y < canvasHeight; y += resolutionMultiplier) {
      const zx = realMin + x * realStep;
      const zy = imagMax - y * imagStep;
      const {iterations, zx: rootRe, zy: rootIm} = newtonFractal(zx, zy);
      const color = getColor(iterations, rootRe, rootIm);

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

let resolutionMultiplier = 1;

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let widthMultiplier, heightMultiplier;

if (canvasHeight > canvasWidth) {
  heightMultiplier = 1;
  widthMultiplier = canvasWidth / canvasHeight;
} else {
  heightMultiplier = canvasHeight / canvasWidth;
  widthMultiplier = 1;
}

let diffX = 0;
let diffY = 0;

let zoomMultipier = 100;

let mode = 3;

let realStep = 0;
let imagStep = 0;

let realMin = -1 * widthMultiplier * zoomMultipier - diffX * realStep;;
let realMax = 1 * widthMultiplier * zoomMultipier - diffX * realStep;
let imagMin = -1 * heightMultiplier * zoomMultipier + diffY * imagStep;
let imagMax = 1 * heightMultiplier * zoomMultipier + diffY * imagStep ;

realStep = (realMax - realMin) / canvasWidth;
imagStep = (imagMax - imagMin) / canvasHeight;

let maxIterations;
let tolerance;

let modeButtons = document.getElementsByClassName('modeButton');

window.onload = function() {
  setMode(mode);
}

 // Default to normal render mode
 function setMode(newMode) {
  switch (newMode) {
    case 1: // Exploration Mode
      scaleFactor = 5;
      maxIterations = 100;
      tolerance = 1e-5;
      for (let i = 0; i < modeButtons.length; i++) {
        if (i + 1 === newMode) {
          modeButtons[i].classList.add("active");
        } else {
          modeButtons[i].classList.remove("active");
        }
      }
      break;
    case 2: // Normal Render Mode
      scaleFactor = 4;
      maxIterations = 100;
      tolerance = 1e-5;
      for (let i = 0; i < modeButtons.length; i++) {
        if (i + 1 === newMode) {
          modeButtons[i].classList.add("active");
        } else {
          modeButtons[i].classList.remove("active");
        }
      }
      break;
    case 3: // High Detail Mode
      scaleFactor = 3;
      maxIterations = 100;
      tolerance = 1e-6;
      for (let i = 0; i < modeButtons.length; i++) {
        if (i + 1 === newMode) {
          modeButtons[i].classList.add("active");
        } else {
          modeButtons[i].classList.remove("active");
        }
      }
      break;
    case 4: // High Detail Mode
      scaleFactor = 2;
      maxIterations = 150;
      tolerance = 1e-6;
      for (let i = 0; i < modeButtons.length; i++) {
        if (i + 1 === newMode) {
          modeButtons[i].classList.add("active");
        } else {
          modeButtons[i].classList.remove("active");
        }
      }
      break;
    case 5: // High Detail Mode
      scaleFactor = 1;
      maxIterations = 200;
      tolerance = 1e-7;
      for (let i = 0; i < modeButtons.length; i++) {
        if (i + 1 === newMode) {
          modeButtons[i].classList.add("active");
        } else {
          modeButtons[i].classList.remove("active");
        }
      }
      break;
    default:
      console.error(`Invalid mode: ${newMode}`);
      return;
  }

  mode = newMode;
  updateFractal(); // Redraw the fractal with the new settings
}


function updateFractal() {
  realStep = (realMax - realMin) / canvasWidth;
  imagStep = (imagMax - imagMin) / canvasHeight;

  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvasWidth / scaleFactor;
  offscreenCanvas.height = canvasHeight / scaleFactor;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  for (let x = 0; x < offscreenCanvas.width; x++) {
    for (let y = 0; y < offscreenCanvas.height; y++) {
      const zx = realMin + x * realStep * scaleFactor;
      const zy = imagMax - y * imagStep * scaleFactor;
      const {iterations, zx: rootRe, zy: rootIm} = newtonFractal(zx, zy);
      const color = getColor(iterations, rootRe, rootIm);

      offscreenCtx.fillStyle = color;
      offscreenCtx.fillRect(x, y, 1, 1);
    }
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width * scaleFactor, offscreenCanvas.height * scaleFactor);
}

function zoomIn() {
  const centerX = (realMin + realMax) / 2;
  const centerY = (imagMin + imagMax) / 2;

  const newWidth = (realMax - realMin) * 0.8;
  const newHeight = (imagMax - imagMin) * 0.8;

  realMin = centerX - newWidth / 2;
  realMax = centerX + newWidth / 2;

  imagMin = centerY - newHeight / 2;
  imagMax = centerY + newHeight / 2;
  
  updateFractal();
}

function zoomOut() {
  const centerX = (realMin + realMax) / 2;
  const centerY = (imagMin + imagMax) / 2;

  const newWidth = (realMax - realMin) * 1.25;
  const newHeight = (imagMax - imagMin) * 1.25;

  realMin = centerX - newWidth / 2;
  realMax = centerX + newWidth / 2;

  imagMin = centerY - newHeight / 2;
  imagMax = centerY + newHeight / 2;

  updateFractal();
}

function moveFractal(x, y) {
  // Calculate the movement in the real and imaginary axis
  let moveReal = x * 50 * realStep;
  let moveImag = y * 50 * imagStep;

  // Update realMin, realMax, imagMin, and imagMax
  realMin -= moveReal;
  realMax -= moveReal;
  imagMin += moveImag;
  imagMax += moveImag;

  // Call updateFractal to redraw the fractal
  updateFractal();
}

document.getElementById('closeInfoScreen').addEventListener('click', function() {
  document.getElementById('infoScreen').style.display = 'none';
});

let lastTouchTime = 0;

document.addEventListener('touchstart', (event) => {
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - lastTouchTime;

  if (timeDifference < 1000 && timeDifference > 0) {
    event.preventDefault();
  }

  lastTouchTime = currentTime;
});

document.querySelectorAll('.no-zoom').forEach((button) => {
  button.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const lastTouchTime = parseFloat(button.dataset.lastTouchTime) || 0;
    const timeDifference = currentTime - lastTouchTime;

    if (timeDifference < 300 && timeDifference > 0) {
      event.preventDefault();
    }

    button.dataset.lastTouchTime = currentTime;
  });
});
