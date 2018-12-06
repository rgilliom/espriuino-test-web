class AdjTrig {

  constructor() {
    this.device = null;
    this.onDisconnected = this.onDisconnected.bind(this);
    this.forceVal = [0,0];
  }
  
  request() {
    let options = {
      "filters": [{
        "namePrefix": "MDBT42Q"
      }],
      "optionalServices": [0xbcde]
    };
    return navigator.bluetooth.requestDevice(options)
    .then(device => {
      this.device = device;
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
    });
  }
  
  connect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    return this.device.gatt.connect();
  }
  
  readForce() {
    return this.device.gatt.getPrimaryService(0xbcde)
    .then(service => service.getCharacteristic(0xabcd))
    .then(characteristic => characteristic.readValue());
  }

  writeForce(data) {
    return this.device.gatt.getPrimaryService(0xbcde)
    .then(service => service.getCharacteristic(0xabcd))
    .then(characteristic => characteristic.writeValue(data));
  }

  incForce() {
    this.forceVal[0] += 1;
    this.forceVal[1] += 2;
    return this.device.gatt.getPrimaryService(0xbcde)
    .then(service => service.getCharacteristic(0xabcd))
    .then(characteristic => characteristic.writeValue(Int8Array.from(this.forceVal)));
  }

  disconnect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    }
    return this.device.gatt.disconnect();
  }

  onDisconnected() {
    console.log('Device is disconnected.');
  }
}

var adjTrig = new AdjTrig();

function inc_trig() {
  //adjTrig.request()
  adjTrig.connect()
  .then(_ => adjTrig.incForce())
  .catch(error => { console.log(error) });
}

function request() {
  adjTrig.request()
  .then( console.log('device attached'));
}
