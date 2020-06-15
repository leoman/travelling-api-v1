import { Model, DataTypes } from 'sequelize'
import sequelize from '../database'

class Location extends Model {
  public id!: number
  public location!: string
  public lat!: number
  public lng!: number
  public hideFromBounding!: boolean

  // timestamps!
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