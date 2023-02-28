export async function requestWaterMeterData() {
    console.log('http://'+document.getElementById('Water-meter-IP').value+'/api/v1/data')
    setInterval(async function(){
        fetch('http://'+document.getElementById('Water-meter-IP').value+'/api/v1/data')
        .then(response => response.json())
        .then(data => { 
            console.log("WaterMeterActiveLiter: "+data.active_liter_lpm)
            console.log("WaterMeterTotalLiter: "+data.total_liter_m3)

            document.getElementById("WaterMeterActiveLiter-box-content").innerHTML = data.active_liter_lpm
            document.getElementById("WaterMeterTotalLiter-box-content").innerHTML = data.total_liter_m3

            if (data.active_liter_lpm === 0) {
                document.getElementById("WaterMeterImage").src='../resources/Water_off.png'
            } else {
                document.getElementById("WaterMeterImage").src='../resources/Water_on.png'
            }
            

        })
        .catch(error => {
            console.error('Error:', error);
        });
     
    }, document.getElementById('Energy-frequency').value)
    
  }
  window.requestWaterMeterData = requestWaterMeterData;
  requestWaterMeterData()