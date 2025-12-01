import { Router } from 'express';

import {
    listarAlertasController
} from '../controllers/alertaController'; 

const router = Router();

router.get('/listar', listarAlertasController);

export default router;