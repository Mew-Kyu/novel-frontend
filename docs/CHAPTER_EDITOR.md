# Tính năng chỉnh sửa Chapter

## Tổng quan

Tính năng cho phép chỉnh sửa thủ công nội dung chapter với Rich Text Editor đầy đủ chức năng giống Word.

## Cách sử dụng

### 1. Truy cập trang chỉnh sửa Chapter

- Vào **Dashboard > Stories > Chọn truyện > Edit**
- Trong phần "Quản lý Chương", **click vào tiêu đề chapter** cần chỉnh sửa
- Sẽ được chuyển đến trang: `/dashboard/stories/edit/[id]/chapters/[chapterId]`

### 2. Sử dụng Rich Text Editor

Editor hỗ trợ các tính năng format sau:

#### Định dạng văn bản

- **Bold** (In đậm): Ctrl/Cmd + B
- **Italic** (In nghiêng): Ctrl/Cmd + I
- **Underline** (Gạch chân): Ctrl/Cmd + U

#### Tiêu đề

- **Heading 1**: Tiêu đề lớn
- **Heading 2**: Tiêu đề nhỏ hơn

#### Căn lề

- **Căn trái** (Align Left)
- **Căn giữa** (Align Center)
- **Căn phải** (Align Right)
- **Căn đều** (Justify)

#### Font chữ

Dropdown chọn font:

- Mặc định
- Arial
- Times New Roman
- Courier New
- Georgia
- Verdana

#### Danh sách

- **Bullet List**: Danh sách không thứ tự
- **Ordered List**: Danh sách có số thứ tự

#### Upload ảnh

- Click icon **Image** trên toolbar
- Chọn file ảnh từ máy tính
- Ảnh sẽ được upload lên Cloudinary và chèn vào vị trí con trỏ
- Ảnh tự động responsive với class `max-w-full`

### 3. Lưu thay đổi

- Nhập **Tiêu đề chương** (bắt buộc)
- Chỉnh sửa **Nội dung** trong editor
- Tùy chọn: Thay đổi **Số thứ tự chương**
- Click **Lưu thay đổi** để cập nhật
- Hoặc **Hủy** để quay lại trang trước

## Cấu trúc files

```
app/(admin)/dashboard/stories/edit/[id]/
  ├── EditStoryPageClient.tsx         # Trang chỉnh sửa truyện (đã update)
  └── chapters/[chapterId]/
      ├── page.tsx                    # Server component
      └── EditChapterPageClient.tsx   # Client component chỉnh sửa chapter

components/dashboard/
  └── RichTextEditor.tsx             # Rich text editor (đã nâng cấp)
```

## API Endpoints sử dụng

- `GET /api/stories/{storyId}/chapters/{chapterId}` - Lấy thông tin chapter
- `PUT /api/stories/{storyId}/chapters/{chapterId}` - Cập nhật chapter
- `POST /api/cloudinary/upload` - Upload ảnh

## Dependencies mới

```json
{
  "@tiptap/extension-text-align": "^3.14.0",
  "@tiptap/extension-underline": "^3.14.0",
  "@tiptap/extension-text-style": "^3.14.0",
  "@tiptap/extension-font-family": "^3.14.0"
}
```

## Lưu ý kỹ thuật

1. **Editor State**: Sử dụng TipTap editor với HTML output
2. **Image Upload**: Upload qua Cloudinary API, trả về URL
3. **Form Validation**: Sử dụng Zod schema validation
4. **Responsive**: Editor tự động điều chỉnh chiều cao min-h-[400px]
5. **Dark Mode**: Hỗ trợ đầy đủ dark/light theme

## Roadmap

- [ ] Thêm tính năng Undo/Redo
- [ ] Hỗ trợ thêm font size selector
- [ ] Hỗ trợ color picker cho text
- [ ] Auto-save draft
- [ ] Word count indicator
