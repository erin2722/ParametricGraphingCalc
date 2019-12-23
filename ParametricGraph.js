//defines the canvas element so that we can draw on it
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var graphDrawn = false;
var trigOrLog = false;
var absOrLog = false;

//so that we only draw the graph once
if(!graphDrawn) {
  drawGridLines();
  graphDrawn= true;
}

//when the graph button is clicked in the html the grpah function is called
document.getElementById("graph").onclick = function() {graph()};
document.getElementById("clear").onclick = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGridLines();
        document.getElementById("xFunctionInput").value = "";
        document.getElementById("yFunctionInput").value = "";
        document.getElementById("tMin").value = "";
        document.getElementById("tMax").value = "";
        document.getElementById("xCood").value = "";
        document.getElementById("velocity").innerHTML = "";
        document.getElementById("acceleration").innerHTML = "";
        };

//code written by me
function drawGridLines() {
  //draws the vertical lines
    for (var x = 0.5; x < canvas.width; x += 10) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
  //draws the horizontal lines
    for (var y = 0.5; y < canvas.height; y += 10) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    ctx.strokeStyle = "#eee";
    ctx.stroke();

    //draws the main x, y axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height/2);
    ctx.lineTo(canvas.width, canvas.height/2);

    ctx.moveTo(canvas.width/2, 0)
    ctx.lineTo(canvas.width/2, canvas.height)

    ctx.strokeStyle = "black";
    ctx.stroke();
}

//code written by me
//takes in an t number input, converts the function inputed by the user into one readable by js eval func, and returns x point
function fx(t) {
  var xFunc = String(document.getElementById('xFunctionInput').value);

  if(xFunc.charCodeAt(0)==116 && xFunc.charCodeAt(1)==97) { //if tan, add Math. to make it readable
    xFunc= convertToFunction(xFunc);
  } else if (xFunc.charCodeAt(0)>58 && xFunc.charCodeAt(0)!=116) { //if a letter that is not t, add Math.
    xFunc= convertToFunction(xFunc);
  }

  return eval(xFunc);
}

//code written by abhi
//same as fx, but returns y value
function fy(t) {
  var yFunc = String(document.getElementById('yFunctionInput').value);

  if(yFunc.charCodeAt(0)==116 && yFunc.charCodeAt(1)==97) { //tests if tan
    yFunc= convertToFunction(yFunc);
    trigOrLog = true;
  } else if (yFunc.charCodeAt(0)>58 && yFunc.charCodeAt(0)!=116) { //tests if function needs "math." appended
      if(yFunc.charCodeAt(0)==115 || yFunc.charCodeAt(0)==99 || yFunc.charCodeAt(0)==108) {
          trigOrLog = true; //tells whather or not it is a trig or log func
       } else {
         trigOrLog = false;
       }
       yFunc= convertToFunction(yFunc);
  } else {
    trigOrLog = false;
  }
  if(yFunc.charCodeAt(0)==97 || yFunc.charCodeAt(0)==108) {
    absOrLog = true;
  }
  return eval(yFunc);
}

//code written by me
function xSolver (fx, domain) {
  var x = [];
  for (i=0; i < domain.length; i++) {
    x.push(fx(domain[i]));
  }
  return x;
}

//code written by abhi
function ySolver (fy, domain) {
  var y = [];
  for (i=0; i < domain.length; i++) {
    if(absOrLog) {
      y.push(-1*fy(domain[i]));
    }
    else {
      y.push(fy(domain[i]));
    }
  }
  if(trigOrLog == false) {
    return y.reverse();
  } else {
    return y;
  }
}

//code written by abhi
function convertToFunction(initialFunc) {
    return "Math." + initialFunc;
}

//code written by abhi
function domainOutput (dMin, dMax) {
  listDomain = [];
  for (i=dMin; i< dMax; i+=0.2) {
    listDomain.push(i);
  }

  return listDomain;
}

//First and Second Derivative//

//code written by abhi
function Velocity (x) {
  var h = 0.0001;
  document.getElementById("velocity").innerHTML = (Math.round(((fx(x+h)-fx(x))/h)*1000)/1000);
  return (fx(x+h)-fx(x))/h;
}

//code written by abhi
function Acceleration (x) {
  var h = 0.0001;
  document.getElementById("acceleration").innerHTML = (Math.round(((Velocity(x+h)-Velocity(x))/h)*1000)/1000);
}

//code written by me
function graph() {
  var tMin = Number(document.getElementById("tMin").value);
  var tMax = Number(document.getElementById("tMax").value);
  var domain = domainOutput(tMin, tMax);

  var x = xSolver(fx, domain);
  console.log(x);

  var y= ySolver(fy,domain);
  console.log(y);

  Velocity(Number(document.getElementById("xCood").value));
  Acceleration(Number(document.getElementById("xCood").value));

  for(var i = 0; i<x.length; i++) {
    setTimeout(drawPoints, 1000, x[i], y[i], x[i-1], y[i-1], y[0]);
  }
}

function drawPoints(x, y, lastX, lastY, initial) {
    var tMin = Number(document.getElementById("tMin").value);
    ctx.beginPath();
    ctx.moveTo(lastX+canvas.width/2, lastY+((canvas.height/2)));
    ctx.lineTo(x+canvas.width/2, y+((canvas.height/2)));
    ctx.strokeStyle="#FF0000";
    ctx.stroke();
}
