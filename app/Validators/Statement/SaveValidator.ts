import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SaveStatementValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    title: schema.string(),
    description: schema.string(),
    amount: schema.number([
      rules.unsigned(),
    ]),
    type: schema.enum(['spending', 'income']),
    date: schema.date(),
  })

  public cacheKey = this.ctx.routeKey

  public reporter = validator.reporters.vanilla;

  public messages = {
    'title.required': 'titulo obrigatório',

    'description.required': 'descrição obrigatória',

    'amount.required': 'preço obrigatório',
    'amount.unsigned': 'preço deve ser positivo',

    'type.required': 'tipo obrigatório',
    'type.enum': 'tipo inválido',

    'date.required': 'data obrigatória'
  }
}
