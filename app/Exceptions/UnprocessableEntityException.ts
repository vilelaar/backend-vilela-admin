import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UnprocessableEntityException extends Exception {
  constructor(message: { [key: string]: string }) {
    super(JSON.stringify(message), 422)
  }

  public async handle(error: this, { response }: HttpContextContract) {
    response
      .status(error.status)
      .json(error.message);
  }
}
