import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Grupo,
  Estudiante,
} from '../models';
import {GrupoRepository} from '../repositories';

export class GrupoEstudianteController {
  constructor(
    @repository(GrupoRepository) protected grupoRepository: GrupoRepository,
  ) { }

  @get('/grupos/{id}/estudiantes', {
    responses: {
      '200': {
        description: 'Array of Grupo has many Estudiante',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Estudiante)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Estudiante>,
  ): Promise<Estudiante[]> {
    return this.grupoRepository.estudiantes(id).find(filter);
  }

  @post('/grupos/{id}/estudiantes', {
    responses: {
      '200': {
        description: 'Grupo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Estudiante)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Grupo.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estudiante, {
            title: 'NewEstudianteInGrupo',
            exclude: ['Id'],
            optional: ['grupoId']
          }),
        },
      },
    }) estudiante: Omit<Estudiante, 'Id'>,
  ): Promise<Estudiante> {
    return this.grupoRepository.estudiantes(id).create(estudiante);
  }

  @patch('/grupos/{id}/estudiantes', {
    responses: {
      '200': {
        description: 'Grupo.Estudiante PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estudiante, {partial: true}),
        },
      },
    })
    estudiante: Partial<Estudiante>,
    @param.query.object('where', getWhereSchemaFor(Estudiante)) where?: Where<Estudiante>,
  ): Promise<Count> {
    return this.grupoRepository.estudiantes(id).patch(estudiante, where);
  }

  @del('/grupos/{id}/estudiantes', {
    responses: {
      '200': {
        description: 'Grupo.Estudiante DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Estudiante)) where?: Where<Estudiante>,
  ): Promise<Count> {
    return this.grupoRepository.estudiantes(id).delete(where);
  }
}
