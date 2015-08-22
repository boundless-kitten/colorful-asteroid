app.directive('clusterPlot', function( /* dependencies */ ) {
  // define constants and helpers used for the directive
  // ...
  return {
    restrict: 'E', // the directive can be invoked only by using <my-directive> tag in the template
    scope: { // attributes bound to the scope of the directive
      key: '@key',
      result: '@result'
    },
    link: function(scope, element, attrs) {

      var colorArr = ["#FF5044", " #E89040", "#FFD536", "#C0E842", "#4BFF6B"];
      var width = 500,
          height = 150,
          padding = 30, // separation between nodes
          maxRadius = 100;

      var m = 5; // number of distinct clusters

      var x = d3.scale.ordinal()
            .domain(d3.range(m))
            .rangePoints([0, width], 1);

      var nodes = [];
      
      var force = d3.layout.force()
              .nodes(nodes)
              .size([width, height])
              .gravity(0)
              .charge(0)
              .on("tick", tick);
              
      var svg = d3.select(element[0]).append("svg")
            .attr("width", width)
            .attr("height", height);

      var circle = svg.selectAll("circle");

      function tick(e) {
        if(circle){
          circle
            .each(gravity(.2 * e.alpha))
            .each(collide(.5))
            .attr("cx", function(d) {
              return d.x;
            })
            .attr("cy", function(d) {
              return d.y;
            });
        }
      }

      // Move nodes toward cluster focus.
      function gravity(alpha) {
        return function(d) {
          d.y += (d.cy - d.y) * alpha;
          d.x += (d.cx - d.x) * alpha;
        };
      }

      // Resolve collisions between nodes.
      function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) {
          var r = d.radius + maxRadius + padding,
              nx1 = d.x - r,
              nx2 = d.x + r,
              ny1 = d.y - r,
              ny2 = d.y + r;
          quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
              var x = d.x - quad.point.x,
                  y = d.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y),
                  r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
              if (l < r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        };
      }

      // WATCH

      scope.$watch('result', function(newVal, oldVal) {
        
        var resNew = JSON.parse(newVal);
        var resOld = JSON.parse(oldVal);
        var res;

        if(nodes.length === 0){
          res = resNew;
        }else{
          res = resNew.splice(- (resNew.length - resOld.length));
        }

        res.forEach(function(r) {
          nodes.push({
            radius: 8,
            color: colorArr[r-1],
            cx: x(r-1),
            cy: height / 2
          });
        });
        
        circle = circle.data(force.nodes());
        circle
          .enter().append("circle")
          .attr("r", function(d) {
            return d.radius;
          })
          .style("fill", function(d) {
            return d.color;
          })
          .call(force.drag);

        force.start();

      });
    }
  };
});
