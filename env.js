const dotenv = require('dotenv');
dotenv.config();

// console.log(process.env)


const APIKEY=process.env.API_KEY
const APISECRET=process.env.API_SECRET
const DBURL=process.env.DB_URL

module.exports = {APIKEY,APISECRET,DBURL}