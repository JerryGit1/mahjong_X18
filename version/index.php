<!DOCTYPE html>
<html lang="en">
<head>
    <title>加载...</title>
    <link href="image/head/1.png" rel="shortcut icon">
    <!--编码格式-->
    <meta charset="UTF-8">
    <!--手机适配-->
    <meta name="viewport" content="width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"/>
    <!--全屏设置-->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="full-screen" content="true"/>
    <meta name="screen-orientation" content="portrait"/>
    <meta name="x5-fullscreen" content="true"/>
    <meta name="360-fullscreen" content="true"/>
    <style>
        /*-------------------数据加载条------------------------*/
        #loadingDiv{
            position: fixed;
            width: 100%;
            height: 100%;
            z-index: 99;
            top:0;
            left: 0;
            text-align: center;
        }
        #loading_imgDiv{
            color: #888;
            perspective: 300px;
            margin-top:35%;

        }
        #loading_img{
            width: 100px;
            padding: 2px;
            background: #fff;
            border-radius: 50%;
            border: 1px solid #eee;
        }
        #loading_tips{
            margin-top: 10px;
        }
        /*放大缩小2*/
        .loading_ani{
            -webkit-animation:ani_1 3s infinite;
            animation-delay:.3s;
        }
        @-webkit-keyframes ani_1 /* Safari 和 Chrome */
        {
            0%{
                transform:rotateY(0deg) rotateX(0deg);
            }
            70% {
                transform:rotateY(350deg) rotateX(20deg);
            }
            100% {
                transform:rotateY(360deg) rotateX(0deg);
            }
        }
    </style>
    <!--文件-->
    <link rel="stylesheet" href="launcher/css/bootstrap.min.css">
    <link rel="stylesheet" href="launcher/css/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/console.css">
    <link rel="stylesheet" href="css/table.css">
    <link rel="stylesheet" href="css/user.css">
    <link rel="stylesheet" href="css/module.css"><!--组件-->
</head>
<body class="GM_back_1" style="position: fixed">
<!--数据加载条-->
<div id="loadingDiv">
    <div id="loading_imgDiv">
        <img id="loading_img" class="loading_ani" src="image/head/1.png">
        <p id="loading_tips">别闹,加载是件正常事...</p>
    </div>
</div>
<!--内容页-->
<div id="centerDiv" style="display: none;" >
    <!--顶部导航-->
    <header id="headerDiv" style="display: none;" class="my_box_size" ng-controller="headerCtrl">
        <!--左侧按钮-->
        <div class="sidebar-toggle-box" ng-click="setMenuDiv()">
            <div href="#" data-toggle="tooltip" data-placement="right" title="隐藏菜单">
                <i class="glyphicon glyphicon-th-list my_font4"></i>
            </div>
        </div>
        <!--logo标志-->
        <img ng-src="{{logoIcon}}" alt="{{title}}" class="my_box_size">
        <!--右侧菜单-->
        <ul class="my_float_right my_box_size pc_add">
            <li class="header_user">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" >
                    <img ng-src="{{userHead}}" alt="">
                    <span class="username" ng-bind="userName"></span>
                    <b class="caret"></b>
                </a>
                <ul class="dropdown-menu my_font2">
                    <li><a ng-click="userInfo()"><i class="glyphicon glyphicon-user"></i> 我的资料</a></li>
                    <li><a ng-click="logOut()"><i class="glyphicon glyphicon-log-out"></i> 退出</a></li>
                </ul>
            </li>
        </ul>
    </header>
    <div id="downDiv" >
        <!--左侧菜单-->
        <nav id="menuDiv"  style="display: none;"  ng-controller="menuCtrl">
            <ul class="GM_back_1" id="menuUl" ng-repeat-end="{{renderFinish()}}">
                <li class="panel panel-default GM_back_1" ng-repeat="info in menuList">
                    <span class="user-select-none menuDiv_menu my_font3" ng-click="clickOneMenu(info.path)"
                          data-toggle="collapse"  href="#{{info.id}}" data-parent="#menuUl">
                        <i ng-class="info.icon" style="margin-right: 10px"></i>
                        <span ng-bind="info.name"></span>
                        <i ng-hide="info.rightHide" class="glyphicon glyphicon-menu-down my_float_right my_font1"></i>
                    </span>
                    <ul id="{{info.id}}" class="panel-collapse collapse SLmenuUl">
                        <li  ng-repeat="slInfo in info.list">
                            <span class="user-select-none menuDiv_menu my_font2" ng-click="clickMenu(slInfo.path)"
                                  >
                                <span ng-bind="slInfo.name" data-toggle="menu_tooltip"  data-placement="right" title="{{slInfo.tips}}"> *</span>
                            </span>
                        </li>
                        <p style="height: 5px;" ng-hide="info.rightHide"></p>
                    </ul>
                </li>
                <li class="mobile_quitLoginDiv btn btn-danger mobile_add" ng-click="logOut()">
                    退出登录
                </li>
            </ul>

        </nav>
        <!--右侧显示区域-->
        <div id="routeDiv" ui-view  class="GM_back_1 my_box_size">
        </div>
    </div>

    <!--自定义提示框-->
    <my-alert></my-alert>
</div>
<!--异步加载文件-->
<script>
    var AH_param='<%=request.getParameter("AH_param") %>';
</script>
<script data-main="js/AH_Main" src="launcher/js/require.min.js"></script>
</body>
</html>