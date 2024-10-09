import { DataTypes, ForeignKey, Model, NonAttribute } from "sequelize";
import { SequelizeConnection } from "../services/sequelize";
import Users from "./users";
export default class Presentations extends Model {
  declare id: number;
  declare presentationName: string;
  declare createdBy: ForeignKey<Users["id"]>;
  declare user: NonAttribute<Users>;
}
const sequelizeConnection = SequelizeConnection.getInstance();

Presentations.init(
  {
    id: {
      field: "id",
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    presentationName: {
      field: "presentationName",
      type: DataTypes.STRING,
    },
    createdBy: {
      field: "createdBy",
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "presentations",
    modelName: "Presentations",
  }
);

Presentations.belongsTo(Users, {
  foreignKey: "createdBy",
  as: "user",
});

Users.hasMany(Presentations, {
  sourceKey: "id",
  foreignKey: "createdBy",
  as: "presentations",
});

Presentations.sync().then();
