import "./InfoColumn.scss";
import "@/inconfont/style.scss";

// 垃圾分类系统头部信息列组件（已移除登出功能）
const InfoColumn = () => {
  // 已删除：useNavigate导入、navigate实例化、handleLogout登出函数

  return (
    <div className="info-column">
      {/* 保留背景图：路径/错误兜底逻辑不变 */}
      <img 
        onError={(e) => {
          const imgElement = e.target as HTMLImageElement;
          imgElement.src = "https://via.placeholder.com/1920x1080?text=垃圾分类系统背景";
        }}
      />
      <div className="info-content">
        <div className="back"></div>
        {/* 保留标题+系统图标：语义化/排版逻辑不变 */}
        <h1>
          <i className="iconfont icon-375" aria-label="系统图标"></i>
          垃圾分类系统
        </h1>
        {/* 已删除：登出相关的ul.term整个列表 */}
      </div>
    </div>
  );
};

export default InfoColumn;