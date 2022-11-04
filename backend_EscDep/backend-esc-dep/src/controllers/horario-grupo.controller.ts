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
  Horario,
  Grupo,
} from '../models';
import {HorarioRepository} from '../repositories';

export class HorarioGrupoController {
  constructor(
    @repository(HorarioRepository) protected horarioRepository: HorarioRepository,
  ) { }

  @get('/horarios/{id}/grupo', {
    responses: {
      '200': {
        description: 'Horario has one Grupo',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Grupo),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Grupo>,
  ): Promise<Grupo> {
    return this.horarioRepository.grupo(id).get(filter);
  }

  @post('/horarios/{id}/grupo', {
    responses: {
      '200': {
        description: 'Horario model instance',
        content: {'application/json': {schema: getModelSchemaRef(Grupo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Horario.prototype.Id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Grupo, {
            title: 'NewGrupoInHorario',
            exclude: ['Id'],
            optional: ['horarioId']
          }),
        },
      },
    }) grupo: Omit<Grupo, 'Id'>,
  ): Promise<Grupo> {
    return this.horarioRepository.grupo(id).create(grupo);
  }

  @patch('/horarios/{id}/grupo', {
    responses: {
      '200': {
        description: 'Horario.Grupo PATCH success count',
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
    return this.horarioRepository.grupo(id).patch(grupo, where);
  }

  @del('/horarios/{id}/grupo', {
    responses: {
      '200': {
        description: 'Horario.Grupo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Grupo)) where?: Where<Grupo>,
  ): Promise<Count> {
    return this.horarioRepository.grupo(id).delete(where);
  }
}
