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
  Profesor,
  Grupo,
} from '../models';
import {ProfesorRepository} from '../repositories';

export class ProfesorGrupoController {
  constructor(
    @repository(ProfesorRepository) protected profesorRepository: ProfesorRepository,
  ) { }

  @get('/profesors/{id}/grupos', {
    responses: {
      '200': {
        description: 'Array of Profesor has many Grupo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Grupo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Grupo>,
  ): Promise<Grupo[]> {
    return this.profesorRepository.grupos(id).find(filter);
  }

  @post('/profesors/{id}/grupos', {
    responses: {
      '200': {
        description: 'Profesor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Grupo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Profesor.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grupo, {
            title: 'NewGrupoInProfesor',
            exclude: ['Id'],
            optional: ['profesorId']
          }),
        },
      },
    }) grupo: Omit<Grupo, 'Id'>,
  ): Promise<Grupo> {
    return this.profesorRepository.grupos(id).create(grupo);
  }

  @patch('/profesors/{id}/grupos', {
    responses: {
      '200': {
        description: 'Profesor.Grupo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grupo, {partial: true}),
        },
      },
    })
    grupo: Partial<Grupo>,
    @param.query.object('where', getWhereSchemaFor(Grupo)) where?: Where<Grupo>,
  ): Promise<Count> {
    return this.profesorRepository.grupos(id).patch(grupo, where);
  }

  @del('/profesors/{id}/grupos', {
    responses: {
      '200': {
        description: 'Profesor.Grupo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Grupo)) where?: Where<Grupo>,
  ): Promise<Count> {
    return this.profesorRepository.grupos(id).delete(where);
  }
}
