export async function requestP1MeterData() {
    console.log('http://'+document.getElementById('Electricity-meter-IP').value+'/api/v1/data')
    setInterval(async function(){
        fetch('http://'+document.getElementById('Electricity-meter-IP').value+'/api/v1/data')
        .then(response => response.json())
        .then(data => { 
            console.log("P1MeterActivePower: "+data.active_power_w)
            console.log("P1MeterTotalPower: "+data.total_power_import_kwh)

            document.getElementById("P1MeterActivePower-box-content").innerHTML = data.active_power_w
            document.getElementById("P1MeterTotalPower-box-content").innerHTML = data.total_power_import_kwh

            if (data.active_power_w === 0) {
                document.getElementById("P1MeterImage").src='../resources/Power_off.png'
            } else {
                document.getElementById("P1MeterImage").src='../resources/Power_on.png'
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
     
    }, document.getElementById('Energy-frequency').value)
    
  }
  window.requestP1MeterData = requestP1MeterData;
  requestP1MeterData()