import test from 'japa'
import supertest from 'supertest';

import Database from '@ioc:Adonis/Lucid/Database'

import Statement from 'App/Models/Statement';
import Balance from 'App/Models/Balance';

const api = supertest.agent(`http://${process.env.HOST}:${process.env.PORT}`);

test.group('Save Statement', (group) => {
  test('should be able to return the expect value', async (assert) => {
    const { body: statement } = await api
      .post('/statement')
      .send({
        title: 'Depósito Trabalho',
        description: 'deposito do trabalho',
        amount: 6000,
        type: 'income',
        date: new Date(2027, 0, 10)
      })
      .expect(200)


    assert.include(statement, {
      id: statement.id,
      title: 'Depósito Trabalho',
      description: 'deposito do trabalho',
      amount: 6000,
      type: 'income',
      date: '2027-01-10T00:00:00.000-03:00',
      created_at: statement.created_at,
      updated_at: statement.updated_at,
    })
  })

  test('should be able to save statement as type income', async (assert) => {
    const { body: statement } = await api
      .post('/statement')
      .send({
        title: 'Depósito Trabalho',
        description: 'deposito do trabalho',
        amount: 6000,
        type: 'income',
        date: new Date(Date.now())
      })
      .expect(200)

    assert.hasAnyKeys(statement, ['id', 'title', 'created_at'])
    assert.isNotFalse(await Statement.find(statement.id));

    const balance = await Balance.findCurrentBalance();

    assert.isNotFalse(balance);
    if (balance) assert.equal(balance.amount, 6000)
  })

  test('should be able to save statement as type spending', async (assert) => {
    const { body: statement } = await api
      .post('/statement')
      .send({
        title: 'Pagamento Bolinha',
        description: 'segunda parcela',
        amount: 6000,
        type: 'spending',
        date: new Date(Date.now())
      })
      .expect(200)

    assert.hasAnyKeys(statement, ['id', 'title', 'created_at'])
    assert.isNotFalse(await Statement.find(statement.id));

    const balance = await Balance.findCurrentBalance();

    assert.isNotFalse(balance);
    if (balance) assert.equal(balance.amount, -6000)
  })

  test('should be able to save statement and change', async (assert) => {
    // type spending and type income

    // statement type income
    await api
      .post('/statement')
      .send({
        title: 'Depósito Trabalho',
        description: 'deposito do trabalho',
        amount: 6000,
        type: 'income',
        date: new Date(Date.now())
      })
      .expect(200)

    const balance1 = await Balance.findCurrentBalance();

    assert.isNotFalse(balance1);
    if (balance1) assert.equal(balance1.amount, 6000)

    // statement type spending
    await api
      .post('/statement')
      .send({
        title: 'Pagamento Bolinha',
        description: 'segunda parcela',
        amount: 6000,
        type: 'spending',
        date: new Date(Date.now())
      })
      .expect(200)

    const balance2 = await Balance.findCurrentBalance();

    assert.isNotFalse(balance2);
    if (balance2) assert.equal(balance2.amount, 0)

    // -------------------------------------------------------------------------

    await Database.rollbackGlobalTransaction()
    await Database.beginGlobalTransaction()

    // -------------------------------------------------------------------------
    // type income and type spending

    // statement type income
    await api
      .post('/statement')
      .send({
        title: 'Pagamento Bolinha',
        description: 'segunda parcela',
        amount: 6000,
        type: 'spending',
        date: new Date(Date.now())
      })
      .expect(200)

    const balance3 = await Balance.findCurrentBalance();

    assert.isNotFalse(balance3);
    if (balance3) assert.equal(balance3.amount, -6000)

    // statement type spending
    await api
      .post('/statement')
      .send({
        title: 'Depósito Trabalho',
        description: 'deposito do trabalho',
        amount: 6000,
        type: 'income',
        date: new Date(Date.now())
      })
      .expect(200)

    const balance4 = await Balance.findCurrentBalance();

    assert.isNotFalse(balance4);
    if (balance4) assert.equal(balance4.amount, 0)
  })


  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
