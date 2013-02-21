(function (X) {

    var __self = this,
        X = __self[arguments[0]] = {

            /**
             * ������ܹ��ܣ����������ͬ���Ӷ���ֱ�Ӹ���
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


    //�������߷���
    X.mix(X, {
        //�汾��Ϣ
        version:'1.0.0',

        /**
         * ����̨���
         * ������������Ҫ������ʾ
         */
        log:function (msg) {

            !arguments[1] ? console.log(msg) : alert(msg);
        },

        /**
         * ��������
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
         * ȥ��ͷβ�ո�
         */

        trim: function (str) {

            if(typeof str === 'string'){
                return  str.replace(/^\s*|\s*$/g,EMPTY);
            }else{
                return null;
            }


        },
        /**
         * ���ص�ǰʱ���
         */
        now:function(){
            return +new Date();
        },
        /**
         * ��װ�ַ�̽��indexof
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
         * ��ȫ�������ͼ��
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
         * ���ع���
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

                    //��׼�����
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
         * ������ʽ
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
         * ������ȡdomԪ��
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
         * ��ȡ��һ������������Ԫ��
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
         * ����Ԫ��
         */
        hide:function(selector){


            __display(selector,'hide',this.query);

        },
        /**
         * ��ʾԪ��
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

            if(elm.addEventListener){//ͨ���¼�����

                elm.addEventListener(type,handle,false);

            } else if (elm.attachEvent){

                elm.attachEvent('on'+type,handle);  //���ie�ı�������

            } else {

                elm['on'+ type]  = handle; //�ִ��DOM0�������Ϸ�ʽ
            }

        };

    X.mix(X[arguments[1]] = {},{

        add:function(elm,type,handle){

            var elm = isString(elm) ? D.query(elm) : elm;

            if(isNodeList(elm)){  //֧������ѭ����

                X.each(elm,function(i){
                    __add(i,type,handle);
                })

            }else{

                __add(elm,type,handle);
            }

            return elm;
        },

        on:function(elm,type,handle){    //ֱ�ӵ���add

            this.add.apply(__self,arguments);
            return elm;

        },

        delegate:function(container,selector,type,handle){ //֧���¼�ί�а󶨣���ɴ�����

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

            if(isNodeList(container)){  //֧������ѭ����

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

(function(X){ //ajaxģ��
    var __self = this,
        __defaulConfig = {
            method:'POST',//Ĭ��post��ʽ
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
(function(X){  //�ͻ�����Ϣ
    var __self = this;

    X.mix(X[arguments[1]] = {},{
        system:function(){

        },
        browser:function(){

        }
    });
})(XDF,'UA');
