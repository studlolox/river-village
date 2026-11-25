import { Game } from './js/sim/game.js';
import { GameScene } from './js/render/scene.js';
import { AudioEngine } from './js/render/audio.js';
import { InputController } from './js/render/input.js';
import { HudController } from './js/ui/hud.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

const canvas = document.getElementById('game-canvas');
const thumbZone = document.getElementById('thumbstick');

const game = new Game();
const audio = new AudioEngine(game.settings);
const scene = new GameScene(canvas, game);
const hud = new HudController(game, scene, audio);

const input = new InputController(
  canvas,
  thumbZone,
  (dir) => {
    if (game.paused || !game.started) return;
    if (game.movePlayer(dir)) {
      audio.playStep();
    }
  },
  (clientX, clientY) => {
    if (game.paused || !game.started) return;
    const tile = scene.screenToTile(clientX, clientY);
    if (!tile) return;
    const dx = Math.sign(tile.x - game.player.gridPos.x);
    const dy = Math.sign(tile.y - game.player.gridPos.y);
    if (dx === 0 && dy === 0) return;
    const dir =
      dy < 0 ? (dx < 0 ? 'up-left' : dx > 0 ? 'up-right' : 'up') :
      dy > 0 ? (dx < 0 ? 'down-left' : dx > 0 ? 'down-right' : 'down') :
      dx < 0 ? 'left' : 'right';
    if (game.movePlayer(dir)) {
      audio.playStep();
    }
  },
  () => audio.unlock()
);

window.addEventListener('resize', () => {
  scene.resize(window.innerWidth, window.innerHeight);
});

let lastTime = performance.now();
let clockAccum = 0;

function frame(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (!game.paused && game.started) {
    input.tick(dt);
    // Advance in-game clock according to configurable mobile day length
    const minutesPerSec = (20 * 60) / game.settings.getDayLengthSeconds();
    clockAccum += dt * minutesPerSec;
    if (clockAccum >= 10) {
      const step = Math.floor(clockAccum / 10) * 10;
      clockAccum -= step;
      if (game.timeOfDay.advanceMinutes(step)) {
        game.sleep();
      }
      hud.syncHud();
    }
  }

  scene.update(dt);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

window.__riverVillage = { game, scene, hud };
