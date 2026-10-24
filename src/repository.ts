import { NewWizard, House, Wizard, Spell } from "./types";
import { ValidateSpellPower } from "./decorators";

export class GenericRepository<T extends { id: number }> {
  protected items: T[] = [];
  private nextId = 1;

  getAll(): T[] {
    return [...this.items];
  }

  add(item: Omit<T, "id"> | T): T {
    const newItem = { ...item, id: "id" in item ? item.id : this.nextId++ } as T;
    this.items.push(newItem);
    return newItem;
  }
}

export class WizardRepository extends GenericRepository<Wizard> {
  addWizard(wizard: NewWizard): Wizard {
    const savedWizard: Wizard = { ...wizard, id: Date.now() };
    this.items.push(savedWizard);
    return savedWizard;
  }

  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }
}

export class SpellRepository extends GenericRepository<Spell> {
  @ValidateSpellPower
  add(spell: Spell): Spell {
    return super.add(spell);
  }
}
