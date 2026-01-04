const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getMyPosts } = require('../controllers/postController');

// Import Middleware
const { protect } = require('../middleware/authMiddleware'); // Kiểm tra đăng nhập
const validatePost = require('../middleware/validationMiddleware'); // Kiểm tra dữ liệu đầu vào

// 1. Đường dẫn công khai
router.get('/', getAllPosts); 

// 2. Đường dẫn bảo mật (Phải đăng nhập)
router.get('/my-posts', protect, getMyPosts);

// 3. Đăng tin: Thêm 'validatePost' vào giữa để kiểm tra dữ liệu trước khi xử lý
router.post('/', protect, validatePost, createPost); 

module.exports = router;