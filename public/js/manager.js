function createModal(node)
{
    var modal = '\
    <div class="modal fade" id="SLModal" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">\
    <div class="modal-dialog">\
     <div class="modal-content">\
       <div class="modal-header">\
         <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
         <h4 class="modal-title inline" id="modalLabel">#{title}</h4>\
       </div>\
       <div class="modal-body">\
       <table class="table table-striped">\
    <thead>\
      <tr>\
        <th>Field</th>\
        <th>Value</th>\
      </tr>\
        </thead>\
        <tbody>\
          <tr>\
            <td>Name</td>\
            <td>#{name}</td>\
          </tr>\
          <tr>\
            <td>Address</td>\
            <td>#{address}</td>\
          </tr>\
          <tr>\
            <td>Port</td>\
            <td>#{port}</td>\
          </tr>\
          <tr>\
            <td>Total Triples</td>\
            <td>#{triples}</td>\
          </tr>\
        </tbody>\
        </table>\
       </div>\
       <div class="modal-footer">\
         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
       </div>\
     </div>\
    </div>\
    </div>\
    ';
    modal = modal.replace("#{title}", "Node Information");
    modal = modal.replace("#{name}", node.Name);
    modal = modal.replace("#{address}", node.Addr);
    modal = modal.replace("#{port}", node.Port);

    modal = modal.replace("#{triples}", node.Triples);
    $("body").append(modal);
    $('#SLModal').modal();
    $( "body" ).delegate( "#SLModal", "hidden.bs.modal", function () {
        $('#SLModal').remove(); // Get rid of the modal so that users can see refreshed content
    });
}

var moreInfo = function(event)
{
    createModal($(event.target).attr('nodeData'));
}

$(document).ready(function() {
    var container = $("#nodes");

    $.ajax({
        url: "/rest/degdb/getAllNodes",
        dataType: 'json',
        method: "GET",
        success: function(data, status, request) {
            console.log("DATA -> "+JSON.stringify(data));
            var nodes = data.nodes;
            for (var i = 0; i < nodes.length; i++)
            {
                console.log("" + i + " -> " + JSON.stringify(nodes[i]));
                var div = $("<div>");
                div.addClass("circleContainer");
                div.data("nodeData", nodes[i]);
                div.text(nodes[i].Name);
                div.click(moreInfo);
                div.prependTo(container);
            }
        }
    });
});
