const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Đăng ký
exports.registerUser = async (req, res) => {
    const { username, email, password, phone } = req.body; // <-- NHẬN THÊM PHONE

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const user = await User.create({ username, email, password, phone });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                token: generateToken(user._id),
                message: "Đăng ký thành công"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                token: generateToken(user._id),
                message: "Đăng nhập thành công"
            });
        } else {
            res.status(401).json({ message: 'Sai thông tin đăng nhập' });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server: " + error.message });
    }
};