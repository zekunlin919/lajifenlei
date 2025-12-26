import { useState } from 'react';
import { postImg } from "@/utils/request";
import "./PostImg.scss";

// 定义Props类型，提升TypeScript类型安全与代码可读性
interface PostImgProps {
  setImageUrl: (url: string) => void;
}

// 改用箭头函数组件，符合React现代开发规范
const PostImg: React.FC<PostImgProps> = ({ setImageUrl }) => {
  // 状态初始化规范，增加明确的类型注解
  const [file, setFile] = useState<File | null>(null);
  // 新增加载状态：避免重复点击上传，提升交互体验
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 文件选择事件：简化逻辑，增加类型安全校验
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    // 生成预览URL并传递给父组件，增加类型断言确保安全
    const previewUrl = URL.createObjectURL(selectedFile);
    setImageUrl(previewUrl);
  };

  // 确认上传逻辑：改用async/await更易读，增加加载/错误处理
  const handlePostImg = async () => {
    // 校验文件是否存在，优化提示文案更友好
    if (!file) {
      alert("请先选择需要上传的图片！");
      return;
    }

    // 加载中禁用按钮，避免重复上传
    if (isUploading) return;
    setIsUploading(true);

    try {
      // 简化FormData构造：无需判断has/delete，直接append即可（冗余逻辑移除）
      const formData = new FormData();
      formData.append("file", file);

      // 调用上传接口，await替代then/catch，逻辑更清晰
      const res = await postImg("/api/image", formData);
      // 校验返回值为Blob（图片流），提升稳定性
      if (!(res instanceof Blob)) {
        throw new Error("后端返回非图片格式数据，请检查接口！");
      }

      // 生成结果图URL并传递给父组件
      const resultImgUrl = URL.createObjectURL(res);
      setImageUrl(resultImgUrl);
    } catch (err) {
      // 优化错误提示：区分Error类型/通用错误，便于调试
      const errorMsg = err instanceof Error ? err.message : "图片上传失败，请重试！";
      alert(errorMsg); // 弹窗提示用户，而非仅打印日志
      console.error("上传失败详情：", err);
    } finally {
      // 无论成功/失败，重置加载状态
      setIsUploading(false);
    }
  };

  // 预览图片逻辑：简化条件判断，增加友好提示
  const handleFileWindow = () => {
    if (file) {
      window.open(URL.createObjectURL(file), "_blank"); // 新开窗口预览，指定target更规范
    } else {
      alert("请先选择图片后再预览！");
    }
  };

  return (
    <div className="column">
      <span className='characters'>请上传图片:</span>
      {/* 增加key提升React渲染性能，文案去多余空格 */}
      <label key="upload-label" className="input-file-button" htmlFor="upload-file">上传文件</label>
      <input
        key="upload-input"
        className="input"
        type="file"
        id="upload-file"
        onChange={handleFileChange}
        accept="image/*" // 新增：仅允许选择图片文件，避免用户选错文件类型
      />
      {/* 简化条件渲染：file存在则显示，替代冗长的null判断 */}
      {file && (
        <div key="file-name" className="file-name" onClick={handleFileWindow}>
          ({file.name})
        </div>
      )}
      <button
        key="post-btn"
        className="post-btn"
        onClick={handlePostImg}
        disabled={isUploading} // 加载中禁用按钮，视觉上提示用户
      >
        {/* 加载中显示“上传中...”，提升交互感知 */}
        {isUploading ? "上传中..." : "确认上传"}
      </button>
    </div>
  );
};

export default PostImg;