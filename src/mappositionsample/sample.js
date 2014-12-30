var map;
$(function(){
    var mapCanvas = document.getElementById("map_canvas");
    var myLatlng = new google.maps.LatLng(34.733758, 135.496849);
    var mapOptions = {
        zoom: 12,
        center: myLatlng
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    var bounds = new google.maps.LatLngBounds();
    var paths = [];
    infos.forEach(function(info){
        var myLatlng = new google.maps.LatLng(info.lat, info.lng);
        bounds.extend(myLatlng);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title:info.place
        });
        paths.push(myLatlng);
    });
    //  set zoom
    map.fitBounds(bounds);
    // Polyine
    var polylineOpt = {
        map: map,
        path:paths,
        editable:true
    };
    var lineObj = new google.maps.Polyline(polylineOpt);
    google.maps.event.addListener(map, "click", addPoints);
});

// add point infomation
function addPoints(event){
    var myLatlng = event.latLng;
    pointsInfo.addPoint(myLatlng);
    // add tr
    var tbody = $('#points');
    var tr = $('<tr>');
    tr.appendTo(tbody);
    $('<td>').text(pointsInfo.pointNo).addClass("latlngNo").appendTo(tr);
    var infoObj = pointsInfo.infoList[pointsInfo.pointNo];
    $('<td>').text(infoObj.lat).addClass("latlng").appendTo(tr);
    $('<td>').text(infoObj.lng).addClass("latlng").appendTo(tr);
    // description
    var tdDesc = $('<td>').addClass("description");
    $('<input>').addClass("inputDesc").appendTo(tdDesc);
    tdDesc.appendTo(tr);
    // linecolor
    var tdColor = $('<td>').addClass("linecolor");
    $('<input>').attr('type', 'color').addClass("inputColor").appendTo(tdColor);
    tdColor.appendTo(tr);
    // Button
    var tdBtn = $('<td>').addClass("btn");
    $('<input>').attr('type', 'button').addClass("inputBtn").attr('value', 'delete').attr('name', 'deleteBtn')
            .attr('deleteno', pointsInfo.pointNo)
            .click(function(event){
                var delBtnObj = $(this);
                // remove tr
                var parentTr = delBtnObj.parent().parent();
                parentTr.remove();
                // reset no TODO
                var delNo = delBtnObj.attr('deleteno');
                pointsInfo.deletePoint(delNo);
            })
            .appendTo(tdBtn);
    tdBtn.appendTo(tr);
    // create marker
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title:String(pointsInfo.pointNo)
    });

}

var pointsInfo = {
    pointNo:-1,
    infoList:[],
    addPoint:function(latlng){
        this.pointNo++;
        var infoObj = {
            lat:latlng.lat(),
            lng:latlng.lng()
        };
        this.infoList.push(infoObj);
    },
    deletePoint:function(delNo){
        this.infoList.splice(delNo, 1); // remove line from array
        this.pointNo--;
        alert(delNo + "," + this.pointNo);
    }
    
};

var infos = [
    {place: 'KIX', lat: 34.4342, lng: 135.2328},
    {place: 'SFO', lat: 37.6189, lng: -122.3750}
];
