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
  Profesor,
} from '../models';
import {GrupoRepository} from '../repositories';

export class GrupoProfesorController {
  constructor(
    @repository(GrupoRepository)
    public grupoRepository: GrupoRepository,
  ) { }

  @get('/grupos/{id}/profesor', {
    responses: {
      '200': {
        description: 'Profesor belonging to Grupo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Profesor)},
          },
        },
      },
    },
  })
  async getProfesor(
    @param.path.string('id') id: typeof Grupo.prototype.Id,
  ): Promise<Profesor> {
    return this.grupoRepository.profesor(id);
  }
}
