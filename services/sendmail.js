
require("dotenv").config();
const createError = require('http-errors')

const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.gUser,
      pass: process.env.gPass,
    },
  });

const sendConfirmationEmail = async (username, email, confirmationCode) => {
  console.log("Check");
  try {
    await transport.sendMail({
        from: 'no-reply@notalone.com',
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${username}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.CLIENT_URL}/confirm/${confirmationCode}> Click here</a>
        </div>`,
    })
  } catch(err) {
      throw createError(500, err)
  }
}

const sendResetPasswordEmail = async (username, email, confirmationCode) => {
    console.log("Check");
    try {
      await transport.sendMail({
          from: 'no-reply@notalone.com',
          to: email,
          subject: "Password reset",
          html: `<h1>Password reset</h1>
          <h2>Hello ${username}</h2>
          <p>Please reset your password by clicking on the following link</p>
          <a href=${process.env.CLIENT_URL}/reset-password/${confirmationCode}> Click here</a>
          </div>`,
      })
    } catch(err) {
        throw createError(500, err)
    }
  }

/*
const sendmail = require('sendmail')({
    silent: true,
})



const sendConfirmationEmail = (username, email, confirmationCode) => {
    sendmail({
        from: 'no-reply@notalone.com',
        to: email,
        subject: 'Please confirm your account',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${username}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.CLIENT_URL}/confirm/${confirmationCode}> Click here</a>
        </div>`
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    })
}
*/

module.exports = {
    sendConfirmationEmail,
    sendResetPasswordEmail
}