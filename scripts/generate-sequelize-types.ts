// Script made 95% by AI, 5% by me 😁

import fs from 'node:fs'
import path from 'node:path'
import * as models from '@/models'

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

function getMixinsFunctionsNames(a: AssociationMeta) {
	const T = a.target

	const get = `get${T}`
	const set = `set${T}`
	const add = `add${T}`
	const create = `create${T}`

	if (a.type === 'BelongsTo') return `'${get}' | '${set}' | '${create}'`
	if (a.type === 'HasOne') return `'${get}' | '${set}' | '${create}'`
	if (a.type === 'HasMany') return `'${get}s' | '${add}' | '${add}s' | '${create}'`
}

function mixinsFor(a: AssociationMeta) {
	const T = a.target
	const propertyName = T[0]?.toLowerCase() + T.slice(1)
	const id = `Models.${T}['id']`

	let text = `    //Tl ${a.source} ${a.type} ${T}`

	if (a.type === 'BelongsTo') {
		text += `
    //* Property
    ${propertyName}: NonAttribute<Models.${T}>

    //* Mixins
    get${T}: BelongsToGetAssociationMixin<${T}>
    set${T}: BelongsToSetAssociationMixin<${T}, ${id}>
    create${T}: BelongsToCreateAssociationMixin<${T}>
    `
	}

	if (a.type === 'HasMany') {
		text += `
    //* Property
    ${propertyName}s: NonAttribute<Models.${T}[]>

    //* Mixins
    get${T}s: HasManyGetAssociationsMixin<Models.${T}>
    add${T}: HasManyAddAssociationMixin<Models.${T}, ${id}>
    add${T}s: HasManyAddAssociationsMixin<Models.${T}, ${id}>
    create${T}: HasManyCreateAssociationMixin<${T}>
    `
	}

	if (a.type === 'HasOne') {
		text += `
    //* Property
    ${propertyName}: NonAttribute<Models.${T}>

    //* Mixins
    get${T}: HasOneGetAssociationMixin<${T}>
    set${T}: HasOneSetAssociationMixin<${T}, ${id}>
    create${T}: HasOneCreateAssociationMixin<${T}>
    `
	}

	return text
}

const cap = (s: string) => s[0]?.toUpperCase() + s.slice(1)
const lines: string[] = []

const timestampsText = `'createdAt' | 'updatedAt'`

lines.push('// ⚠️ AUTO-GENERATED FILE — DO NOT EDIT')
lines.push(`import type { NonAttribute } from 'sequelize'`)
lines.push(`import type * as Models from '@/types/models'`)
lines.push(
	`import type { Model, InferAttributes, InferCreationAttributes, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, BelongsToCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, HasOneCreateAssociationMixin } from 'sequelize'`
)
lines.push('')
lines.push(
	`type MagicModel<M, AttrsOmit extends keyof InferAttributes<M> = never, CreationAttrsOmit extends keyof InferCreationAttributes<M> = never> = Model<InferAttributes<M, { omit: 'createdAt' | 'updatedAt' | AttrsOmit }>, InferCreationAttributes<M, { omit: 'createdAt' | 'updatedAt' | CreationAttrsOmit }>>`
)
lines.push('')
lines.push('interface Timestamps { createdAt: Date; updatedAt: Date }')
lines.push('')

let modelsIndex = 0

for (const [modelName, model] of Object.entries(models)) {
	const assocs = model.associations

	if (!assocs || Object.keys(assocs).length === 0) {
		modelsIndex++
		continue
	}
	const text = getMixinsFunctionsNames(meta[modelsIndex] as AssociationMeta)

	lines.push('declare module "@/types/models" {')
	lines.push(
		`  interface ${modelName} extends MagicModel<${modelName}, ${timestampsText}, ${timestampsText}>, Timestamps {`
	)

	for (const assoc of Object.values(assocs)) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const as = cap(assoc.as!)
		const target = assoc.target.name
		const mixins = mixinsFor({ source: modelName, target, type: assoc.associationType as AssociationMeta['type'] })
		lines.push(mixins)
	}

	lines.push('  }')
	lines.push('}')
	lines.push('')

	modelsIndex++
}

const target = path.resolve('app/types/models-associations.d.ts')
fs.writeFileSync(target, lines.join('\n'))

console.log('✔ Sequelize types generated from real associations')
