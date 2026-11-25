const DISHES = {
  VegetableStew: { name: 'Vegetable Stew', energyRestore: 50, hpRestore: 25 },
  BerryTart: { name: 'Berry Tart', energyRestore: 40, hpRestore: 20 },
  GrilledDace: { name: 'Grilled Dace', energyRestore: 35, hpRestore: 18 },
};

export class Kitchen {
  cook(dishId) {
    return DISHES[dishId] || { name: dishId, energyRestore: 25, hpRestore: 10 };
  }
}
