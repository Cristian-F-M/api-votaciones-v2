export function getRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
// biome-ignore lint/suspicious/noExplicitAny: It does not matter
export function mergeObjects<T>(...options: Record<string, any>[]) {
	const entries = options.flatMap((p) => Object.entries(p).filter((i) => i.every((e) => !!e)))
	return Object.fromEntries(entries) as T
}

const nf = new Intl.NumberFormat('es')

export function formatTime(seconds: number) {
	const h = Math.floor(seconds / 3600)
	const m = Math.floor((seconds % 3600) / 60)
	const s = seconds % 60

	return [
		h && `${nf.format(h)} hora${h !== 1 ? 's' : ''}`,
		m && `${nf.format(m)} minuto${m !== 1 ? 's' : ''}`,
		s && `${nf.format(s)} segundo${s !== 1 ? 's' : ''}`
	]
		.filter(Boolean)
		.join(' ')
}
