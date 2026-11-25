/**
 * Mobile-first HUD, modals, PWA install prompt, and visibilitychange auto-pause.
 */
export class HudController {
  constructor(game, scene, audio) {
    this.game = game;
    this.scene = scene;
    this.audio = audio;
    this._deferredPrompt = null;

    this.$date = document.getElementById('hud-date');
    this.$time = document.getElementById('hud-time');
    this.$gold = document.getElementById('hud-gold');
    this.$energy = document.getElementById('hud-energy');

    this.$modalChar = document.getElementById('modal-char');
    this.$modalSettings = document.getElementById('modal-settings');
    this.$modalSaves = document.getElementById('modal-saves');
    this.$slotsList = document.getElementById('save-slots-list');
    this.$btnInstall = document.getElementById('btn-install');
    this.$iosA2hs = document.getElementById('ios-a2hs');

    this._bindEvents();
    this._setupPwaInstall();
    this.syncHud();
  }

  _bindEvents() {
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.audio.unlock();
      this.audio.playUiClick();
      const pName = document.getElementById('input-player-name').value.trim() || 'Aria';
      const hName = document.getElementById('input-holding-name').value.trim() || 'Honeysuckle Holding';
      const shirtColor = document.getElementById('select-shirt-color').value;
      this.game.player.name = pName;
      this.game.holding.name = hName;
      this.game.player.appearance.shirtColor = shirtColor;
      this.game.start();
      this.$modalChar.classList.add('hidden');
      this.syncHud();
    });

    document.getElementById('btn-sleep').addEventListener('click', () => {
      this.audio.unlock();
      this.audio.playSleepChime();
      this.game.sleep();
      this.syncHud();
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      this.audio.unlock();
      this.audio.playUiClick();
      this._syncSettingsUi();
      this.game.paused = true;
      this.$modalSettings.classList.remove('hidden');
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
      this.audio.playUiClick();
      this.$modalSettings.classList.add('hidden');
      this.game.paused = false;
    });

    document.getElementById('toggle-music').addEventListener('click', () => {
      this.game.settings.setMusicEnabled(!this.game.settings.isMusicEnabled());
      this._syncSettingsUi();
    });

    document.getElementById('toggle-sfx').addEventListener('click', () => {
      this.game.settings.setSfxEnabled(!this.game.settings.isSfxEnabled());
      this._syncSettingsUi();
    });

    document.getElementById('toggle-shake').addEventListener('click', () => {
      this.game.settings.setScreenShake(!this.game.settings.isScreenShakeEnabled());
      this._syncSettingsUi();
    });

    document.getElementById('toggle-quality').addEventListener('click', () => {
      const next = this.game.settings.getQualityMode() === 'high' ? 'battery' : 'high';
      this.game.settings.setQualityMode(next);
      this.scene.applyQualityMode(next);
      this._syncSettingsUi();
    });

    document.getElementById('select-day-length').addEventListener('change', (e) => {
      this.game.settings.setDayLengthSeconds(Number(e.target.value));
    });

    document.getElementById('btn-saves').addEventListener('click', () => {
      this.audio.unlock();
      this.audio.playUiClick();
      this.game.paused = true;
      this._renderSaveSlots();
      this.$modalSaves.classList.remove('hidden');
    });

    document.getElementById('btn-close-saves').addEventListener('click', () => {
      this.audio.playUiClick();
      this.game.saveManager.cancelDelete();
      this.$modalSaves.classList.add('hidden');
      this.game.paused = false;
    });

    document.querySelectorAll('.quick-slot').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.audio.unlock();
        this.audio.playUiClick();
        document.querySelectorAll('.quick-slot').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.game.player.equippedTool = btn.dataset.tool;
      });
    });

    document.getElementById('btn-dismiss-ios').addEventListener('click', () => {
      this.$iosA2hs.classList.add('hidden');
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.game.paused = true;
      } else if (
        this.$modalChar.classList.contains('hidden') &&
        this.$modalSettings.classList.contains('hidden') &&
        this.$modalSaves.classList.contains('hidden')
      ) {
        this.game.paused = false;
      }
    });
  }

  _setupPwaInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this._deferredPrompt = e;
      this.$btnInstall.hidden = false;
    });

    this.$btnInstall.addEventListener('click', async () => {
      if (!this._deferredPrompt) return;
      this._deferredPrompt.prompt();
      await this._deferredPrompt.userChoice;
      this._deferredPrompt = null;
      this.$btnInstall.hidden = true;
    });

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone;
    if (isIos && !isStandalone) {
      this.$iosA2hs.classList.remove('hidden');
    }
  }

  _syncSettingsUi() {
    const s = this.game.settings;
    document.getElementById('toggle-music').textContent = s.isMusicEnabled() ? 'On' : 'Off';
    document.getElementById('toggle-sfx').textContent = s.isSfxEnabled() ? 'On' : 'Off';
    document.getElementById('toggle-shake').textContent = s.isScreenShakeEnabled() ? 'On' : 'Off';
    document.getElementById('toggle-quality').textContent = s.getQualityMode() === 'high' ? 'High' : 'Battery';
    document.getElementById('select-day-length').value = String(s.getDayLengthSeconds());
  }

  _renderSaveSlots() {
    const slots = this.game.saveManager.listSlots();
    const pendingDelete = this.game.saveManager.getPendingDeleteSlot();
    this.$slotsList.innerHTML = '';

    for (const { slot, data } of slots) {
      const row = document.createElement('div');
      row.className = 'slot-row';

      const info = document.createElement('div');
      info.style.fontSize = '13px';
      info.textContent = data
        ? `Slot ${slot}: ${data.holdingName || 'Holding'} · ${data.date?.season || 'Spring'} ${data.date?.day || 1}`
        : `Slot ${slot}: Empty`;

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '6px';

      const saveBtn = document.createElement('button');
      saveBtn.className = 'touch-btn primary';
      saveBtn.textContent = 'Save';
      saveBtn.addEventListener('click', () => {
        this.game.saveManager.save(slot, this.game.toSaveState());
        this._renderSaveSlots();
      });
      actions.appendChild(saveBtn);

      if (data) {
        const loadBtn = document.createElement('button');
        loadBtn.className = 'touch-btn';
        loadBtn.textContent = 'Load';
        loadBtn.addEventListener('click', () => {
          const loaded = this.game.saveManager.load(slot);
          this.game.loadSaveState(loaded);
          this.$modalSaves.classList.add('hidden');
          this.$modalChar.classList.add('hidden');
          this.game.paused = false;
          this.syncHud();
        });
        actions.appendChild(loadBtn);

        const delBtn = document.createElement('button');
        delBtn.className = 'touch-btn danger';
        if (pendingDelete === slot) {
          delBtn.textContent = 'Confirm?';
          delBtn.addEventListener('click', () => {
            this.game.saveManager.deleteSlot(slot);
            this._renderSaveSlots();
          });
        } else {
          delBtn.textContent = 'Del';
          delBtn.addEventListener('click', () => {
            this.game.saveManager.confirmDelete(slot);
            this._renderSaveSlots();
          });
        }
        actions.appendChild(delBtn);
      }

      row.appendChild(info);
      row.appendChild(actions);
      this.$slotsList.appendChild(row);
    }
  }

  syncHud() {
    const { season, day, year } = this.game.date;
    this.$date.textContent = `${season} ${day}, Year ${year}`;
    this.$time.textContent = this.game.timeOfDay.formatted();
    this.$gold.textContent = `${this.game.player.gold}g`;
    this.$energy.textContent = `E: ${this.game.player.energy}/${this.game.player.maxEnergy}`;
  }
}
