import express from 'express'
import router from './routes/user.routes.js'

// экземпляр Express-приложения
const app = express()

app.use(express.json())
// обработка роутов
app.use('/users', router)

app.get('*', (req, res) => {
 res.send('Only /users endpoint is available.')
})

// обработка ошибок
app.use((err, req, res, next) => {
 console.log(err)
 const status = err.status || 500
 const message = err.message || 'We are already correcting your mistake. Try again later'
 res.status(status).json({ message })
})

// запуск сервера
app.listen(3000, () => {
 console.log('Server ready: http://localhost:3000/users')
})