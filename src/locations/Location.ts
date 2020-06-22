import { Model, DataTypes } from 'sequelize'
import sequelize from '../database'
import { Location as LocationI } from '../types'

class Location extends Model<LocationI> {
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Location.init({
  id: {
    type: new DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  location: {
    type: new DataTypes.STRING(128),
  },
  lat: {
      type: new DataTypes.FLOAT
  },
  lng: {
      type: new DataTypes.FLOAT
  },
  duration: {
    type: new DataTypes.INTEGER,
  },
  hideFromBounding: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
  },
  createdAt: {
    type: new DataTypes.DATE
  },
  updatedAt: {
    type: new DataTypes.DATE
  },
 }, {
  sequelize,
  tableName: 'locations',
})

export default Location