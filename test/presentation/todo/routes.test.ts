import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';
import { text } from 'stream/consumers';


describe('Routes', () => {

    beforeAll( async () => {
        await testServer.start();
    });

    afterAll( async () => {
        testServer.close();
    } );

    beforeEach( async () => {
        await prisma.todo.deleteMany();
    });

    const todo1 = {text: 'test todo'};
    const todo2 = {text: 'test todo 2'};
    const id = 1;


   it('should return Todos api/todos', async () => {

    await prisma.todo.createMany({
        data: [todo1, todo2]
    });
       
    const { body } = await request(testServer.app)
       .get('/api/todo')
       .expect(200);

    expect(body).toEqual(expect.arrayContaining([
        expect.objectContaining(todo1),
        expect.objectContaining(todo2)
    ]));
    expect(body).toHaveLength(2);
    expect(body[0]).toEqual(expect.objectContaining(todo1));
    expect(body[1]).toEqual(expect.objectContaining(todo2));
   });

   it('should return a single Todo api/todos/:id', async () => {
    const { id } = await prisma.todo.create({ data: todo1 });

    const { body } = await request(testServer.app)
        .get(`/api/todo/${id}`)
        .expect(200);

    expect(body).toEqual(expect.objectContaining(todo1));
   });

   it('should return 404 if Todo not found', async () => {
    const { body } = await request(testServer.app)
        .get(`/api/todo/${id}`)
        .expect(404);
    expect(body).toEqual({ error: `Todo with id ${id} not found` });
   });

   it('should create a Todo POST api/todos', async () => {
    const { body } = await request(testServer.app)
        .post('/api/todo')
        .send(todo1)
        .expect(201);

    expect(body).toEqual(expect.objectContaining(todo1));
   });

   it('should create a Todo POST api/todos', async () => {
    const { body } = await request(testServer.app)
        .post('/api/todo')
        .send(todo1)
        .expect(201);

    expect(body).toEqual(expect.objectContaining(todo1));
   });

   it('should return an error if text is not present Todo POST api/todos', async () => {
    const { body } = await request(testServer.app)
        .post('/api/todo')
        .send({ })
        .expect(400);

    expect(body).toEqual({ error: 'Text property is required' });
   });

   it('should return an error if text is empty Todo POST api/todos', async () => {
    const { body } = await request(testServer.app)
        .post('/api/todo')
        .send({ text: ''})
        .expect(400);

    expect(body).toEqual({ error: 'Text property is required' });
   });

   it('should return an updated Todo PUT api/todos/:id', async () => {

    const { id } = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
        .put(`/api/todo/${id}`)
        .send({ text: 'updated todo', done: true })
        .expect(200);

        console.log(body);

    expect(body).toEqual({
        id: expect.any(Number),
        text: 'updated todo',
        done: true,
        createdAt: expect.any(String),
     });
   });

   it('should return a 404 if Todo not found PUT api/todos/:id', async () => {
    const { body } = await request(testServer.app)
        .put(`/api/todo/${id}`)
        .send({ text: 'updated todo', done: true })
        .expect(404);

    expect(body).toEqual({ error: `Todo with id ${id} not found` });
   });

   it('should return only updated done Todo PUT api/todos/:id', async () => {
    const { id } = await prisma.todo.create({ data: todo1 });
    const { body } = await request(testServer.app)
        .put(`/api/todo/${id}`)
        .send({ done: true })
        .expect(200);

    expect(body).toEqual({
        id: expect.any(Number),
        text: todo1.text,
        done: true,
        createdAt: expect.any(String),
     });
   });


    it('should delete a Todo DELETE api/todos/:id', async () => {
     const { id } = await prisma.todo.create({ data: todo1 });
     const { body } = await request(testServer.app)
          .delete(`/api/todo/${id}`)
          .expect(200);
    
     expect(body).toEqual(expect.objectContaining(todo1));
    });

    it('should return 404 if Todo not found DELETE api/todos/:id', async () => {
        const { body } = await request(testServer.app)
            .delete(`/api/todo/${id}`)
            .expect(404);
    
        expect(body).toEqual({ error: `Todo with id ${id} not found` });
    });
});