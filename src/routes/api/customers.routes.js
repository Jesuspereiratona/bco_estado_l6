const express = require("express")
const { getAllCustomers, createCustomer, findCustomer, deleteCustomer, addAccountToCustomer, getCustomersWithRut, deleteAccount } = require("../../controllers/api/customers.controllers.js")
const router = express.Router()

router.get("/", getAllCustomers)
router.get("/con-rut", getCustomersWithRut)
router.post("/", createCustomer)
router.post("/:id/accounts", addAccountToCustomer)
router.get("/:id", findCustomer)
router.delete("/:id", deleteCustomer)
router.delete("/:id/accounts/:accountId", deleteAccount)

module.exports = { customerRoutes: router }