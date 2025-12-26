import { useState } from 'react';
import { postImg } from "@/utils/request";
import "./PostImage.scss";

// 定义Props类型，提升代码可读性与类型校验
interface PostImageProps {
  setShowImg: (show: boolean) => void;
  setImageUrl: (url: string) => void;
  setResImg: (res: string) => void;
}

// 箭头函数组件，符合React现代写法
const PostImage: React.FC<PostImageProps> = ({ setShowImg, setImageUrl, setResImg }) => {
  // 状态初始化更规范，增加类型注解
  const [file, setFile] = useState<File | null>(null);
  const [showBtn, setShowBtn] = useState<boolean>(true);
  // 新增加载状态，避免重复点击上传
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 文件选择事件：简化逻辑，增加类型安全
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setShowBtn(false);
    // 生成预览URL，增加类型断言确保安全
    const previewUrl = URL.createObjectURL(selectedFile);
    setImageUrl(previewUrl);
  };

  // 确认上传逻辑：优化FormData处理，增加加载状态，完善错误提示
  const handlePostImg = async () => {
    // 校验文件是否存在
    if (!file) {
      alert("请先选择需要检测的图片！");
      return;
    }

    // 避免重复上传
    if (isUploading) return;
    setIsUploading(true);

    try {
      // 简化FormData构造（无需判断has/delete，直接append即可）
      const formData = new FormData();
      formData.append("file", file);

      // 调用上传接口（异步await写法更易读）
      const res = await postImg("/api/image", formData);
      // 校验返回值是否为Blob（图片流）
      if (!(res instanceof Blob)) {
        throw new Error("后端返回非图片格式数据");
      }
      const resultImgUrl = URL.createObjectURL(res);
      setResImg(resultImgUrl);
    } catch (err) {
      // 优化错误提示，区分不同错误类型
      const errorMsg = err instanceof Error ? err.message : "图片上传失败，请重试！";
      alert(errorMsg);
    } finally {
      // 无论成功/失败，重置加载状态
      setIsUploading(false);
    }
  };

  // 预览图片逻辑：简化条件判断
  const handleFileWindow = () => {
    if (file) {
      setShowImg(true);
    } else {
      alert("请先选择图片后再预览！");
    }
  };

  return (
    <div className="column">
      {/* 【新增容器】将标题+上传按钮包裹，避免flex-wrap导致的换行混乱 */}
      <div className="title-upload-wrapper" style={{ display: "flex", alignItems: "center" }}>
        <span className='characters'>请选择你要检测的图片:</span>
        {/* 优化：点击上传按钮 - 增加可访问性、键盘触发、样式类优化 */}
        {showBtn && (
          <label 
            key="upload-label" 
            className="input-file-button" 
            htmlFor="upload-file"
            aria-label="选择要检测的图片文件"
            tabIndex={0} // 支持键盘聚焦
            onKeyDown={(e) => e.key === "Enter" && document.getElementById("upload-file")?.click()} // 回车触发选择文件
          >
            点击上传
          </label>
        )}
      </div>
      <input
        key="upload-input"
        className="input"
        type="file"
        id="upload-file"
        onChange={handleFileChange}
        accept="image/*" // 仅允许选择图片文件，提升用户体验
        style={{ display: "none" }} // 隐藏原生input，仅通过label触发
      />
      {/* 简化文件名称显示的条件判断 */}
      {file && (
        <div key="file-name" className="file-name" onClick={handleFileWindow}>
          {file.name}(点击预览)
        </div>
      )}
      <button
        key="post-btn"
        className="post-btn"
        onClick={handlePostImg}
        disabled={isUploading} // 加载中禁用按钮，避免重复点击
        aria-label={isUploading ? "图片上传中，请等待" : "确认上传选中的图片进行垃圾分类检测"}
      >
        {/* 加载中显示文案，提升交互体验 */}
        {isUploading ? "上传中..." : "确认上传"}
      </button>
    </div>
  );
};

export default PostImage;