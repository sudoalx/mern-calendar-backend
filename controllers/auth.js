const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'User already exists with that email'
            });
        }

        user = new User(req.body);

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);


        await user.save();

        // Generate JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}


const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        // Use a different variable name, e.g., 'foundUser'
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(400).json({
                ok: false,
                msg: 'User with that email does not exist'
            });
        }

        // Confirm passwords
        const validPassword = bcrypt.compareSync(password, foundUser.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect password'
            });
        }

        // Generate JWT
        const token = await generateJWT(foundUser.id, foundUser.name);

        res.json({
            ok: true,
            uid: foundUser.id,
            name: foundUser.name,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
};



const revalidateJWT = async (req, res = response) => {

    const { uid, name } = req;

    // Generate new JWT
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}




module.exports = {
    createUser,
    loginUser,
    revalidateJWT
}