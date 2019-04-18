/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 * 管理类
 */
/**
 * 初始化管理类
 * routeInfo 路由器页面配置信息
 * */
var GM_manager=(function(){
    function GM_manager(){

    }
    GM_manager.prototype={
        init:function(baseRouterList){ /*初始化*/
            this.refreshRootScope(baseRouterList);
        },
        refreshRootScope:function (list) {
            this.initRootScope(list);/*基础数据配置*/
            this.addHeaderCtrl();/*顶部导航栏 ctrl*/
            this.addLeftMenuCtrl();/*左侧菜单栏 ctrl*/
            this.addBottomMenuCtrl();/*底部功能按钮栏 ctrl 1.6.6*/

            this.addTopMenuCtrl();/*顶部切换游戏功能*/
            this.addBaseDirective();/*基础控件*/
            this.addBaseModule();/*基础功能模块*/
            this.addBasePageCtrl();/*基础页面 ctrl父类*/
            this.addStatisticCtrl();/*基础统计ctrl*/
            this.addBaseService();/*基础通信*/
        },

        initRootScope:function(baseRouterList){ /*初始化全局参数*/
            ///*全局参数*/
            app.run(['$rootScope','$location','myPopUp',function(scope,location,myPopUp){
                /*配置信息*/
                scope.configInfo;
                scope.money_name;/*货币名称*/
                // scope.switch="X9";
                /*用户信息*/
                scope._isLogin=false;
                scope.userInfo={
                    userId:1,/*对应的玩家ID*/
                    init_id:1,/*真ID,从10000*/
                    clubInfo:{},//俱乐部ID
                    IDLevel:0//等级身份  8究管  7超管  6大区代理  5代理
                };
                /*有权限访问的页面*/
                scope.pageRouterList=baseRouterList;
                /*判断设备类型*/
                var ua = navigator.userAgent;
                var isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
                var isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isAndroid) {
                    scope.equipmentType="Android";myPopUp.trace("设备类型 移动端 [安卓]");
                    scope.equipmentName="mobile";
                }else if (isiOS) {
                    scope.equipmentType="ios";myPopUp.trace("设备类型 移动端 [iphone]");
                    scope.equipmentName="mobile";
                }else{
                    scope.equipmentType="pc";myPopUp.trace("设备类型 pc端 ");
                    scope.equipmentName="pc";
                }
                /* 监听路由的状态变化 */
                scope.locationState_list=[];
                /*最后访问的页面*/
                scope.lastPagePath="";
                scope.$on('$locationChangeStart', function() {
                    /*不同权限限制不同页面*/
                    var pageName=location.path().split("/")[1];
                    if(pageName&&scope._isLogin&&!scope.pageRouterList[pageName]){
                        location.path("/404");
                    }
                });
                scope.$on('$locationChangeSuccess', function() {
                    /*页面跳转记录*/
                    scope.locationState_list.push(location.path());
                    myPopUp.trace("页面跳转》》"+location.path());
                });
                /*获取菜单信息*/
                scope.getMenuInfo=function(name){
                    return scope.configInfo.menu_info[name];
                };
                /*tooltip 提示动画*/
                if(scope.equipmentType=="pc"){
                    $(function () {
                        $("[data-toggle='tooltip']").tooltip();
                    });
                }
            }]);
        },
        addHeaderCtrl:function(){/*顶部导航栏*/
            app.controller("headerCtrl",["$scope","$rootScope",'$location',"myCache","setCenterLayout",
                function(scope,rootScope,location,myCache,setCenterLayout){
                    /*logo*/
                    scope.logoIcon="";
                    scope.title="";
                    scope.userName="";
                    scope.userHead="";
                    /*侦听菜单设置事件*/
                    rootScope.$on("setHeader",function(event,data){
                        scope.title=rootScope.configInfo.login_title;
                        scope.logoIcon=rootScope.configInfo.header_logo;
                        if(data.userHead.length<10)scope.userHead="image/head/"+data.userHead+".png";
                        else scope.userHead=data.userHead;
                        scope.userName=decodeURIComponent(data.userName);
                    });
                    /*设置菜单隐藏或者显示*/
                    scope.setMenuDiv=setCenterLayout.setMenu;
                    /*用户信息*/
                    scope.userInfo=function(){
                        location.path("/console");
                    };
                    /*退出登录*/
                    scope.logOut=function(){
                        /*消除缓存*/
                        myCache.clearLoginInfo();
                        /*去登陆页面*/
                        location.path("/login");
                    }
                }
            ]);
        },
        addLeftMenuCtrl:function(){ /*右侧菜单栏*/
            app.controller("menuCtrl",["$scope",'$rootScope','myPopUp',"myRouter","$location","setCenterLayout","myCache",
                function(scope,rootScope,myPopUp,myRouter,location,setCenterLayout,myCache){
                    scope.menuList=[];
                    /*事件*/
                    /*点击菜单二级目录*/
                    scope.clickMenu=function(url){
                        if(url)location.path(url);
                    };
                    scope.clickOneMenu=function(name){
                        if(name=="/console")location.path("/console");
                    };
                    /*侦听菜单设置事件*/
                    rootScope.$on("setLeftMenu",function(event,data){
                        var menuListInfo=rootScope.configInfo.menu_info;
                        scope.menuList=[];
                        var i,name, s,b;
                        for(i in data){
                            name=data[i].name;
                            var info=getInfo(name);/*一级列表*/
                            info.rightHide=true;
                            info.id="menu_"+i;

                            if(info){
                                info.list=[];
                                for(s in data[i].list){/*二级列表*/
                                    b=getInfo(name+"_"+data[i].list[s]);
                                    if(b)info.list.push(b);
                                }
                                if(info.list.length)info.rightHide=false;
                                scope.menuList.push(info);
                            }
                        }
                        /*获取列表详情*/
                        function getInfo(name){
                            var info={};
                            var data=menuListInfo[name];
                            var routerInfo=myRouter.name(name);
                            if(data){
                                info.name=data.name;
                                info.path="/404";/*默认错误页面*/
                                if(data.icon)info.icon=data.icon;
                                if(data.tips) info.tips=data.tips;
                                if(routerInfo) info.path="/"+routerInfo.name;

                                return info;
                            }else{
                                myPopUp.trace("没有该菜单选项"+name,0);
                            }
                            return null;
                        }
                    });
                    /*退出登录*/
                    scope.logOut=function(){
                        /*消除缓存*/
                        myCache.clearLoginInfo();
                        /*去登陆页面*/
                        location.path("/login");
                    }
                    /*tooltip 提示动画*/
                    scope.renderFinish = function(){
                        if(rootScope.equipmentType=="pc")
                        $("[data-toggle='menu_tooltip']").tooltip();
                    }
                }
            ]);
        },
        addBottomMenuCtrl:function () {
            app.controller("bottomMenuCtrl",["$scope",'$rootScope','myPopUp',"myRouter","$location","setCenterLayout","myCache","baseService","baseModule",
                function(scope,rootScope,myPopUp,myRouter,location,setCenterLayout,myCache,baseService,baseModule){
                    scope.menuList=[];
                    /*侦听菜单设置事件*/
                    rootScope.$on("setBottomMenu",function(event,list){
                        var cla="col-md-3 col-xs-3";
                        if(list.length==3)cla="col-md-4 col-xs-4";
                        for(var i in list){
                            var data=rootScope.configInfo.menu_info[list[i]].bottomMenu;
                            if(data){
                                scope.menuList.push({
                                    icon:data.icon,
                                    name:list[i],
                                    tips:false,//小红点提示
                                    title:data.name,
                                    cla:cla,
                                    color:"bottomMenu_color_out"
                                });
                            }else{
                                myPopUp.trace("没有改选项或者该选项不属于底部功能按钮组");
                            }
                        }
                        /*x4俱乐部小红点提示-----vType，线上版本*/
                        if(rootScope.configInfo.statistic_pro_name=="wsw_X1"||rootScope.configInfo.statistic_pro_name=="wsw_X6"){
                            if(rootScope.equipmentName=="mobile"){
                                baseService.getTipsData(function(data){
                                    for(var i in scope.menuList){
                                        if(scope.menuList[i].name=="jerry_index"){
                                            scope.menuList[i].tips=data.haveAction;
                                        }
                                    }
                                });
                            }
                        }
                    });
                    /*点击*/
                    scope.clickMenu=function (name) {
                        /*变色*/
                        for(var i in scope.menuList){
                            if(scope.menuList[i].name==name){
                                scope.menuList[i].color="bottomMenu_color_over";
                            }else{
                                scope.menuList[i].color="bottomMenu_color_out";
                            }
                        }
                        /*跳转*/
                        // alert(name);
                        location.path("/"+name);
                    }
                }
            ]);
        },


        addTopMenuCtrl:function () {
            var is_this=this;
            app.controller("topMenuCtrl",["$scope",'$rootScope',"myCache","$state",
                function(scope,rootScope,myCache,state){
                    if(rootScope.configInfo.statistic_pro_name=="X9_1"||rootScope.configInfo.statistic_pro_name=="X9_13"){
                        /*侦听菜单设置事件*/
                        rootScope.$on("setTopMenu",function(event,list){
                            scope.appList=rootScope.configInfo.appList;/*不同项目配置*/
                        });
                        if(rootScope.equipmentName=="mobile"){
                            scope.show=true;
                            scope.cut_app=function (id) {
                                myCache.setInfo("current_app_id",id);
                                rootScope._isLogin=false;
                                state.reload();
                            }
                        }else{
                            scope.show=false;
                        }
                    }

                }
            ]);
        },

        addBaseDirective:function(){
            /*翻页控件*/
            app.directive("pageingToolNav",["$rootScope",function(rootScope){
                return{
                    restrict:"E",
                    templateUrl:'js/module/paging_btn_tool.html',
                    replace:false,
                    link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/
                        if(!scope.current_page)scope.current_page=1;/*当前页*/
                        if(!scope.page_num)scope.page_num=30;/*每一页显示数量*/
                        if(!scope.max_page)scope.max_page=1;
                        if(!scope.pageLastPageTips)scope.pageLastPageTips="我是有底线的呦";
                        scope.pageTips="正在加载中...";
                        scope.pageloading=false;
                        /*跳转页面*/
                        scope.skipPage=function(id){
                            var page=scope.current_page;
                            switch(id){
                                case 1:
                                    page=1;
                                    break;
                                case 2:
                                    page--;
                                    break;
                                case 3:
                                    page++;
                                    break;
                                default:
                                    page=scope.max_page;
                                    break
                            }
                            /*不重复加载同一页*/
                            if(page<=0)page=1;
                            else if(page>scope.max_page)page=scope.max_page;
                            if(page!=scope.current_page&&scope.max_page!=0){
                                scope.current_page=page;
                                /*显示当前页信息*/
                                if(scope.paging){
                                    scope.pageloading=true;
                                    scope.paging();
                                }
                            }
                        }
                        /*移动端滑动加载*/
                        rootScope.scrollMoveBottom=function () {
                            if(!scope.pageloading)
                            scope.skipPage(3);
                        }
                    }
                }
            }]);
            /*控件 标题 和搜索*/
            app.directive("routerNav",["$rootScope","myPopUp","$stateParams",function(rootScope,myPopUp,stateParams){
                return{
                    restrict:"E",
                    templateUrl:'js/module/router_nav_'+rootScope.equipmentName+'.html',
                    replace:false,
                    scope:false,/*继承父级*/
                    link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/
                        scope.scopeStr="";/*搜索内容 文本*/
                        if(!scope.nav_input_type)scope.nav_input_type="input";/*输入类型*/
                        if(!scope.searchPlaceholder)scope.searchPlaceholder="键入关键字搜索";
                        if(!scope.nav_input_tips)scope.nav_input_tips="";//搜索结果提示
                        scope.searchBtnClass="hide";
                        scope.myStyle="margin-top: 0px;";
                        /*搜索内容*/
                        scope.search=function(e){
                            if(e){
                                var keycode = window.event?e.keyCode:e.which;
                                if(keycode!=13) return;
                            }
                            scope.inputBlur();
                            if(scope.scopeStr){
                                if(scope.startSearch)scope.startSearch(scope.scopeStr);
                                else myPopUp.supernatant("该模块暂不支持搜索");
                            }else{
                                myPopUp.supernatant("搜索内容为空");
                            }

                        }
                        /*文本获取焦点*/
                        scope.inputFocus=function () {
                            scope.searchBtnClass="show";
                            scope.myStyle="margin-top: 30px;";
                        }
                        /*收取焦點*/
                        scope.inputBlur=function () {
                            scope.searchBtnClass="hide";
                            scope.myStyle="margin-top: 0px;";
                        }
                        /*tooltip 提示动画*/
                        if(scope.tooltip){
                            $("[data-toggle='menu_tooltip']").tooltip({title:scope.tooltip});
                            $("[data-toggle='menu_tooltip']").tooltip('show');
                            setTimeout(function () {
                                $("[data-toggle='menu_tooltip']").tooltip('destroy');
                            },1900);
                        }
                    }
                }
            }]);
            /*弹出框*/
            app.directive("myAlert",[function(){
                return{
                    restrict:"E",
                    templateUrl:'js/module/my_alert.html',
                    replace:false,
                    scope:false,/*继承父级*/
                    link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/
                        el=$(el[0]);
                        var back;
                        scope.myAlertSure=function(){           //确定
                            if(back)back();
                            back=null;
                            scope.myAlertCancel();
                        }
                        scope.myAlertCancel=function(){         //取消
                            var div1=el.find(">div");
                            var div2=el.find(">div>div");
                            div2.removeClass("active").addClass("out");
                            setTimeout(function(){
                                div1.hide();
                            },500);
                        }
                        scope.myAlertAdd=function(str,title,backFun){
                            var div1=el.find(">div");
                            var div2=el.find(">div>div");
                            $("#myAlert_hd").html(title);
                            $("#myAlert_bd").html(str);
                            div2.removeClass("out").addClass("active");
                            div1.show();
                            div2.css("top",window.innerHeight/2-div2.height()/2);
                            back=backFun;
                        }
                    }
                }
            }]);
            /*日期控件*/
            app.directive("datetimePicker",[function(){
                return{
                    restrict:"E",
                    templateUrl:'js/module/datetimepicker.html',
                    replace:false,
                    link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/
                        if(scope.startDate){
                            var startDiv=$(el[0]).find("input[name=start]");
                            var overDiv=$(el[0]).find("input[name=over]");
                            startDiv.datetimepicker({
                                locale: 'zh-tw',//显示中文
                                dayViewHeaderFormat:"YYYY MMMM",
                                format:"YYYY-MM-DD",
                                defaultDate:scope.startDate
                            });
                            overDiv.datetimepicker({
                                locale: 'zh-tw',//显示中文
                                dayViewHeaderFormat:"YYYY MMMM",
                                format:"YYYY-MM-DD",
                                defaultDate:scope.overDate
                            });
                            startDiv.on("dp.change", function (e) {
                                overDiv.data("DateTimePicker").minDate(e.date);
                                dateChange();
                            });
                            overDiv.on("dp.change", function (e) {
                                startDiv.data("DateTimePicker").maxDate(e.date);
                                dateChange();
                            });
                            /*时间变化*/
                            function dateChange() {
                                scope.startDate=startDiv.data().date;
                                scope.overDate=overDiv.data().date;
                                if(scope.chooseDate)scope.chooseDate();
                            }
                        }

                    }
                }
            }]);
            /*统计控件1*/
            app.directive("statisticalBroken",[function(){
                return{
                    restrict:"EA",
                    templateUrl:'js/module/statistical_broken.html',
                    replace:false,
                    link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/
                        /*填充数据*/
                        scope.setData=function () {

                        }
                    }
                }
            }]);
            /*标签渲染完毕的完成指令*/
            app.directive('onReanderFinsh',[function(){
                return {
                    restrict:'A',
                    replace:false,
                    link:function (scope,el,attrs,controller) {
                        var fun = scope.$eval(attrs.onReanderFinsh);//计算表达式的值
                        if(fun && typeof(fun)=='function'){
                            setTimeout(function () {
                                fun($(el[0]));
                                fun=null;
                            },100);

                        }
                    }
                };
            }]);
        },
        addBaseModule:function(){/*添加基础组件*/
            app.factory("baseModule",["$rootScope","$location","$state","myPopUp","setCenterLayout",function(rootScope,location,state,myPopUp,setCenterLayout){
                var loadingDiv=$("#loadingDiv");
                var loading_imgDiv=$("#loading_imgDiv");
                var loading_tips=$("#loading_tips");
                return{
                    judgeLogin:function(back){/*判断用户是否登陆*/
                        rootScope.lastPagePath=location.path(); /*记录*/
                        /*跳转登录页面*/
                        if(!rootScope._isLogin){
                            location.path("/login");
                        }else{
                            /*设置布局*/
                            setCenterLayout.center();
                            back();
                        }
                    },
                    skipPage:function(name,data){/*统一跳转页面*/

                        state.go(name,data);
                    },
                    dataTips:function(_is,tips){ /*数据加载提示*/
                        if(_is){
                            loadingDiv.show();
                            loading_imgDiv.animate({
                                "margin-top":window.innerHeight/2.3-loading_imgDiv.outerHeight()/2,
                            },300);
                            if(!tips)tips="玩命加载中...";
                            loading_tips.html(tips);
                        }
                        else loadingDiv.hide();
                    },
                    judge_param_null:function(){/*判断序列参数是否为空*/
                        for(var i in arguments){
                            if(!arguments[i][0]){
                                myPopUp.supernatant("["+arguments[i][1]+"] 不能为空");
                                return false;
                            }
                        }
                        return true;
                    },
                    getTime:function(timestamp,param){/*判断序列参数是否为空*/
                        if(!param)param="YYYY-MM-DD HH:mm:ss";
                        if(String(timestamp).length>10)timestamp=timestamp.substr(0,10);
                        return moment(new Date(timestamp*1000)).format(param);
                    },
                    scroll:function (_isUpdate) { /*设置页面平滑滚动*/
                        if(rootScope.equipmentName=="mobile"){
                            if(rootScope.userInfo.IDLevel<=6){
                                $("#routeDiv").css({
                                    height:window.innerHeight,
                                    paddingBottom:"5rem"
                                });
                            }else{
                                $("#routeDiv").css({
                                    height:window.innerHeight-55,
                                    paddingBottom:0
                                });
                            }

                            if(!_isUpdate){
                                if(rootScope.scroll)rootScope.scroll.destroy();
                                rootScope.scroll= new JRoll(document.getElementById("routeDiv"));
                                rootScope.scroll.on("scrollEnd", function() {
                                    if (Math.abs(this.y)>=Math.abs(this.maxScrollY)&&rootScope.scrollMoveBottom) {
                                        rootScope.scrollMoveBottom();
                                    }
                                });
                            }else if(rootScope.scroll){
                                rootScope.scroll.refresh();
                            }

                        }
                    }
                }
            }]);
            /*调整整体布局*/
            app.factory("setCenterLayout",["$rootScope",function(rootScope){
                var _is=true,
                    headerDiv=$("#headerDiv"),
                    menuDiv=$("#menuDiv"),
                    w= 0,
                    routeDiv,
                    bottomMenuDiv=$("#bottomMenuDiv"),
                    topMenuDiv=$("#topMenuDiv");
                var W=menuDiv.width(),h;
                return{
                    login:function(){/*登录状态布局*/
                        _is=true;
                        headerDiv.css("display","none");
                        menuDiv.css("display","none");
                        bottomMenuDiv.css("display","none");
                        topMenuDiv.css("display","none");
                        routeDiv=$("#routeDiv");
                        routeDiv.css({"padding-left": 0,"padding-bottom": 0,"overflow-y": "hidden"});
                        routeDiv.find(">div").css("padding","0 0");
                    },center:function(){/*进入界面布局*/
                        _is=true;
                        //样式
                        menuDiv.addClass("menuDiv_pc");
                        menuDiv.css("display","inherit");
                        menuDiv.css("height",window.innerHeight);
                        routeDiv=$("#routeDiv");
                        var obj={"padding-bottom": 50,"overflow-y": "scroll","overflow-x": "hidden"};
                        if(rootScope.equipmentType=="pc"){
                            obj["padding-left"]=225;
                            routeDiv.find(">div").css("padding","0 20px");
                            headerDiv.addClass("headerDiv");
                            headerDiv.css("display","inherit");
                        }else{
                            if(rootScope.userInfo.IDLevel>6){//超管能看到右侧菜单
                                headerDiv.addClass("headerDiv");
                                headerDiv.css("display","inherit");
                            }else{//大区一下只能看到底部按钮菜单
                                bottomMenuDiv.css("display","inherit");
                                topMenuDiv.css("display","inherit");
                            }
                            menuDiv.css({"margin-left":-window.innerWidth});
                            _is=false;
                            menuDiv.unbind("click");
                            menuDiv.on("click",function(e){
                                if(e.offsetX>window.innerWidth*.6){
                                    this.setMenu(false);
                                }
                            }.bind(this));
                            routeDiv.find(">div").css("padding","0 10px");
                        }
                        routeDiv.css(obj);

                    },setMenu:function(_is1){/*设置右侧菜单状态*/
                        if(_is1!=null) _is=_is1;
                        else _is=!_is;
                        W=menuDiv.width();
                        if(!_is){
                            w=-W;
                            h=0;
                        }else{
                            w=0;
                            h=W;
                        }
                        if(rootScope.equipmentType!="pc"){
                            setW(w,0);
                        }else{
                            setW(w,h);
                        }
                    }
                }
                function setW(w,h){
                    menuDiv.animate({"margin-left":w},300);
                    routeDiv.animate({"padding-left":h},300);
                }

            }]);
            /*获取缓存信息*/
            app.factory("myCache",['myPopUp',"$rootScope",function(myPopUp,rootScope){
                var loginName="token";
                return {
                    getInfo:function(key,_isJson){
                        var str=document.cookie;
                        var arr=str.split("; ");
                        var nameStr=null;
                        for(var i=0;i<arr.length;i++){
                            var brr=String(arr[i]).split("=");
                            if(brr[0]==key){
                                nameStr=decodeURI(brr[1]);
                                break;
                            }
                        }
                        if(_isJson) nameStr=JSON.parse(nameStr);
                        myPopUp.trace("获取缓存数据"+key+":");
                        myPopUp.trace(nameStr);
                        return nameStr;
                    },
                    //加入一个缓存数据
                    /**
                     * @param name  属性名
                     * @param value 对应的值 json 最好
                     * @param expiresDay 过期时间 天为单位  选填  1
                     * @param path  对应路径               选填 是从从域名下开始的地址绝对地址     不是当前文件地址相对地址
                     * @param domain  对应主机名           选填 .google.com
                     */
                    setInfo:function(name,value,expiresDay,path,domain){
                        if(typeof value=="object"){
                            value=JSON.stringify(value);
                        }
                        value=encodeURI(value);
                        var cookieStr=name+"="+value;//基础属性值
                        if(expiresDay!=null&&expiresDay>0){
                            var date=new Date();
                            date.setTime(date.getTime()+expiresDay*24*60*3600);
                            cookieStr+=";expires="+date.toGMTString();//设置过期时间
                        }
                        if(path!=null){
                            cookieStr+=";path="+path;//设置路径
                        }
                        if(domain!=null){
                            cookieStr+=";domain="+domain;//设置主机
                        }
                        myPopUp.trace("设置缓存数据"+name+":");
                        myPopUp.trace(value);
                        document.cookie=cookieStr;
                    },
                    removeInfo:function(key,path){
                        var date=new Date();
                        date.setTime(date.getTime()-10000);
                        key=key+"=ah; expires="+date.toGMTString();
                        if(path!=null){
                            key+=";path="+path;//设置路径
                        }
                        document.cookie=key;
                    },/*登陆信息操作*/
                    clearLoginInfo:function(){
                        rootScope._isLogin=false;
                        window["AH_param"]=null;
                        this.removeInfo(loginName);
                    },
                    addLoginInfo:function(){
                        return this.getInfo(loginName);
                    },
                    setLoginInfo:function(){
                        this.setInfo(loginName,rootScope.userInfo.token);
                    }
                }
            }]);
            /*弹框提示*/
            app.factory("myPopUp",["$rootScope",function(rootScope){
                return {
                    alert:function(str,sureFun,title){/*提示类型1*/
                        if(!title)title="提示";
                        rootScope.myAlertAdd(str,title,sureFun);
                    },
                    supernatant:function(str,time){/*浮层提示*/
                        var div=$("<div class='supernatant_div my_font3 user-select-none'></div>");
                        $("body").append(div);
                        div.html(str);
                        div.css("left",window.innerWidth/2-div.outerWidth()/2);
                        div.css("top",window.innerHeight/2-div.height()/2);
                        setTimeout(function(){
                            div.animate({top:window.innerHeight/2-80,opacity:0},600,function(){
                                div.remove();
                            });
                        },time||1300);

                    },
                    error_alert:function(){/*错误提示*/

                    },
                    trace:function(a,b){/*打印日志*/
                        if(rootScope.configInfo&&window["ah_tester"]){
                            console.log(a);
                            /**
                             * 填充日志内容
                             * str 内容 必须是字符串
                             * type 类型（0表示错误类型 分类用到了）
                             * userId  用户标识id (总控制台查询用到)
                             * */
                            window["ah_tester"].addLog(a,b);
                        }
                    }
                }
            }]);
            /*统计信息接口*/
            app.factory("statisticService",["baseService","$rootScope",function(baseService,rootScope){
                var url="/HomeGM/Console/Statistics_data/";
                return {
                    getInfo:function(proName,OpeName,s_type,s_date,e_date,children,backFun,id){
                        if(!children)children=null;
                        baseService.GM(url,{userId:rootScope.userInfo.userId,children:children,proName:proName,OpeName:OpeName,type:s_type,s_date:s_date,e_date:e_date},function (data) {
                            backFun(data,id);
                        },false);
                    }
                }
            }]);
        },
        addBasePageCtrl:function(){/*基础的页面控制层*/
            app.controller("basePageCtrl",["$scope",'$rootScope',"myCache","$stateParams","baseModule",
                function(scope,rootScope,myCache,stateParams,baseModule){
                    if(!rootScope._isLogin)return;
                    /*--------------基础信息-----------------------*/
                    scope.nav_info;/*导航栏信息*/
                    scope.seekMyCacheName="info";/*搜索内容缓存关键字*/
                    scope.money_name=rootScope.money_name;/*货币名称*/
                    /*--------------基础方法-----------------------*/
                    /*页面滑动消除*/
                    rootScope.scrollMoveBottom=null;

                    /*设置搜索内容*/
                    scope.setSeekKeyword=function(str){
                        if(!str&&stateParams["seek"])str=stateParams["seek"];
                        if(str!=null){
                            scope.seek=str;
                            if(scope.seek&&scope.seekMyCacheName)myCache.setInfo(scope.seekMyCacheName,scope.seek);/*注入新的缓存*/
                        } else{
                            /*缓存里边的*/
                            scope.seek=myCache.getInfo(scope.seekMyCacheName);
                        }
                    }; //清理关键字缓存
                    scope.clearSeekKeyWord=function () {
                        scope.seek=null;
                        myCache.removeInfo(scope.seekMyCacheName);/*清理缓存*/
                    }
                    /*设置当前页面标题*/
                    var watch = scope.$watch('nav_info.name', function(newValue, oldValue){
                        if(newValue){
                            $("title").html(rootScope.configInfo.subhead_name+"-"+newValue);
                            watch();
                        }
                    });
                    //移动端页面平滑滚动
                    scope.updateScroll=function (currentPage) {
                        var _isUpdate=(currentPage==1)?false:true;
                        setTimeout(function () {
                            baseModule.scroll(_isUpdate);
                        },100);
                    }
                    //数据加载完毕
                    scope.loadingInfoOk=function (data) {
                        scope.max_page=data.maxPage;
                        //内容搜索提示
                        if(data.maxNum)scope.nav_input_tips="共"+data.maxNum+"条记录";
                        /*-------------------移动端策略--------------------------*/
                        if(rootScope.equipmentName=="mobile"){
                            if(!scope.list||scope.current_page==1)scope.list=[];
                            for(var i in data.list){
                                scope.list.push(data.list[i]);
                            }
                            /*移动端 滑动到底部提示*/
                            if(scope.current_page==scope.max_page){
                                scope.pageTips=scope.pageLastPageTips;
                            }else if(scope.max_page==0){
                                scope.pageTips="*>.<*! 运气不佳没有查到任何信息";
                            }
                            /*启动或者刷新滑动组件*/
                            scope.updateScroll(scope.current_page);
                        }else{
                            scope.list=data.list;

                        }
                        scope.pageloading=false;
                    }
                    //查询某个用户详情页面
                    scope.getPlayerInfo=function (id) {
                        if(rootScope.userInfo.IDLevel>=6&&id)baseModule.skipPage('player_userInfo',{seek: id});
                    }
                    //给某个用户充值页面
                    scope.playerPay=function (id) {
                        if(id)baseModule.skipPage('player_pay',{seek: id});
                    }
                    //查看某个代理详情页面
                    scope.getAgencyInfo=function (id) {
                        if(rootScope.userInfo.IDLevel>=6&&id)baseModule.skipPage('agency_userInfo',{seek: id});
                    }
                    //给某个代理充值页面
                    scope.agencyPay=function (id) {
                        if(rootScope.userInfo.IDLevel>=5)baseModule.skipPage('agency_pay',{seek: id});
                    }
                }
            ]);
        },
        addStatisticCtrl:function () { //基础统计组件
            /*统计基础*/
            app.controller('statisticsCtrl',[
                "$scope","$rootScope","$controller","baseModule","statisticService",
                function(scope,rootScope,parentCtrl,baseModule,service){
                    if(!rootScope._isLogin)return;
                    /*-------------继承--------------*/
                    parentCtrl('basePageCtrl', {$scope: scope});
                    scope.titleName="统计";/*标题*/
                    scope._canvasName="canvas";/*canvas*/
                    scope._divName="div";/*div*/
                    scope.myNewChart;/*统计图类*/
                    scope.statisProName=rootScope.configInfo.statistic_pro_name;/*统计项目名,*/
                    scope.operation_list=rootScope.configInfo.statistic.operation_list;/*统计id列表*/
                    scope.color_list=rootScope.configInfo.statistic.color_list;/*颜色列表*/
                    scope.cPperation_list=[];/*要显示的统计ID列表*/
                    scope.startDate=moment().format('YYYY-MM-DD');/*开始时间*/
                    scope.overDate=moment().format('YYYY-MM-DD');/*结束时间*/
                    scope.statisOpeName="";/*统计动作名*/
                    scope.statisType=1;/*当前统计类型*/
                    scope.loaingOkAddData=1;/*加载完毕直接加载数据*/

                    /*数据结构*/
                    scope.dataInfo = {
                        type:"line",
                        data:{
                            labels: [],
                            datasets: []
                        },
                        options :{}
                    }
                    /*设置数据结构*/
                    scope.setDataInfo=function () {
                        for(var i in scope.cPperation_list){
                            var info=scope.cPperation_list[i];
                            var color=scope.color_list[info.color]||scope.color_list[i]||scope.color_list[0];
                            scope.dataInfo.data.datasets.push({
                                label:info.title,
                                backgroundColor:color.back,
                                borderColor:color.border,
                                borderWidth: 1,data: []
                            })
                        }
                    }
                    /*选择日期*/
                    scope.chooseDate=function () {
                        // scope.getData();
                    }
                    /*渲染完毕*/
                    scope.loadOk=function (el) {
                        if(!scope.myNewChart&&scope._canvasName){
                            var canvas=el.find("canvas[name="+scope._canvasName+"]");
                            var div=el.find("div[name="+scope._divName+"]");
                            var context= canvas[0].getContext("2d");
                            canvas.attr({
                                width:div.width(),
                                height:div.height()
                            })
                            scope.myNewChart= new Chart(context,scope.dataInfo);
                        }
                        if(scope.myNewChart&&scope.addView&&scope.loaingOkAddData){
                            // scope.getData();
                        }
                    }
                    /*加载数据*/
                    scope.dataId=0;
                    // scope.getData=function () {
                    //     if(rootScope.equipmentName!="pc")return;
                    //     scope.statisType=1;
                    //     if(scope.startDate!=scope.overDate)scope.statisType=2;
                    //     scope.dataId=0;
                    //     for(var i in scope.cPperation_list){
                    //         service.getInfo(scope.statisProName,scope.cPperation_list[i].name,scope.statisType,scope.startDate,scope.overDate,scope.cPperation_list[i].children,function (data,index) {
                    //             scope.addView(data,index);
                    //         },Number(i));
                    //     }
                    // }
                    /*显示数据*/
                    scope.addView=function (data,index) {
                        if(data){
                            scope.setTableInfo(data.xData,data.yData,index);
                            scope.myNewChart.update();
                        }
                    }
                    /*设置表格信息*/
                    scope.setTableInfo=function (xList,yList,index) {
                        var data=scope.dataInfo.data;
                        data.labels=[];
                        var max=0;
                        for(var i in xList){
                            if(scope.statisType==1){
                                data.labels.push(xList[i]+"点");//0....24点
                            }else{
                                data.labels.push(moment(xList[i]).format("MM-DD"));//日期
                            }
                            max+=Number(yList[i]);
                        }
                        if(!index)index=0;
                        data.datasets[index].data=yList;
                        var str=data.datasets[index].label;
                        var arr=String(str).split("(");
                        data.datasets[index].label=arr[0]+"("+max+")";
                        data.datasets[index].data=yList;
                    }
            }]);
        },
        addBaseService:function(){
            var is_this=this;
            app.factory("baseService",["$rootScope","$http","myPopUp","$rootScope","baseModule","myCache",
                function(scope,http,my_pop_up,rootScope,baseModule,myCache){
                var url="/HomeGM/Index/token_login";
                var url_openid="/HomeGM/Index/open_id_login";
                var tipsUrl="haveAction";
                /*游戏切换的控制参数*/
                return {
                    base:base,
                    GM:function(url,param,backFun,_isLoading,error){
                        /*安全校验*/
                        if(rootScope.userInfo.token){
                            param["token_userId"]=rootScope.userInfo.init_id;
                            param["token"]=rootScope.userInfo.token;
                        }
                        if(rootScope.configInfo.statistic_pro_name=="X9_1"||rootScope.configInfo.statistic_pro_name=="X9_13"){
                            var AH_param=JSON.parse(decodeURIComponent(window["AH_param"]));//获取cid
                            var data=rootScope.configInfo.appList;
                            var cId_num;
                            for(var i in data){
                                if(data[i].cId==AH_param.cId){
                                    cId_num=data[i].token_cId;
                                }
                            }
                            param["token_cId"]=cId_num;
                        }
                        base(rootScope.configInfo.serviceUrl+url,param,backFun,_isLoading,error);
                    },
                    getTipsData:function(backFun){ //获取小红点提示信息
                        if(rootScope.equipmentName=="mobile"){
                            if(rootScope.userInfo.IDLevel==4){
                                this.GM_java(tipsUrl,{userId:rootScope.userInfo.init_id},function(data){
                                    backFun(data);
                                },false);
                            }
                        }
                    },
                    /*俱乐部接口信息*/
                    GM_java:function(url,param,backFun,_isLoading,error){ //获取俱乐部信息
                        /*安全校验*/
                        if(rootScope.userInfo.token){
                            param["token_userId"]=rootScope.userInfo.init_id;
                            param["token"]=rootScope.userInfo.token;
                        }
                        if(rootScope.configInfo.statistic_pro_name=="X9_1"||rootScope.configInfo.statistic_pro_name=="X9_13"){
                            var AH_param=JSON.parse(decodeURIComponent(window["AH_param"]));//获取cid
                            var data=rootScope.configInfo.appList;
                            var cId_num;
                            for(var i in data){
                                if(data[i].cId==AH_param.cId){
                                    cId_num=data[i].token_cId;
                                }
                            }
                            param["cid"]=cId_num;
                        }
                        base(rootScope.configInfo.serviceJavaUrl+url,param,backFun,_isLoading,error);
                    },

                    /*openId登录*/
                    openIdGetUserInfo:function(openId,backFun,error,loading){ /*openId登录*/
                        this.GM(url_openid,{openId:openId},function(data){
                            /*设置用户信息*/
                            if(data)rootScope.userInfo=data.userInfo;
                            /*缓存用户信息*/
                            myCache.setLoginInfo();
                            if(backFun)backFun(data);
                        },loading,error);
                    },
                    /*刷新用户信息*/
                    updateUserInfo:function(token,backFun,error,loading){ /*id登录*/
                        if(!token)token=rootScope.userInfo.token;
                        this.GM(url,{token:token},function(data){
                            /*设置用户信息*/
                            if(data)rootScope.userInfo=data.userInfo;
                            /*缓存用户信息*/
                            myCache.setLoginInfo();
                            if(backFun)backFun(data);
                        },loading,error);
                    }
                };
                /*基础通信方式*/
                function base(url,param,backFun,_isLoading,errorFun){
                    my_pop_up.trace("发送一个http请求:"+url);
                    my_pop_up.trace(param);
                    //if(!url)url=rootScope.gameUrl;
                    if(_isLoading==null||_isLoading)baseModule.dataTips(true);
                    http({
                        method: 'POST',
                        url: url,
                        data: $.param(param) ,
                        headers:{
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(function(response){
                        var data=response.data;
                        my_pop_up.trace("后端返回数据:");
                        my_pop_up.trace(data);
                        baseModule.dataTips(false);
                        if(data&&data["state"]==1)
                        {
                            backFun(data["info"]);
                        }else{
                            //俱乐部后端返回的massage提示
                            var message_list=rootScope.configInfo.message_list;
                            if(message_list[data["message"]]){
                                data["message"]=message_list[data["message"]];
                            }
                            my_pop_up.supernatant(data["message"],3000);
                            if(errorFun)errorFun();
                            if(data["state"]==-1){
                                /*消除缓存*/
                                myCache.clearLoginInfo();
                                /*去登陆页面*/
                                /*token失效重新登陆*/
                                baseModule.skipPage("login");
                            }
                        }
                    },function(error){
                        if(_isLoading)baseModule.dataTips(false);
                        if(errorFun)errorFun();
                        if(!error.statusText)error.statusText="服务器异常";
                        my_pop_up.supernatant(error.statusText,3000);
                        my_pop_up.trace("后端报错了");
                        my_pop_up.trace(error);
                    });
                }
            }]);
        }
    }
    return GM_manager;
})();