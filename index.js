const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const methodOverride = require("method-override")
const session = require("express-session")
const passport = require("passport")
const mongoose = require("mongoose")
const ejs = require("ejs")
const dotenv = require("dotenv")
const nodemailer = require("nodemailer")

dotenv.config()

// import routes
const mainRouter = require("./src/router/mainRouter")
const authRouter = require("./src/router/authRouter")
const dashRouter = require("./src/router/dashRouter")

const app = express()
const PORT = process.env.PORT || 4001


app.use(session({ secret: 'secret_key', resave: true, saveUninitialized: true }))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride("_method"))

app.use(express.static('public'))

app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

app.post('/send', async (req, res) => {
    const { name, company, email, phone, message } = req.body
    try {
        const config = {
            service: 'gmail',
            auth: {
                user: 'saidburxon871@gmail.com',
                pass: 'zeac kjnc fuiz qxhl'
            }
        }

        let transporter = nodemailer.createTransport(config)

        const output = `
        <h3>Contact Details<h3/>
        <ul>
        <li>Name: ${name}</li>
        <li>Company: ${company}</li>
        <li>Email: ${email}</li>
        <li>Phone: ${phone}</li>
        <li>Message: ${message}</li>
        </ul>
        `

        const msg = {
            to: ["saydabzalabdullayf@gmail.com", "saydabzalabdullayf@gmail.com"],
            from: 'saidburxon871@gmail.com',
            subject: 'Contact Request via Nodemailer',
            text: 'Mail is send by Sendgrid App',
            html: output
        }

        transporter.sendMail(msg)
        res.render('status')
    } catch (error) {
        console.log(error)
    }
})

// use routes
app.use('/', mainRouter)
app.use('/', authRouter)
app.use('/', dashRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(PORT, () => console.log(`server started on port: ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}
start()