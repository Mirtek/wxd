var context = document.getElementById('canvas').getContext("2d");
  
var img = new Image();
img.onload = function () {
    context.drawImage(img, 150, 0);
}
img.src = "./img/logo.png";

document.addEventListener("DOMContentLoaded", function(event) { 
  //do work

function TextFiller(dict) {
    var self = this;

/*  Dict should have:
            canvas -> canvas to draw on
            text -> what it will say
            font -> font style of the text
            location -> font location ex. {x:5, y:5}
            start_style  -> style it will start as
            end_style  -> style it will change to
            callback -> function called when fillText finishes
            id -> id of the TextFiller, this will be passed in the callback

            start -> true/false, if false it wont start till start() is called
                default: false
            time -> how long to fill it up
                default: 1000
            interval_rate -> how often the intervals happen
                default: 1
            right_to_left -> fills from right to left
                default: false
            invert_default_style -> sets the style = end_style, before the fill animation begins
                             (Good if you want to keep the start and end text color the same and just change it when an event is fired)
                default: false
            draw_external -> default it will draw itself. You can set this to true and write a manager to call its draw 
                             (Good if you want to manage a lot and want them all to draw at the same time, reduces flicker on overlap)
                default: false
    */

/* External Functions
           draw()
               Draws the TextFiller in its current fill state. Usually only called externally when "draw_external" is set to true
           start()
               Starts the TextFiller, also used after a stop to resume.
           stop()
               Stops/pauses the TextFiller until start is called.
           reset()
               Resets the TextFiller to the begining
           change_time()
               Changes how long it takes to fill up the word. You can set it when its running.
    */

    // setup context
    var ctx = dict.canvas.getContext('2d');
    var current_width = 0;

    var initialize_text = function() {
        ctx.font = dict.font;
        ctx.fillStyle = dict.start_style;
        if (dict.invert_default_style && current_width === 0) {
            ctx.fillStyle = dict.end_style;
        }
        ctx.fillText(dict.text, dict.location.x, dict.location.y);

  
    };


    var image_load = function() {
        var logo = new Image();
        logo.src = './img/logo.png';
        logo.onload = function(){
        ctx.drawImage(logo, 100, 100);
        }
    };
    // set defaults
    dict.start = dict.start || false;
    dict.time = dict.time || 1000;
    dict.interval_rate = dict.interval_rate || 1;
    dict.draw_external = dict.draw_external || false;
    dict.right_to_left = dict.right_to_left || false;
    dict.invert_default_style = dict.invert_default_style || false;

    initialize_text();

    var text_width = ctx.measureText(dict.text).width;
    var width_per_tick = text_width / dict.time;

    //setup vars to keep track of state
    var ticks_completed = 0;

    this.draw = function() {
        initialize_text();
        if (current_width > 0) {
            ctx.save();
            ctx.beginPath();
            // the Y and height should be programmatically figured out
            if (dict.right_to_left) {
                //ctx.rect(text_width-ticks_completed*width_per_tick, 0, dict.location.x+text_width, dict.canvas.height); 
                ctx.rect(text_width - current_width, 0, dict.location.x + text_width, dict.canvas.height);
            } else {
                //ctx.rect(dict.location.x, 0, ticks_completed*width_per_tick, dict.canvas.height);
                ctx.rect(dict.location.x, 0, current_width, dict.canvas.height);
            }

            ctx.clip();
            ctx.fillStyle = dict.end_style;
            ctx.fillText(dict.text, dict.location.x, dict.location.y);
            ctx.restore();
        }

    };

    var update = function() {
        if (!dict.draw_external) {
            self.draw();
        }
        if ((dict.start) && (ticks_completed < dict.time)) {

            current_width += width_per_tick;
            setTimeout(function() {
                update(++ticks_completed);
            }, dict.interval_rate);
        }
        if (ticks_completed === dict.time && dict.callback) {
            dict.callback(dict.id);
        }

    };

    this.change_time = function(new_time) {
        dict.time = new_time;

        if (dict.time <= ticks_completed) {
            width_per_tick = text_width / dict.time;
            current_width = text_width;
            ticks_completed = dict.time;
            self.draw();
        } else {
            width_per_tick = (text_width - current_width) / (dict.time - ticks_completed);
        }
    };

    this.start = function() {
        dict.start = true;
        setTimeout(function() {
            update(ticks_completed);
        }, dict.interval_rate);
    };

    this.stop = function() {
        dict.start = false;
    };

    this.reset = function() {
        ticks_completed = 0;
        current_width = 0;
        initialize_text();
    };


    if (dict.start) {
        self.start();
    }

}


var canvas = document.getElementById('canvas');

new TextFiller({
    'start': true,
    'end_style': 'white',
    'time': 200,
    'font': "100 24px Arial",
    'start_style': "#87b1df",
    'text': "Технология найма продуктивных сотрудников",
    'location': {
        'x': 10,
        'y': 110
    },
    'canvas': canvas
});
setTimeout(function() {
    // rest of code here
    document.getElementById("mySidenav").classList.toggle("one");
    document.getElementById("mySidenav2").classList.toggle("two");
    document.getElementById("canvas").style.display = "none";
}, 1000);

});