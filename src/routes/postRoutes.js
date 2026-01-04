const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getMyPosts } = require('../controllers/postController');

// Import các lớp bảo vệ
const { protect } = require('../middleware/authMiddleware'); // Kiểm tra đăng nhập
const validatePost = require('../middleware/validationMiddleware'); // Kiểm tra dữ liệu (Nếu bạn chưa đổi tên file thì để nguyên tên cũ)

// 1. Đường dẫn công khai (Ai cũng xem được danh sách)
router.get('/', getAllPosts); 

// 2. Đường dẫn bảo mật (Phải đăng nhập)
router.get('/my-posts', protect, getMyPosts);

// 3. Đăng tin: Phải Đăng nhập (protect) -> Dữ liệu phải Đúng (validatePost) -> Mới được Tạo (createPost)
router.post('/', protect, validatePost, createPost); 

module.exports = router;