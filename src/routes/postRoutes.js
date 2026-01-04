const express = require('express');
const router = express.Router();

// 1. IMPORT getPostById
const { 
    createPost, 
    getAllPosts, 
    getMyPosts, 
    getPostById  
} = require('../controllers/postController');

// Import Middleware
const { protect } = require('../middleware/authMiddleware'); 
const validatePost = require('../middleware/validationMiddleware'); 

// --- ĐỊNH NGHĨA ROUTES ---

// 1. Lấy tất cả tin (Công khai)
router.get('/', getAllPosts); 

// 2. Lấy tin của tôi (Bảo mật) -> QUAN TRỌNG: Phải đặt dòng này TRƯỚC dòng /:id
// Nếu đặt sau, chữ "my-posts" sẽ bị hiểu nhầm là một cái ID
router.get('/my-posts', protect, getMyPosts);

// 3. Lấy chi tiết 1 tin theo ID (Công khai) 
router.get('/:id', getPostById); 

// 4. Đăng tin mới (Bảo mật + Validate)
router.post('/', protect, validatePost, createPost); 

module.exports = router;