import databaseConfig from './database'

export enum ConfigEnviroment {
  development = "development",
  test = "test",
  production = "production"
}

// enum dialect {
//   postgres = "postgres",
//   mysql = "mysql",
//   sqlite = "sqlite",
//   mariadb = "mariadb",
//   mssql = "mssql",
//   undefined = "undefined",
// }
type dialect = "postgres" | "mysql" | "sqlite" | "mariadb" | "mssql" | undefined

export interface DatabaseConfig {
  [key: string] :  keyof typeof ConfigEnviroment;
}

export interface Config {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: dialect;
}

const configs = databaseConfig

export const getDatabaseConfig = (env: string): Config => {
  if (env && configs[env]) {
    return configs[env]
  }
  throw Error('A database config could not be found')
}
