// Vérifie la puissance du sort avant d'exécuter add().
export function ValidateSpellPower(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

  descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
    const candidate = args[0] as { power?: unknown } | null;

    if (
      typeof candidate === "object" &&
      candidate !== null &&
      "power" in candidate &&
      typeof candidate.power === "number" &&
      candidate.power < 0
    ) {
      throw new Error("Spell power cannot be negative");
    }

    return originalMethod.apply(this, args);
  };
}

// Cache les résultats selon les arguments et garde un cache par instance.
export function Cache(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: unknown[]) => unknown;
  const caches = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (this: object, ...args: unknown[]): unknown {
    let instanceCache = caches.get(this);

    if (!instanceCache) {
      instanceCache = new Map<string, unknown>();
      caches.set(this, instanceCache);
    }

    const key = JSON.stringify(args);
    if (instanceCache.has(key)) {
      console.log("Résultat récupéré depuis le cache");
      return instanceCache.get(key);
    }

    const result = originalMethod.apply(this, args);
    instanceCache.set(key, result);
    return result;
  };
}
