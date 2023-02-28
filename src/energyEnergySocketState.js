export async function setEnergySocketState() {
    const url = 'http://192.168.68.113/api/v1/state';
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:5501',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS, GET'
    };
    const data = {
      power_on: true
    };
    
    fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
    setInterval(async function(){
        fetch('http://192.168.68.113/api/v1/data')
        .then(response => response.json())
        .then(data => { console.log(data)
        })
        .catch(error => {
            console.error('Error:', error);
        });
     
    }, 3000)
    

  }
  window.setEnergySocketState = setEnergySocketState;
  setEnergySocketState()