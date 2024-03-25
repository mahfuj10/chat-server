// const { MongoClient } = require('mongodb')
// require("dotenv").config();

// let dbConnection: any;

// module.exports = {
//   connectToDb: (cb:any) => {
//     MongoClient.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@leaves.eaf0bsd.mongodb.net/`)
//       .then((client:any) => {
//         dbConnection = client.db()
//         return cb()
//       })
//       .catch((err:any) => {
//         console.log(err)
//         return cb(err)
//       })
//   },
//   getDb: () => dbConnection
// }