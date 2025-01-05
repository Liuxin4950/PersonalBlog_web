# 我的个人博客

本项目是我在咸鱼时间尝试学习后端实践的测试项目，本来是只想写一个简单的博客，存储文章的，结果中途遇到了各种各样的问题，比如服务器部署，OSS服务。如何优化大模型推理速度，如何让live2d模型开口，不同尺寸浏览器下模型不变形，如何调整live2d模型配置文件等，中途遇到了很多问题。总之我这一次学到了很多。

## vite + SpringBoot

本项目由 vite+SpringBoot+vue3+element-plus+mysql+vue3-router+axios+pinia 构建

前端地址https://github.com/Liuxin4950/PersonalBlog_web.git
后端地址https://github.com/Liuxin4950/PersonalBlog_backend.git
SpringBoot 运行在 8080 端口，vite 运行在 5173 端口

## 运行项目

```text
1.clone 项目到本地
2.cd 到项目根目录
3.npm install
4.npm run dev
```

就可以运行成功了

## live2d 语言和大模型驱动依赖

### 大模型

本项目大模型服务使用的是本地跑的 ollama 本地量化模型，qwen2.5-3b 模型。
当你在本地运行项目并想使用大模型的时候，需要先安装 ollama 以此来运行大模型。
ollama 下载地址https://ollama.com/
下载完成后，在 win+r 输入 cmd 使用 ollama run qwen2.5:3b 安装模型；
之后呢，你需要配置环境变量，让项目可以访问到 ollama 服务。
在系统变量里添加 OLLAMA_MODELS 变量值为 0.0.0.0
接下来项目就可以访问 ollama 本地模型了，注意默认端口是 11434 哦，访问就是 127.0.0.1:11434；
详细的请前往 ollama 官网查看 ollama 的 api 开发文档。

### 语音生成服务

语音项目是基于**[GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS)**二次开发的**GPT-soVITS-Inference**推理加速。

注意，这个GPT-soVITS-Inference项目集成了快捷的可视化添加模型和管理模型的可视化页面，在使用纳西妲的时候，记得上传一个纳西妲的文件哦。

### 合成效果

经过live2，大模型，语音生成，你可以实现让纳西妲开口回答你的问题。

大模型流式返回文本，每集齐10个字符，就将字符发给语言生成服务（这里是将文本发给我的后端，后端请求GPT-soVITS-Inference的服务api，生成音频文件后，存储到后端，返回音频路径到前端，前端使用列表存储，每播放完成一个音频就播放下一个，这样就可以让纳西妲快速反应回答你的问题了）这是最难的地方。

