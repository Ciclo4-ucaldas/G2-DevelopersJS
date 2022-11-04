import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Grupo,
  Horario,
} from '../models';
import {GrupoRepository} from '../repositories';

export class GrupoHorarioController {
  constructor(
    @repository(GrupoRepository)
    public grupoRepository: GrupoRepository,
  ) { }

  @get('/grupos/{id}/horario', {
    responses: {
      '200': {
        description: 'Horario belonging to Grupo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Horario)},
          },
        },
      },
    },
  })
  async getHorario(
    @param.path.string('id') id: typeof Grupo.prototype.Id,
  ): Promise<Horario> {
    return this.grupoRepository.horario(id);
  }
}
