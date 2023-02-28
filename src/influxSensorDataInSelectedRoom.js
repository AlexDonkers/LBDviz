import { QueryEngine } from '@comunica/query-sparql'
import { InfluxDB, Point } from "@influxdata/influxdb-client-browser";

export async function queryInfluxSensorDataInSelectedRoom() {
  console.log("StartQueryInfluxSensorData");


  // First, we query some metadata from our graph using Comunica
  const myEngine = new QueryEngine();

  const graphs = document.getElementById("GRAPH-input").value.split(',')
  const bindingsStream = await myEngine.queryBindings(`PREFIX bpt: <https://w3id.org/bpt#>
  PREFIX bop: <https://w3id.org/bop#>
  select * where { 
      ?room bpt:hasGlobalIdIfcRoot `+JSON.stringify(document.getElementById("selected-guid").innerHTML)+` .
      ?property bop:isPropertyOf ?room .
      ?property bop:hasPropertyState ?dp .
      ?database bop:hasDataPoint ?dp .
  } limit 1`, {
    sources: graphs,
  });

  const bindings = await bindingsStream.toArray();
  const room = bindings[0].get('room').value.split("#", 2)[1];;
  const dp = bindings[0].get('dp').value.split("#", 2)[1];;
  const property = bindings[0].get('property').value.split("#", 2)[1];;
  const database = bindings[0].get('database').value.split("#", 2)[1];;


  // Secondly, we use that metadata to query from InfluxDB

  /** Environment variables **/
  const url = document.getElementById('INFLUX-url').value || "https://westeurope-1.azure.cloud2.influxdata.com/";
  const token = document.getElementById('INFLUX-token').value || "FnaRbX8P9Gyhq4VKySjtOlB0UQSOygtpP3bylYp8X8bqwN_9tkZjD8AH_BhDntaOshSxGoKQ0Styb6pp0S0dIg==";
  const org = document.getElementById('INFLUX-org').value || "a.j.a.donkers@tue.nl";

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

  const fluxObserver = {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      console.log(
        `${o._time} ${o._measurement} in ${o.region} (${o.sensor_id}): ${o._field}=${o._value}`
      );
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



  return console.log("FinishedQueryInflux");
}
window.queryInfluxSensorDataInSelectedRoom = queryInfluxSensorDataInSelectedRoom;
