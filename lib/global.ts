export function getRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
// biome-ignore lint/suspicious/noExplicitAny: It does not matter
export function mergeObjects<T>(...options: Record<string, any>[]) {
	const entries = options.flatMap((p) => Object.entries(p).filter((i) => i.every((e) => !!e)))
	return Object.fromEntries(entries) as T
}
