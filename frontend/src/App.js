import React, { Component } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaTrash,FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

class CustomerManagementSystem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      formData: { name: '', email: '', phone: '', dob: new Date(), address: '' },
      editingId: null,
      errors: {},
      searchQuery: '',
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customers');
      const data = await response.json();
      this.setState({ customers: data });
    } catch (error) {
      toast.error('Failed to fetch customers');
    }
  };

  validateForm = () => {
    const { formData } = this.state;
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phone) errors.phone = 'Phone is required';
    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (this.validateForm()) {
      const { formData, editingId } = this.state;
      const requestOptions = {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };
  
      const endpoint = editingId ? `/${editingId}` : '/';
      const response = await fetch(`http://localhost:5000/api/customers${endpoint}`, requestOptions);
  
      if (response.ok) {
        this.fetchCustomers();
        toast.success(editingId ? 'Customer updated' : 'Customer added');
        this.setState({ formData: { name: '', email: '', phone: '', dob: new Date(), address: '' }, editingId: null });
      } else {
        toast.error('Error in saving customer');
      }
    }
  };
  

  handleEdit = (customer) => {
    this.setState({ formData: { ...customer, dob: new Date(customer.dob) }, editingId: customer._id });
  };

  handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        this.fetchCustomers();
        toast.success('Customer deleted');
      } else {
        toast.error('Error in deleting customer');
      }
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let errors = { ...this.state.errors };
  
    if (name === 'phone') {
      // Allow only digits and limit to 10 digits
      updatedValue = value.replace(/\D/g, '').slice(0, 10);
      // Update errors object based on phone length
      errors[name] = updatedValue.length === 10 ? '' : 'Phone number must be 10 digits';
    }
  
    // Set state with updated values and errors
    this.setState((prevState) => ({
      formData: { ...prevState.formData, [name]: updatedValue },
      errors,
    }));
  };
  
  handleDateChange = (date) => {
    this.setState((prevState) => ({
      formData: { ...prevState.formData, dob: date },
    }));
  };

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  render() {
    const { customers, formData, errors, searchQuery } = this.state;

    // Filter customers based on search query
    const filteredCustomers = customers.filter((customer) => {
      const query = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.address.toLowerCase().includes(query)
      );
    });

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-center text-2xl font-bold mb-4">Customer Management System</h1>

        <form onSubmit={this.handleSubmit} className="mb-4">
          <div className="form-group">
            <label htmlFor="name">
              <FaUser /> Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={this.handleInputChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={this.handleInputChange}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="form-group">
          <label htmlFor="phone">
            <FaPhone /> Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={this.handleInputChange}
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

          <div className="form-group">
            <label htmlFor="dob">
              <FaCalendarAlt /> Date of Birth
            </label>
            <DatePicker
              selected={formData.dob}
              onChange={this.handleDateChange}
              className="form-control"
              id="dob"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={this.handleInputChange}
                className="form-control"
              />
          </div>

          <button type="submit" className="btn btn-primary">
            {this.state.editingId ? 'Update Customer' : 'Add Customer'}
          </button>
        </form>

        <div className="search-bar mb-4">
        <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email, phone, or address"
            value={searchQuery}
            onChange={this.handleSearchChange}
            className="form-control"
          />
          
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{new Date(customer.dob).toLocaleDateString()}</td>
                <td>{customer.address}</td>
                <td>
                  <button onClick={() => this.handleEdit(customer)} className="btn btn-info">
                    <FaEdit />
                  </button>
                  <button onClick={() => this.handleDelete(customer._id)} className="btn btn-danger">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

export default CustomerManagementSystem;
