/**
 * 页面管理器
 */

(function(window) {
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
          console.log(fromPage)
          //$('.page').removeClass('active');
          if(fromPage){
            if(param && param._back){
              fromPage.$.removeClass('active left right').addClass('right');
            }else{
              fromPage.$.removeClass('active left right').addClass('left');
            }
          }
          $(this.pages).each(function(i, item){
              var $ele = item.$,
                  name = item.name;
              if(name === pageName){
                  hasPage = true;
                  _this.activePage = item;
                  $ele.addClass('no-effic');
                  $ele.removeClass('left right');
                  if(param && param._back){
                    $ele.addClass('left');
                  }else{
                    $ele.addClass('right');
                  }
                  setTimeout(function(){
                    $ele.removeClass('no-effic').removeClass('left right').addClass('active');
                  })
                  $(document).trigger('page', [pageName, fromPage, param]);//pagename, from, param
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
          /*$html.attr({
            'data-page': name,
            'id': name
          });*/
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
      stretchFooter: function(page){
          var pageObj = page || this.getActivePage();
          pageObj.$.addClass('stretch-footer');
      },
      //收缩
      shrink: function(){

      }
  };
  window.PageManager = PageManager;
})(this);
