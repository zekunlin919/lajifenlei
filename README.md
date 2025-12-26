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
- **使用预训练模型**：跳过此步骤，直接使用项目中已有的`yolo11n.pt`模型（或其他预训练权重）。
- **训练自定义模型**：
  1. 将你的垃圾分类数据集`dataset/`文件夹拉入项目文件夹中（确保数据集格式符合YOLOv11要求）。
  2. 在PyCharm中运行`train.py`脚本。
  3. 训练完成后，模型权重会保存在`runs/`文件夹中（`\runs\detect\custom_model_gpu_final\weights\best.pt`）。

#### 步骤4：启动后端服务
- 打开主程序`app.py`，将代码中的**模型文件路径**修改为你实际的预训练/训练后模型路径（`\runs\detect\custom_model_gpu_final\weights\best.pt`）。
- 运行`app.py`启动Flask后端服务（确保服务启动成功，无端口冲突）。


### 2. 前端操作（VSCode）
#### 步骤1：将项目导入VSCode
- 用VSCode 1.96打开完整项目文件夹（确保包含`package.json`等前端相关文件）。

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
1. 确保CUDA、CUDNN版本与PyTorch版本匹配，避免模型训练/推理时GPU加速失败。
2. 修改`app.py`中的模型路径时，建议使用**绝对路径**或正确的相对路径，防止后端无法加载模型。
3. 若前端启动端口`5173`被占用，可修改`vite.config.ts`中的端口配置，重新执行`npm run dev`。
4. `uploads/`文件夹用于存储前端页面用户上传的图片，`runs/`文件夹记录模型训练结果——请勿随意删除这两个文件夹。

