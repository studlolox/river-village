import { Character, Game } from './sim/game.js';
import { Settings } from './sim/settings.js';
import { SaveManager } from './sim/save.js';
import { IsometricScene } from './render/scene.js';
import { TileRenderer } from './render/tile-renderer.js';
import { InputAdapter } from './render/input.js';
import { AudioStub } from './render/audio-stub.js';

const settings = new Settings();
const saveManager = new SaveManager();
const game = new Game();
const audio = new AudioStub(settings);

let isoScene = null;
let tileRenderer = null;
let deferredInstallPrompt = null;

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

function updateHUD() {
  document.getElementById('hud-holding').textContent = game.holding.name;
  document.getElementById('hud-date').textContent = `${game.date.season} ${game.date.day}, Yr ${game.date.year}`;
  document.getElementById('hud-time').textContent = game.clock.format();
  document.getElementById('hud-gold').textContent = `${game.player.gold}g`;
  document.getElementById('hud-energy').textContent = `Energy: ${game.energy}/${game.maxEnergy}`;
  document.getElementById('hud-location').textContent = game.player.location;
  document.getElementById('btn-toggle-music').textContent = settings.isMusicEnabled() ? 'On' : 'Off';
  document.getElementById('btn-toggle-sfx').textContent = settings.isSfxEnabled() ? 'On' : 'Off';
}

function renderFrame() {
  if (!isoScene || !tileRenderer) return;
  tileRenderer.syncPlayer(game.player, game.character.appearance.outfitColor);
  isoScene.followPlayer(game.player.gridPos);
  isoScene.updateDaylight(game.clock.daylightFactor());
  isoScene.render();
}

function bindUI() {
  const ccModal = document.getElementById('modal-char-create');
  const settingsModal = document.getElementById('modal-settings');

  document.getElementById('btn-start-game').addEventListener('click', () => {
    audio.unlock();
    const playerName = document.getElementById('input-player-name').value.trim() || 'Aria';
    const holdingName = document.getElementById('input-holding-name').value.trim() || 'Honeysuckle Holding';
    const outfitColor = document.getElementById('input-outfit-color').value || '#3c7a57';
    const char = new Character(playerName, holdingName, { outfitColor });
    game.character = char;
    game.player.name = playerName;
    game.holding.name = holdingName;
    game.start();
    ccModal.classList.add('hidden');
    updateHUD();
    renderFrame();
  });

  document.getElementById('btn-sleep').addEventListener('click', () => {
    game.sleep();
    updateHUD();
    renderFrame();
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    saveManager.save(1, game.toJSON());
  });

  document.getElementById('btn-load').addEventListener('click', () => {
    const loaded = saveManager.load(1);
    if (loaded) {
      game.loadFromSave(loaded);
      ccModal.classList.add('hidden');
      updateHUD();
      renderFrame();
    }
  });

  document.getElementById('btn-settings').addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
    updateHUD();
  });

  document.getElementById('btn-close-settings').addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  document.getElementById('btn-toggle-music').addEventListener('click', () => {
    settings.setMusicEnabled(!settings.isMusicEnabled());
    updateHUD();
  });

  document.getElementById('btn-toggle-sfx').addEventListener('click', () => {
    settings.setSfxEnabled(!settings.isSfxEnabled());
    updateHUD();
  });

  document.getElementById('btn-delete-save').addEventListener('click', () => {
    saveManager.confirmDelete(1);
  });

  const installBtn = document.getElementById('btn-install');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    installBtn.classList.remove('hidden');
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt = null;
    installBtn.classList.add('hidden');
  });

  new InputAdapter(
    (dir) => {
      audio.unlock();
      if (game.player.handleInput(dir, game.holding.map)) {
        game.player.location = 'Holding';
        game.tick(5);
        audio.playStep();
        updateHUD();
        renderFrame();
      }
    },
    () => {
      audio.unlock();
      game.tick(10);
      updateHUD();
      renderFrame();
    }
  );
}

function init() {
  registerServiceWorker();
  const canvas = document.getElementById('game-canvas');
  isoScene = new IsometricScene(canvas);
  tileRenderer = new TileRenderer(isoScene.scene, game.holding.map);
  bindUI();
  updateHUD();
  renderFrame();
}

init();
