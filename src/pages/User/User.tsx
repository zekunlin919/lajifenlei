import { useNavigate } from "react-router";
import { useLayoutEffect, useState } from "react";
import "./User.scss";
import PostImg from "@/components/PostImg/PostImg";
import ShowImg from "@/components/ShowImg/ShowImg";

// 定义组件类型，符合TypeScript规范（无Props则定义为React.FC）
const User: React.FC = () => {
  // 状态初始化规范，补充明确的类型注解
  const [imageURL, setImageUrl] = useState<string | null>(null);
  
  // 初始化路由导航实例
  const navigate = useNavigate();

  // 优化：组件卸载时释放Blob URL内存（避免内存泄漏）
  useLayoutEffect(() => {
    return () => {
      if (imageURL && imageURL.startsWith('blob:')) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

  // 登出逻辑：保留核心功能，优化函数命名语义化+注释
  const handleLogout = () => {
    // 清除登录态token
    localStorage.removeItem('token');
    // 跳转到首页
    navigate('/');
  };

  return (
    <>
      {/* 背景图：更换时只需修改src后的路径（绝对路径） */}
      {/* 推荐：将新背景图放入public/assets目录，替换下面的文件名即可 */}
      <img 
        className="background-img" 
        // 👇 更换背景图只需修改这行的路径，示例：/assets/new-bg.jpg
        src="/assets/image1.png" 
        alt="垃圾分类系统背景图"
        // 优化：图片加载失败兜底（避免背景空白）
        onError={(e) => {
          const imgEl = e.target as HTMLImageElement;
          imgEl.src = "https://via.placeholder.com/1920x1080?text=垃圾分类系统";
        }}
      />
      <div className="container">
        {/* 页面标题：补充语义化，标题标签更规范 */}
        <div className="title">
          <div className="background"></div>
          <h1 aria-label="垃圾分类系统主标题">垃 圾 分 类 系 统</h1>
        </div>
        
        {/* 上传区域：添加内边距避免内容贴边，提升层级防止被遮挡 */}
        <div className="post-column" key="post-area" style={{ padding: '1vw' }}>
          <div className="background1">
            <PostImg setImageUrl={setImageUrl} />
          </div>
        </div>
        
        {/* 结果展示区域：核心优化 - 补充专属容器样式，避免预览图被裁切/遮挡 */}
        <div className="user-show-table" key="show-area">
          <div className="table-column" style={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden' // 避免图片溢出容器
          }}>
            {/* 给ShowImg传递预览图样式类，确保图片适配容器 */}
            <ShowImg 
              imageUrl={imageURL} 
              className="preview-img" // 关联scss中新增的preview-img样式
            />
          </div>
        </div>
        
        {/* 退出按钮：优化可访问性，添加aria属性+回车触发 */}
        <button 
          className="quit" 
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleLogout()}
          aria-label="退出登录，返回首页"
          // 新增：按钮层级高于展示区，避免被覆盖
          style={{ zIndex: 10 }}
        >
          退出登录
        </button>
      </div>
    </>
  );
};

export default User;