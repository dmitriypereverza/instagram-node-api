import { Router } from "express";

import { getBot, getBots } from "../controllers/bot";

const router = Router();
router.post('/:id', getBot);
router.post('/list', getBots);

export default router;
