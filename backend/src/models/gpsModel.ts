import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class GpsAreaSegura extends Model {
  declare nome: String;
  declare id: number;
  declare pontos: any[];
  declare ativo: boolean;
}

GpsAreaSegura.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pontos: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Gps_Area_Segura',
    tableName: 'gps_area_segura',
    timestamps: false
  }
);