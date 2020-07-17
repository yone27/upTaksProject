const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const util = require('util')
const htmlToText = require('html-to-text')
const emailConfig = require('../config/email')

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.host,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.password
    }
})

//generar html
const generarHtml = (file, opc = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${file}.pug`, opc)
    return juice(html)
}

exports.enviar = async(opc) => {
    const html = generarHtml(opc.file, opc)
    const text = htmlToText.fromString(html)
    let mailOptions = {
        from: 'Uptask <no-reply@uptask.com>',
        to: opc.user.email,
        subject: opc.subject,
        text,
        html
    }
    const enviarEmail = util.promisify(transport.sendMail, transport)
    return enviarEmail.call(transport, mailOptions)
}