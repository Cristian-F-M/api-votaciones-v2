import type {
	GreaterThatMessageOptions,
	LessThatMessageOptions,
	Location,
	RequiredMessageOptions,
	StrongMessageOptions
} from '@/types/fieldsMessages'

export const LOCATION_TEXTS: Record<Location, string> = {
	headers: 'header',
	params: 'parametro',
	body: 'campo',
	query: 'parametro',
	cookies: 'cookie'
}

export const DEFAULT_MESSAGE_OPTIONS: RequiredMessageOptions = {
	location: 'body',
	complement: '',
	gender: 'M'
}

export const STRONG_DEFAULT_OPTIONS: StrongMessageOptions = {
	...DEFAULT_MESSAGE_OPTIONS,
	requirements: []
}

export const GREATER_THAT_DEFAULT_OPTIONS: GreaterThatMessageOptions = {
	...DEFAULT_MESSAGE_OPTIONS,
	secondField: {
		gender: 'M',
		location: 'body',
		field: ''
	}
}

export const LESS_THAT_DEFAULT_OPTIONS: LessThatMessageOptions = {
	...DEFAULT_MESSAGE_OPTIONS,
	secondField: {
		gender: 'M',
		location: 'body',
		field: ''
	}
}
