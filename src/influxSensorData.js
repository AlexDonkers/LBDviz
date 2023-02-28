import { QueryEngine } from '@comunica/query-sparql'
import { InfluxDB, Point } from "@influxdata/influxdb-client-browser";

export async function queryInfluxSensorData() {
  
  console.log("StartQueryInfluxSensorData");
  // First, we query some metadata from our graph using Comunica
  const myEngine = new QueryEngine();

  const graphs = document.getElementById("GRAPH-input").value.split(',')
  const bindingsStream = await myEngine.queryBindings(`PREFIX bpt: <https://w3id.org/bpt#>
  PREFIX bot: <https://w3id.org/bot#>
  PREFIX bop: <https://w3id.org/bop#>
  select * where { 
      ?room a bot:Space .
      ?sensor bop:observes ?room .
      ?sensor bop:hasResult ?dp .
      ?dp bop:isDataPointOf ?database .
  } limit 1`, {
    sources: graphs,
  });

  const bindings = await bindingsStream.toArray();
  const room = bindings[0].get('room').value.split("#", 2)[1];;
  const dp = bindings[0].get('dp').value.split("#", 2)[1];;
  const sensor = bindings[0].get('sensor').value.split("#", 2)[1];;
  const database = "OpenFlatDB"
  console.log(dp, database, room, sensor)

  
  // Secondly, we use that metadata to query from InfluxDB

  /** Environment variables **/
  const url = /**document.getElementById('INFLUX-url').value || **/"https://westeurope-1.azure.cloud2.influxdata.com/";
  const token = /**document.getElementById('INFLUX-token').value || **/"FnaRbX8P9Gyhq4VKySjtOlB0UQSOygtpP3bylYp8X8bqwN_9tkZjD8AH_BhDntaOshSxGoKQ0Styb6pp0S0dIg==";
  const org = /**document.getElementById('INFLUX-org').value || **/"a.j.a.donkers@tue.nl";

  console.log("User input influx settings: " + url + token + org);
  /**
   * Instantiate the InfluxDB client
   * with a configuration object.
   *
   * Get a query client configured for your org.
   **/
  const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

  /** To avoid SQL injection, use a string literal for the query. */
  const fluxQuery =
    'from(bucket:"'+database+'") |> range(start: 0) |> filter(fn: (r) => r._measurement == "'+dp+'")';

    
  //clear result box
  document.getElementById("results-box-content").innerHTML = "";
  //start table component
  let tableContent = "<table>" 
  tableContent +="<tr><th>time</th><th>measurement</th><th>sensor</th><th>field</th><th>value</th><tr>"

  const fluxObserver = {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      console.log(o)
      console.log(JSON.stringify(o))
      console.log(
        `${o._time} ${o._measurement} (${o.sensor_id}): ${o._field}=${o._value}`
      );
      tableContent+= "<tr><td>"+o._time+"</td><td>"+o._measurement+"</td><td>"+o._sensor_id+"</td><td>"+o._field+"</td><td>"+o._value+"</td></tr>"
      console.log(tableContent)
      document.getElementById("results-box-content").innerHTML = tableContent
    },
    error(error) {
      console.error(error);
      console.log("\nFinished ERROR");
    },
    complete() {
      console.log("\nFinished SUCCESS");


    },
  };

  /** Execute a query and receive line table metadata and rows. */
  queryApi.queryRows(fluxQuery, fluxObserver);

  //end
  tableContent += "</table>" 
  document.getElementById("results-box-content").innerHTML = tableContent
}



window.queryInfluxSensorData = queryInfluxSensorData;
