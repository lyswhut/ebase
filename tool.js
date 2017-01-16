/**
 * DOM加载
 * @param {Function} fn DOM加载完成后执行的函数
 */
function addDomLoaded (fn) {
    if (document.addEventListener) {
        addEvent(document, 'DOMContentLoaded', function () {
            fn();
        });
    } else {
        var timer = setInterval(function () {
            try {
                document.documentElement.doScroll('left');
                clearInterval(timer);
                fn();
            } catch (e) {}
        }, 0);
    }
    // var timer = setInterval(function () {
    //     if (/loaded|complete/.test(document.readyState)) {
    //         clearTimeout(timer);
    //         fn();
    //     }
    // }, 0);
}

/**
 * 跨浏览器添加事件
 * @param {object}   obj  要添加事件的元素
 * @param {string}   type 要添加的事件名
 * @param {Function} fn   事件触发时执行的函数
 */
function addEvent (obj, type, fn) {
    if (typeof obj.addEventListener != 'undefined') {
        obj.addEventListener(type, fn, false);
    } else {//针对IE添加事件
        if (!obj.events) {//初始化事件绑定函数
            obj.events = {};//初始化存放事件的哈希表（散列表）
            addEvent.ID = 0;//初始化事件计数器
        }
        if (!obj.events[type]) {//第一次绑定该类型的事件时创建该事件的数组
            obj.events[type] = [];//创建一个存放事件处理函数的数组
        } else {//否则遍历注册函数是否重复，如果重复则直接退出
            for (var i in obj.events[type]) {
                if (obj.events[type][i] === fn) return;
            }
        }
        var nowEvent = obj.events[type];
        nowEvent[addEvent.ID++] = fn;//用事件计数器来存储
        obj['on' + type] = function () {//执行事件处理函数
            for (var j in nowEvent) {
                nowEvent[j].call(this, addEvent.fixEvent(window.event));
            }
        };
    }
}

//把IE常用的Event对象匹配的W3C中去
addEvent.fixEvent = function (event) {
    event.preventDefault = function () {//IE阻止默认行为
        this.returnValue = false;
    };
    event.stopPropagation = function () {//IE取消冒泡
        this.cancelBubble = true;
    };
    event.target = event.srcElement;
    return event;
};

/**
 * 跨浏览器移除事件
 * @param  {object}   obj  要移除事件的元素
 * @param  {steing}   type 要移除的事件名
 * @param  {Function} fn   事件触发时执行的函数
 */
function removeEvent (obj, type, fn) {
    if (typeof obj.removeEventListener != 'undefined') {
        obj.removeEventListener(type, fn, false);
    } else {
        var nowEvent = obj.events[type];
        if (nowEvent) {
            for (var i in nowEvent) {
                if (nowEvent[i] === fn) {
                    delete nowEvent[i];
                }
            }
        }
    }
}

// 针对IE添加trim方法
if (String.prototype.trim === undefined) {
    String.prototype.trim = function(){
        return this.replace(/(^\s*)|(\s*$)/g, '');
    };
}

/**
 * 跨浏览器获取Style
 * @param  {element} element   元素节点
 * @param  {string} attr    Style属性名
 * @return {string}         Style属性值
 */
function getStyle (element, attr) {
    return typeof window.getComputedStyle !== 'undefined' ? window.getComputedStyle(element, null)[attr] :
        typeof element.currentStyle !== 'undefined' ? element.currentStyle[attr] : null;
}

/**
 * 判断Class是否存在
 * @param  {element}  element   元素节点
 * @param  {string}  className  要判断的Class
 * @return {Boolean}
 */
function hasClass (element, className) {
    return Boolean(element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)')));
}

/**
 * 添加CSS规则到样式表
 * @param {int} num        样式表的编号
 * @param {string} selectText 选择器
 * @param {string} cssText    样式规则
 * @param {int} position   样式位置
 */
function addRule (num, selectText, cssText, position) {
    var sheet = document.styleSheets[num];
    if (typeof sheet.insertRule != 'undefined') {//W3C
        sheet.insertRule(selectText + '{' + cssText + '}', position);
    } else if (typeof sheet.addRule != 'undefined') {//IE
        sheet.addRule(selectText, cssText, position);
    }
}

/**
 * 从样式表移除CSS规则
 * @param  {int} num  样式表编号
 * @param  {int} index  规则编号
 */
function removeRule (num, index){
    var sheet = document.styleSheets[num];
    if (typeof sheet.deleteRule != 'undefined') {//W3C
        sheet.deleteRule(index);
    } else if (typeof sheet.removeRule != 'undefined') {//IE
        sheet.removeRule(index);
    }
}

/**
 * 跨浏览器获取text
 * @param  {element} element 节点对象
 * @return {string}         获取到的text
 */
function getInnerText (element) {
    return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}

/**
 * 跨浏览器设置text
 * @param {element} element 节点对象
 * @param {string}  text    要设置的text
 */
function setInnerText (element, text) {
    if (typeof element.textContent == 'string') {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}


/**
 * 跨浏览器获取视口大小
 * @return {object} 带有宽、高属性的对象
 */
function getInner () {
    if (typeof window.innerWidth != 'undefined') {
        return {
            width : window.innerWidth,
            height : window.innerHeight
        };
    } else {
        return {
            width : document.documentElement.clientWidth,
            height : document.documentElement.clientHeight
        };
    }
}


/**
 * 获取滚动条位置
 * @return {object} 带有纵向、横向位置的属性对象
 */
function getScroll () {
    return {
        top : document.documentElement.scrollTop || document.body.scrollTop,
        left : document.documentElement.scrollLeft || document.body.scrollLeft
    };
}


/**
 * 判断某个值是否在数组中
 * @param  {array} array 数组
 * @param  {value} value 值
 * @return {boolean}     布尔值
 */
function inArray (array, value) {
    for (var i in array) {
        if (array[i] === value) return true;
    }
    return false;
}




























