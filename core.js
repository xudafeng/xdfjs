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
        EMPTY = '';


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
         * �������ͼ��
         */
        __isXDF:function(source,option){

            return  option ==  Object.prototype.toString.call(source);
        },
        isArray :function (source) {

            return X.__isXDF(source,'[object Array]');

        },
        isNodeList :function (source) {

            return X.__isXDF(source,'[object NodeList]');

        },
        isString: function(source){

            return X.__isXDF(source,'[object String]');

        }

    });

})('XDF');

(function(X){
    var doc = document,EMPTY = '',
        trim = X.trim;

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
        __display:function(selector,option){

            var __self = this,
                isArray = X.isArray,
                isString = X.isString,
                isNodeList = X.isNodeList,
                __option = function(i){

                if(option =='hide'){

                    i.style.display = 'none';

                }else if(option =='show'){

                    i.style.display = 'block';

                }else{

                }
            }
            isString(selector) && (selector = __self.query(selector));

            isArray(selector)|| isNodeList (selector) ? (function(selector){

                X.each(selector,function(i){

                    __option(i);

                })

            })(selector): (function(i){

                __option(i);

            })(selector)
        },
        /**
         * ����Ԫ��
         */
        hide:function(selector){

            var __self = this;

            __self.__display(selector,'hide');

        },
        /**
         * ��ʾԪ��
         */
        show:function(selector){
            var __self = this;

            __self.__display(selector,'show');
        },
        toggle:function(selector){
            var __self = this;

            __self.__display(selector);
        }
    });
})(XDF,'DOM');

(function(X){
    var __self = this,
        D = X.DOM,
        isNodeList = X.isNodeList,
        isString = X.isString,
        isArray = X.isArray;

    X.mix(X[arguments[1]] = {},{
        add:function(elm,type,handle){

            if(isArray(elm)){  //ʵ���¼�����

            }else{

            }
            var __add = function(elm){
                if(elm.addEventListener){//ͨ���¼�����
                    elm.addEventListener(type,handle,false);
                } else if (elm.attachEvent){
                    elm.attachEvent('on'+type,handle);  //���ie�ı�������
                } else {
                    elm['on'+ type]  = handle; //�ִ��DOM0�������Ϸ�ʽ
                }
            }

            elm = isString(elm) ? D.query(elm) : elm;

            if(isNodeList(elm)){  //֧������ѭ����
                X.each(elm,function(i){
                    __add(i);
                })
            }else{
                __add(elm);
            }

            return elm;
        },
        on:function(elm,type,handle){    //ֱ�ӵ���add
            this.add.apply(__self,arguments);
            return elm;
        },
        delegate:function(container,type,elm,handle){ //֧���¼�ί�а󶨣���ɴ�����

            var target = isString(container) ? D.query(container) : container;

            this.add([target,elm],type,handle);


        },
        __delegate:function(targets, type, selector, fn, scope) {
            if (batchForType(Event, 'delegate', targets, type, selector, fn, scope)) {
                return targets;
            }
            DOM.query(targets).each(function(target) {
                var preType = type,handler = delegateHandler;
                if (delegateMap[type]) {
                    type = delegateMap[preType].type;
                    handler = delegateMap[preType].handler || handler;
                }
                Event.on(target, type, handler, target, {
                    fn:fn,
                    selector:selector,
                    preType:preType,
                    scope:scope,
                    equals:equals
                });
            });
            return targets;
        }
    });
})(XDF,'Event');

(function(X){ //ajaxģ��
    var __self = this;

    X.mix(X[arguments[1]] = {},{
        add:function(){

        },
        delegate:function(){

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
