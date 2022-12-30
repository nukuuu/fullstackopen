const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

describe('GET tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blogs have id property named id instead of _id', async () => {
    const response = await api.get('/api/blogs');
    const idArray = response.body.map((blog) => blog.id);
    idArray.forEach((id) => expect(id).toBeDefined());
  });
});

describe('POST tests', () => {
  test('posting a new blog increases the total number of blogs by 1 and saves a blog with the correct title', async () => {
    const initialBlogs = await api.get('/api/blogs');

    const newBlog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const newBlogs = await api.get('/api/blogs');
    const newBlogsTitles = newBlogs.body.map((blog) => blog.title);

    expect(newBlogs.body).toHaveLength(initialBlogs.body.length + 1);
    expect(newBlogsTitles).toContain('test title');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
