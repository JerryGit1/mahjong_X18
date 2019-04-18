/**
 * Created by Admin on 2018/2/3.
 */
app.register.controller('agency_gradeCtrl',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","agencyService","baseService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,service,baseService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            scope.nav_info=rootScope.getMenuInfo("agency_grade");
            /*导航栏信息*/
            /*默认不显示接口按钮*/
            scope.hide=true;
            scope.head=0;
            scope.user_id=null;
            scope.level=null;
            scope.user_name="";

            /*搜索*/
            scope.startSearch=function(id){
                scope.setSeekKeyword(id);
                scope.addUserInfo();
            }

            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }

            //搜索代理id的接口
            scope.addUserInfo=function () {
                service.playerId_getUserInfo(scope.seek,function (data) {
                    scope.head=data.head;
                    scope.user_id=data.id;
                    scope.level=rootScope.configInfo.IDLevel["level"+data.level].name;
                    // scope.money=data.money;//不显示该代理的房卡
                    scope.user_name=data.userName;
                    if(data.level=="4"){
                        scope.hide=true;
                    }else if(data.level=="5"){
                        scope.hide=false;
                    }
                })
            }

            /*切换为s极代理的接口*/
            scope.s_agency_change=function () {
                myPopUp.alert("确定要将该代理设为S级代理吗?",function(){
                    if( baseModule.judge_param_null(
                            [scope.seek,"用户信息"]
                        )){
                        var seek=Number(scope.seek);
                        service.s_agency_change(seek,5,function (data) {
                            scope.startSearch(scope.seek);
                            scope.addUserInfo();
                        })
                        scope.startSearch(scope.seek);
                        scope.addUserInfo();
                    }
                })
            }

            /*切换为普通代理的接口*/
            scope.m_agency_change=function () {
                myPopUp.alert("确定要将该代理设为普通代理吗?",function(){
                    if( baseModule.judge_param_null(
                            [scope.seek,"用户信息"]
                        )){
                        var seek=Number(scope.seek);
                        service.m_agency_change(seek,4,function (data) {
                            scope.startSearch(scope.seek);
                            scope.addUserInfo();
                        })
                        scope.startSearch(scope.seek);
                        scope.addUserInfo();
                    }
                })
            }
            scope.updateScroll(1);
        });
    }]);