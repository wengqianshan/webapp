/**
 * 模板管理器
 * 可用性不大，可以考虑把所有模板最终合并到页面中来处理会更好
 */
(function(window, $document) {
  var TemplateManager = function(){
      this.historys = [];
  };
  TemplateManager.prototype = {
      init: function(){

      },
      load: function(tmpl){
          var json = null;
          $.ajax({
            type: 'get',
            url: 'template/tmpl.html',
            async: false,
            success: function(data){
              //console.log(data)
              json = data;
            }
          });
          return json;

      },
      back: function(){
         
      }
  };
  window.TemplateManager = TemplateManager;
})(this, $(document));