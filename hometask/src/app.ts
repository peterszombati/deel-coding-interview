import express from 'express'
import bodyParser from 'body-parser'
import {sequelize} from './model.ts'

const app = express();
//@ts-ignore
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

import routes from './routes.ts'

routes(app)

export default app