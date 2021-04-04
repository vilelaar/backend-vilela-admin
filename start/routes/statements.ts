import Route from '@ioc:Adonis/Core/Route'

Route.get('/statement', 'StatementsController.list')

Route.post('/statement', 'StatementsController.save')

Route.delete('/statement', 'StatementsController.delete')
