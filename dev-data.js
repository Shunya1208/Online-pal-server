const axios = require('axios');
const fs = require("fs")

axios.get("https://randomuser.me/api/?results=300&exc=name,id,cell,phone,registered,timezone").then(res => {
    console.log(res.data)
    const data = JSON.stringify(res.data)
    fs.writeFileSync('./data.json', data)
    
}).catch(err => {
    console.log(err)
})