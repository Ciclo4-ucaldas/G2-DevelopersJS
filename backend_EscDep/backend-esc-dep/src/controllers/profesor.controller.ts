import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Profesor} from '../models';
import {ProfesorRepository} from '../repositories';
import {NotificacionService} from '../services';

export class ProfesorController {
  constructor(
    @repository(ProfesorRepository)
    public profesorRepository : ProfesorRepository,
    @service(NotificacionService)
    public NotificacionService : NotificacionService
  ) {}

  @post('/profesores')
  @response(200, {
    description: 'Profesor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Profesor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profesor, {
            title: 'NewProfesor',
            exclude: ['Id'],
          }),
        },
      },
    })
    profesor: Omit<Profesor, 'Id'>,
  ): Promise<Profesor | any> {
    //Generar y cifrar clave
    let clave = this.NotificacionService.GenerarClave();
    let claveCifrada = this.NotificacionService.CifrarClave(clave);
    profesor.Clave=claveCifrada;
    let prof = await this.profesorRepository.create(profesor);

    let destino = profesor.Correo;
    let asunto = "REGISTRO en Plataforma Escuela Deportiva"
    let contenido = `Hola, ${profesor.Nombres} ${profesor.Apellidos}. <br/> ¡SU REGISTRO EN LA PLATAFORMA HA SIDO EXITOSO! <br/> Su usuario es el correo electronico registrado en la plataforma: ${profesor.Correo} <br/> Su contraseña es: ${clave}`
    let mensaje = this.NotificacionService.MensajeClave(destino,asunto,contenido);
    if (mensaje){
      return prof; //Devuelve los datos del estudiante guardados
    }else{
      return new HttpErrors[400]("No se pudo registrar en la plataforma");
    }
  }

  @get('/profesores/count')
  @response(200, {
    description: 'Profesor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Profesor) where?: Where<Profesor>,
  ): Promise<Count> {
    return this.profesorRepository.count(where);
  }

  @get('/profesores')
  @response(200, {
    description: 'Array of Profesor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Profesor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Profesor) filter?: Filter<Profesor>,
  ): Promise<Profesor[]> {
    return this.profesorRepository.find(filter);
  }

  @patch('/profesores')
  @response(200, {
    description: 'Profesor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profesor, {partial: true}),
        },
      },
    })
    profesor: Profesor,
    @param.where(Profesor) where?: Where<Profesor>,
  ): Promise<Count> {
    return this.profesorRepository.updateAll(profesor, where);
  }

  @get('/profesores/{id}')
  @response(200, {
    description: 'Profesor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Profesor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Profesor, {exclude: 'where'}) filter?: FilterExcludingWhere<Profesor>
  ): Promise<Profesor> {
    return this.profesorRepository.findById(id, filter);
  }

  @patch('/profesores/{id}')
  @response(204, {
    description: 'Profesor PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Profesor, {partial: true}),
        },
      },
    })
    profesor: Profesor,
  ): Promise<void> {
    await this.profesorRepository.updateById(id, profesor);
  }

  @put('/profesores/{id}')
  @response(204, {
    description: 'Profesor PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() profesor: Profesor,
  ): Promise<void> {
    await this.profesorRepository.replaceById(id, profesor);
  }

  @del('/profesores/{id}')
  @response(204, {
    description: 'Profesor DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.profesorRepository.deleteById(id);
  }
}
