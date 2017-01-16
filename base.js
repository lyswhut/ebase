
/**
 * 前台调用
 * @return {object} 返回基础库对象
 */
var _ = function (args) {
    return new Base(args);
};

/**
 * 基础库
 */
function Base(args) {
    //创建一个数组来保存获取的节点和节点数组
    this.elements = [];
    switch (typeof args) {
        case 'string':
            args = args.trim();
            if (args.indexOf(' ') == -1) {//find模拟
                if (typeof args == 'string') {
                    switch (args.charAt(0)) {
                        case '#':
                            this.elements.push(document.getElementById(args.substring(1)));
                            break;
                        case '.':
                            this.elements = this.getClass(args.substring(1));
                            break;
                        default:
                            this.elements = this.getTagName(args);
                            break;
                    }
                }
            } else {//CSS模拟
                var elements = args.split(' ');
                this.elements.push(document);
                for(var i in elements) {
                    if (this.elements.length) {
                        switch (elements[i].charAt(0)) {
                            case '#':
                                this.elements = [document.getElementById(elements[i].substring(1))];
                                break;
                            case '.':
                                this.elements = this.getClass(elements[i].substring(1), this.elements);
                                break;
                            default:
                                this.elements = this.getTagName(elements[i], this.elements);
                                break;
                        }
                    } else return;
                }
            }
            break;
        case 'object':
            this.elements[0] = args;
            break;
        case 'function':
            this.ready(args);
            break;
        default:
            break;
    }
    // if (typeof args === 'string') {

    // } else if (typeof args == 'object') {
    //     this.elements[0] = args;
    // } else if (typeof args == 'function') {
    //     addDomLoaded(args);
    // }

}

/**
 * DOM加载
 * @param  {Function} fn DOM加载完成后执行的函数
 */
Base.prototype.ready = function(fn){
    addDomLoaded(fn);
};

/**
 * 获取ID节点
 * @param  {string} id 要获取的ID
 * @return {object}    返回基础库对象
 */
Base.prototype.getId = function (id) {
    this.elements.push(document.getElementById(id));
    return this;
};

/**
 * 获取元素节点数组
 * @param  {string} tag         要获取的标签名
 * @param  {string} parentNode  父节点，如果有
 * @return {object}             返回基础库对象
 */
// Base.prototype.getTagName = function (tag, parentNode) {
//     var node = null;
//     var temps = [];
//     if (parentNode === undefined) {
//         node = document;
//     } else {
//         node = parentNode;
//     }
//     console.log(node);
//     var tags = node.getElementsByTagName(tag);
//     for (var i = 0; i < tags.length; i++) {
//         temps.push(tags[i]);
//     }
//     return temps;
// };
Base.prototype.getTagName = function (tag, parentNode) {
    var node = null,temps = [],tags = [],nowTags;

    if (parentNode === undefined) {
        node = document;
    } else {
        node = parentNode;
    }
    if (parentNode instanceof Array) {
        for (var i = 0; i < node.length; i++) {
            nowTags = node[i].getElementsByTagName(tag);
            for (var j = 0; j < nowTags.length; j++) {
                tags.push(nowTags[j]);
            }
        }
    } else {
        tags = node.getElementsByTagName(tag);
    }
    for (var k = 0; k < tags.length; k++) {
        temps.push(tags[k]);
    }
    return temps;
};


/**
 * 获取CLASS节点数组
 * @param  {string} className  要获取的class名
 * @param  {string} parentNode 父节点，如果有
 * @return {object}            返回基础库对象
 */
// Base.prototype.getClass = function(className, parentNode){
//     var node = null;
//     var temps = [];
//     if (parentNode === undefined) {
//         node = document;
//     } else {
//         node = parentNode;
//     }

//     var all = node.getElementsByTagName('*');
//     for (var i = 0; i < all.length; i++) {
//         if (all[i].className == className) {
//             temps.push(all[i]);
//         }
//     }
//     return temps;
// };
Base.prototype.getClass = function(className, parentNode){
    var node = null,temps = [],all = [],nowClass;
    if (parentNode === undefined) {
        node = document;
    } else {
        node = parentNode;
    }

    if (parentNode instanceof Array) {
        for (var i = 0; i < parentNode.length; i++) {
            nowClass = parentNode[i].getElementsByTagName('*');
            for (var j = 0; j < nowClass.length; j++) {
                all.push(nowClass[j]);
            }
        }
    } else {
        all = node.getElementsByTagName('*');
    }

    for (var k = 0; k < all.length; k++) {
        if ((new RegExp('(\\s|^)'+className+'(\\s|$)')).test(all[k].className)) {
            temps.push(all[k]);
        }
    }
    return temps;
};


/**
 * 节点查找
 * @param  {string} str 要查找的节点
 * @return {object}     返回基础库对象
 */
Base.prototype.find = function(str){
    var chlidElements = [];
    for (var i = 0; i < this.elements.length; i++) {
        switch (str.charAt(0)) {
            case '#':
                chlidElements.push(document.getElementById(str.substring(1)));
                break;
            case '.':
                chlidElements = chlidElements.concat(this.getClass(str.substring(1), this.elements[i]));
                break;
            default:
                chlidElements = chlidElements.concat(this.getTagName(str, this.elements[i]));
                break;
        }
    }
    this.elements = chlidElements;
    return this;
};


/**
 * 从节点数组中获取单一节点
 * @param  {int} num    节点编号
 * @return {object}     返回基础库对象
 */
Base.prototype.eq = function(num){
    var element = this.elements[num];
    this.elements = [];
    this.elements[0] = element;
    return this;
};


/**
 * 从节点数组中获取单一节点
 * @param  {int} num 节点编号
 * @return {element}     返回该节点对象
 */
Base.prototype.ge = function(num){
    return this.elements[num];
};


/**
 * 获取当前节点的上一个节点
 * @return {element} 当前节点的上一个节点
 */
Base.prototype.prev = function(){
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i].previousSibling;
        if (this.elements[i] === null) throw new Error('找不到上一个同级元素节点！');
        if (this.elements[i].nodeType == 3) this.prev();
    }
    return this;
};


/**
 * 获取当前节点的下一个节点
 * @return {element} 当前节点的下一个节点
 */
Base.prototype.next = function(){
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i].nextSibling;
        if (this.elements[i] === null) throw new Error('找不到下一个同级元素节点！');
        if (this.elements[i].nodeType == 3) this.next();
    }
    return this;
};


/**
 * 获取当前对象的节点数量
 * @return {int} 节点数量
 */
Base.prototype.length = function(){
    return this.elements.length;
};


/**
 * 添加Class
 * @param  {string} className 要添加的Class
 * @return {object}           返回基础库对象
 */
Base.prototype.addClass = function(className){
    for (var i = 0; i < this.elements.length; i++) {
        if (!hasClass(this.elements[i], className)) {
            this.elements[i].className += ' ' + className;
        }
    }
    return this;
};


/**
 * 移除Class
 * @param  {string} className 要移除的Class
 * @return {object}           返回基础库对象
 */
Base.prototype.removeClass = function(className){
    for (var i = 0; i < this.elements.length; i++) {
        if (hasClass(this.elements[i], className)) {
            this.elements[i].className =
            this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'), ' ');
        }
    }
    return this;
};


/**
 * 设置CSS
 * @param  {string} attr  要设置的CSS属性名
 * @param  {string} value 要设置的CSS属性值
 * @return {object}       返回基础库对象
 */
Base.prototype.css = function(attr, value){
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length === 1) {
            return getStyle(this.elements[i], attr);
        }
        this.elements[i].style[attr] = value;
    }
    return this;
};


/**
 * 设置innerHTML
 * @param  {string} str 要设置的HTML
 * @return {object}     返回基础库对象
 */
Base.prototype.html = function(str){
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length === 0) {
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML = str;
    }
    return this;
};


/**
 * 设置文本
 * @param  {string} str 要设置的文本
 * @return {object}     返回基础库对象
 */
Base.prototype.text = function(str){
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length === 0) {
            return getInnerText(this.elements[i]);
        }
        setInnerText(this.elements[i], str);
    }
    return this;
};


/**
 * 获取表单元素
 * @param  {string} name 要获取的表单的name
 * @return {object}      表单元素
 */
Base.prototype.form = function(name){
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i] = this.elements[i][name];
    }
    return this;
};


/**
 * 获取表单内容
 * @param  {string} str     要设置的内容
 * @return {string|object}  表单内容|返回基础库对象
 */
Base.prototype.value = function(str){
    for (var i = 0; i < this.elements.length; i++) {
        if (arguments.length === 0) {
            return this.elements[i].value;
        }
        this.elements[i].value = str;
    }
    return this;
};


/**
 * 添加事件
 * @param  {string}   event 事件名
 * @param  {Function} fn    事件触发时执行的函数
 * @return {object}         返回基础库对象
 */
Base.prototype.on = function(event, fn){
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], event, fn);
    }
    return this;
};


/**
 * 移除事件
 * @param  {string}   event 事件名
 * @param  {Function} fn    要移除的事件函数
 * @return {object}         返回基础库对象
 */
Base.prototype.off = function(event, fn){
    for (var i = 0; i < this.elements.length; i++) {
        removeEvent(this.elements[i], event, fn);
    }
    return this;
};


/**
 * 设置点击事件
 * @param  {Function} fn 触发事件时要执行的函数
 * @return {object}      返回基础库对象
 */
Base.prototype.click = function(fn){
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], 'click', fn);
    }
    return this;
};


/**
 * 设置鼠标移入移出事件
 * @param  {Function} over 鼠标移入函数
 * @param  {Function} out  鼠标移出函数
 * @return {object}      返回基础库对象
 */
Base.prototype.hover = function(over, out){
    for (var i = 0; i < this.elements.length; i++) {
        addEvent(this.elements[i], 'mouseover', over);
        addEvent(this.elements[i], 'mouseout', out);
    }
    return this;
};


/**
 * 设置窗口改变事件
 * @param  {Function} fn 窗口改变时执行的函数
 * @return {object}      返回基础库对象
 */
// Base.prototype.resize = function(fn){
//     window.onresize = fn;
//     return this;
// };


/**
 * 设置显示
 * @return {object} 返回基础库对象
 */
Base.prototype.show = function(){
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'block';
    }
    return this;
};


/**
 * 设置隐藏
 * @return {object} 返回基础库对象
 */
Base.prototype.hide = function(){
    for (var i = 0; i < this.elements.length; i++) {
        this.elements[i].style.display = 'none';
    }
    return this;
};


/**
 * 点击切换
 * @param  {function}  切换时执行的函数
 * @return {objecg} 返回基础库对象
 */
Base.prototype.toggle = function(){
    for (var i = 0; i < this.elements.length; i++) {
        toggle (this.elements[i], arguments);
    }
    function toggle (element, args) {
        var count = 0;
        addEvent(element, 'click', function () {
            args[count++ % args.length].call(this);
        });
    }
    return this;
};


/**
 * 设置元素居中
 * @param  {float} _width   可选，元素的宽
 * @param  {float} _height  可选，元素的高
 * @return {object}         返回基础库对象
 */
Base.prototype.center = function(_width, _height){
    for (var i = 0; i < this.elements.length; i++) {
        var width = _width || parseFloat(getStyle(this.elements[i], 'width')) || 0,
            height = _height || parseFloat(getStyle(this.elements[i], 'height')) || 0,
            // top = parseInt((getInner().height - height)/2),
            // left = parseInt((getInner().width - width)/2);
            top = (getInner().height - height)/2,
            left = (getInner().width - width)/2;
        this.elements[i].style.top = top + 'px';
        this.elements[i].style.left = left + 'px';
    }
    return this;
};


/**
 * 锁屏
 * @param  {Function} fn 锁屏后执行的函数
 * @return {object}      返回基础库对象
 */
Base.prototype.lock = function(fn){
    for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i];
        element.style.width = getInner().height + 'px';
        element.style.height = getInner().width + 'px';
        element.style.display = 'block';
    }
    return this;
};


/**
 * 设置动画
 * @param  {object} obj {
 *             {number} type   运动类型，可选，0为匀速，1为缓冲，默认1
 *             {number} speed  缓冲速度，可选，默认6
 *             {string} attr   运动属性，可选，横线x，竖向y，透明度o，其他的属性写CSS名，默认x
 *             {number} step   运行像素，可选，默认10
 *             {number} start  运行起点，可选，默认为CSS的值
 *             {number} target|alter 运行终点，增量或目标点必选其一,默认为原点
 *             {number} t      运行间隔，可选，默认30
 * }
 * @return {object}     返回基础库对象
 */
Base.prototype.animate = function(obj){
    for (var i = 0; i < this.elements.length; i++) {
        var element = this.elements[i],
        flag,residualDistance,start,target,attr,
        mul = obj.mul,
        type = obj.type === 0 ? 'constant' : obj.type == 1 ? 'buffer' : 'buffer',
        speed = obj.speed !== undefined ? obj.speed : 6,
        //attr = obj.attr !== undefined ? (obj.attr == 'x' ? 'left' : obj.attr == 'y' ? 'top' : obj.attr == 'o' ? 'opacity' : obj.attr) : 'left',
        //step = obj.step !== undefined ? obj.step : attr == 'opacity' ? 0.03 : 10,
        //start = obj.start !== undefined ? obj.start : parseFloat(getStyle(element, attr)),
        time = obj.t !== undefined ? obj.t : 16;


        clearInterval(element.timer);
        if (mul === undefined) {
            mul = {};
            attr = obj.attr !== undefined ? (obj.attr == 'x' ? 'left' : obj.attr == 'y' ? 'top' : obj.attr == 'o' ? 'opacity' : obj.attr) : 'left';
            start = obj.start !== undefined ? obj.start : parseFloat(getStyle(element, attr));
            mul[attr] = obj.target !== undefined ? obj.target : obj.alter !== undefined ? start + obj.alter : start;
        }
        element.timer = setInterval(animate, time);
    }
    function animate() {
        flag = true;
        for (var j in mul) {
            attr = j;
            target = mul[j];
            start = parseFloat(getStyle(element, attr));

            if (attr == 'opacity') {
                // if (isNaN(start)) {
                //     start = 100;
                //     element.style.opacity = 1;
                //     element.style.filter = 'alpha(opacity=100)';
                // }
                target = target < 0 ? 0 : target > 1 ? 1 : target;
                residualDistance = target - start;
                if (type == 'buffer') {
                    step = target > start ? Math.ceil(residualDistance / speed*100)/100 : Math.floor(residualDistance / speed*100)/100;
                } else {
                    step = obj.step !== undefined ? obj.step : 0.03;
                    if (start > target) step = -step;
                }
                if (step >= 0 && (start === 1 || residualDistance <= step)) {
                    setTarget();
                } else if (step <= 0 && (start === 0 || residualDistance >= step)) {
                    setTarget();
                } else {
                    element.style.opacity = start + step;
                    element.style.filter = 'alpha(opacity=' + (start + step)*100 +')';
                }

            } else {
                if (isNaN(start)) {
                    //console.log(getStyle(element, attr));
                    throw new Error('start数值获取错误，获取到的值为：'+ getStyle(element, attr));
                }
                target = parseInt(target);
                residualDistance = target - start;
                if (type == 'buffer') {
                    step = target > start ? Math.ceil(residualDistance / speed) : Math.floor(residualDistance / speed);
                } else {
                    step = obj.step !== undefined ? obj.step : 10;
                    if (start > target) step = -step;
                }
                if (step >= 0 && residualDistance <= step) {
                    setTarget();
                } else if (step <= 0 && residualDistance >= step) {
                    setTarget();
                } else {
                    element.style[attr] = start + step + 'px';
                }
            }
            if (target != start) flag = false;
            //console.log(step+'---'+parseFloat(getStyle(element, attr)));
            //console.log(attr + '--' + element.style[attr] + '--' + flag,start,target,residualDistance,step);
            //document.getElementById('bg').innerHTML += step + '<br>';
        }
        if (flag) {
            clearInterval(element.timer);
            if (obj.fn !== undefined) obj.fn();
        }
    }
    // function constantAnimate() {//匀速动画

    // }
    // function bufferAnimate() {//缓冲动画
    //     step = step > 0 ? Math.ceil(residualDistance / speed) : Math.floor(residualDistance / speed);
    // }
    function setTarget() {
        if (attr == 'opacity') {
            element.style.opacity = target;
            element.style.filter = 'alpha(opacity=' + target*100 +')';
        } else {
            element.style[attr] = target + 'px';
        }
    }
    return this;
};


/**
 * 插件入口
 * @param  {string}   name 插件名
 * @param  {Function} fn   插件方法
 */
Base.prototype.extend = function(name, fn){
    Base.prototype[name] = fn;
};













