import { AcademyEvent, House, NewWizard, Spell, SpellCastEvent, Wizard } from "./types";
import { Cache } from "./decorators";
import { SpellRepository, WizardRepository } from "./repository";

// Exercice 6 : vérifier que la maison est bien l'une des quatre maisons.
const validHouses: readonly House[] = [
  "Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"
];

function isHouse(value: unknown): value is House {
  return typeof value === "string" &&
    validHouses.some(house => house === value);
}

function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean";
}

// Exercice 3 : ce gestionnaire accepte uniquement un événement spell-cast.
function handleSpellCast(event: SpellCastEvent): void {
  console.log(`${event.spellName} a été lancé par le sorcier ${event.wizardId}.`);
}

// Exercice 5 : méthode utilisée pour tester le décorateur Cache.
class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calcul en cours...");
    return basePower * multiplier;
  }
}

function main(): void {
  console.log("--- Exercice 1 : ajouter un sorcier ---");
  const wizards = new WizardRepository();
  const newWizard: NewWizard = {
    name: "Harry Potter", house: "Gryffindor", level: 5, active: true
  };
  const harry = wizards.addWizard(newWizard);
  console.log(harry);

  console.log("\n--- Exercice 2 : filtrer par maison ---");
  wizards.addWizard({
    name: "Draco Malfoy", house: "Slytherin", level: 4, active: true
  });
  console.log(wizards.findByHouse("Gryffindor"));

  console.log("\n--- Exercice 3 : événement de sort ---");
  const event: AcademyEvent = {
    type: "spell-cast", wizardId: harry.id, spellName: "Expelliarmus"
  };
  if (event.type === "spell-cast") handleSpellCast(event);

  console.log("\n--- Exercice 4 : valider la puissance ---");
  const spells = new SpellRepository();
  const validSpell: Spell = {
    id: 102, name: "Protego", category: "defense", power: 50
  };
  console.log("Sort ajouté :", spells.add(validSpell));

  try {
    spells.add({ id: 103, name: "Sort invalide", category: "attack", power: -10 });
  } catch (error) {
    console.log("Erreur attendue :", (error as Error).message);
  }

  console.log("\n--- Exercice 5 : cache ---");
  const calculator = new SpellCalculator();
  console.log(calculator.calculatePower(10, 3));
  console.log(calculator.calculatePower(10, 3));
  console.log(calculator.calculatePower(5, 2));

  console.log("\n--- Exercice 6 : Type Guard ---");
  const validData: unknown = {
    id: 1, name: "Harry Potter", house: "Gryffindor", level: 5, active: true
  };
  const invalidData: unknown = {
    id: 2, name: "Viktor", house: "Durmstrang", level: 5, active: true
  };
  console.log("Donnée valide :", isWizard(validData));     // true
  console.log("Donnée invalide :", isWizard(invalidData)); // false
}

main();
