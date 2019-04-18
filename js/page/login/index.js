/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 *
 * 登录界面
 */
/*用户登录基础页面*/
app.register.controller("loginCtrl",[
    "$scope","myCache","$rootScope","$location","userLogin","config","baseModule",
    function(scope,myCache,rootScope,location,userLogin,config,baseModule){
        /*获取配置信息*/
        config(function(){
            /*加载提示条*/
            baseModule.dataTips(true,"安全登录中...");
            rootScope._isLogin=0;
            /*是否需要登录*/
            var token=myCache.addLoginInfo();
            if(window["AH_param"]&&window["AH_param"].indexOf("?>")==-1){//openId登录
                userLogin.openIdLogin(addUserLogin);
            }else if(token){/*缓存登录*/
                userLogin.uIdLogin(token,addUserLogin);
            }else{/*账号登录*/
                addUserLogin();
            }
        });
        /*显示用户名登陆界面*/
        function addUserLogin(){
            /*加载提示条*/
            baseModule.dataTips(false);
            if(rootScope.equipmentType=="pc"){/*pc端*/
                location.path("/login_pc");
            }else{
                location.path("/login_mobile");/*移动端*/
            }
        }
    }
]);
/*pc端登录页面*/
app.register.controller("loginPcCtrl",["$scope","$rootScope","config","setCenterLayout","userLogin",
    function(scope,rootScope,config,setCenterLayout,userLogin){
        /*获取配置信息*/
        config(function(data){
            /*设置布局*/
            setCenterLayout.login();
            /*信息*/
            scope.name=rootScope.configInfo.login_title;
            scope.logo_img=rootScope.configInfo.login_logo;
            /*开场动画*/
            var loginBackDiv=$("#loginBackDiv");
            var loginDiv=$("#loginDiv");
            loginDiv.css({
                "left":window.innerWidth/2-300/2,
                "top":window.innerHeight/3-loginDiv.height()/2
            });
            loginBackDiv.animate({opacity:.7},600,function(){
                loginDiv.animate({opacity:1,top:window.innerHeight/3-loginDiv.height()/2+65},400).
                animate({opacity:1,top:window.innerHeight/3-loginDiv.height()/2+60},100,function(){
                    loginBackDiv.animate({opacity:.2},1200);
                });
            });
            /*变量*/
            scope.passwd="";
            scope.userName="";
            scope.tips="";
            /*事件*/
            scope.login=function(e){
                if(e){
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode!=13) return;
                }

                /*用户名*/
                /*密码登录*/
                if(!scope.userName){
                    scope.tips="写个名字呗!小哥";
                }else if(!scope.passwd){
                    scope.tips="小哥!要写密码的呦!"
                }else{
                    userLogin.userNameLogin(scope.userName,scope.passwd,function(str){
                        /*登陆失败*/
                        scope.tips=str;
                        var left=window.innerWidth/2-loginDiv.width()/2;
                        loginDiv.animate({left:left-15},50).animate({left:left+30},100).animate({left:left-30},140).animate({left:left},40);
                    });
                }
            }
            /*输入事件*/
            scope.inputChange=function(){
                scope.tips="";
            }
        });
    }
]);
/*移动端登录页面*/
app.register.controller("login_person_mobileCtrl",["$scope","$rootScope","config","setCenterLayout","userLogin",
    function(scope,rootScope,config,setCenterLayout,userLogin){
        /*获取配置信息*/
        config(function(){
            /*设置布局*/
            setCenterLayout.login();
            /*信息*/
            scope.name=rootScope.configInfo.login_title;
            scope.logo_img=rootScope.configInfo.login_logo;
            $("body").on("touchmove",function(e){
                e.stopPropagation();
                e.preventDefault();
            });
            /*变量*/
            scope.passwd="";
            scope.userName="";
            scope.tips="";
            /*缓存数据*/
            if(localStorage.mobileUserName){
                scope.userName=localStorage.mobileUserName;
                scope.passwd=localStorage.mobilePasswd;
            }
            /*事件*/
            scope.login=function(e){
                if(e){
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode!=13) return;
                }
                /*用户名*/
                /*密码登录*/
                if(!scope.userName){
                    scope.tips="写个名字呗!小哥";
                }else if(!scope.passwd){
                    scope.tips="哎？ 密码呢？"
                }else{
                    localStorage.mobileUserName=scope.userName;
                    localStorage.mobilePasswd=scope.passwd;
                    userLogin.userNameLogin(scope.userName,scope.passwd,function(str){
                        /*登陆失败*/
                        scope.tips=str;
                    });
                }
            }
            /*输入事件*/
            scope.inputChange=function(){
                scope.tips="";
            }
        });
    }
]);
/*获取配置信息*/
app.register.factory("config",["$rootScope","baseService","myPopUp",function(rootScope,baseService,myPopUp){
    return function (back) {
        if(rootScope.configInfo){
            back();/*获取过直接返回*/
            return;
        }
        /*获取配置信息*/
        baseService.base("AH_config.json",{},function(data){
            rootScope.configInfo=data;
            /*设置网页标题*/
            $("title").html(data.title_name);
            /*设置加载提示logo*/
            $("#loading_img").attr("src",data.login_logo);
            /*界面显示*/
            $("#centerDiv").show();
            /*货币名称*/
            if(data.money_name)rootScope.money_name=data.money_name;

            //X9_1和X9_13的项目走分包方案
            if(data.statistic_pro_name=="X9_1"||data.statistic_pro_name=="X9_13"){
                /*设置游戏链接*/
                var vInfo=data.versionInfo;
                var AH_param=JSON.parse(decodeURIComponent(window["AH_param"]));//后端传过来的数据
                if(AH_param.cId){
                    var appInfo;
                    for(var i in data.appList){
                        if(Number(data.appList[i].cId)==Number(AH_param.cId)){
                            appInfo=data.appList[i];
                            break;
                        }
                    }
                    if(appInfo){
                        if(!vInfo.AH_develop)vInfo.AH_develop="";
                        data.serviceUrl=appInfo["serviceUrl_"+vInfo.AH_develop];
                        data.socketUrl=appInfo["socketUrl_"+vInfo.AH_develop];
                        data.gameScoreUrl=appInfo["gameScoreUrl_"+vInfo.AH_develop];
                        data.gameLoginUrl=appInfo["gameLoginUrl_"+vInfo.AH_develop];
                        data.serviceJavaUrl=appInfo["serviceJavaUrl_"+vInfo.AH_develop];
                        data.subhead_name=appInfo["name"];
                    }else{
                        alert("项目异常");
                    }
                }else{
                    alert("非法登录");
                }
            }

            /*测试环境*/
            if(data.versionInfo&&data.versionInfo.AH_develop&&window["ah_tester"]){
                //X1的
                if(data.statistic_pro_name=="X9_1"||data.statistic_pro_name=="X9_13"){
                    data.vType=vInfo.AH_develop;
                    window["ah_tester"].start(vInfo.proCode,vInfo.v,3);
                    myPopUp.trace("----伟大的周大王第"+vInfo.releaseNum+"次降临----",3);
                    vInfo=null;
                }else{
                    var vInfo=data.versionInfo;
                    data.vType=vInfo.AH_develop;
                    data.serviceUrl=data["serviceUrl_"+vInfo.AH_develop];
                    data.serviceJavaUrl=data["serviceJavaUrl_"+vInfo.AH_develop];
                    data.socketUrl=data["socketUrl_"+vInfo.AH_develop];
                    data.gameScoreUrl=data["gameScoreUrl_"+vInfo.AH_develop];
                    window["ah_tester"].start(vInfo.proCode,vInfo.v,3);
                    myPopUp.trace("----伟大的周大王第"+vInfo.releaseNum+"次降临----",3);
                    vInfo=null;
                }
            }else{
                var vInfo=data.versionInfo;
                window["ah_tester"].start(vInfo.proCode,vInfo.v,3);
                data.vType="release";
            }
            if(data.versionInfo&&data.versionInfo.v){
                console.log("v:"+data.versionInfo.v);
            }
            back();
        });
    }
}]);
/*登录成功*/
app.register.factory("userLogin",["myPopUp","myCache","$rootScope","$location","baseService",
    function(myPopUp,myCache,scope,location,baseService){
        var url1="/HomeGM/Index/login";
        return{
            uIdLogin:function(token,error){/*id登录*/
                baseService.updateUserInfo(token,function(data){
                        if(!data)error();
                        else loginSucceed(data);
                },function(){
                    error();
                },false);
            },
            openIdLogin:function(error){/*openId登录*/
                var data=JSON.parse(decodeURIComponent(window["AH_param"]));
                if(data&&data.openId){
                    myPopUp.trace("-----用户openId登陆----",3);
                    baseService.openIdGetUserInfo(data.openId,function(data){
                        if(!data)error();
                        else loginSucceed(data);
                    },function(){
                        error();
                    },false);
                }else{
                    error();
                }
            },
            userNameLogin:function(userName,passwd,error){/*用户名登录*/
                if(!userName){
                    error("用户名为空");
                }else if(!passwd){
                    error("密码为空");
                }else{
                    baseService.GM(url1,{lName:userName,lPasswd:passwd},function(data){
                        if(!data)error("用户名或密码错误");
                        else loginSucceed(data);
                    },true);
                }
            }
        }
        /*登录成功*/
        function loginSucceed(data){
            $("body").unbind("touchmove");
            /*设置用户信息*/
            scope.userInfo=data.userInfo;
            /*左侧抽屉菜单  设置有权限访问的页面*/
            var i,s,name1,name2;
            for(i in data.menuList){
                name1=data.menuList[i].name;/*一级页面*/
                scope.pageRouterList[name1]=true;
                for(s in data.menuList[i].list){
                    name2=data.menuList[i].list[s];/*二级页面*/
                    scope.pageRouterList[name1+"_"+name2]=true;
                }
            }
            /*底部功能菜单*/
            var bottomList=[];
            var proName=scope.configInfo.statistic_pro_name;
                if(scope.userInfo.IDLevel>=6){//底部菜单大区代理和管理员的功能
                    bottomList=["player_pay","player_payRecord","agency_add","console"];
                }else if(scope.userInfo.IDLevel==5){//S代理的功能
                    bottomList=["player_pay","player_payRecord","agency_add","console"];
                }else if(scope.userInfo.IDLevel==4){//小代理的功能
                    if(proName=="wsw_X1"||
                        proName=="wsw_X6"||
                        proName=="wsw_X8"||
                        proName=="wsw_X4"||
                        proName=="wsw_X13"||
                        proName=="X9_1"||
                        proName=="wsw_X14"||
                        proName=="wsw_X15"||
                        proName=="wsw_X18"
                    ){
                        bottomList=["player_pay","player_payRecord","jerry_index","console"];
                    }else{
                        bottomList=["player_pay","player_payRecord","console"];
                    }
                }
            /*缓存用户信息*/
            myCache.setLoginInfo();
            // 广播菜单事件/*拉取用户菜单列表*/
            scope.$broadcast('setHeader',data.userInfo);
            scope.$broadcast('setLeftMenu',data.menuList);
            scope.$broadcast('setBottomMenu',bottomList);
            scope.$broadcast('setTopMenu',bottomList);
            /*跳转页面*/
            scope._isLogin=true;
            if(scope.lastPagePath&&scope.lastPagePath!="/login")location.path(scope.lastPagePath);
            else location.path("/console");
        }
    }]);














