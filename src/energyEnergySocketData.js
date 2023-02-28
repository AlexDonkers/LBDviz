export async function requestEnergySocketData() {
    console.log('http://'+document.getElementById('Energy-socket-IP').value+'/api/v1/data')
    setInterval(async function(){
        fetch('http://'+document.getElementById('Energy-socket-IP').value+'/api/v1/data')
        .then(response => response.json())
        .then(data => { 
            console.log("EnergySocketActivePower: "+data.active_power_w)
            console.log("EnergySocketActivePower: "+data.total_power_import_t1_kwh)

            document.getElementById("EnergySocketActivePower-box-content").innerHTML = data.active_power_w
            document.getElementById("EnergySocketTotalPower-box-content").innerHTML = data.total_power_import_t1_kwh

            if (data.active_power_w === 0) {
                document.getElementById("EnergySocketImage").src='../resources/Socket_off.png'
            } else {
                document.getElementById("EnergySocketImage").src='../resources/Socket_on.png'
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
     
    }, document.getElementById('Energy-frequency').value)
    
  }
  window.requestEnergySocketData = requestEnergySocketData;
  requestEnergySocketData()