import { Animal } from './animal.js';

/**
 * Manages buildings (barn, coop) and housed animals on the player's holding.
 */
export class Holding {
  constructor(name = 'Honeysuckle Holding') {
    this.name = name;
    this.buildings = new Map();
    this.animals = new Map();
  }

  _key(x, y) {
    return `${x},${y}`;
  }

  placeBuilding(type, x, y) {
    const building = { type, x, y, capacity: type === 'barn' ? 4 : 4, animals: [] };
    this.buildings.set(this._key(x, y), building);
    return building;
  }

  buildingAt(x, y) {
    return this.buildings.get(this._key(x, y)) || null;
  }

  addAnimal(kind, x, y) {
    const b = this.buildingAt(x, y);
    if (!b || b.animals.length >= b.capacity) return null;
    const animal = new Animal(kind);
    b.animals.push(animal);
    this.animals.set(this._key(x, y), animal);
    return animal;
  }

  animalAt(x, y) {
    return this.animals.get(this._key(x, y)) || null;
  }
}
