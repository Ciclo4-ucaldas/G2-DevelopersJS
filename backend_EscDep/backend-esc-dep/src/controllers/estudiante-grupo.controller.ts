import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Estudiante,
  Grupo,
} from '../models';
import {EstudianteRepository} from '../repositories';

export class EstudianteGrupoController {
  constructor(
    @repository(EstudianteRepository)
    public estudianteRepository: EstudianteRepository,
  ) { }

  @get('/estudiantes/{id}/grupo', {
    responses: {
      '200': {
        description: 'Grupo belonging to Estudiante',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Grupo)},
          },
        },
      },
    },
  })
  async getGrupo(
    @param.path.string('id') id: typeof Estudiante.prototype.Id,
  ): Promise<Grupo> {
    return this.estudianteRepository.grupo(id);
  }
}
