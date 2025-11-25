import app from './app';
import { sequelize } from './config/db';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.sync(); // ou .sync({ force: true }) para resetar
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
})();