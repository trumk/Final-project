const express = require("express")
const mongoose = require("mongoose");




const hostname = 'localhost'
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`hello nxt, server http://${hostname}:${port}/`)
  })