const request = require('supertest')
const app = require('../src/server')
const Payment = require('../src/models/payment-service')
const axios = require('axios');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const userId = new mongoose.Types.ObjectId();
const orderId = new mongoose.Types.ObjectId();
jest.mock('stripe', () => {
  const mockstripePaymentIntentCreate = jest.fn().mockResolvedValue({ id: 'pi_test' });
  const mockstripePaymentIntentConfirm = jest.fn().mockResolvedValue({ status: 'succeeded' });

  // Make them available for assertions elsewhere
  global.mockstripePaymentIntentCreate = mockstripePaymentIntentCreate;
  global.mockstripePaymentIntentConfirm = mockstripePaymentIntentConfirm;

  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: mockstripePaymentIntentCreate,
      confirm: mockstripePaymentIntentConfirm,
    }
  }))
});


const Stripe = require('stripe');
const stripe = Stripe(process.env.stripe_key)

jest.mock('axios');
//setting up mocks
const token = jwt.sign(
  { id: userId.toString(), username: 'demo' },
  process.env.JWT_SECRET || 'test',
  { expiresIn: '1h' }
);

//test for Payment

describe('payment-service test',()=>{
    afterAll(async () => {
    // Clean up test payment (optional if using a test DB)
    await Payment.deleteOne({ orderId});
  });
    test('payment successful test',async ()=>{
        axios.get
      .mockImplementationOnce(() => Promise.resolve({ data: { totalAmount: 1000 } })) // order service
      .mockImplementationOnce(() => Promise.resolve({ data: { email: 'buyer@example.com' } })); // user service
    axios.put.mockResolvedValue(); // order status update
    axios.post.mockResolvedValue();

        const res = await request(app)
        .post('/api/payment/process')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderId: orderId.toString() });
        expect(res.statusCode).toBe(200);
        expect(global.mockstripePaymentIntentCreate).toHaveBeenCalled();
    expect(global.mockstripePaymentIntentConfirm).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalled();
    expect(axios.put).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalled();


    })
})