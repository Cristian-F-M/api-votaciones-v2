import transporter from '@/config/nodemailer'
import { RESET_PASSWORD_CODE_EXPIRATION_TIME } from '@/constants/auth'
import { render } from '@react-email/components'
import dotenv from 'dotenv'
import type { SendMailOptions } from 'nodemailer'
import { ConfigService } from '@/services/emailConfig.service'
import ResetPasswordEmail from '@/emails/password-reset/email'
import { formatTime } from './global'

interface SendEmailProps extends SendMailOptions {
	to: string
	subject: string
	html: string
}

dotenv.config()

const { SMTP_USER } = process.env

export async function renderEmail(Email: React.ReactNode) {
	return await render(Email)
}

export async function sendEmail({ to, subject, html, ...props }: SendEmailProps) {
	return await transporter.sendMail({
		from: `Votaciones <${SMTP_USER}>`,
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
