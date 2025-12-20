import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const { SMTP_USER, SMTP_PASSWORD } = process.env

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: SMTP_USER,
		pass: SMTP_PASSWORD
	}
})

export default transporter
