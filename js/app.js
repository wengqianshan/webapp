//图表
var chart1; // globally available
$(document).ready(function() {
  chart1 = new Highcharts.Chart({
     title: {
        text: ''
     },
     colors: ['#f80', '#fff', '#0ff'],
     chart: {
        renderTo: 'canvas',
        type: 'spline',
        backgroundColor: 'transparent',
        borderColor: '#fff'
     },
     legend: {
        enabled: true,
        verticalAlign: 'top',
        borderWidth: 0,
        style: {
            align: 'right'
        },
        itemStyle: {
            color: '#fff'
        },
        itemHoverStyle: {

        },
        itemHiddenStyle: {

        }
     },
     xAxis: {
        categories: ['15:00', '16:00', '17:00', '18:00', '19:00'],
        lineColor: '#f80',
        tickColor: '#ff8800',
        labels: {
            style: {
                color: '#fff'
            }
        }
     },
     yAxis: {
        title: {
            text: ''
        },
        gridLineColor: '#777',
        max: 100,
        min: 0,
        tickInterval: 50,
        labels: {
            style: {
                color: '#fff'
            }
        }
     },
     series: [{
        name: 'CPU使用率',
        data: [25, 33, 60, 55, 12] // predefined JavaScript array
     }],
     credits: {
        enabled: false
     }
  });

});
//实例初始化
window.pageManager = new PageManager();
window.historyManager = new HistoryManager();
window.navManager = new NavManager();
//应用管理======================================================
var AppManager = function(){

};
AppManager.prototype = {
    init: function(){
        pageManager.init();
        navManager.init();


        var $document = $(document);
        //回退事件
        $document.on('history.back', function(e, obj){
            navManager.render(obj.header, obj.footer);
            pageManager.navTo(obj.page.name)
        });
        //添加历史事件
        $document.on('history.add', function(e, obj){
            //console.log('add event')
        });
        $document.on('page.login', this.initLoginPage);
        $document.on('page.list', this.initListPage);
        $document.on('page.detail', this.initDetailPage);
        $document.on('page.about', this.initAboutPage);
        //默认使用登录页
        pageManager.navTo('login');

        //动态创建页面例子
        var p = pageManager.createPage('', 'Hello UED');
        $document.on('page.' + p.name, function(e, name, fromPage, param){
            //alert(name)
            console.log('我是页面:', name, '，我来自页面:', fromPage, '，参数是:', param)
        })
        //pageManager.navTo(p.name, {id: 100});
        //pageManager.stretch();
        //end
    },
    initLoginPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
        navManager.headerWrap.hide();
        navManager.footerWrap.hide();
        pageManager.stretch();
        $('#J_btn_login').off().on('click', function(){
            historyManager.add({
                page: {
                    name: 'login'
                }
            });
            pageManager.navTo('list');
        });
        
    },
    initListPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
        navManager.headerWrap.show();
        var header = {
            title: {
                text: '服务器列表'
            },
            right: {
                actions: [
                    {
                        type: 'refresh',
                        text: '刷新',
                        fn: function(){
                            this.on('touchstart click', function(e){
                                e.preventDefault();
                                alert('不要刷新我');
                            })
                        }
                    }
                ]
            }
        };
        navManager.render(header);

        navManager.footerWrap.show();
        navManager.footerWrap.find('li').removeClass('active').eq(1).addClass('active');
        $('.list-view li').off().on('click', function(){
            historyManager.add({
                header: header,
                page: {
                    name: 'list'
                }
            });
            pageManager.navTo('detail');
        })
        
    },
    initDetailPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
        navManager.headerWrap.show();
        navManager.footerWrap.show();
        var header = {
            title: {
                text: '服务器详情'
            },
            right: {
                actions: []
            }
        };
        navManager.render(header);

        navManager.footerWrap.find('li').removeClass('active').eq(3).addClass('active');
        $('.list-group li').off().on('click', function(){
            historyManager.add({
                header: header,
                page: {
                    name: 'detail'
                }
            });
            pageManager.navTo('about');
        })
        
    },
    initAboutPage: function(e, pageName, fromPage, param){
        var header = {
            title: {
                text: '关于我们'
            }
        };
        navManager.render(header);
        $('#J_create').off().on('click', function(){
            historyManager.add({
                header: header,
                page: {
                    name: 'about'
                }
            });



            var $this= $(this);
            if($this.attr('data-nav')){
                pageManager.navTo($this.attr('data-nav'));
                navManager.render({
                    title: {
                        text: '新页面'
                    }
                });
                return false;
            }
            var p = pageManager.createPage();
            $this.attr('data-nav', p.name);
            p.$.html('<p style="color: #fff;">这是个新页面</p>');
            $(document).on('page.' + p.name, function(e, name){
                //alert(name)
            })
            pageManager.navTo(p.name);
            navManager.render({
                title: {
                    text: '新页面'
                }
            });
            //pageManager.stretch();
        })
    }
};

var appManager = new AppManager();
appManager.init();

//no change