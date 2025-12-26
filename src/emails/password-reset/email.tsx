import { Body, Container, Head, Heading, Hr, Html, Img, Section, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

interface ResetPasswordProps {
  code: string
  color: string
  imageSrc: string,
  expirationTime: string
}

export default function ResetPassword({ code, color, imageSrc, expirationTime }: ResetPasswordProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Tailwind>
          <Section className="mx-auto w-fit py-8">
            <Heading className="mx-auto">
              <Container className="rounded-full p-2 text-white aspect-square w-fit mx-auto mb-4">
                <Img src={imageSrc} alt="Logo" className="w-[100px] h-auto object-contain" />
              </Container>

              <Container className="w-fit mx-auto">
                <Text className="font-bold text-3xl text-center my-0 text-balance">Restablecimiento de Contraseña</Text>

                <Text
                  className="w-11/12 max-w-[550px] mx-auto text-center text-gray-500 text-sm leading-relaxed my-0 text-muted-foreground leading-relaxed mb-8 text-balance font-normal"
                  style={{ fontFamily: 'Helvetica' }}
                >
                  Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Por favor, utiliza el
                  siguiente código de verificación para completar el proceso. Este código expirará en {expirationTime} por motivos de seguridad.
                </Text>
              </Container>
            </Heading>

            <Container className="border p-6 rounded-lg" style={{ borderColor: color, backgroundColor: `${color}3f` }}>
              <Text className="my-0 text-center text-gray-600">Tu código de verificación</Text>
              <Text
                className="my-0 font-bold text-[60px] text-center my-0 text-balance leading-[60px] tracking-widest"
                style={{ color: color }}
              >
                {code}
              </Text>
            </Container>

            <Container className="mt-3">
              <Text
                className="w-10/12 mx-auto my-0 text-center text-gray-500 text-xs my-0 text-muted-foreground leading-relaxed mb-8 text-pretty"
                style={{ fontFamily: 'Helvetica' }}
              >
                Si no solicitaste este código, puedes ignorar este correo de forma segura. Tu contraseña no será
                cambiada a menos que ingreses el código en nuestra página.
              </Text>
            </Container>

            <Hr className="my-[16px] border-gray-300 border-t-2" />

            <Container>
              <Text className="text-center text-gray-500 text-xs my-0 text-muted-foreground leading-relaxed mb-8 text-balance">
                Este es un correo automático, por favor no respondas. Si necesitas ayuda, visita nuestro centro de
                soporte. &copy; {new Date().getFullYear()} <b>SENA - CGAO</b>. Todos los derechos reservados.
              </Text>
            </Container>
          </Section>
        </Tailwind>
      </Body>
    </Html>
  )
}
