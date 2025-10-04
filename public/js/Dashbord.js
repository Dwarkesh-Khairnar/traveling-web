const { data } = require("autoprefixer")
const { response } = require("express")

document.addEventListener('DOMContentLoaded',()=>{
fetch('/api/dashbord')
.then(response=>response.json())
.then(data=>{
    document.getElementById('username').textContent=data.username;
})
.catch(Error=>{
    console.error('Error fetingdashbord data:',error);
    document.getElementById('username').textContent='user';   
})
})