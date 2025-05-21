import express from 'express';
import v1Router from "./V1/index.js";
import pingCheck from '../Controllers/pingCheck.js';
const router = express.Router();



router.use('/ping', pingCheck);
router.use('/v1', v1Router);


export default router;