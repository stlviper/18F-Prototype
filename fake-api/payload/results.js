module.exports = {
  "sources": [
    {
      "key": "/test",
      "value": "./payload/json/test.json"
    },
    {
      "key": "/drug/event.json?search=receivedate:[20040101+TO+20150101]&limit=100",
      "value": "./payload/json/drug_event_20040101_20150101_limit_100.json"
    },
    {
      "key": "/drug/label.json?search=receivedate:[20090601+TO+20140731]&limit=50",
      "value" : "./payload/json/drug_label_20090601_TO_20140731_limit_50.json"
    }, 
    {
      "key" : "/drug/enforcement.json?limit=100",
      "value": "./payload/json/drug_enforcement_limit_100.json"
    }, 
    {
      "key" : "/food/enforcement.json?limit=100",
      "value": "./payload/json/food_enforcement_limit_100.json"
    }, 
    {
      "key" : "/device/event.json?search=date_received:[19910101+TO+20150101]&limit=100",
      "value": "./payload/json/device_event_19910101_20150101_limit_100.json"
    },
    {
      "key": "/device/enforcement.json?limit=100",
      "value": "./payload/json/device_enforcement_limit_100.json"
    },
    {
      "key": "/drug/event.json?search=receivedate:%5B20040101+TO+20150101%5D&count=patient.patientsex",
      "value": "./payload/json/drug_event_20040101_20150101_count_patient_patientsex.json"
    }
  ]
};