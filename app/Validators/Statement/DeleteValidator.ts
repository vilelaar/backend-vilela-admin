import { schema, rules, validator } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StatementListValidator {
  constructor(protected ctx: HttpContextContract) {
  }

  public schema = schema.create({
    id: schema.string({}, [
      rules.exists({ table: 'statements', column: 'id' })
    ]),
  })

  public cacheKey = this.ctx.routeKey

  public reporter = validator.reporters.vanilla;

  public messages = {
    'id.required': 'id obrigatório',
    'id.exists': 'id inválido',
  }
}
