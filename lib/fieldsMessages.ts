import { LOCATION_TEXTS, DEFAULT_MESSAGE_OPTIONS, STRONG_DEFAULT_OPTIONS, LESS_THAN_DEFAULT_OPTIONS, GREATER_THAN_DEFAULT_OPTIONS } from '@/constants/fieldsMessages'
import type {
	GreaterThanMessageOptions,
	LessThanMessageOptions,
	MessageOptions,
	MinMaxMessageOptions,
	NotValidMessageOptions,
	RequiredMessageOptions,
	StrongMessageOptions
} from '@/types/fieldsMessages'
import type { Location } from '@/types/fieldsMessages'
import { mergeObjects } from '@/lib/global'

export const formatter = new Intl.ListFormat('es', {
	style: 'long',
	type: 'conjunction'
})

export function getLocationText(location: Location) {
	const locationText = LOCATION_TEXTS[location] ?? location
	return locationText
}

export function getPronoun(gender: MessageOptions['gender'], lowerCase = false) {
	const pronoun = gender === 'F' ? 'La' : 'El'
	if (lowerCase) return pronoun.toLowerCase()
	return pronoun
}

export function requiredMessage(field: string, options: Partial<RequiredMessageOptions> = {}) {
	const mergedOptions = mergeObjects<RequiredMessageOptions>(DEFAULT_MESSAGE_OPTIONS, options)

	const pronoun = getPronoun(mergedOptions.gender)
	const locationText = getLocationText(mergedOptions.location)
	let message = `${pronoun} ${locationText} ${field} es obligatorio`

	if (mergedOptions.complement) message += ` para ${mergedOptions.complement}`

	return message
}

export function minMaxMessage(field: string, options: Partial<MinMaxMessageOptions> = {}) {
	let message = 'Debes tener '

	if (options.min && !options.max) message += `al menos ${options.min}`
	if (options.min && options.max) message += `entre ${options.min} y ${options.max}`
	if (options.max && !options.min) message += `como maximo ${options.max}`

	message += ` ${field}`
	if (options.complement) message += ` ${options.complement}`

	return message
}

export function notValidMessage(field: string, options: Partial<NotValidMessageOptions> = {}) {
	const mergedOptions = mergeObjects<NotValidMessageOptions>(DEFAULT_MESSAGE_OPTIONS, options)

	const pronoun = getPronoun(mergedOptions.gender, true)
	const locationText = getLocationText(mergedOptions.location)
	let message = `El valor de ${pronoun} ${locationText} ${field} no es válido o no está en el formato correcto`

	if (mergedOptions.complement) message += ` ${mergedOptions.complement}`

	return message
}

export function strongMessage(field: string, options: PartialExcept<StrongMessageOptions, 'requirements'>) {
	const allOptions = mergeObjects<StrongMessageOptions>(STRONG_DEFAULT_OPTIONS, options)
	const pronoun = getPronoun(allOptions.gender)
	const locationText = getLocationText(allOptions.location)
	const requirementsText = formatter.format(allOptions.requirements)

	let message = `${pronoun} ${locationText} ${field} debe contener al menos ${requirementsText}`

	if (allOptions.complement) message += ` ${allOptions.complement}`

	return message
}

export function greaterThanMessage(field: string, options: GreaterThanMessageOptions) {
	const mergedOptions = mergeObjects<GreaterThanMessageOptions>(GREATER_THAN_DEFAULT_OPTIONS, options)
	const pronoun = getPronoun(mergedOptions.gender, true)
	const secondPronoun = getPronoun(mergedOptions.secondField.gender, true)
	const secondLocationText = getLocationText(mergedOptions.secondField.location)

	const locationText = getLocationText(options.location)

	let message = `El valor de ${pronoun} ${locationText} ${field} debe ser mayor que ${secondPronoun}`

	if (secondLocationText) message += secondLocationText

	message += ` ${options.secondField.field}`

	return message
}

export function lessThanMessage(field: string, options: LessThanMessageOptions) {
	const mergedOptions = mergeObjects<LessThanMessageOptions>(LESS_THAN_DEFAULT_OPTIONS, options)
	const pronoun = getPronoun(mergedOptions.gender, true)
	const secondPronoun = getPronoun(mergedOptions.secondField.gender, true)
	const secondLocationText = getLocationText(mergedOptions.secondField.location)

	const locationText = getLocationText(options.location)

	let message = `El valor de ${pronoun} ${locationText} ${field} debe ser menor que ${secondPronoun}`

	if (secondLocationText) message += secondLocationText

	message += ` ${options.secondField.field}`

	return message
}
