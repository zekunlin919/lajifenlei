import { useEffect, useState } from 'react';
import "./ShowImg.scss";

// 定义Props类型：新增可选的className属性（核心修改）
interface ShowImgProps {
  imageUrl: string | null | undefined;
  className?: string; // 新增：允许父组件传递类名，可选属性
}

// 改用箭头函数组件，符合React现代开发规范
const ShowImg: React.FC<ShowImgProps> = ({ imageUrl, className }) => { // 接收className参数
  // 新增图片加载状态：配合SCSS实现渐显/失败兜底
  const [imgLoadStatus, setImgLoadStatus] = useState<'loading' | 'success' | 'error'>('loading');
  // 图片加载失败时的兜底占位图（适配垃圾分类主题）
  const fallbackImg = "https://via.placeholder.com/400x300?text=分类结果图片加载失败";

  // 图片加载/失败事件处理
  const handleImgLoad = () => setImgLoadStatus('success');
  const handleImgError = () => setImgLoadStatus('error');

  // 优化：组件卸载时释放Blob URL内存（避免内存泄漏）
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // 简化条件判断：判断imageUrl是否有效
  const hasValidUrl = !!imageUrl;

  return (
    <div className="show-img" aria-label="垃圾分类结果展示区">
      {/* 仅当有有效URL时显示标题，保持原逻辑 */}
      {hasValidUrl && <h2>分类结果</h2>}
      
      {hasValidUrl ? (
        // 图片区域：将className传递给img标签（核心修改）
        <img
          key={imageUrl} // URL变化时重新渲染，避免缓存问题
          // 拼接原有res-img类和父组件传递的className
          className={`res-img ${className || ''} ${imgLoadStatus === 'success' ? 'loaded' : ''}`}
          src={imgLoadStatus === 'error' ? fallbackImg : imageUrl}
          alt={imgLoadStatus === 'error' ? '分类结果图片加载失败，请重试' : '垃圾分类识别结果图片'}
          loading="lazy" // 懒加载：提升页面加载性能
          aria-label={imgLoadStatus === 'loading' ? '图片加载中...' : '垃圾分类识别结果'}
          aria-live="polite" // 可访问性：屏幕阅读器友好提示
          onLoad={handleImgLoad}
          onError={handleImgError}
        />
      ) : (
        // 无有效URL时显示友好提示，替代空白
        <div className="empty-tip" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(14px, 1.2vw, 18px)',
          color: '#999',
          fontFamily: '宋体'
        }}>
          暂无分类结果，请先上传图片
        </div>
      )}
    </div>
  );
};

export default ShowImg;