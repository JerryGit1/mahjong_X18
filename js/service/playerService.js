/**
 * 创建者 伟大的周鹏斌大王 on 2017/5/29.
 *
 * 玩家相关接口
 */
/*接口----用户信息*/
app.register.factory("playerService",["baseService","$rootScope","baseModule",function(baseService,rootScope,baseModule){
    var url1="/HomeGM/Player/player_user_list/";
    var url2="/HomeGM/Player/black_name_list/";//黑名单列表
    var url2_1="/HomeGM/Player/set_user_black_list/";//黑名单操作
    var url3="/HomeGM/Player/pay_record_list_user/";
    var url4="/HomeGM/Player/player_buy_list/";
    var url5="/HomeGM/Player/get_user_info/";
    var url6="/HomeGM/Player/pay_user/";
    var url7="/HomeGM/Player/record_list_query/";//战绩列表---战绩查询
    var url8="/HomeGM/Player/record_list_query/";//用户个人战绩
    return{
        user_list:function(cPage,pageNum,backFun){/*用户列表*/
            baseService.GM(url1,{userId:rootScope.userInfo.userId,page:cPage,pageNum:pageNum},function(data){
                setListData(data.list,1+((cPage-1)*pageNum),true);
                backFun(data);
            },true);
        },
        seek_user_list:function(seek,cPage,pageNum,backFun){/*用户列表 搜索*/
            baseService.GM(url1,{keyword:seek,page:cPage,pageNum:pageNum},function(data){
                setListData(data.list,1+((cPage-1)*pageNum),true);
                backFun(data);
            },true);
        },
        id_getUserInfo:function(userId,backFun){
            baseService.GM(url5,{userId:userId},function(data){
                backFun(data);
            });
        },
        user_black_list:function(cPage,pageNum,backFun){/*黑名单*/
            baseService.GM(url2,{userId:rootScope.userInfo.init_id,page:cPage,pageNum:pageNum},function(data){
                setListData(data.list,true);
                backFun(data);
            });
        },
        user_set_black:function(userId,black,backFun){/*黑名单操作*/
            baseService.GM(url2_1,{userId:userId,black:black},function(data){
                backFun(data);
            });
        },
        seek_user_black_list:function(seek,cPage,pageNum,backFun){/*黑名单 搜索*/
            baseService.GM(url2,{keyword:seek,page:cPage,pageNum:pageNum},function(data){
                setListData(data.list,1+((cPage-1)*pageNum))
                backFun(data);
            });
        },
        pay_record:function(cPage,pageNum,backFun){/*充值记录 总超管可以看到所有玩家的充值记录，大区代理和代理只能看到自己的充值记录*/
            baseService.GM(url3,{page:cPage,pageNum:pageNum,agencyId:rootScope.userInfo.userId},function(data){
                setListData(data.list,1+((cPage-1)*pageNum))
                backFun(data);
            });
        },
        u_pay_record:function(uId,cPage,pageNum,backFun){/*充值记录 个人*/
            baseService.GM(url3,{playerId:uId,page:cPage,pageNum:pageNum,agencyId:rootScope.userInfo.userId},function(data){
                setListData(data.list,1+((cPage-1)*pageNum))
                backFun(data);
            });
        },
        consume_record:function(cPage,pageNum,backFun){/*消费记录 总*/
            baseService.GM(url4,{page:cPage,pageNum:pageNum},function(data){
                setListData(data.list,1+((cPage-1)*pageNum),true);
                backFun(data);
            });
        },
        u_consume_record:function(uId,cPage,pageNum,backFun){/*消费记录 个人*/
            baseService.GM(url4,{userId:uId,page:cPage,pageNum:pageNum},function(data){
                setListData(data.list,1+((cPage-1)*pageNum),true);
                backFun(data);
            });
        },
        pay:function(p_id,money,backFun){
            baseService.GM(url6,{player_uId:p_id,userId:rootScope.userInfo.userId,pay_money:money},function(data){
                backFun(data);
            },true);
        },
        record:function(cPage,pageNum,backFun){
            baseService.GM(url7,{pageNum:pageNum,page:cPage},function(data){
                setRecordList(data.list,1+((cPage-1)*pageNum))
                backFun(data);
            });
        },
        u__record:function(uId,cPage,pageNum,backFun){/*战绩记录 个人*/
            baseService.GM(url8,{userId:uId,page:cPage,pageNum:pageNum},function(data){
                setRecordList(data.list,1+((cPage-1)*pageNum))
                backFun(data);
            });
        },
    }
    /*整理信息*/
    function setListData(list,num,_isSetTime){
        for(var i in list){
            list[i].num=num;
            if(list[i].aUserName)list[i].aUserName=decodeURIComponent(list[i].aUserName);
            if(list[i].userName)list[i].userName=decodeURIComponent(list[i].userName);
            if(_isSetTime&&list[i].createTime)list[i].createTime=baseModule.getTime(list[i].createTime);
            (num%2!=0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            if(Number(list[i].black)){
                list[i].stateName="正常玩家";
            }else{
                list[i].stateName="已拉黑";
            }
            num++;
        }
        return list;
    }
    /*战绩信息整理*/
    function setRecordList(list,num){
        var i,s;
        for(i in list){
            list[i].num=num;
            if(list[i].sTime)list[i].sTime=baseModule.getTime(list[i].sTime);
            if(list[i].eTime)list[i].eTime=baseModule.getTime(list[i].eTime);
            (num%2!=0)?(list[i].class="table_back1"):(list[i].class="table_back2");
            for(s in list[i].player){
                list[i].player[s].visible=false;
                if(list[i].player[s].uId){
                    list[i].player[s].tips="赢";
                    if(list[i].player[s].score<=0){
                        list[i].player[s].color="#dd0000";
                        list[i].player[s].tips="输";
                    }
                    list[i].player[s].uName=decodeURIComponent(list[i].player[s].uName);
                    if(list[i].player[s].uName.length>5)list[i].player[s].uName=list[i].player[s].uName.substr(0,5)+"..";
                    list[i].player[s].visible=true;
                    if(list[i].room_user_id==list[i].player[s].uId){
                        list[i].room_user_head=list[i].player[s].uHead;
                        list[i].room_user_name=list[i].player[s].uName;
                    }
                }
            }
            list[i].player[0].icon="glyphicon glyphicon-home";
            num++;
        }
    }
}]);