
export function basicClone<T>(object:T): T {
  return JSON.parse(JSON.stringify(object));
}