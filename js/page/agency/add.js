/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/23.
 *
 * 添加代理页面
 */
app.register.directive("agencyBaseInfo",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/agency/html/'+rootScope.equipmentName+'/baseInfo.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
/*基础类*/
app.register.controller('agency_baseCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service){
        if(!rootScope._isLogin)return;//zpb
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*-------------变量--------------*/
        /*可创建的代理等级*/
        scope.levelList=[];
        scope._isUser=false;
        scope.cLevel=Number(rootScope.userInfo.IDLevel);
        scope.userInfo=null;
        scope.nav_input_type="tel";
        scope.payClass="hide";
        scope.saveClass="hide";
        scope.recordClass="hide";
        scope.checked_num=5;

        /*-------------事件--------------*/
        //登录者的代理等级大于等于大区代理可选代理等级,否测不可选
        console.log(scope.cLevel);
        if(scope.cLevel>=6){
            scope.level=true;
        }else{
            scope.level=false;
            scope.checked_num=4;
        }

        /*获取用户选择的代理等级*/
        scope.checked=function (num) {
            scope.checked_num=num;
        }
        /*搜索*/
        scope.startSearch=function(id){
            scope.setSeekKeyword(id);
            scope.addUserInfo();
        }
        //字符串转义
        scope.get_name=function(name){
            return decodeURIComponent(name);
        }
        /*获取代理商信息*/
        scope.addUserInfo=function () {
            ///*个人信息*/
            service.playerId_getUserInfo(scope.seek,function(data){
                scope.userInfo=null;
                if(data&&data.id){
                    scope.userInfo=data;
                    if(scope.userInfo.identity=="player"){
                        scope.userInfo.identityStr="玩家";
                        scope.payClass="hide";
                        scope.saveClass="show";
                        scope.recordClass="hide";
                    }else if(scope.userInfo.identity=="agency"){
                        scope.userInfo.identityStr=rootScope.configInfo.IDLevel["level"+scope.userInfo.level].name;
                        scope.payClass="show";
                        scope.saveClass="hide";
                        scope.recordClass="show";
                    }
                }else{
                    scope._isUser=false;
                    scope.seek=null;
                    myPopUp.supernatant("用户不存在");
                }
            });
        }
        /*获取文本信息*/
        scope.getInputInfo=function(backFun){
            /*判断参数是否完整*/
            if(scope.userInfo&&scope.userInfo.identity=="player"){
                /*配置参数*/
                var info={
                    agency_id:rootScope.userInfo.init_id,
                    playerId:scope.userInfo.id,
                    level:scope.checked_num
                }
                backFun(info);
            }else{
                scope.seek=null;
                myPopUp.supernatant("用户不存在 或已是代理身份");
            }
        }
        /*获取可创建代理列表*/
        scope.getLevelList=function(){
            if(scope.cLevel>=6){
                scope.levelList.push(rootScope.configInfo.IDLevel);
            }else if(scope.cLevel==5){
                scope.levelList.push(rootScope.configInfo.IDLevel["level4"]);
            }
        }
        /*充值*/
        scope.pay=function(){
            if(scope.cLevel>=5){
                if(scope.userInfo){
                    console.log(scope.userInfo);
                    if(scope.userInfo.identity!="player"){
                        scope.agencyPay(scope.userInfo.id);
                    }

                }
            }else{
                myPopUp.alert("等级不足");
            }
        }
        /*给代理的转账记录*/
        scope.record=function(){
            if(scope.cLevel>=5){
                if(scope.userInfo){
                    if(scope.userInfo.identity!="player"){
                        baseModule.skipPage('agency_sellRecordSeek',{seek: scope.userInfo.init_id});
                    }
                }
            }else{
                myPopUp.alert("等级不足");
            }
        }
        scope.updateScroll(1);
    }]);


/*代理等级*/
app.register.controller('agency_addCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service){
        /*-------------继承--------------*/
        parentCtrl('agency_baseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("agency_add");
            scope.btnName="设为代理";
            scope.searchPlaceholder="点击输入代理ID";
            scope.payClass="hide";
            scope.saveClass="show";
            scope.recordClass="hide";
            /*-------------事件--------------*/
            /*创建新的代理*/
            scope.saveInfo=function(){
                if(scope.cLevel>=5){
                    /*判断参数是否完整*/
                    scope.getInputInfo(function(info){
                        /*添加成功*/
                        service.add_user(info,function(){
                            myPopUp.supernatant("添加成功");
                            scope.startSearch(scope.userInfo.id);
                        });
                    })
                }else{
                    myPopUp.alert("等级不足");
                }
            }
            scope.getLevelList();
        });
    }]);
app.register.controller('agency_setInfoCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","agencyService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service){
        /*-------------继承--------------*/
        parentCtrl('agency_baseCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("agency_setInfo");/*导航*/
            scope.seekMyCacheName="a_set_uId";
            scope.searchPlaceholder="ID 搜索";
            scope.payClass="show";
            scope.saveClass="hide";
            scope.recordClass="show";
            scope.setSeekKeyword();
            /*-------------事件--------------*/
            /*修改信息*/
            scope.saveInfo=function(){
                if(scope.cLevel>=5&&scope.userId){
                    /*判断参数是否完整*/
                    scope.getInputInfo(function(info){
                        info.pay_uId=scope.userId;
                        service.setUserInfo(info,function(){/*添加成功*/
                            myPopUp.supernatant("修改成功");
                            addUserInfo();
                        });
                    })
                }
            }
            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(id);
                addUserInfo();
            }
            /*获取代理商信息*/
            function addUserInfo(){
                ///*个人信息*/
                if(scope.seek){
                    service.id_getUserInfo(scope.seek,function(data){
                        scope.userInfo=data;
                        scope.userInfo.userName=decodeURIComponent(scope.userInfo.userName);
                    });
                }
            }
            scope.getLevelList();
            addUserInfo();
        });
    }]);