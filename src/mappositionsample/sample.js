/*
 * sample.js
 */
var map;
var initPolyLine;
var infos = [
    {place: 'KIX', lat: 34.4342, lng: 135.2328},
    {place: 'SFO', lat: 37.6189, lng: -122.3750}
];

/*
 * initialize
 */
$(function(){
   // init map
   initMap();
   // regist [save to json] button event
   $('#saveBtn').on('click', saveJson);
   // regist map event
   google.maps.event.addListener(map, "click", addPoints);
});

/*
 * initialize google map
 */ 
function initMap(){
    var mapCanvas = document.getElementById("map_canvas");
    var kixLatLng = infos[0];
    var myLatlng = new google.maps.LatLng(kixLatLng.lat, kixLatLng.lng);
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
    // draw KIX-SFO Polyine
    var polylineOpt = {
        map: map,
        path:paths,
        editable:true
    };
    initPolyLine = new google.maps.Polyline(polylineOpt);    
}

/*
 * add point to map
 */
function addPoints(event){
    var myLatlng = event.latLng;
    var infoOptions = {
        latlng:myLatlng
    };
    pointsInfo.addPoint(infoOptions);
    // add latest point to table 
    addTr(pointsInfo.getPoint());
}

/*
 * add tr element to table
 */
function addTr(pointObj){    
    var tbody = $('#points');
    var tr = $('<tr>');
    tr.appendTo(tbody);
    $('<td>').text(pointObj.pointNo+1).addClass("latlngNo").appendTo(tr);
    $('<td>').text(pointObj.lat).addClass("latlng").appendTo(tr);
    $('<td>').text(pointObj.lng).addClass("latlng").appendTo(tr);
    // description
    var tdDesc = $('<td>').addClass("description");
    $('<input>').addClass("inputDesc").val(pointObj.desc)
            .attr('selno', pointObj.pointNo)
            .change(function(event){
                var inDesc = $(this);
                // set desc
                var selNo = inDesc.attr('selno');
                pointsInfo.setDesc(selNo, inDesc.val());
            })
            .appendTo(tdDesc);
    tdDesc.appendTo(tr);
    // Color Picker
    var tdColor = $('<td>').addClass("linecolor");
    $('<input>').attr('type', 'color').val(pointObj.color).addClass("inputColor")
            .attr('selno', pointObj.pointNo)
            .change(function(event){
                var inColor = $(this);
                // set color
                var selNo = inColor.attr('selno');
                pointsInfo.setColor(selNo, inColor.val());
                // set color input
                inColor.parent().next('.linecolor').children('input').val(inColor.val());
            })
            .appendTo(tdColor);
    tdColor.appendTo(tr);
    // Color input
    var tdColor2 = $('<td>').addClass("linecolor");
    $('<input>').val(pointObj.color).addClass("inputColor").attr('name', 'inColor')
            .attr('selno', pointObj.pointNo)
            .change(function(event){
                var inColor = $(this);
                // set color
                var selNo = inColor.attr('selno');
                pointsInfo.setColor(selNo, inColor.val());
                // set color picker
                inColor.parent().prev('.linecolor').children('input').val(inColor.val());
            })
            .appendTo(tdColor2);
    tdColor2.appendTo(tr);
    // delete Button
    var tdBtn = $('<td>').addClass("btn");
    $('<input>').attr('type', 'button').addClass("inputBtn").attr('value', 'delete')
            .attr('deleteno', pointObj.pointNo)
            .click(function(event){
                var delBtnObj = $(this);
                // remove tr
                var parentTr = delBtnObj.parent().parent();
                parentTr.remove();
                // delete pointsInfo
                var delNo = delBtnObj.attr('deleteno');
                pointsInfo.deletePoint(delNo);
                pointsInfo.deleteMarker(delNo);
            })
            .appendTo(tdBtn);
    tdBtn.appendTo(tr);
    // create marker
    pointsInfo.addMarker(pointObj);
}
/*
 * point information 
 */
var pointsInfo = {
    pointNo:-1,
    // pointNo, lat, lng, desc, color, latlng, isDeleted
    infoList:[],
    markers:[],
    getPoint:function(selNo){
        if (selNo){
            return this.infoList[selNo];
        } else {
            return this.infoList[this.pointNo];
        }
    },
    addPoint:function(info){
        this.pointNo++;
        var infoObj = {
            isDeleted:false
        };
        infoObj.pointNo = this.pointNo;
        if (info.latlng){
            infoObj.lat = info.latlng.lat();
            infoObj.lng = info.latlng.lng();
            infoObj.latlng = info.latlng;
        }
        if (info.desc){
            infoObj.desc = info.desc;
        } else {
            infoObj.desc = '';
        }
        if (info.lat){
            infoObj.lat = info.lat;
        }
        if (info.lng){
            infoObj.lng = info.lng;
        }
        if (info.color){
            infoObj.color = info.color;
        } else {
            infoObj.color = '#000000';
        }
        // this infoObj has pointNo, lat, lng, desc, color, latlng, isDeleted
        this.infoList.push(infoObj);
    },
    addMarker:function(pointObj){
        var marker = new google.maps.Marker({
            position: pointObj.latlng,
            map: map,
            title:String(pointObj.pointNo+1)
        });        
        this.markers.push(marker);
    },
    setColor:function(selNo, selColor){
        var info = this.infoList[selNo];
        info.color = selColor;
    },
    setDesc:function(selNo, inDesc){
        var info = this.infoList[selNo];
        info.desc = inDesc;
    },
    deletePoint:function(delNo){
        //this.infoList.splice(delNo, 1); // remove line from array
        this.infoList[delNo].isDeleted = true;
    },
    deleteMarker:function(delNo){
        this.markers[delNo].setMap(null);
    },
    getInfoList:function(){
        return this.infoList;
    },
    deleteAllMarkers:function(){
        this.markers.forEach(function(marker){
            marker.setMap(null);
        });
    }
};
/*
 * [save to json] button event
 */        
function saveJson(){
    // remove deleted info
    var newList = [];
    pointsInfo.infoList.forEach(function(info){
        if (!info.isDeleted){
            delete info.latlng;
            newList.push(info);
        }
    });
    // call java method
    var infos = JSON.stringify(newList);
    app.getInfoList(infos);
}

/*
 * add table tr & draw polyline from Json file.
 * called by JavaFX
 */
function drawPolylineFromJson(pointsListJson){
    // clear map & table
    pointsInfo.pointNo = -1; // reset no
    pointsInfo.deleteAllMarkers(); // remove all markers from map
    initPolyLine.setMap(null); // remove KIX - SFO Polyline
    var tbody = $('#points');
    tbody.children().remove();
    var kixLatLng = infos[0];
    var sfoLatLng = infos[1];
    var prevPath = new google.maps.LatLng(kixLatLng.lat, kixLatLng.lng);
    pointsListJson.forEach(function(info){
        pointsInfo.addPoint(info);
        // add point to table 
        addTr(pointsInfo.getPoint());
        // create polyline
        var thisPath = new google.maps.LatLng(info.lat, info.lng);
        var polylineOpt = {
           map: map,
           path: [prevPath, thisPath],
           strokeColor: info.color
       };
       new google.maps.Polyline(polylineOpt);    
       prevPath = thisPath;
    });
    // last place - SFO
    var sfoPath = new google.maps.LatLng(sfoLatLng.lat, sfoLatLng.lng);
    var polylineOpt = {
       map: map,
       path: [prevPath, sfoPath],
       strokeColor: '#000000'
    };
    new google.maps.Polyline(polylineOpt);    
}