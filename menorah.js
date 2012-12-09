$(function(){
  
draw_menorah();

function draw_menorah(){

  var drawing_top = 0;
  var menorah_left = 0;
  var menorah_right = 800;
  var distance_from_side = 50;
  var top_buffer = 100;

  var candle_height = 100;
  var menorah_height = 400;

  var menorah_top = top_buffer + candle_height; //location of the top of the menorah.
  var menorah_bottom = menorah_height + menorah_top; //location
  var shamash_height = 30;
  var hanukkah_start_date_2012 = moment(new Date(2012, 11, 8, 16, 28, 0, 0)); //(2012, 11, 8, 16, 28, 0, 0)
  var now = moment();

  var base_width = 150;

  candle_count = Math.floor(now.diff(hanukkah_start_date_2012, "minutes") / (24 * 60)) + 1;
  next_candlelighting_time = hanukkah_start_date_2012.add("days", now.diff(hanukkah_start_date_2012, "days") );
  if( next_candlelighting_time.diff(now, "seconds") < 0){ //if the closest candlelighting time has already passed.
    next_candlelighting_time = hanukkah_start_date_2012.add("days", now.diff(hanukkah_start_date_2012, "days") + 1 );
  }

  if(candle_count > 8){
    candle_count = 0;
    console.log("See you next year!");
    window.clearInterval(window.should_i_keep_drawing_the_menorah);
  }else if(candle_count <= 7){
    var milliseconds_until_next_candlelighting = next_candlelighting_time.diff(now, "seconds") * 1000;
    _.delay(draw_menorah, milliseconds_until_next_candlelighting);
    console.log("If you're still here, I'll light " + (candle_count + 1) + " candles in about " + moment.duration(milliseconds_until_next_candlelighting).humanize());
  }

  if(window.override_candle_count){
    candle_count = window.override_candle_count;
  }
  console.log("Candles: " + candle_count)



  var paper = Raphael(menorah_left, drawing_top, menorah_right, menorah_bottom+ 500);
  //var conline1 = paper.path("M100,500L0,250");
  //var conline2 = paper.path("M100,0L0,250");
  //var conline3 = paper.path("M50,125l0,250");
  var stalk = paper.path("M" + (menorah_right/2) +","+ (menorah_top - shamash_height) + "L"+(menorah_right/2)+"," + (menorah_bottom));
  stalk.attr("stroke-width", 30);
  stalk.attr("stroke", "#FF0");
  var base = paper.path("M" + (menorah_right/2 - base_width/2) +","+ (menorah_bottom ) + "L"+(menorah_right/2 + base_width/2)+"," + (menorah_bottom));
  base.attr("stroke-width", 30);
  base.attr("stroke", "#FF0");


  var curve_adjustment = 0;
  var source_coordinates = [menorah_left + distance_from_side, menorah_top];
  var target_coordinates = [menorah_right - distance_from_side, menorah_top ];

  //Mbeginning x, y; Qcontrol point x, y, end x, y
  var curve_distance_adjustment = 75;

  _(_([0, 1, 2, 3]).map(function(n){return n * curve_distance_adjustment; })).each(function(which_curve_adjustment){
    var curve_string = "M" + (source_coordinates[0] + which_curve_adjustment) + "," + (source_coordinates[1]);
    curve_string += " Q"+ ((Math.abs(source_coordinates[0] + target_coordinates[0])) / 2) +"," + (menorah_top + menorah_bottom - menorah_height - which_curve_adjustment/1.5)*2 + ", ";
    curve_string += (target_coordinates[0] - which_curve_adjustment ) + "," + (target_coordinates[1] );
    var curve = paper.path(curve_string);
    curve.attr("stroke-width", 30);
    curve.attr("stroke", "#FF0");
  });

  var cover_upper_width = 20;
  var cover_upper1 = paper.path("M" + (source_coordinates[0] - 15 ) + "," + source_coordinates[1] + ",L" + (source_coordinates[0] + curve_distance_adjustment*4) + ","+ source_coordinates[1] );
  cover_upper1.attr("stroke-width", cover_upper_width);
  var cover_upper2 = paper.path("M" + (target_coordinates[0] + 15 ) + "," + source_coordinates[1] + ",L" + (target_coordinates[0] - curve_distance_adjustment*4) + ","+ source_coordinates[1] );
  cover_upper2.attr("stroke-width", cover_upper_width);

  //shamash
  if(candle_count >= 1){
    if(window.shamash){
      window.shamash.remove();
      //window.shamash_glow.remove();
    }
    window.shamash_flicker_x = _.random(-10, 10)
    window.shamash_flicker_y = _.random(-10, 10)
    window.shamash = draw_candle(menorah_right/2, menorah_top - shamash_height, window.shamash_flicker_x, shamash_flicker_y);
    //window.shamash_glow = window.shamash.glow({color: "#ffaa00"});
  }
  _(candle_count).times(function(n){ 
    candle_x_adjustment = curve_distance_adjustment * n
    if(n >= 4){ //candles 5-8 have to be translated across the shamash
      candle_x_adjustment += Math.abs((source_coordinates[0] - target_coordinates[0] + 7 * curve_distance_adjustment) + 5) ;
    }else{
      candle_x_adjustment += 5;
    }
    candle = draw_candle(source_coordinates[0] + candle_x_adjustment , source_coordinates[1] + (cover_upper_width/2), _.random(-10, 10), _.random(-10, 10));
    //candle.glow(); //why doesn't this work
  })

  function draw_candle(candle_center_bottom_x, candle_center_bottom_y, flicker_x, flicker_y){
    var candle_width = 25;
    var candle_burn_constant = 100000;
    var candle_burn_time = Math.floor(candle_burn_constant * _.random(8, 12) / 10);
    var candle_path = "M" + (candle_center_bottom_x) + "," + (candle_center_bottom_y);
    candle_path += "L" + (candle_center_bottom_x) + "," + (candle_center_bottom_y - candle_height);
    var candle = paper.path(candle_path);
    candle.attr("stroke-width", candle_width);
    candle.attr("stroke", "#28DEDE");

    var flame_height = 60;
    var flame_width = 28;
    var flame_center_bottom_y = candle_center_bottom_y - candle_height;
    var flame_path = "M" + (candle_center_bottom_x - flame_width/2) + "," + (flame_center_bottom_y)
    flame_path += "L" + (candle_center_bottom_x + flicker_x) + "," + (flame_center_bottom_y - flame_height + flicker_y)
    flame_path += "L" + (candle_center_bottom_x + flame_width/2) + "," + (flame_center_bottom_y)
    flame_path += "z";
    var flame = paper.path(flame_path);
    flame.attr("stroke", "#ffaa00");
    flame.attr("fill", "#ffaa00");
    //flame.glow();

    var planck_time = 1000;
    _(Math.floor(candle_burn_time / planck_time)).times(function(n){
      iterations = Math.floor(candle_burn_time / planck_time);
      current_scale_factor = (n + 1) / iterations;

      candle_top_this_interation = candle_center_bottom_y - (candle_height * (1 - current_scale_factor)); // if there are five iterations, multiple by .8, then .6
      var new_candle_path = "M" + (candle_center_bottom_x) + "," + candle_center_bottom_y;
      new_candle_path += "L" + (candle_center_bottom_x) + "," + (candle_top_this_interation );

      var intermediate_flame_width = flame_width * (1 - (0.25 * current_scale_factor));
      var intermediate_flame_height = flame_height * (1 - (0.5 * current_scale_factor));
      var bottom_flame_path = "M" + (candle_center_bottom_x - intermediate_flame_width/2) + "," + candle_top_this_interation; //bottom left
      bottom_flame_path += "L" + (candle_center_bottom_x + _.random(-10, 10)) + "," + (candle_top_this_interation - intermediate_flame_height + _.random(-10, 10)); //top
      bottom_flame_path += "L" + (candle_center_bottom_x + intermediate_flame_width/2) + "," + candle_top_this_interation; //bottom right
      function delayable_anim(){
        candle.animate({path: new_candle_path}, candle_burn_time / iterations, "linear");
        flame.animate({path : bottom_flame_path }, candle_burn_time / iterations, "linear");
      }
      _.delay(delayable_anim, n * planck_time );
    });


    //flicker
    /*var new_flame_path = "M" + (candle_center_bottom_x - flame_width/2) + "," + (flame_center_bottom_y) //bottom left
    new_flame_path += "L" + (candle_center_bottom_x + _.random(-10, 10)) + "," + (flame_center_bottom_y - flame_height + _.random(-10, 10)) //top
    new_flame_path += "L" + (candle_center_bottom_x + flame_width/2) + "," + (flame_center_bottom_y) //bottom right
    new_flame_path += "z";*/
    //flame.animate({path : new_flame_path }, 1000, "linear", flicker(flame, flame_height, flame_width, flame_center_bottom_y, candle_center_bottom_x, candle_center_bottom_y ));


    var gone_out_flame_path = "M" + (candle_center_bottom_x ) + "," + (candle_center_bottom_y) //bottom left
    gone_out_flame_path += "L" + (candle_center_bottom_x ) + "," + (candle_center_bottom_y ) //top
    gone_out_flame_path += "L" + (candle_center_bottom_x ) + "," + (candle_center_bottom_y) //bottom right
    function delayable_anim(){
      flame.animate({path : gone_out_flame_path }, 300, "linear");
    }
    _.delay(delayable_anim, Math.floor(candle_burn_time / planck_time ) * planck_time );

    candle_set = paper.set();
    candle_set.push(candle);
    candle_set.push(flame);

    return candle_set;
  }
  function flicker(flame, flame_height, flame_width, flame_center_bottom_y, candle_center_bottom_x, candle_center_bottom_y ){
    var new_flame_path = "M" + (candle_center_bottom_x - flame_width/2) + "," + (flame_center_bottom_y)
    new_flame_path += "L" + (candle_center_bottom_x + _.random(-10, 10)) + "," + (flame_center_bottom_y - flame_height + _.random(-10, 10))
    new_flame_path += "L" + (candle_center_bottom_x + flame_width/2) + "," + (flame_center_bottom_y)
    new_flame_path += "z";
    flame.animate({path : new_flame_path }, 1000, "linear" )// flicker(flame, flame_height, flame_width, flame_center_bottom_y, candle_center_bottom_x, candle_center_bottom_y ))
  }
  return paper;
}
});
