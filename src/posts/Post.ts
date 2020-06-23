import slugify from 'slugify'
import { Model, DataTypes, Association } from 'sequelize'
// import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import sequelize from '../database'
import { Location } from '../locations'
import { Photo } from '../photos'
import { Post as PostI, Status } from '../types'

class Post extends Model<PostI> {
  
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

export const validStatuses: Status[] = [Status.live, Status.draft]

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
  // @ts-ignore
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