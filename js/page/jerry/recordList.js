/**
 * 唐僧洗头爱飘柔  --丁杰 2017/11/20.
 * 战绩查询
 */
app.register.controller("jerry_recordListCtrl",[
    "$scope","$rootScope","$controller","baseModule","myPopUp","jerryService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,jerryService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*导航栏信息*/
            scope.nav_info=rootScope.getMenuInfo("jerry_recordList");
            scope.seekMyCacheName="clubId";/*搜索内容缓存关键字*/
            scope.recordList_data={activeNum:0,currNum:0,allHeXiao:0};//今天
            scope.yesterdayList_data={allHeXiao:0};//昨天
            scope.agoList_data={allHeXiao:0};//前天
            scope.page1 = true;
            scope.setSeekKeyword();
            //字符串转义
            scope.get_name=function(name){
                return decodeURIComponent(name);
            }
            //昨日今日前日 选项卡
            scope.show = function(page){
                // console.log(page);
                if(page==1){
                    scope.page1 = true;
                    scope.page2 = false;
                    scope.page3 = false;
                }else if(page==2){
                    scope.page1 = false;
                    scope.page2 = true;
                    scope.page3 = false;
                    //昨天的战绩查询列表--调用
                    scope.yesterdayList();

                }else if(page==3){
                    scope.page1 = false;
                    scope.page2 = false;
                    scope.page3 = true;
                    //前天的战绩查询列表---调用
                    scope.agoList();
                }
            }

            //今天的战绩查询列表
            scope.recordList=function () {
                //今天的凌晨
                var nowList=new Date(new Date().setHours(0,0,0,0)).getTime();
                var wan_nowList=nowList+86400000;//晚
                //传参
                var param={
                    clubId:scope.seek,
                    userId:rootScope.userInfo.init_id,
                    startData:nowList,
                    endData:wan_nowList,
                    order:"juNum,score,hexiao",
                    desc:"1,2",
                    page:10
                }
                // 走接口
                jerryService.recordList(param,function(data){
                    scope.recordList_data=data;
                    console.log(scope.recordList_data.allHeXiao);

                    // 局数倒序排序
                    var nowList=[];
                    for(var i=0;i<scope.recordList_data.users.length;i++){
                        nowList[nowList.length]=scope.recordList_data.users[i].currNum;
                        nowList.sort(function(a,b){return b-a;});
                        scope.recordList_data.users[i].currNum=nowList[i];
                    }
                    for(var g=0;g<nowList.length;g++){
                        scope.recordList_data.users[g].currNum=nowList[g];
                    }
                    scope.updateScroll(1);//平滑滚动
                })
            }

            //昨天的战绩查询列表
            scope.yesterdayList=function(){
                //昨天的凌晨
                var yesterdayList=new Date(new Date(new Date().setDate(new Date().getDate()-1)).setHours(0,0,0,0)).getTime();
                var wan_yesterdayList=yesterdayList+86400000;//晚
                //传参
                var param={
                    clubId:scope.seek,
                    userId:rootScope.userInfo.init_id,
                    startData:yesterdayList,
                    endData:wan_yesterdayList,
                    order:"juNum,score,hexiao",
                    desc:"1,2",
                    page:10
                }
                // 走接口
                jerryService.recordList(param,function(data){
                    scope.yesterdayList_data=data;

                    // 局数倒序排序
                    var yesterdayList=[];
                    for(var i=0;i<scope.yesterdayList_data.users.length;i++){
                        yesterdayList[yesterdayList.length]=scope.yesterdayList_data.users[i].currNum;
                        yesterdayList.sort(function(a,b){return b-a;});
                        scope.yesterdayList_data.users[i].currNum=yesterdayList[i];
                    }
                    for(var g=0;g<yesterdayList.length;g++){
                        scope.yesterdayList_data.users[g].currNum=yesterdayList[g];
                    }
                })
                scope.updateScroll(1);//平滑滚动
            }

            //前天的战绩查询列表
            scope.agoList=function(){
                //前天的凌晨
                var agoList=new Date(new Date(new Date().setDate(new Date().getDate()-2)).setHours(0,0,0,0)).getTime();
                var wan_agoList=agoList+86400000;//晚
                //传参
                var param={
                    clubId:scope.seek,
                    userId:rootScope.userInfo.init_id,
                    startData:agoList,
                    endData:wan_agoList,
                    order:"juNum,score,hexiao",
                    desc:"1,2",
                    page:10
                }
                // 走接口
                jerryService.recordList(param,function(data){
                    scope.agoList_data=data;

                    // 局数倒序排序
                    var agoList=[];
                    for(var i=0;i<scope.agoList_data.users.length;i++){
                        agoList[agoList.length]=scope.agoList_data.users[i].currNum;
                        agoList.sort(function(a,b){return b-a;});
                        scope.agoList_data.users[i].currNum=agoList[i];
                    }
                    for(var g=0;g<agoList.length;g++){
                        scope.agoList_data.users[g].currNum=agoList[g];
                    }
                    scope.updateScroll(1);//平滑滚动
                })
            }

            //核销---------昨天------
            scope.yesterday_off=function(info,heXiaoStatus,inClubUserId){
                myPopUp.alert("确定要核销吗?",function(){
                    //昨天的凌晨
                    var yesterdayList=new Date(new Date(new Date().setDate(new Date().getDate()-1)).setHours(0,0,0,0)).getTime();
                    var wan_yesterdayList=yesterdayList+86400000;//晚
                    var data={
                        clubId:scope.seek,//俱乐部ID
                        userId:rootScope.userInfo.init_id,//代理id
                        inClubUserId:inClubUserId,
                        startData:yesterdayList
                    };
                    // 走接口
                    jerryService.heXiaoStatus(data,function(data){
                        console.log(data);
                        myPopUp.supernatant("操作成功");
                    });
                    if(!heXiaoStatus){
                        info.heXiaoStatus=1;
                    }
                    scope.yesterdayList();//刷新昨天的战绩查询列表
                });
            }

            //核销---------前天------
            scope.intraday_off=function(info,heXiaoStatus,inClubUserId){
                myPopUp.alert("确定要核销吗?",function(){
                    //前天的凌晨
                    var agoList=new Date(new Date(new Date().setDate(new Date().getDate()-2)).setHours(0,0,0,0)).getTime();
                    var wan_agoList=agoList+86400000;//晚
                    var data={
                        clubId:scope.seek,//俱乐部ID
                        userId:rootScope.userInfo.init_id,//代理id
                        inClubUserId:inClubUserId,
                        startData:agoList
                    };
                    // 走接口
                    jerryService.heXiaoStatus(data,function(data){
                        console.log(data);
                        myPopUp.supernatant("操作成功");
                    });
                    if(!heXiaoStatus){
                        info.heXiaoStatus=1;
                    }
                    scope.agoList();//刷新前天的战绩查询列表
                });
            };


            //调用---------------------------------------------------------------------------------------------------
            //今天的战绩查询列表
            scope.recordList();
        });
    }]);