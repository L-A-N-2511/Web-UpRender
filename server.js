const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const logRequest = require('./src/middleware/logMiddleware');

// 1. Cấu hình môi trường và kết nối DB
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// 2. Middleware (Thứ tự quan trọng)
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Đọc dữ liệu JSON gửi lên
app.use(logRequest); // Ghi log request

// 3. Import Routes (Đường dẫn mới)
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes'); // File quản lý tin đăng

// 4. Định nghĩa đường dẫn API
app.use('/api/auth', authRoutes); // Đường dẫn: http://localhost:3000/api/auth/register...
app.use('/api/posts', postRoutes); // Đường dẫn: http://localhost:3000/api/posts...

// Route mặc định kiểm tra server
app.get('/', (req, res) => {
    res.send('API Tìm Trọ Nhanh đang hoạt động! 🚀');
});

// 5. Chạy server
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});