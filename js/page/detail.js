/*!
 *@description 详情
 *@author ruoguan
*/
(function(window) {
  var PageDetail = function(appManager, navManager, pageManager, historyManager){
    //console.log(appManager, navManager)
  };
  PageDetail.prototype = {
    init: function(){
      var chart1 = new Highcharts.Chart({
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
    }
  };
  window.PageDetail = PageDetail;
})(this);
