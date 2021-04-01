type KeyOf<E> = keyof E;
/**
 * Convert const enum to types
 * @example
 * const ENUM_CONST = {
 *   KEY1: "VALUE1",
 *   KEY2: "VALUE2",
 *   KEY3: 3,
 *   KEY4: true,
 * } as const;
 *
 * export type EnumTypes = EnumType<typeof ENUM_CONST>; // "VALUE1" | "VALUE2" | 3 | true
 */
export type EnumType<E> = E[KeyOf<E>];

export type EnumOf<E> = {
  readonly [K in KeyOf<E>]: {
    readonly value: E[K];
    isEqual: (value: unknown) => boolean;
  };
} & {
  ensureEnum(e: unknown): e is EnumType<E>;
  readonly values: ReadonlyArray<EnumType<E>>;
};

/**
 * Check value is in EnumOf
 * @param obj EnumOf object
 * @param e value to check
 * @example
 * const ENUM_CONST = {
 *   KEY1: "VALUE1",
 *   KEY2: "VALUE2",
 *   KEY3: 3,
 *   KEY4: true,
 * } as const;
 *
 * assertEnum("NO_VALUE"); // --> throw new Error("Invalid ENUM value NO_VALUE);
 * let value1: string = 'VALUE1'
 * assertEnum(value1)
 * value // type: 'VALUE1' | 'VALUE2'
 */
export function assertEnum<E>(
  obj: EnumOf<E>,
  e: unknown
): asserts e is EnumType<E> {
  if (!obj.values.find((value) => value === e)) {
    throw new Error(`Invalid enum ${e}`);
  }
}

function ensureEnum<E>(this: EnumOf<E>, e: unknown): e is EnumType<E> {
  try {
    assertEnum(this, e);
    return true;
  } catch (ex) {
    return false;
  }
}

/**
 * Convert const enum to EnumOf type
 * @param obj const enum
 * @example
 * const ENUM_CONST = {
 *   KEY1: "VALUE1",
 *   KEY2: "VALUE2",
 *   KEY3: 3,
 *   KEY4: true,
 * } as const;
 *
 * export type EnumTypes = EnumType<typeof ENUM_CONST>; // "VALUE1" | "VALUE2" | 3 | true
 * export const Enum = EnumBuilder(ENUM_CONST);
 * Enum.KEY1.isEqual('VALUE1'); // --> true
 * Enum.KEY1.isEqual("VALUE2"); // --> false
 * Enum.KEY1.value; // --> 'VALUE1'
 * let value1: string = 'VALUE1'
 * if(Enum.ensureEnum(value1)) { value1 // type: "VALUE1" | "VALUE2" } // --> OK
 * Enum.values // ["VALUE1", "VALUE2", 3, true]
 */
export function EnumBuilder<E extends Record<string, unknown>>(
  obj: E
): EnumOf<E> {
  const keys = Object.keys(obj) as KeyOf<E>[];
  return keys.reduce(
    (acc, key) => {
      return Object.assign(acc, {
        [key]: Object.freeze({
          value: obj[key],
          isEqual: (value: unknown) => obj[key] === value
        }),
        values: Object.freeze([...acc.values, obj[key]])
      });
    },
    ({
      ensureEnum,
      values: Object.freeze([])
    } as unknown) as EnumOf<E>
  );
}
