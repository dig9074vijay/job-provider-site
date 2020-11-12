const jwt = require('jsonwebtoken')
const Customer = require('../models/Customer')
const Worker = require('../models/signup_workers')

const auth = async (req,res,next) => {
    try {
      console.log("enetered try")
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded  = jwt.verify(token, "thisismynewcourse")
        const customer = await Customer.findOne({_id: decoded._id, 'tokens.token': token})
        console.log(token);
        if(customer)
        {
          req.token = token
          req.customer = customer
          console.log("customer found")
          next()
        }
        if(!customer) {
          console.log("customer not found")
            const worker = await Worker.findOne({_id: decoded._id, 'tokens.token':token});
            if(!worker)
            {
              throw new Error();
              console.log("worker not found")
            }
            req.token = token;
            req.worker = worker;
            next();
        }


    }
    catch (e) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth
