import { Sequelize } from 'sequelize'
import logger from './logging'
import { getDatabaseConfig, Config } from './config'

const config: Config = getDatabaseConfig(process.env.NODE_ENV || 'development')

const sequelize = new Sequelize(config.database, config.username, config.password, config)

export const sequelizeCheck = async () => {
  sequelize
  .authenticate()
  .then(() => {
    logger.log('info', 'Connection to the database has been established successfully.')
  })
  .catch((err: string) => {
    logger.log({
      level: 'error',
      message:'Unable to connect to the database:',
      err
    })
  })

  // await sequelize.sync({ force: true });
}

  export default sequelize