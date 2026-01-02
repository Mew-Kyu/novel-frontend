"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  ImageIcon,
  Loader2,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Maximize2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/generated-api";
import { useAuthStore } from "@/lib/store/authStore";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  enableImageUpload?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  enableImageUpload = true,
}: RichTextEditorProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [imageWidth, setImageWidth] = useState<number>(100);
  const [widthUnit, setWidthUnit] = useState<"%" | "px">("%");
  const router = useRouter();
  const { logout } = useAuthStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class:
            "max-w-full h-auto rounded-lg my-4 cursor-pointer hover:opacity-80 transition",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  // Add resize functionality to images after editor updates
  useEffect(() => {
    if (!editor || !enableImageUpload) return;

    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        setSelectedImage(img);

        // Parse current width
        const currentWidth = img.style.width || `${img.width}px`;
        if (currentWidth.includes("%")) {
          setWidthUnit("%");
          setImageWidth(parseInt(currentWidth));
        } else {
          setWidthUnit("px");
          setImageWidth(parseInt(currentWidth) || img.width);
        }

        setShowResizeModal(true);
      }
    };

    const editorElement = document.querySelector(".ProseMirror");
    editorElement?.addEventListener("click", handleImageClick);

    return () => {
      editorElement?.removeEventListener("click", handleImageClick);
    };
  }, [editor, enableImageUpload]);

  const handleApplyResize = () => {
    if (selectedImage) {
      selectedImage.style.width = `${imageWidth}${widthUnit}`;
      onChange(editor!.getHTML());
      setShowResizeModal(false);
      setSelectedImage(null);
    }
  };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingImage(true);
      try {
        const response = await apiClient.cloudinary.uploadImage(file);
        const imageUrl = response.data.url;

        if (editor && imageUrl) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      } catch (error: any) {
        console.error("Failed to upload image:", error);

        // Handle authentication errors
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
          router.push("/login");
        } else if (error?.message === "Network Error") {
          toast.error("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
        } else {
          toast.error("Không thể tải ảnh lên. Vui lòng thử lại.");
        }
      } finally {
        setUploadingImage(false);
      }
    };

    input.click();
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded transition ${
        active
          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );

  const handleFontChange = (font: string) => {
    editor?.chain().focus().setFontFamily(font).run();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex-wrap">
        {/* Font Family */}
        <select
          onChange={(e) => handleFontChange(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          title="Font"
        >
          <option value="">Mặc định</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Headings */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Text Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
        >
          <AlignJustify size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Image Upload */}
        {enableImageUpload && (
          <ToolbarButton onClick={handleImageUpload} disabled={uploadingImage}>
            {uploadingImage ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImageIcon size={18} />
            )}
          </ToolbarButton>
        )}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Helper Text */}
      {enableImageUpload && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Mẹo: Click vào ảnh để thay đổi kích thước
          </p>
        </div>
      )}

      {/* Resize Modal */}
      {showResizeModal && selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Maximize2 size={20} />
                Điều chỉnh kích thước ảnh
              </h3>
              <button
                onClick={() => {
                  setShowResizeModal(false);
                  setSelectedImage(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Preview */}
            <div className="mb-6 border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-[200px]">
              <div
                className="max-w-full"
                style={{ width: `${imageWidth}${widthUnit}` }}
              >
                <img
                  src={selectedImage.src}
                  alt="Preview"
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>

            {/* Width Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Chiều rộng: {imageWidth}
                  {widthUnit}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min={widthUnit === "%" ? 10 : 100}
                    max={widthUnit === "%" ? 100 : 1200}
                    step={widthUnit === "%" ? 5 : 50}
                    value={imageWidth}
                    onChange={(e) => setImageWidth(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    title="Điều chỉnh chiều rộng"
                    aria-label="Chiều rộng ảnh"
                  />
                  <input
                    type="number"
                    value={imageWidth}
                    onChange={(e) =>
                      setImageWidth(parseInt(e.target.value) || 0)
                    }
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    title="Nhập chiều rộng"
                    aria-label="Nhập chiều rộng"
                  />
                </div>
              </div>

              {/* Unit Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (widthUnit === "px") {
                      // Convert px to %
                      const parentWidth =
                        selectedImage.parentElement?.offsetWidth || 800;
                      setImageWidth(
                        Math.round((imageWidth / parentWidth) * 100)
                      );
                      setWidthUnit("%");
                    }
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    widthUnit === "%"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Phần trăm (%)
                </button>
                <button
                  onClick={() => {
                    if (widthUnit === "%") {
                      // Convert % to px
                      const parentWidth =
                        selectedImage.parentElement?.offsetWidth || 800;
                      setImageWidth(
                        Math.round((imageWidth / 100) * parentWidth)
                      );
                      setWidthUnit("px");
                    }
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                    widthUnit === "px"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Pixel (px)
                </button>
              </div>

              {/* Preset Sizes */}
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-full mb-1">
                  Kích thước nhanh:
                </span>
                {widthUnit === "%" ? (
                  <>
                    <button
                      onClick={() => setImageWidth(25)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      25%
                    </button>
                    <button
                      onClick={() => setImageWidth(50)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      50%
                    </button>
                    <button
                      onClick={() => setImageWidth(75)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      75%
                    </button>
                    <button
                      onClick={() => setImageWidth(100)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      100%
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setImageWidth(300)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      300px
                    </button>
                    <button
                      onClick={() => setImageWidth(500)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      500px
                    </button>
                    <button
                      onClick={() => setImageWidth(800)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      800px
                    </button>
                    <button
                      onClick={() => setImageWidth(1200)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
                    >
                      1200px
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowResizeModal(false);
                  setSelectedImage(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyResize}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
