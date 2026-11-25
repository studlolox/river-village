/**
 * Mobile-first Developer Console drawer & quick-action UI (FV-005).
 */
export class DevConsoleUI {
  constructor(game, dev, scene, hud, audio) {
    this.game = game;
    this.dev = dev;
    this.scene = scene;
    this.hud = hud;
    this.audio = audio;
    this.activeTab = 'economy';

    this.$btnDev = document.getElementById('btn-dev');
    this.$modal = document.getElementById('modal-dev');
    this.$tabs = document.getElementById('dev-tabs');
    this.$quick = document.getElementById('dev-quick-actions');
    this.$log = document.getElementById('dev-log');
    this.$input = document.getElementById('dev-cmd-input');
    this.$btnRun = document.getElementById('btn-dev-run');
    this.$btnClose = document.getElementById('btn-close-dev');
    this.$versionTap = document.getElementById('settings-version');

    this._tapCount = 0;
    this._tapTimer = null;

    this._bindEvents();
    this.syncVisibility();
  }

  syncVisibility() {
    if (!this.$btnDev) return;
    if (this.dev.isEnabled()) {
      this.$btnDev.removeAttribute('hidden');
    } else {
      this.$btnDev.setAttribute('hidden', '');
      this.$modal?.classList.add('hidden');
    }
  }

  _bindEvents() {
    this.$btnDev?.addEventListener('click', () => {
      this.audio?.unlock();
      this.audio?.playUiClick();
      this.open();
    });

    this.$btnClose?.addEventListener('click', () => {
      this.audio?.playUiClick();
      this.close();
    });

    this.$btnRun?.addEventListener('click', () => this._runInput());
    this.$input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this._runInput();
      }
    });

    // 5-tap secret gesture on Settings version string for mobile touch devices
    this.$versionTap?.addEventListener('click', () => {
      this._tapCount += 1;
      clearTimeout(this._tapTimer);
      this._tapTimer = setTimeout(() => { this._tapCount = 0; }, 1800);
      if (this._tapCount >= 5) {
        this._tapCount = 0;
        const next = !this.dev.isEnabled();
        this.dev.setEnabled(next);
        this.syncVisibility();
        this._appendLog(next ? 'Developer mode enabled.' : 'Developer mode disabled.');
      }
    });

    // Keyboard shortcut (~ or Ctrl+Shift+D) when dev mode is active
    window.addEventListener('keydown', (e) => {
      if (!this.dev.isEnabled()) return;
      if (e.key === '~' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd')) {
        e.preventDefault();
        if (this.$modal?.classList.contains('hidden')) this.open();
        else this.close();
      }
    });

    this.$tabs?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dev-tab]');
      if (!btn) return;
      this.activeTab = btn.dataset.devTab;
      this._renderTabs();
      this._renderQuickActions();
    });
  }

  open() {
    if (!this.dev.isEnabled() || !this.$modal) return;
    this.game.paused = true;
    this._renderTabs();
    this._renderQuickActions();
    this.$modal.classList.remove('hidden');
  }

  close() {
    this.$modal?.classList.add('hidden');
    this.game.paused = false;
  }

  _runCommand(cmd) {
    try {
      const res = this.dev.exec(cmd);
      this._appendLog(`> ${cmd}\n${res.message}`);
      this.scene?.refreshTiles?.();
      this.hud?.syncHud?.();
    } catch (err) {
      this._appendLog(`Error: ${err.message}`);
    }
  }

  _runInput() {
    const val = this.$input?.value.trim();
    if (!val) return;
    this._runCommand(val);
    this.$input.value = '';
  }

  _appendLog(text) {
    if (!this.$log) return;
    this.$log.textContent = `${text}\n${this.$log.textContent}`.slice(0, 2000);
  }

  _renderTabs() {
    if (!this.$tabs) return;
    const tabs = [
      { id: 'economy', label: 'Economy' },
      { id: 'world', label: 'World' },
      { id: 'animals', label: 'Animals' },
      { id: 'story', label: 'Story & NPCs' }
    ];
    this.$tabs.innerHTML = tabs
      .map((t) => `<button class="touch-btn ${t.id === this.activeTab ? 'primary' : ''}" data-dev-tab="${t.id}">${t.label}</button>`)
      .join('');
  }

  _renderQuickActions() {
    if (!this.$quick) return;
    const actionsByTab = {
      economy: [
        { label: '+500g', cmd: 'addGold 500' },
        { label: '+5,000g', cmd: 'addGold 5000' },
        { label: 'Fill Energy/HP', cmd: 'fillEnergy' },
        { label: 'Toggle God Mode', cmd: 'godMode' },
        { label: '+10 Spring Root Seeds', cmd: 'giveItem springRootSeed 10' },
        { label: '+50 Wood', cmd: 'giveItem Wood 50' },
        { label: '+50 Stone', cmd: 'giveItem Stone 50' }
      ],
      world: [
        { label: 'Water All Crops', cmd: 'waterAllCrops' },
        { label: 'Grow All Crops', cmd: 'growAllCrops' },
        { label: 'Advance 1 Day', cmd: 'advanceDays 1' },
        { label: 'Weather: Sunny', cmd: 'setWeather sunny' },
        { label: 'Weather: Rainy', cmd: 'setWeather rainy' },
        { label: 'Clear Debris', cmd: 'clearDebris' },
        { label: 'Teleport: Village', cmd: 'teleport RiverVillage' }
      ],
      animals: [
        { label: 'Place Coop', cmd: 'placeBuilding Coop 5 4' },
        { label: 'Place Barn', cmd: 'placeBuilding Barn 11 4' },
        { label: 'Spawn River Hen', cmd: 'spawnAnimal RiverHen Clover' },
        { label: 'Spawn Meadow Cow', cmd: 'spawnAnimal MeadowCow Buttercup' },
        { label: 'Feed All Animals', cmd: 'feedAllAnimals' },
        { label: 'Max Happiness', cmd: 'maxAnimalHappiness' }
      ],
      story: [
        { label: 'Complete FTUE', cmd: 'completeOnboarding' },
        { label: 'Unlock All Milestones', cmd: 'unlockAllMilestones' },
        { label: 'Maren Reed +10❤', cmd: 'setFriendship maren_reed 10' },
        { label: 'Max All Friendships', cmd: 'maxAllFriendships' },
        { label: 'Unlock All Achievements', cmd: 'unlockAllAchievements' },
        { label: 'Inspect State', cmd: 'inspectState' }
      ]
    };

    const list = actionsByTab[this.activeTab] || [];
    this.$quick.innerHTML = '';
    for (const item of list) {
      const btn = document.createElement('button');
      btn.className = 'touch-btn';
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        this.audio?.playUiClick();
        this._runCommand(item.cmd);
      });
      this.$quick.appendChild(btn);
    }
  }
}
