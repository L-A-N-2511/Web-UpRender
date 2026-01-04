const validatePostData = (req, res, next) => {
    const { title, price, area, address, location_city } = req.body;

    // 1. Kiểm tra tiêu đề
    if (!title || title.length < 10) {
        return res.status(400).json({ 
            success: false, 
            message: "Tiêu đề quá ngắn! Vui lòng viết chi tiết hơn (tối thiểu 10 ký tự)." 
        });
    }

    // 2. Kiểm tra giá và diện tích (Phải là số dương)
    if (!price || isNaN(price) || Number(price) <= 0) {
        return res.status(400).json({ success: false, message: "Giá phòng không hợp lệ!" });
    }
    
    if (!area || isNaN(area) || Number(area) <= 0) {
        return res.status(400).json({ success: false, message: "Diện tích không hợp lệ!" });
    }

    // 3. Kiểm tra địa chỉ
    if (!address || !location_city) {
        return res.status(400).json({ success: false, message: "Vui lòng chọn đầy đủ địa chỉ!" });
    }

    // Nếu ổn hết thì cho qua
    next();
};

module.exports = validatePostData;