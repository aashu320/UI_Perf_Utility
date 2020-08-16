const Influx = require('influx');


// Connect to a single host with a full set of config details and
// a custom schema
const hostname='aashish.laptop'
const client = new Influx.InfluxDB({
  database: 'perf',
  host: 'localhost',
  port: 8086,
  //username: 'connor',
  //password: 'pa$$w0rd',
  schema: [
    {
      measurement: 'perf',
      fields: {
        domainlookuptime: Influx.FieldType.FLOAT,
        connecttime: Influx.FieldType.FLOAT,
        TTFB: Influx.FieldType.FLOAT,
        downloadtime: Influx.FieldType.FLOAT,
        firstinteractivepointtime: Influx.FieldType.FLOAT,
        domcontentloadedtime: Influx.FieldType.FLOAT,
        DOMloadtime: Influx.FieldType.FLOAT,
        ONLoadtime: Influx.FieldType.FLOAT
      },
      tags: [
          'host'
      ]
    }
  ]
})

//code to check if database exists. If db is not there, then it would be created for you.
client.getDatabaseNames()
    .then(names => {
        if(!names.includes('perf')) {
            return client.createDatabase('perf');
        }
    })

    /*
client.writePoints([
    {
      measurement: 'perf',
      fields: { memory_usage:431, cpu_usage:45.3,is_online:true},
    }
  ])
*/

  module.exports= { insertSample:function(performanceTiming) {
    //Calculating ui performance counters.
    domainlookuptime_val = performanceTiming['domainLookupEnd'] - performanceTiming['domainLookupStart'];
    connecttime_val = performanceTiming['connectEnd'] - performanceTiming['connectStart'];
    TTFB_val = performanceTiming['responseStart'] - performanceTiming['requestStart']
    downloadtime_val = performanceTiming['responseEnd'] - performanceTiming['responseStart'];
    firstinteractivepointtime_val = performanceTiming['domInteractive'] - performanceTiming['domLoading'];
    domcontentloadedtime_val = performanceTiming['domContentLoadedEventEnd'] - performanceTiming['domContentLoadedEventStart'];
    DOMloadtime_val = performanceTiming['domComplete'] - performanceTiming['domLoading'];
    ONLoadtime_val = performanceTiming['loadEventEnd'] - performanceTiming['loadEventStart'];

    //Pushing metrics to influx db
    client.writePoints([
        {
            measurement: 'perf',
            fields: {domainlookuptime:domainlookuptime_val, connecttime:connecttime_val, TTFB:TTFB_val, downloadtime:downloadtime_val, firstinteractivepointtime:firstinteractivepointtime_val,
                domcontentloadedtime:domcontentloadedtime_val, DOMloadtime:DOMloadtime_val, ONLoadtime:ONLoadtime_val},
        }
    ])

    }
}
