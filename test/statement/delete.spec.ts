import test from 'japa'
import supertest from 'supertest';

import Database from '@ioc:Adonis/Lucid/Database'
import Balance from 'App/Models/Balance';

const api = supertest.agent(`http://${process.env.HOST}:${process.env.PORT}`);

test.group('Delete Statement', (group) => {
  test('should be able to list statements', async (assert) => {
    // income
    const { body: statement1 } = await api
      .post('/statement')
      .send({
        title: 'Depósito Trabalho',
        description: 'deposito do trabalho',
        amount: 100000,
        type: 'income',
        date: new Date(2027, 0)
      })
      .expect(200)

    await api
      .delete('/statement')
      .send({ id: statement1.id })
      .expect(200)

    assert.equal((await Balance.findCurrentBalance()).amount, 0)

    // spending
    const { body: statement2 } = await api
      .post('/statement')
      .send({
        title: 'Depósito Trabalho',
        description: 'deposito do trabalho',
        amount: 100000,
        type: 'spending',
        date: new Date(2027, 0)
      })
      .expect(200)

    await api
      .delete('/statement')
      .send({ id: statement2.id })
      .expect(200)

    assert.equal((await Balance.findCurrentBalance()).amount, 0)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
