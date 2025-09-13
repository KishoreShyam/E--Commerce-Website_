// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    // Mock payment intent creation
    const paymentIntent = {
      id: `pi_mock_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      status: 'requires_payment_method',
      client_secret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
    };

    res.status(200).json({
      success: true,
      paymentIntent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
const confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    // Mock payment confirmation
    const payment = {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: Math.floor(Math.random() * 10000) + 1000,
      currency: 'usd',
      created: Math.floor(Date.now() / 1000)
    };

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user payment methods
// @route   GET /api/payments/methods
// @access  Private
const getPaymentMethods = async (req, res, next) => {
  try {
    // Mock payment methods
    const paymentMethods = [
      {
        id: 'pm_mock_1',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        }
      }
    ];

    res.status(200).json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add payment method
// @route   POST /api/payments/methods
// @access  Private
const addPaymentMethod = async (req, res, next) => {
  try {
    const { type, details } = req.body;

    // Mock payment method creation
    const paymentMethod = {
      id: `pm_mock_${Date.now()}`,
      type,
      [type]: details,
      created: Math.floor(Date.now() / 1000)
    };

    res.status(201).json({
      success: true,
      message: 'Payment method added successfully',
      paymentMethod
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete payment method
// @route   DELETE /api/payments/methods/:id
// @access  Private
const deletePaymentMethod = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod
};
