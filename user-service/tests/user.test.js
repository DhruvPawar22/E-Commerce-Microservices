const request = require('supertest')
const app = require('../src/server')
const jwt = require('jsonwebtoken')
const User = require('../src/models/UserModel')


describe('user-service sign up',()=>{
    let token;
    let userId;
    afterAll(async()=>{
        await User.deleteOne({ username: "test", email: "test@email.com" });
    });
    test('user-service signup test', async ()=>{
        const res = await request(app)
        .post('/api/users/register')
        .send({
            username:"test",
            password: "test",
            email:"test@email.com",
            firstName: "test",
            lastName: "test"
        })
        expect(res.statusCode).toBe(201);
        //expect(res.body.message).toBe('User registered successfully!');

    })
    test('user-service login test', async ()=>{
        const res = await request(app)
        .post('/api/users/login')
        .send({
            username: "test",
            password: "test"
        })
        expect(res.statusCode).toBe(200);}
    )
})

describe('user-service retrieves profile', ()=>{
    let token;
    let userId;

    beforeAll(async()=>{
        const newUser = await new User({
            username: 'Testing',
            password: 'Testing',
            email: 'testing@gmail.com',
            firstName: 'firstname',
            lastName: 'lastname'
        }).save();
        userId=newUser._id
        token = jwt.sign(
            { id: newUser._id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' });
    });
    afterAll(async()=>{
        await User.deleteOne({_id:userId});
    });



    test('user-service returns user profile', async ()=>{
        const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization',`Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email');
        
    })
})