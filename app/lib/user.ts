export function getSecretEmail(email: string, maxLetter: number) {
	const [user, dom] = email.split('@')
	const visiblePercent = Math.floor((user.length * 20) / 100) || 2
	const visibleLetters =
		visiblePercent <= maxLetter ? visiblePercent : maxLetter
	const visibleUser = user.slice(0, visibleLetters)
	const newEmail = `${visibleUser}*****@${dom}`
	return newEmail
}

export function getPasswordResetCode(length: number) {
	const characters = Array.from({ length }, () => {
		const typeChat = Math.random() < 0.5 ? 0 : 1
		return typeChat === 0
			? String.fromCharCode(Math.floor(Math.random() * 26) + 65)
			: Math.floor(Math.random() * 10).toString()
	})
	return characters.join('')
}
