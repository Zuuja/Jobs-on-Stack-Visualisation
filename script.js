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
  .domain([0, 24.453024453024454])
  .range([0, 1]);
  
var strengthScale2 = d3.scale.linear()
  .domain([1, 24.453024453024454])
  .range([0, 1]);
  


//d3.scale.lineral().domain([1,265]).range([1,20]);

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(20)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("data_v1.json", function(error, graph) {
  if (error) throw error;
  
  var maxVal = 0;
  
  graph.links.forEach(function(d){
    d.strength = 1000 * d.count/(graph.nodes[d.source].count * graph.nodes[d.target].count);
    if(maxVal < d.strength)
      maxVal = d.strength;
    });
  
  console.log(maxVal);
  
  
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .linkStrength( function(d) { 
        return strengthScale(d.strength);})
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { 
       // if(d.count > 5)
          return pointsScale(d.count);
        //else
          //return 0;
      })
      .style("opacity", function(d){
        return strengthScale2(d.strength);
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
        link.style("stroke", function(x) { 
            if(d == x.target)
            {
              console.log(x.source);
              x.source.status = 1;
              return "blacred";
            }
            else if(d == x.source)
            {
              x.target.status = 1;
              //x.target.style("class","node selected");
              return "red";
            }
            else
            {
              x.target.status = 0;
              x.source.status = 0;
              //x.target.style("class","node unselected");
              return "link";
          }});
        
        node.filter(function(x){
          if(x.status == 0)
            return x;})
            .style("class","node selected");
        node.filter(function(x){
          if(x.status == 1)
            return x;})
            .style("class","node unselected");
        node.filter(function(x){
          if(x.status == 2)
            return x;})
            .style("class","node clicked");
            
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
    link.attr("x1", function(d) { return Math.min(Math.max(d.source.x,30),height-30); })
        .attr("y1", function(d) { return Math.min(Math.max(d.source.y,30),width-30); })
        .attr("x2", function(d) { return Math.min(Math.max(d.target.x,30),height-30);})
        .attr("y2", function(d) { return Math.min(Math.max(d.target.y,30),width-30);});

    node.attr("cx", function(d) { return Math.min(Math.max(d.x,30),width-30); })
        .attr("cy", function(d) { return Math.min(Math.max(d.y,30),height-30); });
        
    labels.attr("x",function(d) {return d.x;})
        .attr("y",function(d) { return d.y;})
  });
});
