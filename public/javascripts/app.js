
    $(document).ready(function(){     
      var colors = [];

      var cell = $('\
                    <div class="color-cell" data-dar="0" data-sat="0">\
                      <input type="text" class="color-name"></input>\
                      <span class="repeated">repeated</span>\
                      <input type="text" class="color-input"></input>\
                      <input type="text" class="color-new" readonly="readonly"></input>\
                      <div class="controls-bk"></div>\
                      <img class="btn reset" src="images/reset.png" title="reset">\
                      <img class="btn lp" src="images/plus_wht.png" title="lighten by +1">\
                      <img class="btn dp" src="images/plus_blk.png" title="darken by +1">\
                      <img class="btn sp" src="images/plus_sat.png" title="saturate by +1">\
                      <img class="btn sm" src="images/min_sat.png"  title="saturate by -1">\
                      <span class="sat-amo amounts">s: <span class="val"></span></span>\
                      <span class="dar-amo amounts"><span class="letter">d</span>: <span class="val"></span></span>\
                    </div>\
                  ');

      var sassAPI = function(action, color, value, callback){
        $.get('/sass/'+action+'/'+color+'/'+value, function(data){
          console.log('res: '+ data);
          callback(data);
        });      
      }

      $('#crowdvoice-colors').change(function(){
        var data = $(this).val().replace(/\n\r?/g, ',');
            data = data.split(',');

        var j = 0;
        $.each(data,function(i,line){
          colors[j] = {};
          if(line.indexOf('#')>0){
            var color = line.split(':');
            colors[j].name = color[0];
            colors[j].value = color[1].replace(' ', '').replace(';','');
            j++;
          }
        });

        var i=0

        $.each(colors, function(i, color){
          console.log(color);
          var DOMnode = cell.clone();
          DOMnode.find('.color-input').val(color.value)
                 .parent()
                 .find('.color-name').val(color.name)
                 .parent()
                 .attr('id', i)
                 .attr('data-original', color.value)
                 .css('background-color', color.value);
          
          //DOMnode.attr('style', 'background-color: #'+color.value+';');
          console.log(DOMnode.css('background-color'));
          
          $('body').append(DOMnode);
          i++;
        });

        //complete X cells
        for(; i<=100; i++){
          $('body').append(cell.clone().attr('id', i));
        };

        $('body').append($('#crowdvoice-colors'));

        //$( ".color-cell" ).disableSelection();

        $('.color-input').change(function(){
          var that = this;
          $(this).parent().css('background-color', '#'+$(this).val());
          $(this).parent().attr('data-original', $(this).val());

          var unique = true;

          $.each(colors, function(i, color){

            if( $(that).val() == color.value ){
              $(that).parent().find('.repeated').show();
              unique = false;
            }

          });

          if(unique){
              $(that).parent().find('.repeated').hide();
          }

        });

        $('.dp').click(function(){
          var cell = $(this).parent();
          var bk = cell.css('background-color');

          sassAPI('darken', bk, '1', function(newVal){
            console.log('new:'+newVal);
            cell.css('background-color', newVal);
            cell.find('.color-new').val(newVal);
            
            var d = parseInt(cell.attr('data-dar')) + 1;
            cell.attr('data-dar', d);
            cell.find('.dar-amo .val').text(d);
          });

        });

        $('.lp').click(function(){
          var cell = $(this).parent();
          var bk = cell.css('background-color');

          sassAPI('lighten', bk, '1', function(newVal){
            console.log('new:'+newVal);
            cell.css('background-color', newVal);
            cell.find('.color-new').val(newVal);
            
            var d = parseInt(cell.attr('data-dar')) - 1;
            cell.attr('data-dar', d);
            cell.find('.dar-amo .val').text(d);
          });

        });

        $('.sp').click(function(){
          var cell = $(this).parent();
          var bk = cell.css('background-color');

          sassAPI('saturate', bk, '1', function(newVal){
            console.log('new:'+newVal);
            cell.css('background-color', newVal);
            cell.find('.color-new').val(newVal);
            
            var s = parseInt(cell.attr('data-sat')) + 1;
            cell.attr('data-sat', s);
            cell.find('.sat-amo .val').text(s);
          });
        });

        $('.sm').click(function(){
          var cell = $(this).parent();
          var bk = cell.css('background-color');

          sassAPI('desaturate', bk, '1', function(newVal){
            console.log('new:'+newVal);
            cell.css('background-color', newVal);
            cell.find('.color-new').val(newVal);
            
            var s = parseInt(cell.attr('data-sat')) - 1;
            cell.attr('data-sat', s);
            cell.find('.sat-amo .val').text(s);
          });
        });

        $('.reset').click(function(){
          var cell = $(this).parent();
          cell.css('background-color', cell.attr('data-original'));
          cell.find('.color-new').val(cell.attr('data-original'));
          cell.find('.sat-amo .val').text('');
          cell.find('.dar-amo .val').text('');
        });

        $('body').sortable();

      });



      // $('#debug').click(function(){
      //   console.log('deb');
      //   $.get('/sass/darken/ffffff/2', function(data){
      //     console.log('response'+ data);
      //   });
      // });

    });