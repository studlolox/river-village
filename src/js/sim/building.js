/**
 * Holding building (barn or coop) capable of housing animals.
 */
export class Building {
  constructor(type, x, y) {
    this.type = type; // 'barn' | 'coop'
    this.x = x;
    this.y = y;
    this.capacity = type === 'barn' ? 4 : 4;
    this.animals = [];
  }

  addAnimal(animal) {
    if (this.animals.length >= this.capacity) return false;
    this.animals.push(animal);
    return true;
  }
}
