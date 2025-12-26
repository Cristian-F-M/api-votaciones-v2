// Script made 95% by AI, 5% by me 😁

import fs from 'node:fs'
import path from 'node:path'
import * as models from '@/app/models'

const meta = Object.values(models).flatMap((model) =>
	Object.values(model.associations).map((a) => ({
		source: model.name,
		target: a.target.name,
		type: a.associationType as AssociationMeta['type']
	}))
)

type AssociationMeta = {
	source: string
	target: string
	type: 'BelongsTo' | 'HasOne' | 'HasMany'
}

function nonAttributesFor(a: AssociationMeta) {
	const T = a.target
	const propertyName = T[0]?.toLowerCase() + T.slice(1)

	if (a.type === 'HasMany') return `    ${propertyName}s: NonAttribute<Models.${T}[]>`

	return `    ${propertyName}: NonAttribute<Models.${T}>`
}

function mixinsFor(a: AssociationMeta) {
	const T = a.target
	const propertyName = T[0]?.toLowerCase() + T.slice(1)
	const id = `Models.${T}['id']`

	let text = ''

	if (a.type === 'BelongsTo') {
		text += `    get${T}: BelongsToGetAssociationMixin<${T}>
    set${T}: BelongsToSetAssociationMixin<${T}, ${id}>
    create${T}: BelongsToCreateAssociationMixin<${T}>
    `
	}

	if (a.type === 'HasMany') {
		text += `    get${T}s: HasManyGetAssociationsMixin<Models.${T}>
    add${T}: HasManyAddAssociationMixin<Models.${T}, ${id}>
    add${T}s: HasManyAddAssociationsMixin<Models.${T}, ${id}>
    create${T}: HasManyCreateAssociationMixin<${T}>
    `
	}

	if (a.type === 'HasOne') {
		text += `    get${T}: HasOneGetAssociationMixin<${T}>
    set${T}: HasOneSetAssociationMixin<${T}, ${id}>
    create${T}: HasOneCreateAssociationMixin<${T}>
    `
	}

	return text
}

const cap = (s: string) => s[0]?.toUpperCase() + s.slice(1)
const lines: string[] = []

const timestampsText = `'createdAt' | 'updatedAt' | 'deletedAt'`

lines.push('// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT')
lines.push(`import type { NonAttribute } from 'sequelize'`)
lines.push(`import type * as Models from '@/types/models'`)
lines.push(
	`import type { Model, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, HasOneCreateAssociationMixin } from 'sequelize'`
)
lines.push('')
lines.push(
	`type MagicModel<M, AttrsOmit extends keyof InferAttributes<M> = never, CreationAttrsOmit extends keyof InferCreationAttributes<M> = never> = Model<InferAttributes<M, { omit: ${timestampsText} | AttrsOmit }>, InferCreationAttributes<M, { omit: ${timestampsText} | CreationAttrsOmit }>>`
)
lines.push('')
lines.push('interface Timestamps { createdAt: Date; updatedAt: Date }')
lines.push('interface SoftDelete { deletedAt: Date }')
lines.push('')

for (const [modelName, model] of Object.entries(models)) {
	const assocs = model.associations
	const { paranoid } = model.options

	lines.push('declare module "@/types/models" {')
	lines.push(
		`  interface ${modelName} extends MagicModel<${modelName}, ${timestampsText}, ${timestampsText}>, Timestamps ${paranoid ? ', SoftDelete' : ''} {`
	)
	if (!assocs || Object.keys(assocs).length === 0) {
		lines.push('  }')
		lines.push('}')
		lines.push('')
		continue
	}

	for (const assoc of Object.values(assocs)) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const as = cap(assoc.as!)
		const target = assoc.target.name

		const associationMeta: AssociationMeta = {
			source: modelName,
			target,
			type: assoc.associationType as AssociationMeta['type']
		}

		const nonAttributes = nonAttributesFor(associationMeta)
		const mixins = mixinsFor(associationMeta)

		lines.push(`    // ${associationMeta.source} ${associationMeta.type} ${associationMeta.target}`)
		lines.push('')
		lines.push('    // Properties')
		lines.push(nonAttributes)
		lines.push('')
		lines.push('')
		lines.push('    // Mixins')
		lines.push(mixins)
	}

	lines.push('  }')
	lines.push('}')
	lines.push('')
}

const target = path.resolve('types/models-associations.d.ts')
fs.writeFileSync(target, lines.join('\n'))

console.log('✔ Sequelize types generated from real associations')
