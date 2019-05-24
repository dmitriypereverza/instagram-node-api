import { Router } from "express";

import { getAccount, getAccounts } from "../controllers/account";

const router = Router();
router.post('/:id', getAccount);
router.post('/list', getAccounts);

export default router;
