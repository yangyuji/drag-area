/**
* author: "oujizeng",
* license: "MIT",
* github: "https://github.com/yangyuji/drag-area",
* name: "dragarea.js",
* version: "2.1.1"
*/

(function (root, factory) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else if ( typeof define == 'function' && define.amd ) {
        define( function () { return factory(); } );
    } else {
        root['dragarea'] = factory();
    }
}(this, function () {
    'use strict'

    var getEle = function (str) {
        return document.getElementById(str);
    };

    var getCss = function (o, key) {
        return o.currentStyle ? o.currentStyle[key] : window.getComputedStyle(o, null)[key];
    };

    var getScroll = function (scrollProp, offsetProp) {
        if (typeof window[offsetProp] !== 'undefined') {
            return window[offsetProp];
        }
        if (document.documentElement.clientHeight) {
            return document.documentElement[scrollProp];
        }
        return document.body[scrollProp];
    }

    var getOffset = function (el) {
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
                boxIdx = 1,

                start = null,
                flag = false,
                addHotFlag = false,
                dragPointFlag = false,
                dragAreaFlag = false,

                currentHotBox = null,
                newHotBox = null;

            container.addEventListener('mousedown', function(e) {

                e.stopImmediatePropagation();

                // 获取可拖动范围
                var usearea = getOffset(container),
                // 当前触发对象
                    target = e.target;

                //记录鼠标开始位置
                start = {
                    x: e.clientX,
                    y: e.clientY
                };

                // 标记本次鼠标按下
                flag = true;

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

                    // 鼠标在容器内的相对位置
                    var relativePosition = {
                        x: start.x - parseInt(usearea.left),
                        y: start.y - parseInt(usearea.top)
                    };

                    // 创建一个新热区
                    newHotBox = hotbox.cloneNode(true);
                    newHotBox.dataset.index = boxIdx;
                    newHotBox.style.width = '0px';
                    newHotBox.style.height = '0px';
                    newHotBox.style.left = relativePosition.x + 'px';
                    newHotBox.style.top = relativePosition.y + 'px';
                    // 在确定用户拖动前隐藏，避免点击出现热区
                    newHotBox.style.display = 'none';
                    target.parentNode.appendChild(newHotBox);

                    document.onmousemove = function (e) {

                        if (flag) {
                            // 新增热区标签
                            addHotFlag = true;
                            // 显示热区
                            newHotBox.style.display = 'block';
                            // 实际移动距离
                            var move = {
                                x: e.clientX - start.x,
                                y: e.clientY - start.y
                            };

                            // 向左上移动
                            if (move.x < 0 && move.y <= 0) {
                                // 限制不能超过容器
                                var limit = {
                                    x: e.clientX < usearea.left ? usearea.left : e.clientX,
                                    y: e.clientY < usearea.top ? usearea.top : e.clientY
                                };
                                // 应该移动距离
                                var distance = {
                                    x: limit.x - start.x,
                                    y: limit.y - start.y
                                };
                                // 随鼠标移动位置并放大
                                newHotBox.style.left = relativePosition.x - Math.abs(distance.x) + 'px';
                                newHotBox.style.top = relativePosition.y - Math.abs(distance.y) + 'px';
                                newHotBox.style.width = Math.abs(distance.x) + 'px';
                                newHotBox.style.height = Math.abs(distance.y) + 'px';
                            }
                            // 向左下移动
                            else if (move.x < 0 && move.y > 0) {
                                // 限制不能超过容器
                                var limit = {
                                    x: e.clientX < usearea.left ? usearea.left : e.clientX,
                                    y: e.clientY > usearea.top + usearea.height ? usearea.top + usearea.height : e.clientY
                                };
                                // 应该移动距离
                                var distance = {
                                    x: limit.x - start.x,
                                    y: limit.y - start.y
                                };
                                // 随鼠标移动位置并放大
                                newHotBox.style.left = relativePosition.x - Math.abs(move.x) > 0 ? relativePosition.x - Math.abs(move.x) + 'px' : '0px';
                                newHotBox.style.width = Math.abs(distance.x) + 'px';
                                newHotBox.style.height = Math.abs(distance.y) + 'px';
                            }
                            // 向右上移动
                            else if (move.x >= 0 && move.y < 0) {
                                // 限制不能超过容器
                                var limit = {
                                    x: e.clientX > usearea.left + usearea.width ? usearea.left + usearea.width : e.clientX,
                                    y: e.clientY < usearea.top ? usearea.top : e.clientY
                                };
                                // 应该移动距离
                                var distance = {
                                    x: limit.x - start.x,
                                    y: limit.y - start.y
                                };
                                // 随鼠标移动位置并放大
                                newHotBox.style.top = relativePosition.y - Math.abs(move.y) > 0 ? relativePosition.y - Math.abs(move.y) + 'px' : '0px';
                                newHotBox.style.width = Math.abs(distance.x) + 'px';
                                newHotBox.style.height = Math.abs(distance.y) + 'px';
                            }
                            // 向右下移动
                            else if (move.x > 0 && move.y > 0) {
                                // 限制不能超过容器
                                var limit = {
                                    x: e.clientX > usearea.left + usearea.width ? usearea.left + usearea.width : e.clientX,
                                    y: e.clientY > usearea.top + usearea.height ? usearea.top + usearea.height : e.clientY
                                };
                                // 随鼠标放大
                                newHotBox.style.width = limit.x - start.x + 'px';
                                newHotBox.style.height = limit.y - start.y + 'px';
                            }
                        }
                    }
                }

                // 拖动热区
                if (target.classList.contains('crop-box-content')) {

                    // 相对页面当前位置
                    var initPosition = getOffset(target.parentNode);

                    // 相对container当前位置
                    var startPosition = {
                        x: target.parentNode.style.left || getCss(target.parentNode, 'left'),
                        y: target.parentNode.style.top || getCss(target.parentNode, 'top')
                    };

                    // 鼠标移动限制
                    var limitArea = {
                        maxLeft: usearea.left + usearea.width - (initPosition.left + initPosition.width - e.clientX),
                        maxTop: usearea.top + usearea.height - (initPosition.top + initPosition.height - e.clientY),
                        minLeft: usearea.left + (e.clientX - initPosition.left),
                        minTop: usearea.top + (e.clientY - initPosition.top)
                    };

                    document.onmousemove = function (e) {

                        if (flag) {
                            // 拖动热区标签
                            dragAreaFlag = true;
                            currentHotBox = target.parentNode;

                            // 热区拖动限制
                            var movelimit = {
                                x: e.clientX > limitArea.maxLeft ? limitArea.maxLeft : e.clientX < limitArea.minLeft ? limitArea.minLeft : e.clientX,
                                y: e.clientY > limitArea.maxTop ? limitArea.maxTop : e.clientY < limitArea.minTop ? limitArea.minTop : e.clientY,
                            };

                            target.parentNode.style.left = parseInt(startPosition.x) + movelimit.x - start.x + 'px';
                            target.parentNode.style.top = parseInt(startPosition.y) + movelimit.y - start.y + 'px';
                        }
                    }
                }

                // 拖动边框
                if (target.classList.contains('cropper-point')) {

                    // 相对container当前位置
                    var initAttr = {
                        width: target.parentNode.style.width || getCss(target.parentNode, 'width'),
                        height: target.parentNode.style.height || getCss(target.parentNode, 'height'),
                        left: target.parentNode.style.left || getCss(target.parentNode, 'left'),
                        top: target.parentNode.style.top || getCss(target.parentNode, 'top'),
                        direct: target.dataset.direct || 'se'
                    };

                    document.onmousemove = function (e) {

                        if (flag) {
                            // 拖动缩放标签
                            dragPointFlag = true;
                            currentHotBox = target.parentNode;
                            // 鼠标移动距离
                            var moveArea = {
                                x: e.clientX > usearea.left + usearea.width ? usearea.left + usearea.width - start.x : e.clientX < usearea.left ? usearea.left - start.x : e.clientX - start.x,
                                y: e.clientY > usearea.top + usearea.height ? usearea.top + usearea.height - start.y : e.clientY < usearea.top ? usearea.top - start.y : e.clientY - start.y
                            }
                            if (initAttr.direct == 'e') {
                                var nowW = parseInt(initAttr.width) + parseInt(moveArea.x);
                                target.parentNode.style.width = nowW + 'px';
                            }
                            if (initAttr.direct == 's') {
                                var nowH = parseInt(initAttr.height) + parseInt(moveArea.y);
                                target.parentNode.style.height = nowH + 'px';
                            }
                            if (initAttr.direct == 'w') {
                                var nowW = parseInt(initAttr.width) - parseInt(moveArea.x);
                                var offLeft = parseInt(initAttr.left) + parseInt(moveArea.x);
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.left = offLeft + 'px';
                            }
                            if (initAttr.direct == 'n') {
                                var nowH = parseInt(initAttr.height) - parseInt(moveArea.y);
                                var offTop = parseInt(initAttr.top) + parseInt(moveArea.y);
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.top = offTop + 'px';
                            }
                            if (initAttr.direct == 'ne') {
                                var nowW = parseInt(initAttr.width) + parseInt(moveArea.x);
                                var nowH = parseInt(initAttr.height) - parseInt(moveArea.y);
                                var offTop = parseInt(initAttr.top) + parseInt(moveArea.y);
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.top = offTop + 'px';
                                target.parentNode.style.width = nowW + 'px';
                            }
                            if (initAttr.direct == 'nw') {
                                var nowH = parseInt(initAttr.height) - parseInt(moveArea.y);
                                var offTop = parseInt(initAttr.top) + parseInt(moveArea.y);
                                var nowW = parseInt(initAttr.width) - parseInt(moveArea.x);
                                var offLeft = parseInt(initAttr.left) + parseInt(moveArea.x);
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.left = offLeft + 'px';
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.top = offTop + 'px';
                            }
                            if (initAttr.direct == 'sw') {
                                var nowH = parseInt(initAttr.height) + parseInt(moveArea.y);
                                var nowW = parseInt(initAttr.width) - parseInt(moveArea.x);
                                var offLeft = parseInt(initAttr.left) + parseInt(moveArea.x);
                                target.parentNode.style.height = nowH + 'px';
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.left = offLeft + 'px';
                            }
                            if (initAttr.direct == 'se') {
                                var nowW = parseInt(initAttr.width) + parseInt(moveArea.x);
                                var nowH = parseInt(initAttr.height) + parseInt(moveArea.y);
                                target.parentNode.style.width = nowW + 'px';
                                target.parentNode.style.height = nowH + 'px';
                            }
                        }
                    }
                }

            });

            document.addEventListener('mouseup', function(e) {

                // 是否新增热区
                if (addHotFlag) {
                    // 20可以通过陪参传入
                    if (parseInt(newHotBox.style.width) < 20 || parseInt(newHotBox.style.height) < 20) {
                        //console.log(newHotBox);
                        newHotBox && newHotBox.parentNode.removeChild(newHotBox);
                        parseInt(newHotBox.style.width) < 20 && console.log('热区宽度太窄了，建议大于20px');
                        parseInt(newHotBox.style.height) < 20 && console.log('热区高度太小了，建议大于20px');
                    } else {
                        boxIdx++;
                        container.querySelectorAll('.hot-crop-box').forEach(function (val) {
                            val.classList.remove('active');
                        });
                        newHotBox.classList.add('active');
                        opt.newcallback && opt.newcallback(newHotBox);
                    }
                }

                // 是否拖动热区
                if (dragAreaFlag) {
                    container.querySelectorAll('.hot-crop-box').forEach(function (val) {
                        val.classList.remove('active');
                    });
                    currentHotBox.classList.add('active');
                    opt.dragareacallback && opt.dragareacallback(currentHotBox);
                }

                // 是否拖动缩放
                if (dragPointFlag) {
                    container.querySelectorAll('.hot-crop-box').forEach(function (val) {
                        val.classList.remove('active');
                    });
                    currentHotBox.classList.add('active');
                    opt.dragpointcallback && opt.dragpointcallback(currentHotBox);
                }

                flag = false;
                addHotFlag = false;
                dragAreaFlag = false;
                dragPointFlag = false;
                currentHotBox = null;
                newHotBox = null;
                start = null;

                // 释放拖动事件
                document.onmousemove = null;
                document.onselectstart = null;
                container.ondragstart = null;
            });

            container.addEventListener('click', function (e) {
                if (e.target.classList.contains('crop-box-content')) {
                    container.querySelectorAll('.hot-crop-box').forEach(function (val) {
                        val.classList.remove('active');
                    });
                    e.target.parentNode.classList.add('active');
                    opt.clickcallback && opt.clickcallback(e.target.parentNode);
                }
            });
        }
    };

    return dragarea;

}));