import type { ConfigScope } from '@/types/index'
import type { Config as ConfigModel, Role as RoleModel, TypeDocument as TypeDocumentModel } from '@/types/models'
import dotenv from 'dotenv'
import type { CreationAttributes } from 'sequelize'
dotenv.config()

const { CM_PASSWORD, SMTP_USER = '', SMTP_PASSWORD = '' } = process.env

export const ALLOWED_SESSION_TYPES = {
	WEB: 'WEB',
	MOBILE: 'MOBILE'
}

export const ALLOWED_DEVICE_TYPES = {
	WEB: 'WEB',
	IOS: 'IOS',
	ANDROID: 'ANDROID'
}

export const BLANK_VOTE_USER = {
	document: '0',
	email: 'voto@votaciones.com',
	phone: '0',
	name: 'Voto en blanco',
	lastname: '',
	description: 'Vota en blanco si no estás de acuerdo con ninguno de los candidatos',
	password: CM_PASSWORD
}

export const TYPES_DOCUMENTS = {
	CEDULA_CIUDADANIA: {
		name: 'Cédula de ciudadanía',
		code: 'CEDULA_CIUDADANIA',
		description:
			'Documento de identidad emitido a los ciudadanos colombianos mayores de 18 años para acreditar su ciudadanía'
	},
	TARJETA_IDENTIDAD: {
		name: 'Tarjeta de identidad',
		code: 'TARJETA_IDENTIDAD',
		description: 'Documento emitido a los ciudadanos colombianos mayores de 7 años para acreditar su identidad'
	},
	CEDULA_EXTRANJERIA: {
		name: 'Cédula de extranjería',
		code: 'CEDULA_EXTRANJERIA',
		description: 'Documento emitido a los ciudadanos extranjeros para acreditar su ciudadanía'
	},
	PASAPORTE: {
		name: 'Pasaporte',
		code: 'PASAPORTE',
		description: 'Documento con validez internacional expedido por las autoridades de su respectivo país'
	}
}

export const ROLES = {
	USER: {
		name: 'Usuario',
		code: 'USER',
		description: 'Usuario de la aplicación'
	},
	APPRENTICE: {
		name: 'Aprendiz',
		code: 'APPRENTICE',
		description: 'Usuario que se encuentra registrado en el sistema y tiene acceso a las funciones de aprendizaje'
	},
	ADMINISTRATOR: {
		name: 'Administrador',
		code: 'ADMINISTRATOR',
		description: 'Usuario que tiene acceso a la administración de la aplicación'
	},
	DEVELOPER: {
		name: 'Desarrollador',
		code: 'DEVELOPER',
		description: 'Desarrollador de la aplicación'
	},
	CANDIDATE: {
		name: 'Candidato',
		code: 'CANDIDATE',
		description: 'Usuario candidato a votar'
	}
}

export const CONFIGS = {
	COLOR: {
		name: 'Color',
		code: 'COLOR',
		description: 'Color of the logo and the main texts',
		value: '#ff6719',
		scope: 'system' as ConfigScope
	},
	LOGO_IMAGE: {
		name: 'Logo image',
		code: 'LOGO_IMAGE',
		description: 'Logo de la aplicación',
		value: 'https://images.seeklogo.com/logo-png/24/1/sena-logo-png_seeklogo-242896.png',
		scope: 'system' as ConfigScope
	},
	SMTP_USER: {
		name: 'SMTP User',
		code: 'SMTP_USER',
		description: 'Usuario para enviar correos electrónicos',
		value: SMTP_USER,
		scope: 'system' as ConfigScope
	},
	SMTP_PASSWORD: {
		name: 'SMTP Password',
		code: 'SMTP_PASSWORD',
		description: 'Contraseña del usuario para enviar correos electrónicos',
		value: SMTP_PASSWORD,
		scope: 'system' as ConfigScope
	}
}

export const SHIFT_TYPES = {
	MORNING: {
		name: 'Mañana',
		code: 'MORNING',
		description: 'Jornada de la mañana',
		startTime: '07:00',
		endTime: '12:00'
	},
	AFTERNOON: {
		name: 'Tarde',
		code: 'AFTERNOON',
		description: 'Jornada de la tarde',
		startTime: '13:00',
		endTime: '18:00'
	},
	NIGHT: {
		name: 'Noche',
		code: 'NIGHT',
		description: 'Jornada de la noche',
		startTime: '19:00',
		endTime: '10:00'
	}
}

export const CONFIG_SCOPES: Record<Uppercase<ConfigScope>, string> = {
	SYSTEM: 'system',
	USER: 'user'
}
