# 基于YOLOv11的垃圾分类系统
这是一个结合YOLOv11深度学习模型、React-TS前端界面与Flask后端的垃圾分类系统，可通过网页界面实现垃圾图片检测与交互展示。

## 🛠️ 技术栈
### 模型与后端
- **检测模型**：YOLOv11
- **编程语言**：Python 3.10
- **深度学习框架**：PyTorch 2.0.1
- **GPU加速环境**：CUDA 11.7 + CUDNN 8500
- **科学计算库**：NumPy 1.26.2
- **后端框架**：Flask
- **开发工具**：PyCharm Professional 2025.2.1.1

### 前端
- **开发工具**：VSCode 1.96
- **技术框架**：基于Vite的React-TS（React + TypeScript）

## 🚀 运行步骤
### 1. 后端操作（PyCharm）
#### 步骤1：将项目导入PyCharm
- 下载完整项目文件夹，用PyCharm Professional 2025.2.1.1打开。
- 确保PyCharm中的Python解释器版本为3.10。

#### 步骤2：安装Python依赖
- 在PyCharm终端中执行以下命令，一键安装所有Python依赖库：
  ```bash
  pip install -r requirements.txt
  ```

#### 步骤3：模型训练（可选）
- **使用项目内置模型**：跳过此步骤，直接启动后端服务即可（`app.py`已配置好内置模型路径）。
- **训练自定义模型**：
  1. 因垃圾分类数据集（`dataset/`文件夹）体积较大未随项目上传，需自行准备符合YOLOv11格式的垃圾分类数据集，放入项目根目录的`dataset/`文件夹。
  2. 在PyCharm中运行`train.py`脚本。
  3. 训练完成后，模型权重会保存在`runs/detect/custom_model_gpu_final/weights/best.pt`路径下。

#### 步骤4：启动后端服务
- **使用内置模型**：直接运行`app.py`启动Flask后端服务（无需修改任何配置，确保服务启动成功且无端口冲突）。
- **使用自定义训练模型**：先打开`app.py`，将代码中的模型路径修改为自定义训练后的路径（`runs/detect/custom_model_gpu_final/weights/best.pt`），再运行`app.py`。

### 2. 前端操作（VSCode）
#### 步骤1：将项目导入VSCode
- 用VSCode 1.96打开完整项目文件夹（确保包含`package.json`等前端核心文件）。

#### 步骤2：安装前端依赖
- 在VSCode终端中执行以下命令，安装所有Node.js依赖（首次运行仅需执行一次）：
  ```bash
  npm install
  ```

#### 步骤3：启动前端服务
- 执行以下命令启动Vite开发服务器：
  ```bash
  npm run dev
  ```

#### 步骤4：访问系统
- 前端服务启动成功后，打开浏览器访问：`http://localhost:5173/`。
- 系统会先显示登录界面（登录功能暂未完善），直接点击“登录”按钮即可进入垃圾分类主界面。

## ⚠️ 注意事项
1. 确保CUDA、CUDNN版本与PyTorch 2.0.1匹配，避免模型训练/推理时GPU加速失败；若无GPU，可修改`train.py`中训练参数为CPU模式。
2. 修改`app.py`中的模型路径时，建议使用跨平台的相对路径（正斜杠`/`），例如`runs/detect/custom_model_gpu_final/weights/best.pt`，防止路径转义导致模型加载失败。
3. 若前端启动端口`5173`被占用，可修改`vite.config.ts`中的端口配置，重新执行`npm run dev`。
4. `uploads/`文件夹用于存储前端页面用户上传的图片，`runs/`文件夹记录模型训练结果——请勿随意删除这两个文件夹。
5. 垃圾分类数据集（`dataset/`文件夹）因体积较大未随项目上传，需自行准备符合YOLOv11格式的数据集后，方可进行自定义模型训练。
