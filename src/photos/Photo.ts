import { Model, DataTypes } from 'sequelize'
import sequelize from '../database'

export interface PhotoI {
  id?: number
  url: string
}

class Photo extends Model<PhotoI> {
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Photo.init({
  id: {
    type: new DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: new DataTypes.STRING(128),
  },
  createdAt: {
    type: new DataTypes.DATE
  },
  updatedAt: {
    type: new DataTypes.DATE
  },
 }, {
  sequelize,
  tableName: 'photos',
})

export default Photo