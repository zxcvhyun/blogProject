import express from 'express';
import * as adminController from '../controller/admin.js';
import { adminAuth } from '../middleware/admin.js';

const router = express.Router();

router.post('/', adminController.login);
router.get('/user', adminAuth, adminController.getUserList);
router.get('/board/:id', adminAuth, adminController.getBoard);
router.post('/list/:id', adminAuth, adminController.changeOrder);
router.put('/modify/:id', adminAuth, adminController.updateBoard);
router.delete('/delete/:id', adminAuth, adminController.removeUser);
router.delete('/delete/board/:id', adminAuth, adminController.deleteBoard);
router.post('/delete/image/:id', adminAuth, adminController.deleteImage);
export default router;
