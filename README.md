# Tiệm Hoa Nhỏ — AI Flower Designer

## Deploy lên Render
1. Giải nén ZIP.
2. Tạo GitHub repository mới và upload toàn bộ nội dung bên trong thư mục `flower_ai_integrated` (không upload file ZIP).
3. Trên Render chọn **New → Web Service**, kết nối GitHub và chọn repository.
4. Thiết lập:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Trong Environment Variables, thêm `OPENAI_API_KEY` với API key riêng của bạn.
6. Chọn Create Web Service. Khi deploy thành công, mở URL `https://...onrender.com`.

## Chạy local
Yêu cầu Node.js 20+.
```bash
npm install
```
Tạo `.env`:
```env
OPENAI_API_KEY=your_api_key_here
PORT=3000
```
Sau đó:
```bash
npm start
```
Mở http://localhost:3000.

## Lưu ý
- Không upload `.env` hoặc đưa API key vào frontend. Chỉ nhập key trong Environment Variables của Render.
- Mỗi lần tạo ảnh sẽ phát sinh phí API theo model, chất lượng và kích thước. Kiểm tra billing/usage của OpenAI.
- Gói hosting miễn phí có thể có giới hạn hoặc đưa dịch vụ vào trạng thái ngủ; xem điều kiện hiện hành của Render.
- Nếu triển khai công khai, nên bổ sung giới hạn lượt tạo, xác thực hoặc CAPTCHA để tránh người lạ sử dụng API gây phát sinh chi phí.
