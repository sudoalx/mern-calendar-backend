/*
    User Routes / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { createUser, loginUser, revalidateJWT } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt');


const router = Router();



router.post(
    '/new',
    [ // middlewares
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'A valid email is required').isEmail(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
        validateFields
    ],
    createUser
);

router.post(
    '/',
    [
        check('email', 'A valid email is required').isEmail(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
        validateFields
    ],
    loginUser
);

router.get('/renew', validateJWT, revalidateJWT);

module.exports = router;