import { DataTypes, Model } from "sequelize";
import { SequelizeConnection } from "../services/sequelize";

export default class Users extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
}
const sequelizeConnection = SequelizeConnection.getInstance();

Users.init(
  {
    id: {
      field: "id",
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    username: {
      field: "username",
      type: DataTypes.STRING,
    },
    email: {
      field: "email",
      type: DataTypes.STRING,
    },
    password: {
      field: "password",
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
    modelName: "Users",
  }
);

Users.sync().then();
