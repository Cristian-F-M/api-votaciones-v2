import { LOCATION_TEXTS } from '@/constants/fieldsMessages'
import type { FieldValidationError } from 'express-validator'

type Location = FieldValidationError['location'] | ({} & string)

export interface MinMax {
	min: number
	max: number
}

export interface MessageOptions {
	complement: string
	location: Location
	gender: 'M' | 'F'
}

export interface RequiredMessageOptions extends MessageOptions {}

export type MinMaxMessageOptions = Partial<Pick<MessageOptions, 'complement'>> & RequireAtLeastOne<MinMax>

export interface NotValidMessageOptions extends MessageOptions {}

export interface StrongMessageOptions extends MessageOptions {
	requirements: string[]
}

export interface GreaterThatMessageOptions extends CustomPartial<MessageOptions, 'complement'> {
	secondField: CustomOmit<MessageOptions, 'complement'> & { field: string; location: Location | null }
}

export interface LessThatMessageOptions extends CustomPartial<MessageOptions, 'complement'> {
	secondField: CustomOmit<MessageOptions, 'complement'> & { field: string; location: Location | null }
}
