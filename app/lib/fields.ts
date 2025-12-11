import type { ValidationError } from 'sequelize'

export const groupBy = Object.groupBy

export function getCleanedSequelizeErrors(validationError: ValidationError) {
	const errors = validationError.errors
	const filteredErrors = errors.map((err) => {
		const { message, path, type } = err

		return { message, path, type }
	})

	return Object.groupBy(filteredErrors, (o) => o.path || 'unknown')
}
