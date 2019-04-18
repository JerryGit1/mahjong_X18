/**
 * 创建者 伟大的周鹏斌大王 on 2017/9/19.
 * 直冲管理
 */
app.register.controller('fling_manage',[
    "$scope","$rootScope","$controller","baseModule","myPopUp","flingService",
    function(scope,rootScope,parentCtrl,baseModule,myPopUp,flingService){
        /*-------------继承--------------*/
        parentCtrl('basePageCtrl', {$scope: scope});
        /*登录验证*/
        baseModule.judgeLogin(function(){
            /*-------------变量--------------*/
            scope.nav_info=rootScope.getMenuInfo("fling_manage");

            scope.quantity="请选择";//扣量比例
            scope.btnSelect_data={};/*总扣量金额*/
            scope.flingDataTop_data={todayAllCount:0,todayAllKouCount:0,allDing:0,allKou:0,todayAllMoney:0,todayAllKouMoney:0,allMoney:0,allKouMoney:0};/*直冲数据*/
            scope.flingData_data={todayAllCount:0,todayAllKouCount:0,allDing:0,allKou:0,todayAllMoney:0,todayAllKouMoney:0,allMoney:0,allKouMoney:0};/*扣量管理数据*/
            scope.current_page=1;/*当前页*/
            scope.page_num=8;/*每页数量*/
            scope.max_page=1;/*总页数*/
            /*-------------事件--------------*/
            /*直冲管理数据*/
            scope.flingData=function(){
                    // 传数据
                var param={
                    userId:rootScope.userInfo.init_id,//代理ID
                    page:scope.page_num,/*每页数量*/
                    currentPage:scope.current_page/*当前页*/
                }
                /*走接口*/
                flingService.flingData(param,function(data){
                    // 遍历数组
                    for(var i=0;i<data.users.length;i++){
                        // 时间戳转为时间
                        var time = new Date(data.users[i].openTime);
                        var h = time.getHours();
                        var mm = time.getMinutes();
                        var s = time.getSeconds();
                        var time_date=h+':'+mm;
                        // 时间赋值
                        data.users[i].openTime=time_date;
                        // 充值列表状态
                        if(data.users[i].status==0){
                            data.users[i].status="分成";
                        }else if(data.users[i].status==1){
                            data.users[i].status="扣量";
                            if(data.users[i].cashStatus==0){
                                data.users[i].cashStatus=1;
                            }
                        }
                    }
                    //当前扣量比例
                    if(data.currentKou==0){
                        data.currentKou="10/0";
                    }else if(data.currentKou==1){
                        data.currentKou="9/1";
                    }else if(data.currentKou==2){
                        data.currentKou="8/2";
                    }else if(data.currentKou==3){
                        data.currentKou="7/3";
                    }else if(data.currentKou==4){
                        data.currentKou="6/4";
                    }else if(data.currentKou==5){
                        data.currentKou="5/5";
                    }else if(data.currentKou==6){
                        data.currentKou="4/6";
                    }else if(data.currentKou==7){
                        data.currentKou="3/7";
                    }else if(data.currentKou==8){
                        data.currentKou="2/8";
                    }else if(data.currentKou==9){
                        data.currentKou="1/9";
                    }else if(data.currentKou==10){
                        data.currentKou="0/10";
                    }
                    //总页数赋值到当前页数
                    scope.max_page=data.pages;
                    /*-------------------移动端策略--------------------------*/
                    if(rootScope.equipmentName=="mobile"){
                        if(!scope.flingData_data||scope.current_page==1)scope.flingData_data=[];

                        for(var i in data.users){
                            scope.flingData_data.push(data.users[i]);
                        }
                        scope.flingDataTop_data=data;//扣量管理上面的直冲数据
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
                        scope.flingData_data=data;
                    }
                    scope.pageloading=false;
                })
            }

            /*切换分成扣量接口*/
            scope.cutInto=function(openId,dailId,orderNum){
                // 传数据
                var param={
                    userId:rootScope.userInfo.init_id,//代理ID
                    queryUserId:openId,//玩家ID
                    DailId:dailId,//代理ID
                    orderNum:orderNum//订单号
                }
                /*走接口*/
                flingService.cutInto(param,function(data){
                    scope.flingData();
                })
            }

            /*发送扣量比例接口----刷新列表*/
            scope.btnSelect=function(warn){

                //请用户再次确认
                myPopUp.alert("确定要修改扣量比例吗？",function(){
                    /*判断扣量比例发数据到后台*/
                    if(warn=="10/0"){
                        warn=0;
                    }else if(warn=="9/1"){
                        warn=1;
                    }else if(warn=="8/2"){
                        warn=2;
                    }else if(warn=="7/3"){
                        warn=3;
                    }else if(warn=="6/4"){
                        warn=4;
                    }else if(warn=="5/5"){
                        warn=5;
                    }else if(warn=="4/6"){
                        warn=6;
                    }else if(warn=="3/7"){
                        warn=7;
                    }else if(warn=="2/8"){
                        warn=8;
                    }else if(warn=="1/9"){
                        warn=9;
                    }else if(warn=="0/10"){
                        warn=10;
                    }

                    //限制扣量比例的空值
                    if( baseModule.judge_param_null([scope.warn,"扣量比例"])){
                        // 传数据
                        var param={
                            userId:rootScope.userInfo.init_id,//代理ID
                            kouState:warn//扣量规定
                        }
                        console.log(warn);
                        /*走接口*/
                        flingService.btnSelect(param,function(data){
                            scope.btnSelect_data=data;
                            // 调用整体页面
                            scope.flingData();
                            scope.updateScroll(1);//平滑滚动
                        })
                    }
                })
            }

            scope.choose_quantity=function(num){
                scope.quantity=num+"/"+(10-num);
            }
            
            /*翻页*/
            scope.paging=function(){
                scope.flingData();
            }
            scope.flingData();//已绑定用户列表调用
        });
    }]);