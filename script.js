// Code goes here


var width = 700,
    height = 700;

var color = d3.scale.category20();
var pointsScale = d3.scale.sqrt()
  .domain([0, 265])
  .range([1, 50]);
var linkScale = d3.scale.linear()
  .domain([1, 56])
  .range([0, 10]);

var strengthScale = d3.scale.linear()
  .domain([0, 0.02445302445302445])
  .range([0, 1]);
  
function sila(d)
{
  return 1000 * d.count/(d.source.count * d.target.count);
}


//d3.scale.lineral().domain([1,265]).range([1,20]);

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(0)
//    .linkStrength( function(d) { 
  //    return d.strength;})
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data_v1.json", function(error, graph) {
  if (error) throw error;
  
  graph.links.forEach(function(d){
    d.strength = sila(d);
    });
  
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { 
          return pointsScale(d.count);
      })
      .style("opacity", function(d){
        return strengthScale( d.count/(d.source.count * d.target.count));
      });
      
  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d) { return pointsScale(d.count); })
      .on("click",function(d,i){
        console.log("ha ha!");
        console.log(d.name);
        d.status = 2;
        link.attr("class", function(x,i) { 
            if(d == x.target)
            {
              x.source.status = 1;
              console.log(i);
              return "link selected";
            }
            else if(d == x.source)
            {
              x.target.status = 1;
              console.log(i);
              return "link selected";
            }
            else
            {
              x.target.status = 0;
              x.source.status = 0;
              return "link";
          }});
        node.attr("fill", function(x) {
          if(x.status == 0)
            return "steelblue";
          else if(x.status == 1)
            return "green";
          else
            return "red";
        })
        
        
            
        /*node.style("fill", function(x)
        {
          if(x == d)
            return "blue";
          else
            return color(2);
        });*/
        
        
        /*
        node.style("opacity",function(x)
        {
          if(x == d)
            return 1;
          else
          return 0.5;
        });*/
      })
      .call(force.drag);
      
  var labels = svg.selectAll(".label")
    .data(graph.nodes)
   .enter().append("text")
      .attr("font-size","10")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-family","sans-serif")
      .text(function(d) { return d.name; });
      
      
  console.log("cokolwiek");
  node.append("title")
      .text(function(d) { return d.name; });
  labels.append("title")
      .text(function(d) { return d.name; });
  
  
  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
        
    labels.attr("x",function(d) {return d.x;})
        .attr("y",function(d) { return d.y;})
  });
});
