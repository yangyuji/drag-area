# drag-area
拖动实现区域选择，移动缩放选择区域

## 实现功能
> *  PC端拖动实现区域选择，并可以移动、缩放选择区域等

## 实现技术
> *  原生javascript，无须依赖任何库，可用于zepto/jquery或者vue等任意技术场景；

## 特点
> *  代码非常小的库，只有100多行，每个人都能看懂，可以进行扩展和修改；
> *  无依赖，这样你就可以用于任何地方了；

## 新增功能
> * 增加支持反方向（左移，上移）生成区域；
> * 控制选择、拖动区域不超过容器范围；
> * 增加回调函数。

## 预览
> * 页面[点击这里](https://yangyuji.github.io/drag-area/demo.html)

## 记录一下
> * github设置master分支作为预览页面，报404错误的时候，执行命令：
```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```