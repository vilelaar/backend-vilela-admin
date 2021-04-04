import test from 'japa'
import supertest from 'supertest';

import Database from '@ioc:Adonis/Lucid/Database'

const api = supertest.agent(`http://${process.env.HOST}:${process.env.PORT}`);

test.group('List Statement', (group) => {
  test('should be able to list statements', async (assert) => {
    // income
    // #region
    await api
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
      .post('/statement')
      .send({
        title: 'Depósito Trabalho',
        description: 'deposito do trabalho',
        amount: 100000,
        type: 'income',
        date: new Date(2027, 0, 5)
      })
      .expect(200)
    // #endregion

    // spending
    // #region
    await api
      .post('/statement')
      .send({
        title: 'Pagamento Bolinha',
        description: 'segunda parcela',
        amount: 50000,
        type: 'spending',
        date: new Date(2027, 0)
      })
      .expect(200)

    await api
      .post('/statement')
      .send({
        title: 'Pagamento Bolinha',
        description: 'segunda parcela',
        amount: 50000,
        type: 'spending',
        date: new Date(2027, 0, 10)
      })
      .expect(200)
    await api
      .post('/statement')
      .send({
        title: 'Pagamento Bolinha',
        description: 'segunda parcela',
        amount: 50000,
        type: 'spending',
        date: new Date(2027, 0, 10)
      })
      .expect(200)
    // #endregion

    // list
    // #region
    const { body: list } = await api
      .get('/statement')
      .query({ year: '2027', month: '01' })
      .expect(200)
    // #endregion

    // expect
    assert.include(list, {
      balance: 150000,
      total_spending: 150000,
      total_income: 300000,
    })

    // total
    assert.equal(list.total.length, 3)
    assert.equal(list.total[0].date.slice(0, 10), '2027-01-01')
    assert.equal(list.total[0].list.length, 3)
    assert.equal(list.total[1].date.slice(0, 10), '2027-01-05')
    assert.equal(list.total[1].list.length, 1)
    assert.equal(list.total[2].date.slice(0, 10), '2027-01-10')
    assert.equal(list.total[2].list.length, 2)

    // incomes
    assert.equal(list.income.length, 2)
    assert.equal(list.income[0].date.slice(0, 10), '2027-01-01')
    assert.equal(list.income[0].list.length, 2)
    assert.equal(list.income[1].date.slice(0, 10), '2027-01-05')
    assert.equal(list.income[1].list.length, 1)

    // spendings
    assert.equal(list.spending.length, 2)
    assert.equal(list.spending[0].date.slice(0, 10), '2027-01-01')
    assert.equal(list.spending[0].list.length, 1)
    assert.equal(list.spending[1].date.slice(0, 10), '2027-01-10')
    assert.equal(list.spending[1].list.length, 2)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
