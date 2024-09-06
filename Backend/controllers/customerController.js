const Customer = require('../models/customerModel');

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new customer
exports.addCustomer = async (req, res) => {
  const { name, email, phone, dob,address } = req.body;

  try {
    const newCustomer = new Customer({
      name,
      email,
      phone,
      dob,
      address,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a customer
exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Ensure address is included in the updateData
    console.log('Updating with data:', updateData); // Log update data
  
    try {
      const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updatedCustomer);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    await Customer.findByIdAndDelete(id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
