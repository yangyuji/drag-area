/*
* author: "oujizeng",
* license: "MIT",
* name: "dragarea.js",
* version: "1.0.0"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root['dragarea'] = factory();
    }
}(this, function () {


    var getEle = function (str) {
        return document.getElementById(str);
    };

    var getCss = function(o, key) {
        return o.currentStyle ? o.currentStyle[key] : window.getComputedStyle(o, null)[key];
    };

    function getScroll (scrollProp, offsetProp) {
        // if (typeof global[offsetProp] !== 'undefined') {
        //     return global[offsetProp];
        // }
        if (document.documentElement.clientHeight) {
            return document.documentElement[scrollProp];
        }
        return document.body[scrollProp];
    }

    var getOffset = function  (el) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
            top: rect.top + getScroll('scrollTop', 'pageYOffset'),
            width: rect.right - rect.left,
            height: rect.bottom - rect.top
        };
    }

    var dragarea = {

        init: function(opt) {

            var container = getEle(opt.container),
                hotbox = getEle(opt.hotbox),
                start = null,
                move = null,
                current = null,
                flag = false,
                addHotFlag = false,
                newHotBox = null;

            container.addEventListener('mousedown', function(e) {

                e.stopImmediatePropagation();

                //记录鼠标开始位置
                start = {
                    x: e.clientX,
                    y: e.clientY
                };

                // 标记本次鼠标按下
                flag = true;

                // 当前触发对象
                var target = e.target;

                // 禁止选择事件
                document.onselectstart = function() {
                    return false;
                }
                // 禁止拖动
                container.ondragstart = function () {
                    return false;
                }

                // 拖动新建热区
                if (target.classList.contains('hot-area-img')) {
                    var offset = getOffset(container);
                    // 创建一个新热区
                    newHotBox = hotbox.cloneNode(true);
                    newHotBox.style.width = '0px';
                    newHotBox.style.height = '0px';
                    newHotBox.style.left = start.x - parseInt(offset.left) + 'px';
                    newHotBox.style.top = start.y - parseInt(offset.top) + 'px';
                    // 在确定用户拖动前隐藏，避免点击出现热区
                    newHotBox.style.display = 'none';
                    target.parentNode.appendChild(newHotBox);

                    document.onmousemove = function (e) {

                        if (flag) {
                            // 新增热区标签
                            addHotFlag = true;
                            // 显示热区
                            newHotBox.style.display = 'block';
                            // 鼠标移动距离
                            move = {
                                x: e.clientX - start.x,
                                y: e.clientY - start.y
                            }
                            // 随鼠标放大box
                            newHotBox.style.width = move.x + 'px';
                            newHotBox.style.height = move.y + 'px';
                        }
                    }
                }

                // 拖动热区
                if (target.classList.contains('crop-box-content')) {

                    // 获取控件当前位置
                    current = {
                        x: getCss(target.parentNode, 'left'),
                        y: getCss(target.parentNode, 'top')
                    }

                    document.onmousemove = function (e) {

                        if (flag) {

                            // 鼠标移动距离
                            move = {
                                x: e.clientX - start.x,
                                y: e.clientY - start.y
                            }

                            // 当前应该放置位置
                            var now = {
                                x: parseInt(move.x) + parseInt(current.x),
                                y: parseInt(move.y) + parseInt(current.y)
                            }
                            target.parentNode.style.left = now.x + 'px';
                            target.parentNode.style.top = now.y + 'px';
                        }
                    }
                }

                // 拖动边框
                if (target.classList.contains('cropper-point')) {

                    // 获取初始值
                    var w = getCss(target.parentNode, 'width');
                    var h = getCss(target.parentNode, 'height');
                    var left = getCss(target.parentNode, 'left');
                    var top = getCss(target.parentNode, 'top');
                    var direct = target.dataset.direct;

                    document.onmousemove = function (e) {

                        if (flag) {
                            // 鼠标移动距离
                            move = {
                                x: e.clientX - start.x,
                                y: e.clientY - start.y
                            }
                            if (direct == 'e') {
                                var nowW = parseInt(w) + parseInt(move.x);
                                target.parentNode.style.width = nowW + 'px';
                            }
                            if (direct == 's') {
                                var nowH = parseInt(h) + parseInt(move.y);
                                target.parentNode.style.height = nowH + 'px';
                            }
                            if (direct == 'w') {
                                var nowW = parseInt(w) - parseInt(move.x);
                                var offLeft = parseInt(left) + parseInt(move.x);
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.left = offLeft + 'px';
                            }
                            if (direct == 'n') {
                                var nowH = parseInt(h) - parseInt(move.y);
                                var offTop = parseInt(top) + parseInt(move.y);
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.top = offTop + 'px';
                            }
                            if (direct == 'ne') {
                                var nowW = parseInt(w) + parseInt(move.x);
                                var nowH = parseInt(h) - parseInt(move.y);
                                var offTop = parseInt(top) + parseInt(move.y);
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.top = offTop + 'px';
                                target.parentNode.style.width = nowW + 'px';
                            }
                            if (direct == 'nw') {
                                var nowH = parseInt(h) - parseInt(move.y);
                                var offTop = parseInt(top) + parseInt(move.y);
                                var nowW = parseInt(w) - parseInt(move.x);
                                var offLeft = parseInt(left) + parseInt(move.x);
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.left = offLeft + 'px';
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.top = offTop + 'px';
                            }
                            if (direct == 'sw') {
                                var nowH = parseInt(h) + parseInt(move.y);
                                var nowW = parseInt(w) - parseInt(move.x);
                                var offLeft = parseInt(left) + parseInt(move.x);
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.left = offLeft + 'px';
                            }
                            if (direct == 'se') {
                                var nowW = parseInt(w) + parseInt(move.x);
                                var nowH = parseInt(h) + parseInt(move.y);
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.height = nowH + 'px';
                            }
                        }
                    }
                }

            });

            document.addEventListener('mouseup', function(e) {

                e.stopImmediatePropagation();

                //记录鼠标位置
                current = {
                    x: e.clientX,
                    y: e.clientY
                }

                // 判断是否新增热区
                if (addHotFlag) {
                    console.log('拖动新增热区啦！！！');
                    // 20可以通过陪参传入
                    if (move.x < 20 || move.y < 20) {
                        console.log(move);
                        newHotBox && newHotBox.parentNode.removeChild(newHotBox);
                        move.x < 20 && console.log('热区宽度太窄了，建议大于20px');
                        move.y < 20 && console.log('热区高度太小了，建议大于20px');
                    }
                }

                flag = false;
                addHotFlag = false;
                newHotBox = null;
                start = null;
                move = null;

                // 释放拖动事件
                document.onmousemove = null;
                document.onselectstart = null;
                container.ondragstart = null;
            });
        }
    };

    return dragarea;

}));