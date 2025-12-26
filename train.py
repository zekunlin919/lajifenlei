from ultralytics import YOLO

if __name__ == '__main__':
    # 若要续训之前中断的进度：加载 last.pt（正确续训方式）
    # model = YOLO("runs/detect/custom_model_gpu/weights/last.pt")
    # 若要重新训练（推荐，避免旧状态干扰）：加载预训练权重
    model = YOLO("yolo11n.pt")

    results = model.train(
        data="dataset/waste/data.yaml",
        epochs=30,  # 改回30轮，足够达标，600轮完全没必要
        imgsz=512,  # 低内存核心：512尺寸比640省30%显存/内存
        batch=8,    # 8G显存安全值，避免溢出
        workers=0,  # 单进程加载，彻底稳定，不占额外内存
        device='0', # GPU加速
        name="custom_model_gpu_final",  # 新名称，避免冲突
        patience=10,
        save=True,
        val=True,
        cache=False,  # 关闭磁盘缓存！彻底杜绝C盘占用
        exist_ok=True,
        resume=False,  # 重新训练设False；若续训则设True（且上面模型加载last.pt）
        half=True,     # 半精度训练，显存再省50%
        mosaic=0.0,    # 关闭高内存增强
        plots=False,   # 不生成冗余图，省空间
        save_crop=False,
        save_txt=False,
        warmup_epochs=2.0,
        lr0=0.0008,
        project="D:/yolo-training-results",  # 所有训练文件存D盘，不占C盘
    )