/**
 * 创建者 伟大的周鹏斌大王 on 2017/9/19.
 *
 * 直冲白名
 */
/*用基础控件*/
app.register.directive("flingWhiteBaseList",["$rootScope",function(rootScope){
    return{
        restrict:"E",
        templateUrl:'js/page/fling/html/'+rootScope.equipmentName+'/whitebaselist.html',
        replace:false,
        link:function(scope,el,attrs,controller){/*处理元素 绑定事件*/

        }
    }
}]);
app.register.controller('fling_whitelist',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","flingService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,flingService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("fling_whitelist");
            scope.current_page=1;/*当前页*/
            scope.page_num=8;/*每页数量*/
            scope.max_page=1;/*总页数*/
            scope.whiteList_data={};
            scope.checkWhiteList_data={};
            scope.joinRemList_data={};
            /*-------------事件--------------*/

            /*白名单列表，接口*/
            scope.whiteList=function(){
                // 传数据
                var param={
                    userId:rootScope.userInfo.init_id,//代理ID
                    page:scope.page_num,//每页数量
                    currentPage:scope.current_page//当前页
                }
                /*走接口*/
                flingService.whiteList(param,function(data){
                    //scope.whiteList_data=data;//赋值给傀儡对象
                    scope.hid=false;//设置白名单列表的默认为删除
                    //scope.updateScroll(1);//平滑滚动

                    // 设置翻页
                    scope.max_page=data.pages;
                    // alert(scope.nav_input_tips);
                    /*-------------------移动端策略--------------------------*/
                    if(rootScope.equipmentName=="mobile"){
                        if(!scope.whiteList_data||scope.current_page==1)scope.whiteList_data=[];

                        for(var i in data.users){
                            scope.whiteList_data.push(data.users[i]);
                        }
                        console.log(scope.whiteList_data);
                        /*移动端 滑动到底部提示*/
                        //当前页等于总页数时，
                        if(scope.current_page==scope.max_page){
                            scope.pageTips=scope.pageLastPageTips;
                        }else if(scope.max_page==0){
                            scope.pageTips="*>.<*! 运气不佳没有查到任何信息";
                        }
                        /*启动或者刷新滑动组件*/
                        scope.updateScroll(scope.current_page);
                    }else{
                        scope.whiteList_data=data;
                    }
                    scope.pageloading=false;
                })
            }

            /*查找白名单，接口------事件驱动*/
            scope.checkWhiteList=function(wan){
                if( baseModule.judge_param_null([scope.wan,"查找的用户"])){
                    // 传数据
                    var param={
                        userId:rootScope.userInfo.init_id,//代理ID
                        queryUserId:wan
                    }
                    /*走接口*/
                    flingService.checkWhiteList(param,function(data){
                        scope.checkWhiteList_data=data.users;
                        if(scope.checkWhiteList_data[0].whiteState==1){
                            alert("是白名单");
                            scope.hid=false;
                            scope.whiteList_data=scope.checkWhiteList_data;
                        }else if(scope.checkWhiteList_data[0].whiteState==0){
                            alert("不是白名单");
                            scope.hid=true;
                            scope.whiteList_data=scope.checkWhiteList_data;
                        }
                    })
                }
            }

            /*加入删除接口------事件驱动*/
            scope.joinRemList=function(info,num){
                    // 验证弹框加入与删除
                    var join;
                    if(num==0){
                        join="删除";
                    }else{
                        join="加入";
                    }
                if( baseModule.judge_param_null([info,join+"的用户"])){
                    myPopUp.alert("确定要将"+info+join+"白名单吗?",function(){
                        // 传数据
                        var param={
                            userId:rootScope.userInfo.init_id,//代理ID
                            queryUserId:info,//要删除-加入的玩家ID
                            action:num//当前页
                        }
                        /*走接口*/
                        flingService.joinRemList(param,function(data){
                            scope.whiteList();
                        })
                        myPopUp.supernatant(join+"成功");
                    })
                }
            }

            scope.whiteList();//白名单列表调用----默认列表

            /*翻页*/
            scope.paging=function(){
                scope.whiteList();
            }
            scope.whiteList();//已绑定用户列表调用
        });
    }]);