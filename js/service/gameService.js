/**
 * 创建者 伟大的周鹏斌大王 on 2017/6/3.
 */
app.register.factory("game_SM_service",["baseService","$rootScope",function(baseService,rootScope){
    var url1="/Home/Game/systemMessageList/";//获取系统消息
    var url2="/Home/Game/addSystemMessage/";//发布系统消息
    return{
        list:function(page,num,backFun){
            baseService.GM(url1,{userId:rootScope.userInfo.userId,page:page,pageNum:num},function(data){
                setListData(data.list,1+((page-1)*num))
                backFun(data);
            });
        },add:function(content,c_as,backFun){
            baseService.GM(url2,{userId:rootScope.userInfo.userId,content:content,as:c_as},function(data){
                backFun(data);
            });
        }
    }
    function setListData(list,num){
        var str,jList;
        for(var i in list){
            list[i].num=num;
            (i%2==0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            num++;
        }
    }
}]);
app.register.factory("game_FB_service",["baseService","$rootScope",function(baseService,rootScope){
    var url1="/Home/Game/feedbackMessage/";//获取反馈消息
    return{
        list:function(page,num,backFun){
            baseService.GM(url1,{userId:rootScope.userInfo.userId,page:page,pageNum:num},function(data){
                setListData(data.list,1+((page-1)*num));
                backFun(data);
            });
        }
    }
    function setListData(list,num){
        for(var i in list){
            list[i].num=num;
            (i%2==0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            num++;
        }
    }
}]);

app.register.factory("game_SN_service",["baseService","$rootScope",function(baseService,rootScope){
    var url1="/Home/Game/systemNotice/";//系统公告
    var url2="/Home/Game/addSystemNotice/";//发布系统公告
    return{
        list:function(page,num,backFun){
            baseService.GM(url1,{userId:rootScope.userInfo.userId,page:page,pageNum:num},function(data){
                setListData(data.list,1+((page-1)*num))
                backFun(data);
            });
        },add:function(content,backFun){
            baseService.GM(url2,{userId:rootScope.userInfo.userId,content:content},function(data){
                backFun(data);
            });
        }
    }
    function setListData(list,num){
        for(var i in list){
            list[i].num=num;
            (i%2==0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            num++;
        }
    }
}]);

app.register.factory("game_onlineRoom_service",["baseService","$rootScope",function(baseService,rootScope){
    var url1="/Home/Game/onlineRoomList/";//在线房间列表
    var url2="/Home/Game/killRoom/";//解散房间
    return{
        list:function(page,num,seek,backFun){
            baseService.GM(url1,{userId:rootScope.userInfo.userId,page:page,pageNum:num,seek:seek},function(data){
                setListData(data.list,1+((page-1)*num))
                backFun(data);
            });
        },killRoom:function(roomId,backFun){
            baseService.GM(url2,{userId:rootScope.userInfo.userId,roomId:roomId},function(data){
                backFun(data);
            });
        }
    }
    function setListData(list,num){
        for(var i in list){
            list[i].num=num;
            (num%2!=0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            num++;
        }
    }
}]);

app.register.factory("game_monitor_service",["baseService","$rootScope",function(baseService,rootScope){
    var url1="/Home/Game/onlineRoomList/";//在线房间列表
    var url2="/Home/Game/killRoom/";//解散房间
    return{
        list:function(page,num,seek,backFun){
            baseService.GM(url1,{userId:rootScope.userInfo.userId,page:page,pageNum:num,seek:seek},function(data){
                setListData(data.list,1+((page-1)*num))
                backFun(data);
            });
        },killRoom:function(roomId,backFun){
            baseService.GM(url2,{userId:rootScope.userInfo.userId,roomId:roomId},function(data){
                backFun(data);
            });
        }
    }
    function setListData(list,num){
        for(var i in list){
            list[i].num=num;
            (num%2!=0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            num++;
        }
    }
}]);
