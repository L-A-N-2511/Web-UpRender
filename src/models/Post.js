const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    // 1. Thông tin cơ bản
    title: { 
        type: String, 
        required: [true, 'Vui lòng nhập tiêu đề bài đăng'],
        trim: true 
    },
    price: { 
        type: Number, 
        required: [true, 'Vui lòng nhập giá phòng'] 
    },
    area: { 
        type: Number, 
        required: [true, 'Vui lòng nhập diện tích'] 
    },
    description: { 
        type: String,
        default: ''
    },
    
    // 2. Địa chỉ (Quan trọng để hiển thị và tìm kiếm)
    address: { 
        type: String, 
        required: true 
    },
    // Lưu riêng 3 trường này để làm bộ lọc (Filter)
    location_city: { type: String, required: true },
    location_district: { type: String, required: true },
    location_ward: { type: String, required: true },

    // 3. Hình ảnh (Lưu chuỗi base64 hoặc đường dẫn URL)
    image: {
        type: String,
        default: '' // Nếu không có ảnh thì để rỗng
    },

    // 4. Liên kết với Người đăng (User)
    // Trường này giúp bạn biết ai là chủ bài đăng này
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu sang bảng User
        required: true
    }

}, {
    timestamps: true // Tự động tạo ngày đăng (createdAt) và ngày sửa (updatedAt)
});

module.exports = mongoose.model('Post', PostSchema);