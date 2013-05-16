(function(window){
  window.CONFIG = {
    button: {},
    header: {
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
                            this.on('touchstart click', function(e){
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
        },
    footer: {
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
        },
    page: {
      name: '',
      $: ''
    }
  }
})(this);