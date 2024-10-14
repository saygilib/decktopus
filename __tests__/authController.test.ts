import request from 'supertest';
import app from '../src/index'; // Adjust the path as necessary
import { SequelizeConnection } from '../src/services/sequelize';
import Users from '../src/models/users';

describe('Auth Controller', () => {
  beforeAll(async () => {
    await SequelizeConnection.getInstance();
    await Users.sync({ force: true });
  });

  afterAll(async () => {
    await Users.drop(); 
    await SequelizeConnection.getInstance().close(); 
  });

  describe('POST /api/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser',
          password: 'password',
          email: 'test@example.com',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should return 400 if information is missing', async () => {
      const response = await request(app).post('/api/signup').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'missing information');
    });

    it('should return 500 if user already exists', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser',
          password: 'password',
          email: 'test@example.com',
        });

      const response = await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser2',
          password: 'password',
          email: 'test@example.com',
        });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'user already exists');
    });
  });

  describe('POST /api/login', () => {
    it('should log in the user', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser',
          password: 'password',
          email: 'test@example.com',
        });

      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'testuser',
          password: 'password',
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
    });

    it('should return 400 if username or password is missing', async () => {
      const response = await request(app).post('/api/login').send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Username and password are required');
    });

    it('should return 401 if invalid credentials are provided', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'wronguser',
          password: 'wrongpassword',
        });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
  });
  
});

