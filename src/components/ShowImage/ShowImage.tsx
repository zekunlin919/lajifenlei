import { useEffect, useState } from 'react';
import "./ShowImage.scss";

// 定义Props类型，明确参数类型，提升TypeScript类型安全
interface ShowImageProps {
  resImg: string | null | undefined;
}

// 改用箭头函数组件，符合React现代开发规范
const ShowImage: React.FC<ShowImageProps> = ({ resImg }) => {
  // 新增图片加载状态：控制加载/失败/成功的视觉反馈
  const [imgStatus, setImgStatus] = useState<'loading' | 'success' | 'error'>('loading');
  // 兜底图片URL：图片加载失败时显示
  const fallbackImgUrl = "https://via.placeholder.com/400x300?text=图片加载失败";

  // 监听图片加载状态
  const handleImgLoad = () => setImgStatus('success');
  const handleImgError = () => setImgStatus('error');

  // 优化：组件卸载时释放ObjectURL内存（避免内存泄漏）
  useEffect(() => {
    return () => {
      if (resImg && resImg.startsWith('blob:')) {
        URL.revokeObjectURL(resImg);
      }
    };
  }, [resImg]);

  // 仅当resImg有效时渲染图片相关逻辑
  const hasValidImg = !!resImg;

  return (
    <div className="show-img" aria-label="垃圾分类结果展示区域">
      <h2>分类结果</h2>
      {hasValidImg ? (
        <img
          key={resImg} // 图片URL变化时重新渲染，避免缓存问题
          className={`res-img ${imgStatus === 'success' ? 'loaded' : ''}`} // 配合SCSS的渐显动画
          src={imgStatus === 'error' ? fallbackImgUrl : resImg}
          alt={imgStatus === 'error' ? '图片加载失败，请重试' : '垃圾分类识别结果图片'}
          // 懒加载：提升页面加载性能（仅视口内加载）
          loading="lazy"
          // 可访问性：添加aria属性，适配屏幕阅读器
          aria-label={imgStatus === 'loading' ? '图片加载中...' : '垃圾分类识别结果'}
          aria-live="polite"
          onLoad={handleImgLoad}
          onError={handleImgError}
        />
      ) : (
        // 无图片时显示提示文本，提升用户体验
        <div className="no-img-tip" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '1.2vw',
          color: '#999',
          fontFamily: '宋体'
        }}>
          暂无识别结果，请先上传图片
        </div>
      )}
    </div>
  );
};

export default ShowImage;