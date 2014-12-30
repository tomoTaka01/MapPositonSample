/*
 * sample.js
 */
var map;
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
    new google.maps.Polyline(polylineOpt);    
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
    // linecolor
    var tdColor = $('<td>').addClass("linecolor");
    $('<input>').attr('type', 'color').val(pointObj.color).addClass("inputColor")
            .attr('selno', pointObj.pointNo)
            .change(function(event){
                var inColor = $(this);
                // set color
                var selNo = inColor.attr('selno');
                pointsInfo.setColor(selNo, inColor.val());
            })
            .appendTo(tdColor);
    tdColor.appendTo(tr);
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
    }
};
/*
 * [save to json] button event
 */        
function saveJson(){
    // call java method
    var infos = JSON.stringify(pointsInfo.infoList);
    app.getInfoList(infos);
}
