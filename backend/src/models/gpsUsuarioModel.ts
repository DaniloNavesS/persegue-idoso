import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class GpsUsuario extends Model {
  declare usuarioId: number;
  declare latitude: number;
  declare longitude: number;
  declare timestamp: Date;
}

GpsUsuario.init(
  {
    usuarioId: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'gpsUsuarioModel',
    tableName: 'gps_usuario',
    timestamps: false
  }
);
