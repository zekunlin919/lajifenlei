import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import "./User1.scss";
import InfoColumn from "@/components/InfoColumn/InfoColumn";
import PostImage from "@/components/PostImage/PostImage";
import ShowImage from "@/components/ShowImage/ShowImage";


// 改用箭头函数组件，符合React/TS最佳实践
const User1: React.FC = () => {
  // 状态初始化：补充明确的类型注解，默认值为null更规范
  const [imageURL, setImageUrl] = useState<string | null>(null);
  const [showImg, setShowImg] = useState<boolean>(false);
  const [resImg, setResImg] = useState<string | null>(null);

  // 路由导航实例
  const navigate = useNavigate();

  // 1. 权限校验：无token跳转到首页
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // 2. 内存优化：组件卸载时释放Blob URL（避免内存泄漏）
  useLayoutEffect(() => {
    return () => {
      // 释放本地预览图URL
      if (imageURL && imageURL.startsWith("blob:")) {
        URL.revokeObjectURL(imageURL);
      }
      // 释放识别结果图URL
      if (resImg && resImg.startsWith("blob:")) {
        URL.revokeObjectURL(resImg);
      }
    };
  }, [imageURL, resImg]);

  // 3. 重新上传文件逻辑：优化类型安全，补充友好提示
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      alert("请选择有效的图片文件！");
      return;
    }
    // 生成预览URL并更新状态
    const previewUrl = URL.createObjectURL(selectedFile);
    setImageUrl(previewUrl);
  };

  // 4. 弹窗确认逻辑：语义化函数命名
  const handleConfirmUpload = () => {
    if (!imageURL) {
      alert("请先选择图片后再确认！");
      return;
    }
    setShowImg(false);
  };

  return (
    <div className="user1-page" aria-label="垃圾分类系统用户操作页面">
      {/* 优化：背景图改为绝对路径，补充有意义的alt文本，添加加载失败兜底 */}
      <img
        className="back-img"
        src="/assets/image1.png"
        alt="垃圾分类系统背景图"
        onError={(e) => {
          const imgEl = e.target as HTMLImageElement;
          imgEl.src = "https://via.placeholder.com/1920x1080?text=垃圾分类系统";
        }}
      />

      <div className="user1-container">
        {/* 页面头部信息栏 */}
        <div className="user1-header">
          <InfoColumn />
        </div>

        {/* 核心内容区：上传+展示 */}
        <div className="user1-content">
          <div className="user-post">
            <PostImage
              setShowImg={setShowImg}
              setImageUrl={setImageUrl}
              setResImg={setResImg}
            />
          </div>
          <div className="user-show">
            <ShowImage resImg={resImg} />
          </div>
        </div>
      </div>

      {/* 上传弹窗：通过classnames控制显隐，优化可访问性 */}
      <div
        className={classnames("postWindow", { none: !showImg })}
        aria-modal={showImg}
        role="dialog"
      >
        <div className="black-back" aria-hidden={!showImg}></div>
        <div className="post-window">
          {/* 预览图片：补充alt文本，添加加载状态类 */}
          {imageURL && (
            <img
              src={imageURL}
              alt="垃圾分类图片预览"
              className="preview-img"
              onLoad={() => console.log("预览图加载完成")}
            />
          )}
          {/* 无图片时显示提示 */}
          {!imageURL && (
            <div style={{ textAlign: "center", padding: "2vw" }}>
              暂无预览图片，请重新上传
            </div>
          )}

          <div className="opt">
            {/* 重新上传按钮：优化文案，补充可访问性 */}
            <label
              className="change-file-button"
              htmlFor="upload-file"
              aria-label="重新上传图片"
            >
              重新上传
            </label>
            {/* 隐藏的文件输入框：补充accept限制图片类型 */}
            <input
              className="input none"
              type="file"
              id="upload-file"
              onChange={handleFileChange}
              accept="image/*"
            />
            {/* 确认按钮：绑定语义化函数，补充aria属性 */}
            <button
              className="identify-btn"
              onClick={handleConfirmUpload}
              aria-label="确认上传并关闭预览弹窗"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleConfirmUpload()}
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User1;