import { Sequelize } from 'sequelize'
import { getDatabaseConfig, Config } from './config'

const config: Config = getDatabaseConfig(process.env.NODE_ENV || 'development')

const sequelize = new Sequelize(config.database, config.username, config.password, config)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err: string) => {
    console.error('Unable to connect to the database:', err)
  })

  export default sequelize