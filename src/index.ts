import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import monitorfelRoutes from './routes/monitorfel.routes'

const app = express()
const xmlparser = require('express-xml-bodyparser');

app.set('port', process.env.PORT || '5008')

app.use(morgan('dev'))

app.use(cors())
app.use(express.json())
app.use(express.raw())
app.use(express.urlencoded({extended: true}))
app.use(xmlparser({trim: true, explicitArray: false}))

app.use(monitorfelRoutes)

app.listen(app.get('port'), () => {
    console.log('Servidor en puerto ' + app.get('port'))
})

export default app;