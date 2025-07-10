const request = require('supertest')
const app = require('../server')
const Product = require('../models/Product')


//as all APIs are simple, only writing for the one which is connected to Order-Service
describe('Product stock decrement API',()=>{
    let productId;
    beforeAll(async()=>{
        const newProduct = await new Product({
            name:"test product",
            stock:10,
            price:299.99
        }).save()
        productId=newProduct._id;
    })
    afterAll(async()=>{
            await Product.deleteOne({ _id:productId });
        });
    test('stock decrement test', async ()=>{
            const res = await request(app)
            .put(`/api/products/success/${productId}`)
            .send({
                decrementBy:2
            })
            expect(res.statusCode).toBe(200);})
})