$(window).on('load', function(){
    //setTimeout(function(){window.scrollTo(0,1)},0);
});

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

//页面管理器====================================================================
var PageManager = function(){
    this.pages = [];
    this.activePage = null;
};
PageManager.prototype = {
    init: function(){
        var _this = this;
        var $pages = $('.page');
        $pages.each(function(i, item){
            //console.log(item)
            var $item = $(item);
            _this.pages.push({
                name: $item.attr('data-page'),
                $: $item
            })
        });
    },
    //页面跳转
    navTo: function(pageName, param){
        var _this = this;
        var hasPage = false;
        var fromPage = this.activePage;
        $('.page').removeClass('active');
        $(this.pages).each(function(i, item){
            var $ele = item.$,
                name = item.name;
            if(name === pageName){
                hasPage = true;
                _this.activePage = item;
                $ele.addClass('active');
                $(document).trigger('page.' + pageName, [pageName, fromPage, param]);//pagename, from, param
                return false;
            }
        });
        if(!hasPage){
            console.log('没有该页面');
        }
        
    },
    //获取当前页
    getActivePage: function(){
        return this.activePage || (function(){
            var $active = $('.page.active');
            return {
                name: $active.attr('data-page'),
                $: $active
            }
        }());
    },
    //获取页面
    getPage: function(pageName){
        var page = null;
        $(this.pages).each(function(i, item){
            var $ele = item.$,
                name = item.name;
            if(name === pageName){
                page = item;
            }
        });
        return page;
    },
    //创建页面
    createPage: function(pageName, pageHtml){
        var name = pageName || 'page_id_' + this.pages.length;
        //var $html = pageHtml || $('<section class="page" />');
        var $html = $('<section class="page" />');
        pageHtml && $html.html(pageHtml);
        $html.attr('data-page', name);
        var page = {
            name: name,
            $: $html
        };
        //添加到DOM
        $('.pages').append($html);

        this.pages.push(page);
        return page;
    },
    //删除页面
    deletePage: function(pageName){
        var _this = this;
        $(this.pages).each(function(i, item){
            var name = item.name;
            if(name === pageName){
                _this.pages.splice(i, 1);
            }
        });
        //从DOM中删除
        $('.page[data-page="' + pageName + '"]').remove();
    },
    //布局控制：占满空间, 参数page：
    stretch: function(page){
        var pageObj = page || this.getActivePage();
        pageObj.$.addClass('stretch');
    },
    //布局控制：占满顶部
    stretchHeader: function(page){
        var pageObj = page || this.getActivePage();
        pageObj.$.addClass('stretch-header');
    },
    //布局控制：占满底部
    stretchFooter: function(){
        var pageObj = page || this.getActivePage();
        pageObj.$.addClass('stretch-footer');
    },
    //收缩
    shrink: function(){

    }
};

var pageManager = new PageManager();
pageManager.init();


//历史记录管理器============================================================
var HistoryManager = function(){
    this.historys = [];
    //历史信息单位
    var obj = {
        header: {
            html: '',
            fn: function(){}
        },
        footer: {
            html: '',
            fn: function(){}
        },
        page: {
            name: 'list'
        }
    }
};
HistoryManager.prototype = {
    init: function(){

    },
    add: function(obj){
        var header = $.extend(navManager.header, obj.header);
        var footer = $.extend(navManager.footer, obj.footer);
        this.historys.push({
            header: header,
            footer: footer,
            page: obj.page
        });
        console.log('History add:', obj.page.name)
    },
    back: function(){
        if(this.historys.length < 1){
            return;
        }
        var obj = this.historys.splice(-1)[0];
        //var obj = this.historys.pop();
        navManager.render(obj.header, obj.footer);
        pageManager.navTo(obj.page.name)
        console.log('History remove:', obj.page.name)
        //return obj;
    }
};
var historyManager = new HistoryManager();
historyManager.init();


//导航管理====================================================================
var NavManager = function(){
    var _this = this;
    this.headerWrap = $('.header');
    this.footerWrap = $('.footer');
    var defaultHeader = {
        title: {
            text: "管理控制台",
            class: ""
        },
        left: {
            actions: [
                {
                    type: "back",
                    text: "返回",
                    fn: function(){
                        this.off().on('touchstart click', function(e){
                            e.preventDefault();
                            historyManager.back();
                        })
                    }
                }
            ]
        },
        right: {
            actions: [
                {
                    type: "refresh",
                    text: "刷新",
                    fn: function(){}
                }
            ]
        }
    };
    var defaultFooter = {
        html: template.render('J_tmpl_footer'),
        fn: function($html){
            $html.find('li').on('click', function(e){
                e.preventDefault();
                var $this = $(this);
                $this.addClass('active').siblings().removeClass('active');
                var pageName = $this.attr('data-nav');
                pageManager.navTo(pageName);
            })
        }
    };
    this.header = defaultHeader;
    this.footer = defaultFooter;
};

NavManager.prototype = {
    init: function(){
        this.render();
    },
    render: function(header, footer){
        var header = $.extend(this.header, header);
        var footer = $.extend(this.footer, footer);
        this.renderHeader(header);
        this.renderFooter(footer);
    },
    renderHeader: function(header){
        var _this = this;
        var title = header.title;
        var left = header.left;
        var right = header.right;
        var headerLeft = this.headerWrap.find('.header-left');
        var headerRight = this.headerWrap.find('.header-right');
        headerLeft.empty();
        headerRight.empty();
        this.headerWrap.find('.title').html(title.text);
        $(left.actions).each(function(i, item){
            var button = _this.createButton(item);
            headerLeft.append(button);
        });
        $(right.actions).each(function(i, item){
            var button = _this.createButton(item);
            headerRight.append(button);
        });

    },
    renderFooter: function(footer){
        var $footerHtml = $(footer.html);
        this.footerWrap.empty().append($footerHtml).show();
        footer.fn.call(null, $footerHtml);
    },
    createButton: function(obj){
        var button = {
            back: '<a href="#" class="btn-back">返回</a>',
            refresh: '<a href="#" class="btn-refresh">刷新</a>'
        }
        var tag = $(button[obj.type]);
        tag.html(obj.text);
        obj.fn.call($(tag));
        return tag;
    }
};
var navManager = new NavManager();
navManager.init();



//应用管理======================================================
var AppManager = function(){

};
AppManager.prototype = {
    init: function(){
        var $document = $(document);
        $document.on('page.login', this.initLoginPage);
        $document.on('page.list', this.initListPage);
        $document.on('page.detail', this.initDetailPage);
        $document.on('page.about', this.initAboutPage);
        //默认使用登录页
        pageManager.navTo('login');

        //动态创建页面例子
        var p = pageManager.createPage();
        p.$.html('<p style="color: #fff;">xiaoshan</p>');
        $document.on('page.' + p.name, function(e, name){
            //alert(name)
        })
        //pageManager.navTo(p.name);
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
            pageManager.navTo('detail');
        });
        
    },
    initListPage: function(e, pageName, fromPage, param){
        //console.log(fromPage)
        navManager.headerWrap.show();
        var header = {
            title: {
                text: '服务器列表'
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