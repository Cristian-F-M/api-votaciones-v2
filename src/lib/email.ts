import { ConfigService } from '@/app/services/config.service'
import transporter from '@/config/nodemailer'
import { RESET_PASSWORD_CODE_EXPIRATION_TIME } from '@/constants/auth'
import ResetPasswordEmail from '@/emails/password-reset/email'
import { render } from '@react-email/components'
import dotenv from 'dotenv'
import type { SendMailOptions } from 'nodemailer'
import { formatTime } from './global'

interface SendEmailProps extends SendMailOptions {
	to: string
	subject: string
	html: string
}

dotenv.config()

export async function renderEmail(Email: React.ReactNode) {
	return await render(Email)
}

export async function sendEmail({ to, subject, html, ...props }: SendEmailProps) {
	const configs = ConfigService.get()

	return await transporter.sendMail({
		from: `Votaciones <${configs.SMTP_USER}>`,
		to,
		subject,
		html,
		...props
	})
}

export async function renderResetPasswordEmail(code: string) {
	const configs = ConfigService.get()
	return await renderEmail(
		ResetPasswordEmail({
			code,
			color: configs.COLOR as string,
			imageSrc: configs.LOGO_IMAGE as string,
			expirationTime: formatTime(RESET_PASSWORD_CODE_EXPIRATION_TIME)
		})
	)
}
