/**
 * 历史管理器
 */
/*
一个历史单位：

*/
(function(window, $document) {
  var HistoryManager = function(){
      this.historys = [];
  };
  HistoryManager.prototype = {
      init: function(){

      },
      add: function(obj){
          var header = $.extend(CONFIG.header, obj.header);
          var footer = $.extend(CONFIG.footer, obj.footer);
          this.historys.push({
              header: header,
              footer: footer,
              page: obj.page
          });
          $document.trigger('history.add', obj);
          console.log('History add:', obj.page.name)

      },
      back: function(){
          if(this.historys.length < 1){
              return;
          }
          var obj = this.historys.splice(-1)[0];
          //var obj = this.historys.pop();
          $document.trigger('history.back', obj);
          console.log('History remove:', obj.page.name);
      }
  };
  window.HistoryManager = HistoryManager;
})(this, $(document));