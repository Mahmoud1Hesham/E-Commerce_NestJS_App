import { BadRequestException, InternalServerErrorException } from "@nestjs/common"
import { createTransport, SendMailOptions, Transporter } from 'nodemailer'

export const sendEmail = async (data:SendMailOptions) => {
    try {
        if (!data.to && !data.cc && !data.bcc) {
            throw new BadRequestException('missing email destination')
        }

        const transporter:Transporter = createTransport({
            host: "smtp.gmail.email",
            service:"gmail",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_EMAIL_PASS
            },
        });

        const info = await transporter.sendMail({
            from: `"E-Commerce-App 👻" <${process.env.APP_EMAIL}>`, // sender address
            ...data,
        });
console.log(`email sent to : ${{...data}}`)

    } catch (error) {
        throw new InternalServerErrorException(error.stack);
    }
}