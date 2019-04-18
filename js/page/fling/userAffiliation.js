/**
 * 创建者 伟大的周鹏斌大王  唐僧洗头爱飘柔   on 2017/9/19.
 *
 * 用户归属管理
 */
app.register.controller('fling_userAffiliation',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","flingService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,flingService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("fling_userAffiliation");
            scope.todayCardNum=0;/*今日直充金额*/
            scope.yesterdayCardNum=0;/*昨日直充金额*/
            scope.pushMoneyRMB=0;/*可提现金额*/
            scope.userPart_data={};/*用户归属管理*/
            scope.agencyInfo_data={};/*要切换的代理ID*/
            /*-------------事件--------------*/

            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }

            //用户归属管理---------事件驱动
            scope.userPart=function(val){
                if( baseModule.judge_param_null([val,"要调整的玩家ID"])){
                    // 传数据
                    var param={
                        userId:rootScope.userInfo.init_id,//代理ID
                        queryUserId:val
                    }
                    console.log(val);
                    /*走接口*/
                    flingService.userPart(param,function(data){
                        scope.userPart_data=data;
                    })
                }
            }

            //要切换的代理ID-----------事件驱动
            scope.agencyInfo=function(info,val){
                if( baseModule.judge_param_null([info,"要归属的玩家ID"])){
                    // 传数据
                    var param={
                        userId:rootScope.userInfo.init_id,//代理ID
                        queryUserId:info//要更改的代理ID
                    }
                    /*走接口*/
                    flingService.agencyInfo(param,function(data){
                        scope.agencyInfo_data=data;
                    })
                }
            }

            //调整归属----事件驱动
            scope.amendInfo=function(val,info){
                if(val==null||val==undefined||val==""){
                    myPopUp.supernatant("要调整的玩家不能为空");
                }else if(info==null||info==undefined||info==""){
                    myPopUp.supernatant("要归属的代理不能为空");
                }else{
                    var param={
                        userId:rootScope.userInfo.init_id,//代理ID
                        queryUserId:val,//查询的玩家ID
                        chageId:info//要切换的代理ID
                    }
                    console.log(info);
                    /*走接口*/
                    flingService.amendInfo(param,function(data){
                        myPopUp.supernatant("调整成功");
                        setTimeout(function(){
                            location.reload();//刷新当前页面
                        },800)

                    })
                }
            }
            scope.updateScroll(1);
        });
    }]);