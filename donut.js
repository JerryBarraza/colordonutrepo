//
//Original spinning donut.js code and maths by Andy Sloane, a1k0n.net
//https://www.a1k0n.net/2011/07/20/donut-math.html
//
//I just added the changing color modes and minor effects. -J wave.s
//8.6.2020

(function() {

    var state = 0;
    var colorModeRefresh = 20;
    var mode = "";
    var _onload = function() {

        var canvastag = document.getElementById('canvasdonut');
    
        var tmr2 = undefined;
        var A=1, B=1;

        var intervalInMilli = 50;

        var colorTimerCount = 0;
 
        var red = 0;
        var green = 255;
        var blue = 255;
        var colorState = 0;

        var sizeDelta = 0.5;
        var sizeState = 0;
        var sizeTimerCount = 0;

        var shinnyState = 0;
        var shadowState = 0;

        var ctx0 = canvastag.getContext('2d');
        var canW = ctx0.canvas.width; //one side only, square canvas

        var R1 = 1;//1, controls donut tube diameter
        var R2 = 2;//2, controls donut hole diameter
        var K1 = canW * sizeDelta;//150, controls overall size..?
        var K2 = 5;//5, controls..?
        var dotSize = ctx0.canvas.width * 0.015;

        var setState = function(){
            switch(state){
                case 0:
                    state = 1; colorModeRefresh = 200; colorTimerCount = 0;
                    mode = "C L A S S I C S L O W" ; break;
                case 1: 
                    state = 2; colorModeRefresh = 1; colorTimerCount = 0;
                    mode = "P A R T Y" ; break;
                case 2: 
                    state = 3;  colorModeRefresh = 50; colorTimerCount = 0;
                    mode = "C L A S S I C F A S T" ; break;
                case 3: 
                    state = 0; colorModeRefresh = 4; colorTimerCount = 0;
                    mode = "S T R O B E" ; break;
                default: return;
            }
            document.getElementById("mode").innerHTML = mode;
        }

        var colorSwipe = function() {
            switch(colorState) {
                case 0:
                    red++; green--;
                    if(red == 255){ colorState = 1; } break;
                case 1:
                    green++; blue--;
                    if(green == 255){ colorState = 2; } break;
                case 2:
                    red--; blue++;
                    if(blue == 255){ colorState = 0; } break;
                default: return;
            }
        }

        //This works, but I wanted to make the grow/shrink
        //interval based on sizeDelta hitting 0.6 and 0.4
        //so I could change growth as percentage of canvas width
        //not on sizeTimerCount, but this still works.
        //Adjust growth by increase/decrease sizeTimerCount
        var sizeSwipe = function(){
            switch(sizeState){
                case 0:
                    sizeDelta -= 0.01;
                    sizeTimerCount ++;
                    K1 = canW * sizeDelta;
                    if (sizeTimerCount == 20) { sizeState = 1; sizeTimerCount = 0; }
                    break;
                case 1:
                    sizeDelta += 0.01;
                    sizeTimerCount ++;
                    K1 = canW * sizeDelta;
                    if (sizeTimerCount == 20) { sizeState = 0; sizeTimerCount = 0; }
                    break;
                default: return;
            }
        }

        shinny = function(){
            switch(shinnyState){
                case 0:
                    shinnyState = 1; break;
                case 1:
                    shinnyState = 0; break;
                default: return;
            }
        }

        shadow = function(){
            switch(shadowState){
                case 0:
                    shadowState = 1; break;
                case 1:
                    shadowState = 0; break;
                default: return;
            }
        }

        // This is a reimplementation according to my math derivation on the page https://www.a1k0n.net/2011/07/20/donut-math.html
        var canvasframe=function() {
            sizeSwipe();
            var ctx = canvastag.getContext('2d');
            ctx.fillStyle='#000';
            ctx.fillRect(0, 0, canW, canW); //square canvas

            A += 0.07;
            B += 0.03;

            // precompute cosines and sines of A, B, theta, phi, same as before
            var cA=Math.cos(A), sA=Math.sin(A),
                cB=Math.cos(B), sB=Math.sin(B);
            for(var j=0;j<6.28;j+=0.3) { // j <=> theta
                var ct=Math.cos(j),st=Math.sin(j); // cosine theta, sine theta
                for(i=0;i<6.28;i+=0.1) {   // i <=> phi
                    var sp=Math.sin(i),cp=Math.cos(i); // cosine phi, sine phi
                    var ox = R2 + R1*ct, // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
                        oy = R1*st;
                    var x = ox*(cB*cp + sA*sB*sp) - oy*cA*sB; // final 3D x coordinate
                    var y = ox*(sB*cp - sA*cB*sp) + oy*cA*cB; // final 3D y
                    var ooz = 1/(K2 + cA*ox*sp + sA*oy); // one over z
                    var xp=(ctx.canvas.width/2+K1*ooz*x); // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
                    var yp=(ctx.canvas.width/2-K1*ooz*y); // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
                    
                    // luminance, scaled back to 0 to 1
                    var L=0.7*(cp*ct*sB - cA*ct*sp - sA*st + cB*(cA*st - ct*sA*sp));
                    colorTimerCount++;
                    if(colorTimerCount == colorModeRefresh){
                        colorSwipe();
                        colorTimerCount = 0;
                    }
                    if(L > 0) {
                        if(shadowState == 1){
                            if(L > 0.6){
                                ctx.fillStyle = 'rgba(255,255,255,1)';
                                ctx.fillRect(xp, yp, dotSize, dotSize);
                            }
                        }
                        else{
                            if(L > 0.75 && shinnyState == 1 ){
                                ctx.fillStyle = 'rgba(255,255,255,1)';
                                ctx.fillRect(xp, yp, dotSize, dotSize);
                            }
                            else{
                                ctx.fillStyle = 'rgba('+red+','+green+','+blue+','+L+')';
                                ctx.fillRect(xp, yp, dotSize, dotSize);
                            }
                        }
                    }
                }
            }
        }

        window.anim1 = function() {
            setState();
            if(tmr2 === undefined) {
                tmr2 = setInterval(canvasframe, intervalInMilli);
            }
            else {
                clearInterval(tmr2);
                tmr2 = undefined;
                tmr2 = setInterval(canvasframe, intervalInMilli);
            }
        };

        window.pause = function(){
            if (tmr2){
                clearInterval(tmr2);
                tmr2 = undefined;
                document.getElementById("pause").innerHTML = "P L A Y"
            }
            else{
                tmr2 = setInterval(canvasframe, intervalInMilli);
                document.getElementById("pause").innerHTML = "P A U S E"
            }
        };
        
        canvasframe();
    }

    if(document.all)
        { window.attachEvent('onload',_onload); }
    else
        { window.addEventListener("load",_onload,false); }

})();
