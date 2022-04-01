const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const router = express.Router();
const Customer = require("../model/customer");

router.get("/customer", async (req, res) => {
  try {
    const customer = await Customer.find();
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/customer/idcard/:id", findByCard, async (req, res) => {
  res.send(res.customer);
});

router.post("/customer", checkCustomer, async (req, res) => {
  const customer = new Customer({
    idCard: req.body.idCard,
    FirstName: req.body.FirstName,
    FirstNameN: req.body.FirstNameN,
    LastName: req.body.LastName,
    LastNameN: req.body.LastNameN,
    Gender: req.body.Gender == "M" ? "ชาย" : "หญิง",
    Phone: req.body.Phone,
    Type: req.body.Type,
  });
  try {
    if (res.is_not_exist) {
      const newCustomer = await customer.save();
      res.status(201).json({ status: true, payload: newCustomer });
    }
    res.json({ status: false, payload: "" });
    // const newCustomer = await customer.save();
    // res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// const getCustomer = async (req, res) => {
//   let customer;
//   try {
//     customer = await Customer.findOne({ idCard: req.params.id });
//     if (user == null) {
//       return res.status(404).json({ message: "Cannot find user" });
//     }
//   } catch (err) {
//     res.json({ message: err.message });
//   }
// };
async function checkCustomer(req, res, next) {
  res.is_not_exist = false;
  let customer;
  try {
    customer = await Customer.findOne({ idCard: req.body.idCard });
    if (customer == null) {
      res.is_not_exist = true;
    }
  } catch (err) {
    res.json({ message: err.message });
  }
  next();
}

async function findByCard(req, res, next) {
  let customer;
  try {
    customer = await Customer.findOne({ idCard: req.params.id });
    console.log(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: "Cannot find customer" });
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
  res.customer = customer;
  next();
}

module.exports = router;
