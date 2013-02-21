(function (X) {

    var __self = this,
        X = __self[arguments[0]] = {

            /**
             * 基础框架功能：对象深拷贝，同名子对象直接覆盖
             */
            mix:function (r, s) {
                for(var i in s){
                    r[i] = s[i];
                }
                return r;
            }
        },
        EMPTY = '',
        __isXDF = function(source,option){

            return  option ==  Object.prototype.toString.call(source);
        };


    //基础工具方法
    X.mix(X, {
        //版本信息
        version:'1.0.0',

        /**
         * 控制台输出
         * 参数二控制需要弹窗提示
         */
        log:function (msg) {

            !arguments[1] ? console.log(msg) : alert(msg);
        },

        /**
         * 遍历功能
         */

        each:function (object, fn) {

            if(object){
              for(var i in object){
                  if(i !== 'length' && i !== 'item'){
                      fn.call(__self,object[i]);
                  }
              }
            }
            return object;
        },

        /**
         * 去除头尾空格
         */

        trim: function (str) {

            if(typeof str === 'string'){
                return  str.replace(/^\s*|\s*$/g,EMPTY);
            }else{
                return null;
            }


        },
        /**
         * 返回当前时间戳
         */
        now:function(){
            return +new Date();
        },
        /**
         * 封装字符探针indexof
         */
        indexOf:function (i, objective) {
           if(objective){
               if(objective.indexOf(i) !== -1){
                    return true;
               }else{
                   return false;
               }
           }
        },
        /**
         * 安全数据类型检测
         */

        isArray :function (source) {

            return __isXDF(source,'[object Array]');

        },
        isNodeList :function (source) {

            return __isXDF(source,'[object NodeList]');

        },
        isString: function(source){

            return __isXDF(source,'[object String]');

        },
        isFunction: function(source){

            return __isXDF(source,'[object Function]');

        },
        /**
         * 加载工具
         */
        getScript:function(url, success, charset) {
            if (utils.isCss(url)) {
                return S.getStyle(url, success, charset);
            }
            var doc = document,
                head = doc.head || doc.getElementsByTagName("head")[0],
                node = doc.createElement('script'),
                config = success,
                error,
                timeout,
                timer;

            if (S.isPlainObject(config)) {
                success = config.success;
                error = config.error;
                timeout = config.timeout;
                charset = config.charset;
            }

            function clearTimer() {
                if (timer) {
                    timer.cancel();
                    timer = undefined;
                }
            }


            node.src = url;
            node.async = true;
            if (charset) {
                node.charset = charset;
            }
            if (success || error) {
                scriptOnload(node, function() {
                    clearTimer();
                    S.isFunction(success) && success.call(node);
                });

                if (S.isFunction(error)) {

                    //标准浏览器
                    if (doc.addEventListener) {
                        node.addEventListener("error", function() {
                            clearTimer();
                            error.call(node);
                        }, false);
                    }

                    timer = S.later(function() {
                        timer = undefined;
                        error();
                    }, (timeout || this.Config.timeout) * MILLISECONDS_OF_SECOND);
                }
            }
            head.insertBefore(node, head.firstChild);
            return node;
        },
        /**
         * 加载样式
         */
        getStyle:function(url, success, charset) {
            var doc = document,
                head = utils.docHead(),
                node = doc.createElement('link'),
                config = success;

            if (S.isPlainObject(config)) {
                success = config.success;
                charset = config.charset;
            }

            node.href = url;
            node.rel = 'stylesheet';

            if (charset) {
                node.charset = charset;
            }

            if (success) {
                utils.scriptOnload(node, success);
            }
            head.appendChild(node);
            return node;

        }

    });

})('XDF');

(function(X){
    var doc = document,EMPTY = '',
        trim = X.trim,
        isArray = X.isArray,
        isString = X.isString,
        isNodeList = X.isNodeList,
        __display = function(selector,option,queryHandle){

            var __option = function(i){

                    if(option =='hide'){

                        i.style.display = 'none';

                    }else if(option =='show'){

                        i.style.display = 'block';

                    }else{

                    }
                }
            isString(selector) && (selector = queryHandle(selector));

            isArray(selector)|| isNodeList (selector) ? X.each(selector,function(i){

                    __option(i);

                }): __option(selector);

        };

    X.mix(X[arguments[1]] = {},{
        /**
         * 批量获取dom元素
         */
        query:function(selector){

            var __selector = typeof (selector) === 'string' ?  selector :  selector.toString();

            __selector = trim(__selector);

            if(X.indexOf('#',__selector)){

                return doc.getElementById(__selector.replace('#',EMPTY)) || null;

            } else if(X.indexOf('.',__selector)){

                return doc.getElementsByClassName(__selector.replace('.',EMPTY)) || null;

            }else{

                return doc.getElementsByTagName(__selector) || null;

            }

        },
        /**
         * 获取第一个符合条件的元素
         */
        get:function(selector){

            var __selector =  this.query(selector),
                isArray = X.isArray,
                isNodeList = X.isNodeList;

           if(__selector){

               if(isArray(__selector)|| isNodeList(__selector)){

                   return this.query(selector)[0];

               }else{

                   return this.query(selector);

               }

           }else{

               return null;
           }

        },
        data:function(){

        },

        /**
         * 隐藏元素
         */
        hide:function(selector){


            __display(selector,'hide',this.query);

        },
        /**
         * 显示元素
         */
        show:function(selector){

            __display(selector,'show',this.query);

        },
        toggle:function(selector){

            __display(selector,'',this.query);

        }
    });
})(XDF,'DOM');

(function(X){
    var __self = this,
        D = X.DOM,
        W = window,
        isNodeList = X.isNodeList,
        isString = X.isString,

        __add = function(elm,type,handle){

            if(elm.addEventListener){//通用事件捆绑

                elm.addEventListener(type,handle,false);

            } else if (elm.attachEvent){

                elm.attachEvent('on'+type,handle);  //针对ie的保险捆绑

            } else {

                elm['on'+ type]  = handle; //现存的DOM0基本古老方式
            }

        };

    X.mix(X[arguments[1]] = {},{

        add:function(elm,type,handle){

            var elm = isString(elm) ? D.query(elm) : elm;

            if(isNodeList(elm)){  //支持批量循环绑定

                X.each(elm,function(i){
                    __add(i,type,handle);
                })

            }else{

                __add(elm,type,handle);
            }

            return elm;
        },

        on:function(elm,type,handle){    //直接调用add

            this.add.apply(__self,arguments);
            return elm;

        },

        delegate:function(container,selector,type,handle){ //支持事件委托绑定，完成代理功能

            var container = isString(container) ? D.query(container) : container;

            var __handle = function(e) {

                function getEventTarget(e) {
                    e = e || W.event;
                    return e.target || e.srcElement;
                }

                if(getEventTarget(e).tagName.toLowerCase() === selector) {

                    handle.call(__self,e);

                }
            }

            if(isNodeList(container)){  //支持批量循环绑定

                X.each(container,function(i){
                    __add(i,type,__handle);
                })

            }else{
                __add(container,type,__handle);
            }

            return container;

        }
    });
})(XDF,'Event');

(function(X){ //ajax模块
    var __self = this,
        __defaulConfig = {
            method:'POST',//默认post方式
            url:'/',
            async:false,
            success:function(e){
                alert(e);
            }
        };

    X.mix(X[arguments[1]] = {},{

        io:function(__config){
           var method = __config['method']||__defaulConfig['method'],
               url =  __config['url']||__defaulConfig['url'],
               successHandle = __config['success']||__defaulConfig['success'],
               async = __config['async']||__defaulConfig['async'],
               xmlHttp;

            if (window.XMLHttpRequest){
                xmlHttp=new XMLHttpRequest();
            }
            else{           //for IE6, IE5
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlHttp.onreadystatechange=function(){
                if (xmlHttp.readyState==4 && xmlHttp.status==200){
                    successHandle(xmlHttp.responseText);
                }
            }
            xmlHttp.open(method,url+'?t='+ X.now(),async);
            xmlHttp.send();

        },
        parse:function(){

        },
        toString :function(){

        }
    });

})(XDF,'Ajax');
(function(X){  //客户端信息
    var __self = this;

    X.mix(X[arguments[1]] = {},{
        system:function(){

        },
        browser:function(){

        }
    });
})(XDF,'UA');
