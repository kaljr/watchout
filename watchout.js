// start slingin' some d3 here.
var width = window.innerWidth;
var height = window.innerHeight;
var nEnemies = 30;
var userR = 15;
var enemyR = 15;

var nEnemiesText = d3.select('.enemies span');
var HighScore = d3.select('.high span');
var CurrentScore = d3.select('.current span');
var Collisions = d3.select('.collisions span');


// object holding scores of the game
var score = {
  current: 0,
  high: 0,
  collisions: 0
}

var increment = function(n){
    nEnemies += n;
    nEnemiesText.html(nEnemies);
    var arr = reposition(nEnemies);

    var circles = enemies.selectAll('circle')
           .data(arr);

    circles.enter()
           .append('circle')
           .attr('cx', Math.random()*width)
           .attr('cy', Math.random()*height)
           .attr('r', enemyR)
           .style('fill', '#2C5DBC');

    circles.exit().remove();
}

var minus5 = d3.select('.minus5');
  minus5.on('click', function(){
    increment(-5)
  });

var minus1 = d3.select('.minus1');
  minus1.on('click', function(){
    increment(-1)
  });

var plus1 = d3.select('.plus1');
  plus1.on('click', function(){
    increment(1)
  });

var plus5 = d3.select('.plus5');
  plus5.on('click', function(){
    increment(5)
  });


// Set up listener for user
var drag = d3.behavior.drag().on('drag', function() {
  var x = +user.attr('cx')+d3.event.dx;
  var y = +user.attr('cy')+d3.event.dy;
  if( 100 < x  && x < 150) {
    user.attr('cx', x).attr('cy', y);
  } else {
    if(x>userR && x<width-userR) {
      user.attr('cx', x);
    }
    if(y>userR && y<height-userR) {
      user.attr('cy', y);
    }
  }
});

// rendering of board
var gameBoard = d3.select('body')
                  .append('svg')
                  .style('width', width)
                  .style('height', height);

var user = gameBoard.append('circle')
                    .attr('cx', width/2)
                    .attr('cy', height/2)
                    .attr('r', userR)
                    .style('fill', '#BC8200')
                    .call(drag);

// SVG group of all our enemies
var enemies = gameBoard.append('g');

// function to create n enemies
var createEnemies = function(n){
  for(var i = 0; i < n; i++){
    enemies.append('circle')
           .attr('cx', Math.random()*width)
           .attr('cy', Math.random()*height)
           .attr('r', enemyR)
           .style('fill', '#2C5DBC');
  }
}(nEnemies);

// repositioning of enemies
var reposition = function(n){
  var arr = [];
  for(var i = 0; i < n; i++){
    arr.push([Math.random() * width, Math.random() * height]);
  }
  return arr;
};

var distance = function(d){

  var enemyX = [d3.select(this).attr('cx'), d[0]];
  var enemyY = [d3.select(this).attr('cy'), d[1]];
  var dist = userR + enemyR;
  var collided = false;

  return function(t){
    var currentX = +enemyX[0] + (enemyX[1]-enemyX[0])*t;
    var currentY = +enemyY[0] + (enemyY[1]-enemyY[1])*t;
    var d = Math.sqrt(Math.pow(currentX - user.attr('cx'), 2) + Math.pow(currentY - user.attr('cy'), 2));
    if( d < dist){
      if(!collided){
      score.current = 0;
      score.collisions++;
      Collisions.html(score.collisions);
      collided = true;
      }
    }
  }
}

var updateEnemyPos = function(){
  var arr = reposition(nEnemies);
  var enemiesNow = enemies.selectAll('circle')
                          .data(arr);

  enemiesNow.transition()
            .duration(3000)
            .tween('custom', distance)
            .attr('cx', function(d) { return d[0] })
            .attr('cy', function(d) { return d[1] })
            .attr('r', enemyR)
            .style('fill', '#2C5DBC');

  // enemiesNow.enter().append('circle');
  // enemiesNow.remove();
}

setInterval(updateEnemyPos, 2500);

var incrementScore = function(){
  CurrentScore.html(score.current);
  if(score.current > score.high){
    score.high = score.current;
  }
  HighScore.html(score.high);
  score.current++;
};

setInterval(incrementScore, 50);


