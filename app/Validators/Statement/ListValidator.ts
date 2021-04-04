import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StatementListValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    year: schema.string({}, [
      rules.minLength(4)
    ]),
    month: schema.enum(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']),
  })

  public cacheKey = this.ctx.routeKey

  public reporter = validator.reporters.vanilla;

  public messages = {
    'year.required': 'ano obrigatório',
    'year.minLength': 'formato inválido',

    'month.enum': 'mês inválido'
  }
}
