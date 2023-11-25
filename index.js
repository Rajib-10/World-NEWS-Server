const express = require('express')
const app = express()

const port = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send("World NEWS is running...")
})

app.listen(port,()=>{
    console.log(`World NEWS is running on port ${port}`)
})