import express from 'express';
import pingCheck from '../../Controllers/pingCheck.js';
import projectRouter from './projects.js';
const router = express.Router();


router.use('/ping', pingCheck);
router.use('/projects' , projectRouter)


export default router;