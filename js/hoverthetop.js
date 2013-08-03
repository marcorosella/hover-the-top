/* Hover The Top! - A simple clickless user interface for Leap Motion's LeapJS
v0.2 - August 3, 2013

by Marco Rosella 

marcorosella.com
@Marco_Rosella

*/


var CONFIG = CONFIG || {};

var hoverTheTop = hoverTheTop || {};
var hoverTheTop = {
    numTxt: null,
    timerG: null,
    timerGraph: null,
    intervalTime: 1200,
    intervalID: null,
    paper: null,
    clickElms: [],
    init: function(action) {
        this.resize();
        $('body').append('<div id="index"></div><div id="htp-timer"></div>');
        this.paper = Raphael('htp-timer', "130", "170");
         // Custom Attribute
        this.paper.customAttributes.arc = function (value, total, R) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x =  65 + R * Math.cos(a),
                y = 65 - R * Math.sin(a),
               path;
            if (total == value) {
                path = [["M", 65, 65 - R], ["A", R, R, 0, 1, 1, 359.99, 360 - R]];
            } else {
                path = [["M", 65, 65 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
            }
            return {path: path};
        };
        
        var timerCc = this.paper.circle(65,65,50).attr({stroke: "#222", "fill": "none"});
        var timerBg = this.paper.circle(65,65,55).attr({stroke: "none", "fill": "transparent"});
        this.timerGraph = this.paper.path().attr({stroke: "#222", "stroke-width": 13, arc: [0, 360, 37]});
        this.timerG = this.paper.set();
        this.timerG.push(timerCc,timerBg,this.timerGraph);
        this.timerG.hide();
 
        $(".clickless").each(function() {
            var dest = $(this).attr("data-dest"); 
            var action = $(this).attr("data-action"); 
            var elId = $(this).attr("id"); 
            var el = new hoverTheTop.hoverEl({id: elId, dest: dest, action: action});
            hoverTheTop.clickElms.push(el);
        });

        var fingers = {};
        var spheres = {};
 
        Leap.loop({enableGestures: true}, function(frame) {
            var fingerIds = {};
            var handIds = {};
            var posX1, posX2, posY1, posY2, posZ1, posZ2;
            var posDiff;
            for (var pointableId = 0, pointableCount = frame.pointables.length; pointableId != pointableCount; pointableId++) {
                var pointable = frame.pointables[pointableId];
                var posX = (pointable.tipPosition[0]);
                var posY = (pointable.tipPosition[1]);
                var finger = fingers[pointable.id];
                if (!finger) {
                    fingers[pointable.id] = pointable.id;
                } else {
                }

                if(pointableId == 0) {
                    posX1 = posX;
                    posY1 = posY;
                }
                fingerIds[pointable.id] = true;
            } 
            var newX1 = CONFIG.halfW + (CONFIG.halfW/ (100/posX1));  
            var newY1 = CONFIG.currentH - (CONFIG.currentH / (150/posY1) ); 

            $("#index").css({"left": newX1, "top": newY1});

        });


        $(window).mousemove(function(e) {
                hoverTheTop.clientX = e.clientX;
                hoverTheTop.clientY = e.clientY;
                $("#index").css({"top": hoverTheTop.clientY-40 , "left": hoverTheTop.clientX -40});
        });

        setInterval(function() {            
            jQuery.each(hoverTheTop.clickElms, function() {
                this.check();
            });
        }, 50);
    },
    open: function(section) {
        this.start(section,true);
    },
    close: function(section) {
        this.start(section,false);
    },
    start: function(section,open) {
        $("#htp-timer").show();
        this.timerG.show();
        this.timerGraph.animate({arc: [359.99, 360, 37]}, hoverTheTop.intervalTime, function() {});

        function interact() { 
            if(open) {
                $("#"+section).fadeIn(500);
            } else {
                $("#"+section).fadeOut(500);
            }
            
            $("#htp-timer").hide();
            window.clearInterval(hoverTheTop.intervalID);
        }
        this.intervalID = window.setInterval(interact, hoverTheTop.intervalTime);
    },
    stop: function(action) {
        $("#clickless").hide();
        this.timerGraph.stop().attr({arc: [0, 360, 37]});
        this.timerG.hide();
        window.clearInterval(hoverTheTop.intervalID);
    },
    hoverEl: function(args) {
        this.elObj = $("#"+args.id);
        this.elInd = $("#index");
        this.lock = false;

        this.check = function() {  
            this.pos = this.elObj.offset();
            this.posInd = this.elInd.position();
       
            if(this.posInd.left > (this.pos.left-30) && this.posInd.left < (this.pos.left + this.elObj.width() + 30) && this.posInd.top > (this.pos.top-30) && this.posInd.top < (this.pos.top + this.elObj.height() + 30)) {

                if(this.lock == false) {
                    if(args.action == "open") {
                        hoverTheTop.open(args.dest);
                    } else {
                        hoverTheTop.close(args.dest);
                    }
                }

                this.lock = true;

                $("#htp-timer").css({"top": this.posInd.top-40, "left": this.posInd.left - 40});


            } else {

                if(this.lock == true) {
                    this.lock = false;
                    hoverTheTop.stop();
                    $("#htp-timer").hide();
                }

            } 
        }
    },
    resize: function () {
        CONFIG.currentW = $(window).width();
        CONFIG.currentH = $(window).height();
        CONFIG.halfW = CONFIG.currentW /2;
        CONFIG.halfH = CONFIG.currentH /2;
        $("html").css({"width": CONFIG.currentW, "height": CONFIG.currentH});
    }

 
}