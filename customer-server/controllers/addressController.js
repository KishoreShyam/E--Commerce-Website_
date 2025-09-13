const Address = require('../models/Address');
const { validationResult } = require('express-validator');

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ 
      user: req.user.id, 
      isActive: true 
    }).sort({ isDefault: -1, createdAt: -1 });

    res.json({
      success: true,
      addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching addresses'
    });
  }
};

// Create a new address
const createAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      type,
      firstName,
      lastName,
      company,
      address,
      apartment,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    } = req.body;

    // If this is set as default, remove default from other addresses
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      );
    }

    const newAddress = new Address({
      user: req.user.id,
      type,
      firstName,
      lastName,
      company,
      address,
      apartment,
      city,
      state,
      zipCode,
      country: country || 'US',
      phone,
      isDefault: isDefault || false
    });

    await newAddress.save();

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address: newAddress
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating address'
    });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const {
      type,
      firstName,
      lastName,
      company,
      address,
      apartment,
      city,
      state,
      zipCode,
      country,
      phone,
      isDefault
    } = req.body;

    // Find the address and verify ownership
    const existingAddress = await Address.findOne({
      _id: id,
      user: req.user.id,
      isActive: true
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If this is set as default, remove default from other addresses
    if (isDefault && !existingAddress.isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    // Update the address
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        type,
        firstName,
        lastName,
        company,
        address,
        apartment,
        city,
        state,
        zipCode,
        country: country || 'US',
        phone,
        isDefault: isDefault || false
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Address updated successfully',
      address: updatedAddress
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating address'
    });
  }
};

// Delete an address (soft delete)
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the address and verify ownership
    const address = await Address.findOne({
      _id: id,
      user: req.user.id,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Soft delete the address
    address.isActive = false;
    await address.save();

    // If this was the default address, set another address as default
    if (address.isDefault) {
      const nextAddress = await Address.findOne({
        user: req.user.id,
        isActive: true,
        _id: { $ne: id }
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting address'
    });
  }
};

// Get a specific address
const getAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      user: req.user.id,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      address
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching address'
    });
  }
};

// Set default address
const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the address and verify ownership
    const address = await Address.findOne({
      _id: id,
      user: req.user.id,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Remove default from all other addresses
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: id } },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.json({
      success: true,
      message: 'Default address updated successfully',
      address
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while setting default address'
    });
  }
};

// Get default address
const getDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      user: req.user.id,
      isDefault: true,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'No default address found'
      });
    }

    res.json({
      success: true,
      address
    });
  } catch (error) {
    console.error('Get default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching default address'
    });
  }
};

module.exports = {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getAddress,
  setDefaultAddress,
  getDefaultAddress
};
