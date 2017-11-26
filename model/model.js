var admin = require("firebase-admin");
var MicroGear = require('microgear')

var microgear = MicroGear.create({
  key : "6xeLdlHHWBuM49O",
  secret : "tzTRtxJbuejASaIBHWD3snUa3",
  alias: 'server'
});

module.exports = {
	notification: function() {
		microgear.connect('noti')
		microgear.on('connected', function() {
			console.log('test')
			microgear.publish('/message','eieieeiieieie.')
			microgear.disconnect()
		})
	}
}
