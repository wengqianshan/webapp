/**
 * 导航管理器
 */

(function(window) {
  var NavManager = function(){
      var _this = this;
      this.headerWrap = $('.header');
      this.footerWrap = $('.footer');
      this.header = CONFIG.header;
      this.footer = CONFIG.footer;
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
          var tag = $(CONFIG.button[obj.type]);
          tag.html(obj.text);
          obj.fn && obj.fn.call($(tag));
          return tag;
      }
  };
  window.NavManager = NavManager;
})(this);