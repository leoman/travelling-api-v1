// import Joi from 'joi'
import slugify from 'slugify'
import { Model, DataTypes, Association } from 'sequelize'
// import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import sequelize from '../database'
import { Location } from '../locations'
import { Photo } from '../photos'

enum Status {
  "live" = "live",
  "draft" = "draft"
}

class Post extends Model {
  public id!: number
  public title!: string
  public slug!: string
  public titleColour!: string | null
  public content!: string | null
  public date!: Date | null
  public order!: Date | null
  public photo!: string | null
  public status!: Status

  public dataValues: any

  // timestamps!
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public static Location: Association<Model<Location>>
  public static Photo: Association<Model<Photo>>

  public static associations: {
    Photos: Association<Post, Photo>;
    Location: Association<Post, Location>;
  };
}

const validStatuses: Status[] = [Status.live, Status.draft]

Post.init({
  id: {
    type: new DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: new DataTypes.STRING(128),
    allowNull: false,
    unique: true
  },
  slug: {
      type: new DataTypes.STRING(128)
  },
  titleColour: {
      type: new DataTypes.STRING(128)
  },
  content: {
      type: new DataTypes.TEXT
  },
  date: {
      type: new DataTypes.DATE,
      allowNull: true,
  },
  order: {
      type: new DataTypes.DATE
  },
  photo: {
      type: new DataTypes.STRING(256)
  },
  status: {
      type: new DataTypes.ENUM,
      values: validStatuses,
      defaultValue: Status.live,
  },
  createdAt: {
    type: new DataTypes.DATE
  },
  updatedAt: {
    type: new DataTypes.DATE
  },
 }, {
  sequelize,
  tableName: 'posts',
})

Post.addHook('beforeSave', (post: Post) => {
  post.slug = slugify(post.title, { lower: true });
})

Post.hasOne(Location, {
  onDelete: "CASCADE",
  foreignKey: {
    allowNull: true
  }
});

Post.hasMany(Photo, {
  onDelete: "CASCADE",
  foreignKey: {
    allowNull: true
  }
});

export default Post