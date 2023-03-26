const app = require('./config/server')
const port = process.env.PORT

app.listen(port, () => console.log(`App Express is running on port ${port}`))
