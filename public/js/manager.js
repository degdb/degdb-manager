function createModal(title, body) {
    var modal = '\
    <div class="modal fade" id="SLModal" tabindex="-1" role="dialog" aria-labelledby="modal-label" aria-hidden="true">\
    <div class="modal-dialog">\
     <div class="modal-content">\
       <div class="modal-header">\
         <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
         <h4 class="modal-title inline" id="modalLabel">#{title}</h4>\
       </div>\
       <div class="modal-body">\
       #{body}\
       </div>\
       <div class="modal-footer">\
         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
       </div>\
     </div>\
    </div>\
    </div>\
    ';
    modal = modal.replace("#{body}", body);
    modal = modal.replace("#{title}", title);


    $("body").append(modal);
    $('#SLModal').modal();
    $( "body" ).delegate( "#SLModal", "hidden.bs.modal", function () {
        $('#SLModal').remove(); // Get rid of the modal so that users can see refreshed content
    });
}

function createNewServerModal() {
    var modal = '\
    <input type="text" id="rootPass" class="form-control createField" placeholder="root password" />\
    <br />\
    <input type="text" id="label" class="form-control createField" placeholder="label" />\
    <br />\
    <div id="createSpin" class="noDisplay"><i class="fa fa-spin fa-gear fa-2x"></i></div><b id="createStatus" class="text-muted"></b>\
    <a class="btn btn-warning" id="createServer">create server</a>\
    ';
    createModal("Create Node", modal);
    $( "body" ).delegate( "#createServer", "click", function () {
        $.ajax({
            url: "/linode/createNode",
            method: "POST",
            data: {"rootPass": $("#rootPass").val(), "label": $("#label").val()}
        })
        .done(function( data ) {
            var provisionId = data.id;
            $("#createServer").attr('disabled', 'disabled');
            $("#createSpin").show();
            var pollStatus = window.setInterval(function () {
                $.ajax({
                    url: "/linode/createNode/status/" + provisionId,
                    method: "GET"
                }).done(function (data2, textStatus2, xhr2) {
                    var message = data2.message;
                    if (data2.done === true) {
                        $("#createServer").removeAttr('disabled');
                        $("#createSpin").hide();
                        $("#createStatus").text("Creation succeeded!");
                        clearInterval(pollStatus);
                    }
                    else {
                        $("#createStatus").text(message);
                    }
                });
            }, 1000);


        });
    });
}

function createServerInfoModal(node) {
    var modal = '\
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
     </table>';
     modal = modal.replace("#{name}", node.Name);
     modal = modal.replace("#{address}", node.Addr);
     modal = modal.replace("#{port}", node.Port);
     modal = modal.replace("#{triples}", node.tripleCount);
     createModal("Node information", modal);
}

var moreInfo = function(event) {
    createServerInfoModal($(event.target).data('nodeData'));
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
                div.addClass("circleContainer pull-left");
                div.data("nodeData", nodes[i]);
                div.text(nodes[i].Name);
                div.click(moreInfo);
                div.prependTo(container);
            }
        }
    });
    $(".addNode").click(function () {
        createNewServerModal();
    });
});
