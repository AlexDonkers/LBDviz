import { InfluxDB, Point } from "@influxdata/influxdb-client-browser";

export async function queryInflux() {
  console.log("StartQueryInflux");

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
    'from(bucket:"OpenFlatDB") |> range(start: 0) |> filter(fn: (r) => r._measurement == "TempSensor_DP")';

  const fluxObserver = {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      console.log(
        `${o._time} ${o._measurement} in ${o.region} (${o.Sensor}): ${o._field}=${o._value}`
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
window.queryInflux = queryInflux;
