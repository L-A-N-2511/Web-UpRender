const Post = require('../models/Post');

// --- 1. ĐĂNG TIN MỚI ---
// [POST] /api/posts
exports.createPost = async (req, res) => {
    try {
        // Lấy dữ liệu từ body (Frontend gửi lên)
        const { 
            title, price, area, address, description, 
            location_city, location_district, location_ward, 
            image 
        } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!title || !price || !area || !address || !location_city) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc!' 
            });
        }

        // Tạo bài đăng mới
        const newPost = await Post.create({
            title,
            price,
            area,
            address,
            description,
            location_city,
            location_district,
            location_ward,
            image,
            user: req.user._id // Lấy ID từ token người dùng đang đăng nhập (nhờ middleware protect)
        });

        res.status(201).json({
            success: true,
            message: 'Đăng tin thành công!',
            data: newPost
        });

    } catch (error) {
        console.error("Lỗi đăng tin:", error);
        res.status(500).json({ success: false, message: 'Lỗi Server: ' + error.message });
    }
};

// --- 2. LẤY TẤT CẢ TIN (Cho trang chủ) ---
// [GET] /api/posts gọi vào hàm GET nên không thể xóa 
exports.getAllPosts = async (req, res) => {
    try {
        // Lấy bộ lọc từ query params (Ví dụ: ?city=Hà Nội&district=Cầu Giấy)
        const { city, district, ward } = req.query;
        //(chỉ lấy trong query từ frontend gửi lên các biến city, district, ward  )
        // => nếu quẻy này là một đoạn mã muốn xóa database thì sẽ không được thực hiện 

        // Xây dựng điều kiện tìm kiếm
        let query = {};
        if (city) query.location_city = city;
        if (district) query.location_district = district;
        if (ward) query.location_ward = ward;

        // Tìm trong DB, sắp xếp tin mới nhất lên đầu
        // .populate('user', 'username phone') -> Giúp lấy luôn tên và sđt người đăng
        const posts = await Post.find(query)// Hàm .find() cũng chỉ phục vụ tìm kiếm nên không lo chạy mã đọc xóa database
            .sort({ createdAt: -1 }) 
            .populate('user', 'username phone email'); 

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách: ' + error.message });
    }
};
//Kết luận không lo hàm fetchPosts(query) từ phía frontend gửi lên bị sửa thành mã độc và thực thi mã độc
//Vì ngay từ đầu thứ query đi và là hàm GET

// --- 3. LẤY TIN CỦA TÔI (Để quản lý) ---
// [GET] /api/posts/my-posts
exports.getMyPosts = async (req, res) => {
    try {
        // Tìm bài đăng có user trùng với user đang đăng nhập
        const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi Server' });
    }
};

// --- 4. LẤY CHI TIẾT 1 BÀI ĐĂNG (MỚI) ---
// [GET] /api/posts/:id
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username phone email'); // Lấy cả thông tin chủ nhà

        if (!post) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy bài đăng' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi Server' });
    }
};

// --- 5. XÓA BÀI ĐĂNG ---
// [DELETE] /api/posts/:id
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Bài đăng không tồn tại' });
        }

        // QUAN TRỌNG: Kiểm tra xem người đang xóa có phải chủ bài đăng không?
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Bạn không có quyền xóa bài này!' });
        }

        await post.deleteOne(); // Xóa khỏi DB

        res.status(200).json({ success: true, message: 'Đã xóa bài đăng thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi Server: ' + error.message });
    }
};