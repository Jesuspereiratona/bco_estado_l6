const fs = require("node:fs/promises")
const path = require("node:path")
const { Customer } = require("../../models/customer.models")

const getAllCustomers = async (req, res) => {
    const textData = await fs.readFile(path.join(__dirname, "../../models/customers.json"), { encoding: "utf-8" })
    res.json(JSON.parse(textData))
}

const createCustomer = async (req, res) => {
    const { rut, name, age, phoneNumber, email, accountType } = req.body
    const newCustomer = new Customer(rut, name, age, phoneNumber, email)
    newCustomer.addAccount(accountType)
    const response = await newCustomer.saveCustomer()
    res.json({ ok: true, message: response })
}

const findCustomer = async (req, res) => {
    const { id } = req.params
    const textData = await fs.readFile(path.join(__dirname, "../../models/customers.json"), { encoding: "utf-8" })
    const customer = JSON.parse(textData).find(c => c.id_customer === id)
    if (!customer) return res.status(404).json({ ok: false, message: "El cliente no se encontró" })
    res.json({ ok: true, data: customer })
}

const deleteCustomer = async (req, res) => {
    const { id } = req.params
    const filePath = path.join(__dirname, "../../models/customers.json")
    const data = JSON.parse(await fs.readFile(filePath, { encoding: "utf-8" }))
    const filtered = data.filter(c => c.id_customer !== id)
    if (filtered.length === data.length) return res.status(404).json({ ok: false, message: "Cliente no encontrado" })
    await fs.writeFile(filePath, JSON.stringify(filtered), { encoding: "utf-8" })
    res.json({ ok: true, message: "Cliente eliminado" })
}

const addAccountToCustomer = async (req, res) => {
    const { id } = req.params
    const { accountType } = req.body
    const filePath = path.join(__dirname, "../../models/customers.json")
    const data = JSON.parse(await fs.readFile(filePath, { encoding: "utf-8" }))
    const customer = data.find(c => c.id_customer === id)
    if (!customer) return res.status(404).json({ ok: false, message: "Cliente no encontrado" })
    const tempCustomer = new Customer(customer.rut, customer.name, customer.age, customer.phoneNumber, customer.email)
    tempCustomer.id_customer = customer.id_customer
    tempCustomer.accounts = customer.accounts
    const message = tempCustomer.addAccount(accountType)
    const updated = data.map(c => c.id_customer === id ? tempCustomer : c)
    await fs.writeFile(filePath, JSON.stringify(updated), { encoding: "utf-8" })
    res.json({ ok: true, message })
}

const getCustomersWithRut = async (req, res) => {
    const filePath = path.join(__dirname, "../../models/customers.json")
    const data = JSON.parse(await fs.readFile(filePath, { encoding: "utf-8" }))
    res.json(data.filter(c => c.accounts.some(a => a.type === "cuenta rut")))
}

const deleteAccount = async (req, res) => {
    const { id, accountId } = req.params
    const filePath = path.join(__dirname, "../../models/customers.json")
    const data = JSON.parse(await fs.readFile(filePath, { encoding: "utf-8" }))
    const updated = data.map(c => {
        if (c.id_customer !== id) return c
        return { ...c, accounts: c.accounts.filter(a => a.id_account !== accountId) }
    })
    await fs.writeFile(filePath, JSON.stringify(updated), { encoding: "utf-8" })
    res.json({ ok: true, message: "Cuenta eliminada" })
}

module.exports = {
    getAllCustomers,
    createCustomer,
    findCustomer,
    deleteCustomer,
    addAccountToCustomer,
    getCustomersWithRut,
    deleteAccount
}