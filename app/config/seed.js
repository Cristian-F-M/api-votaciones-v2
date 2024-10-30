import { Role, TypeDocument, Config } from '../models/index.js'

async function seedDb () {
  await TypeDocument.bulkCreate(
    [
      {
        name: 'Cédula de ciudadanía',
        code: 'CedulaCiudadania',
        description: 'Documento de identidad emitido a los ciudadanos colombianos mayores de 18 años para acreditar su ciudadanía'
      },
      {
        name: 'Tarjeta de identidad',
        code: 'TarjetaIdentidad',
        description: 'Documento emitido a los ciudadanos colombianos mayores de 7 años para acreditar su identidad'
      },
      {
        name: 'Cédula de extranjería',
        code: 'CedulaExtranjeria',
        description: 'Documento emitido a los ciudadanos extranjeros para acreditar su ciudadanía'
      },
      {
        name: 'Pasaporte',
        code: 'Passport',
        description: 'Documento con validez internacional expedido por las autoridades de su respectivo país'
      }
    ]
  )

  await Role.bulkCreate([
    {
      name: 'Usuario',
      code: 'User',
      description: 'Usuario de la aplicación'
    },
    {
      name: 'Aprendiz',
      code: 'Apprentice',
      description: 'Usuario que se encuentra registrado en el sistema y tiene acceso a las funciones de aprendizaje'
    },
    {
      name: 'Administrador',
      code: 'Administrator',
      description: 'Usuario que tiene acceso a la administración de la aplicación'
    },
    {
      name: 'Desarrollador',
      code: 'Developer',
      description: 'Desarrollador de la aplicación'
    },
    {
      name: 'Candidato',
      code: 'Candidate',
      description: 'Usuario candidato a votar'
    }
  ])

  await Config.bulkCreate([
    {
      name: 'Color',
      code: 'Color',
      description: 'Color of the logo and the main texts',
      value: '#ff6719'
    }
  ])

  console.log('\nDatabase seeded!!!!')
}

seedDb()
