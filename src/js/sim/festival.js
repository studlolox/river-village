const REWARDS = {
  'Spring Egg Hunt': 'SunburstHat',
  'Summer Luau': 'TideLantern',
  'Fall Fair': 'HarvestTrophy',
  'Winter Feast': 'StarlightCloak',
};

export class Festival {
  constructor(name = 'Spring Egg Hunt') {
    this.name = name;
  }

  playMinigame({ score = 0 } = {}) {
    const reward = score >= 5 ? REWARDS[this.name] || 'FestivalRibbon' : 'ParticipationToken';
    return { festival: this.name, score, reward };
  }
}
