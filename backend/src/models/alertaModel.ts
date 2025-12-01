import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Alerta extends Model {
  declare AlertaId: number;
  declare tipoAlerta: string;
  declare timestamp: Date;
}

Alerta.init(
  {
    AlertaId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tipoAlerta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'alertaModel',
    tableName: 'alerta',
    timestamps: false
  }
);