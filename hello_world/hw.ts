const axios = require('axios');

async function getData() {
    try {
        const response = await axios.get('http://localhost:8080/neo4j/read');
        console.log('Response data:', response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
async function postData(data: string) {
    try {
        const response = await axios.post('http://localhost:8080/neo4j/write', {name: data});
        // console.log('Response data:', response.data);
    } catch (error) {
        console.error('Error posting data:', error);
    }
}

async function hw(){
    await getData()
    await postData("Hello World!!");
    await postData("Juno was mad, he knew he'd been had\nSo he shot at the sun with a gun");
    await getData();
}
hw()