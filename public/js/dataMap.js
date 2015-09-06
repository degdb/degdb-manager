
function drawData(links)
{
    // clear first
    clearData();
    // TODO: fancy animations

    console.log('data => ' + JSON.stringify(links));

    var width = 900;
    var height = 600;
    var radius = 60;
    var outsideCount = links.length-1;

    // radius + 10 for some good margins between the circles
    var bigRadius = (radius + radius/2) * (1/Math.sin(Math.PI / outsideCount)); // calculate radius

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
    };
    var y = function(index) {
        if (index == 0)
        {
            return (height / 2 - (radius / 2));
        }
        //      r * sin(  theta )  + offset
        return bigRadius * Math.sin(angle * (index-1)) + (height / 2 - (radius / 2));
    };

    var barDemo = d3.select("#canvas").
        append("svg:svg").
        attr("width", width).
        attr("height", height);

    barDemo.selectAll("circle").
        data(links).
        enter().
        append("svg:circle").
        attr("cx", function(datum, index) { return x(index); }).
        attr("cy", function(datum, index) { return y(index); }).
        attr("text-anchor", "middle").
        attr("style", "color: #fff").
        text(function(datum) { return "SOME THING HERE" }).
        //attr("height", function(datum) { return y(datum.books); }).
        attr("r", radius);
        //attr("fill", "#2d578b");
}

function clearData()
{
    // TODO: no data
    $("#canvas").empty();
}


function search(str)
{
    // do ajax
    $.ajax({
        url: "/rest/degdb/queryByName?name="+str,
        dataType: 'json',
        method: 'GET',
        success: function(data, status, req) {

            // no data
            if (data.root == undefined)
            {
                console.log('NO DATA');
                clearData();
                return;
            }

            var root = data.root;
            var links = $.map(data.links, function(value, index) {
                return [value];
            });
            links.unshift(root);
            drawData(links)
        },
        error: function() {
            clearData();
        }
    });
}

$(document).ready(function() {
    // bind search function
    $('#searchBox').change(function(event) {
        search($(event.target).val());
    });
    $('#searchButton').click(function(event) {
        event.stopPropagation();
        search($('#searchBox').val());
    });
});