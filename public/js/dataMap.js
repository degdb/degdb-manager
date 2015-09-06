
$(document).ready(function() {

    var data = [
        {year: 2006, books: 54},
        {year: 2007, books: 43},
        {year: 2008, books: 41},
        {year: 2009, books: 44},
        {year: 2010, books: 35},
        {year: 2009, books: 44},
        {year: 2010, books: 35},
        {year: 2009, books: 44},
        {year: 2010, books: 35}
    ];

    var width = 500;
    var height = 500;
    var radius = 25;
    var outsideCount = data.length - 1;

    // radius + 10 for some good margins between the circles
    var bigRadius = (radius + 20) * (1/Math.sin(Math.PI / outsideCount)); // calculate radius

    console.log(bigRadius)
    if (bigRadius < (2*radius+20))
    {
        bigRadius = 2*radius+20;
    }

    var angle = (2*Math.PI)/outsideCount;

    var x = function(index) {
        if (index == 0)
        {
            return (width / 2 - (radius / 2));
        }

        //      r * cos(  theta )  + offset
        return bigRadius * Math.cos(angle * (index-1)) + (width / 2 - (radius / 2));

        //else if (index == 1)
        //{
        //    return (width / 2 - (radius / 2)) + bigRadius;
        //}
        //
        //var mult = index > Math.ceil(outsideCount/2) ? -1 : 1;
        //return (mult * Math.cos(angle*index) * bigRadius) + (width / 2 - (radius / 2));
    };

    var y = function(index) {
        if (index == 0)
        {
            // center
            return (height / 2 - (radius / 2));
        }

        //      r * sin(  theta )  + offset
        return bigRadius * Math.sin(angle * (index-1)) + (height / 2 - (radius / 2));

        //else if (index == 1)
        //{
        //    return (height / 2 - (radius / 2)) - bigRadius;
        //}
        //else
        //{
        //    var mult = index > Math.ceil(outsideCount/2) ? -1 : 1;
        //    return (mult * Math.sin(angle*index) * bigRadius) + (height / 2 - (radius / 2));
        //}
    };

    //var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
    //var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.books; })]).rangeRound([0, height]);

    var barDemo = d3.select("#canvas").
        append("svg:svg").
        attr("width", width).
        attr("height", height);

    barDemo.selectAll("circle").
        data(data).
        enter().
        append("svg:circle").
        attr("cx", function(datum, index) { return x(index); }).
        attr("cy", function(datum, index) { return y(index); }).
        //attr("height", function(datum) { return y(datum.books); }).
        attr("r", radius);
        //attr("fill", "#2d578b");
});