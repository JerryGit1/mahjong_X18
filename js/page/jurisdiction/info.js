/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/29.
 *
 * 管理员详情或者添加
 */
/*用户信息列表 基础控件*/
app.register.directive("jurisdictionInfo",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/jurisdiction/html/'+rootScope.equipmentName+'/baseInfo.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础*/
app.register.controller('jurisdiction_infoBaseCtrl',[
    "$scope","$rootScope","$controller","baseModule","jurisdiction_service",
    function(scope,rootScope,parentCtrl,baseModule,service){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*--------------当前基础信息配置-------------------*/
        scope.btnName="添加";
        scope.userName="";
        scope.userPhone="";
        scope.loginName="";
        scope.loginPasswd="";
        scope.gameID="";
        scope.currentUserId=null;
        /*--------------事件-------------------*/

        /*获取权限列表*/
        scope.getConfigInfo=function(backFun){
            service.configInfo(function(info){
                scope.baseMenuList=info;
                scope.updateScroll(1);
                if(backFun)backFun();
            });
        }

        /*tooltip 提示动画*/
        scope.renderFinish = function(){
            $("[data-toggle='jurisdiction_tooltip']").tooltip();
        }
        /*设置新的权限数据*/
        scope.getNewJList=function(){
            var jList=[{name:"console"}];
            for(var i in scope.baseMenuList){
                var obj={name:scope.baseMenuList[i].name};
                obj.list=[];
                for(var s in scope.baseMenuList[i].list){
                    if(scope.baseMenuList[i].list[s].value){
                        obj.list.push(scope.baseMenuList[i].list[s].name);
                    }
                }
                /*空列表不录取*/
                if(obj.list.length>0){
                    jList.push(obj);
                }
            }
            return JSON.stringify(jList);
        }
        /*设置权限开启*/
        scope.setMenuJ=function(title,name){
            for(var i in scope.baseMenuList){
                if(title==scope.baseMenuList[i].name){
                    for(var s in scope.baseMenuList[i].list){
                        if(scope.baseMenuList[i].list[s].name==name){
                            scope.baseMenuList[i].list[s].value=true;
                            return;
                        }
                    }
                }
            }
        }
        /*获取输入文本信息*/
        scope.getInputInfo=function(backFun){
            /*判断参数是否完整*/
            if(baseModule.judge_param_null([scope.userName,"用户名"],
                    [scope.userPhone,"手机号"],
                    [scope.loginName,"登陆名"],
                    [scope.loginPasswd,"密码"],
                    [scope.gameID,"游戏ID"]
                )){
                /*配置参数*/
                var info={
                    add_userId:rootScope.userInfo.init_id,
                    level:6,
                    userName:scope.userName,
                    phone:scope.userPhone,
                    loginName:scope.loginName,
                    loginPasswd:scope.loginPasswd,
                    gameID:scope.gameID,
                    head:1,
                    jlist:scope.getNewJList(),/*解析权限列表*/
                }
                backFun(info);
            }
        }

}]);
/*添加*/
app.register.controller('jurisdiction_addCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jurisdiction_service",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service){
        /*-------------继承--------------*/
        parentCtrl('jurisdiction_infoBaseCtrl', {$scope: scope});
        /*登录*/
        baseModule.judgeLogin(function(){
            /*--------------当前基础信息配置-------------------*/
            scope.nav_info=rootScope.getMenuInfo("jurisdiction_add");/*导航栏信息*/
            scope.btnName="添加";
            /*--------------事件-------------------*/
            /*保存或者添加新管理员*/
            scope.btnClick=function(){
                scope.getInputInfo(function(info){
                    service.add(info,function(){/*添加成功*/
                        myPopUp.supernatant("添加成功");
                        baseModule.skipPage('jurisdiction_list'); // 传递参数的跳转
                    });
                })
            }
            scope.getConfigInfo();
        });

    }]);
/*详情*/
app.register.controller('jurisdiction_infoCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jurisdiction_service",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service){
        /*-------------继承--------------*/
        parentCtrl('jurisdiction_infoBaseCtrl', {$scope: scope});
        /*登录*/
        baseModule.judgeLogin(function(){
            /*--------------当前基础信息配置-------------------*/
            scope.nav_info=rootScope.getMenuInfo("jurisdiction_info");/*导航栏信息*/
            scope.btnName="保存";
            scope.seekMyCacheName="j_info_uId";
            scope.setSeekKeyword();/*设置缓存*/
            /*保存修改的管理员信息*/
            scope.btnClick=function(){
                scope.getInputInfo(function(info){
                    info.level=Number(scope.grade);
                    info.userId=scope.seek;
                    service.setInfo(info,function(){
                        myPopUp.supernatant("修改成功");
                        baseModule.skipPage('jurisdiction_list'); // 传递参数的跳转
                    });
                });
            }
            scope.getConfigInfo(function(){
                /*获取已开启的权限列表*/
                service.info(scope.seek,function(info){
                    /*匹配信息*/
                    for(var i in info){
                        scope[i]=info[i];
                    }
                    /*权限加身*/
                    for(var i in info["menuList"]){
                        var name=info["menuList"][i].name;
                        for(var  s in info["menuList"][i].list){
                            scope.setMenuJ(name,info["menuList"][i].list[s]);
                        }
                    }
                });
            });
        });
 }]);