import { Game } from './js/sim/game.js';
import { GameScene } from './js/render/scene.js';
import { AudioEngine } from './js/render/audio.js';
import { InputController } from './js/render/input.js';
import { HudController } from './js/ui/hud.js';
import { DevConsole } from './js/sim/dev.js';
import { DevConsoleUI } from './js/ui/dev-console.js';

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
const dev = new DevConsole(game);
const devUi = new DevConsoleUI(game, dev, scene, hud, audio);

function performTileAction(tx, ty) {
  const res = game.interactTile(tx, ty);
  if (!res.action) return false;
  if (res.action === 'till') {
    audio.play('hoe');
    scene.particles.spawnDirt({ x: tx, y: ty });
  } else if (res.action === 'plant') {
    audio.play('plant');
  } else if (res.action === 'water') {
    audio.play('water');
    scene.particles.spawnWatering({ x: tx, y: ty });
  } else if (res.action === 'harvest') {
    audio.play('harvest');
    scene.particles.spawnHarvest({ x: tx, y: ty });
  }
  scene.refreshTiles();
  hud.syncHud();
  return true;
}

function getFacingTile() {
  let tx = game.player.gridPos.x;
  let ty = game.player.gridPos.y;
  const f = game.player.facing;
  if (f.includes('up')) ty -= 1;
  if (f.includes('down')) ty += 1;
  if (f.includes('left')) tx -= 1;
  if (f.includes('right')) tx += 1;
  return { x: tx, y: ty };
}

document.getElementById('btn-action').addEventListener('click', () => {
  audio.unlock();
  if (game.paused || !game.started) return;
  const target = getFacingTile();
  performTileAction(target.x, target.y);
});

let lastDragTileKey = null;

const input = new InputController(
  canvas,
  thumbZone,
  (dir) => {
    if (game.paused || !game.started) return;
    if (game.movePlayer(dir)) {
      audio.playStep();
    }
  },
  (clientX, clientY, isDrag) => {
    if (game.paused || !game.started) return;
    const tile = scene.screenToTile(clientX, clientY);
    if (!tile) return;

    const key = `${tile.x},${tile.y}`;
    if (isDrag && key === lastDragTileKey) return;
    lastDragTileKey = key;

    const dist = Math.max(
      Math.abs(tile.x - game.player.gridPos.x),
      Math.abs(tile.y - game.player.gridPos.y)
    );

    if (dist <= 1) {
      if (performTileAction(tile.x, tile.y)) return;
    }

    if (!isDrag) {
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
    const minutesPerSec = (20 * 60) / game.settings.getDayLengthSeconds();
    clockAccum += dt * minutesPerSec;
    if (clockAccum >= 10) {
      const step = Math.floor(clockAccum / 10) * 10;
      clockAccum -= step;
      if (game.timeOfDay.advanceMinutes(step)) {
        game.sleep();
        scene.refreshTiles();
      }
      hud.syncHud();
    }
  }

  scene.update(dt);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

window.__riverVillage = { game, scene, hud, dev, devUi };
