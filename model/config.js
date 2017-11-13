var APPID  = "noti";
var KEY    = "6xeLdlHHWBuM49O";
var SECRET = "tzTRtxJbuejASaIBHWD3snUa3";

var microgear = MicroGear.create({
    key : KEY,
    secret : SECRET,
    alias: 'server'
});

microgear.on('connected', function() {
    console.log('Connected...');
    setInterval(function() {
        microgear.publish('/message','Hello world.');
    },3000);
});

microgear.on('message', function(topic,body) {
    console.log('incoming : '+topic+' : '+body);
});

microgear.on('closed', function() {
    console.log('Closed...');
});

microgear.connect(APPID);