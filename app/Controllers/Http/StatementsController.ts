import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Statement from 'App/Models/Statement'

import IListStatementDto from 'App/dtos/IListStatementDto'

import ListValidator from 'App/Validators/Statement/ListValidator'
import SaveValidator from 'App/Validators/Statement/SaveValidator'
import DeleteValidator from 'App/Validators/Statement/DeleteValidator'

import ListService from 'App/Services/Statement/ListService'
import SaveService from 'App/Services/Statement/SaveService'
import DeleteService from 'App/Services/Statement/DeleteService'

export default class StatementsController {
  public async list({ request }: HttpContextContract): Promise<IListStatementDto> {
    const { year, month } = await request.validate(ListValidator)

    return await ListService.execute({ year, month })
  }

  public async save({ request }: HttpContextContract): Promise<Statement> {
    const { title, description, amount, type, date } = await request.validate(
      SaveValidator
    );

    return await SaveService.execute({
      title,
      description,
      amount,
      type: type === 'spending' ? 'spending' : 'income',
      date
    })
  }

  public async delete({ request }: HttpContextContract): Promise<object> {
    const { id } = await request.validate(
      DeleteValidator
    );

    await DeleteService.execute(id)

    return { sucess: 'deleted with sucess' };
  }
}
