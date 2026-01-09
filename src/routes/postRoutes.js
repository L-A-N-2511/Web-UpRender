const express = require('express');
const router = express.Router();

// 1. IMPORT CÁC HÀM TỪ CONTROLLER
const { 
    createPost, 
    getAllPosts, 
    getMyPosts, 
    getPostById,
    deletePost   
} = require('../controllers/postController');

// 2. IMPORT MIDDLEWARE BẢO VỆ
const { protect } = require('../middleware/authMiddleware'); 
const validatePost = require('../middleware/validationMiddleware'); 

// --- ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN (ROUTES) ---

// A. Lấy tất cả tin (Công khai - Ai cũng xem được)
router.get('/', getAllPosts); 

// B. Lấy tin của tôi (Bảo mật - Phải đăng nhập)
// QUAN TRỌNG: Phải đặt dòng này TRƯỚC dòng /:id để tránh nhầm lẫn
router.get('/my-posts', protect, getMyPosts);

// C. Lấy chi tiết 1 tin theo ID (Công khai)
router.get('/:id', getPostById); 

// D. Đăng tin mới (Bảo mật + Kiểm tra dữ liệu)
router.post('/', protect, validatePost, createPost); 

// E. Xóa bài đăng (Bảo mật - Chỉ chủ bài đăng mới xóa được)

router.delete('/:id', protect, deletePost); 

module.exports = router;