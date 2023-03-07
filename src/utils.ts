
import { Callback, EventProperties, ID, Options, SegmentEvent, Traits, User } from "@segment/analytics-next"
type ResolveUser<T extends Traits> = (
  id?: ID | object,
  traits?: T | Callback | null,
  options?: Options | Callback,
  callback?: Callback
) => [ID, T, Options, Callback | undefined]

 function isString(obj: unknown): obj is string {
  return typeof obj === 'string'
}

 function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number'
}

 function isFunction(obj: unknown): obj is Function {
  return typeof obj === 'function'
}

function isPlainObject(obj: unknown): obj is Record<string, any> {
  return (
    Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() === 'object'
  )
}

/**
 * Helper for group, identify methods
 */
export const resolveUserArguments = <T extends Traits, U extends User>(
  user: U
): ResolveUser<T> => {
  return (...args): ReturnType<ResolveUser<T>> => {
    let id: string | ID | null = null
    // args.fin

    id = args.find(isString) ?? args.find(isNumber)?.toString() ?? user.id()

    const objects = args.filter((obj) => {
      if (id === null) {
        return isPlainObject(obj)
      }
      return isPlainObject(obj) || obj === null
    }) as Array<Traits | null>

    const traits = (objects[0] ?? {}) as T
    const opts = (objects[1] ?? {}) as Options

    const resolvedCallback = args.find(isFunction) as Callback | undefined

    return [id, traits, opts, resolvedCallback]
  }
}

/**
 * Helper for the track method
 */
export function resolveArguments(
  eventName: string | SegmentEvent,
  properties?: EventProperties | Callback,
  options?: Options | Callback,
  callback?: Callback
): [string, EventProperties | Callback, Options, Callback | undefined] {
  const args = [eventName, properties, options, callback]

  const name = isPlainObject(eventName) ? eventName.event : eventName
  if (!name || !isString(name)) {
    throw new Error('Event missing')
  }

  const data = isPlainObject(eventName)
    ? eventName.properties ?? {}
    : isPlainObject(properties)
    ? properties
    : {}

  let opts: Options = {}
  if (!isFunction(options)) {
    opts = options ?? {}
  }

  if (isPlainObject(eventName) && !isFunction(properties)) {
    opts = properties ?? {}
  }

  const cb = args.find(isFunction) as Callback | undefined
  return [name, data, opts, cb]
}