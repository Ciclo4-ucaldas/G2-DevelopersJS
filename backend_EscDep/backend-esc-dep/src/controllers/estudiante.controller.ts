import {authenticate} from '@loopback/authentication';
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
import {serialize} from 'v8';
import {Estudiante} from '../models';
import {EstudianteRepository} from '../repositories';
import {NotificacionService} from '../services';

@authenticate("admin")
export class EstudianteController {
  constructor(
    @repository(EstudianteRepository)
    public estudianteRepository : EstudianteRepository,
    @service(NotificacionService)
    public NotificacionService : NotificacionService
  ) {}

  @authenticate("admin","est","prof")
  @post('/estudiantes')
  @response(200, {
    description: 'Estudiante model instance',
    content: {'application/json': {schema: getModelSchemaRef(Estudiante)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estudiante, {
            title: 'NewEstudiante',
            exclude: ['Id'],
          }),
        },
      },
    })
    estudiante: Omit<Estudiante, 'Id'>,
  ): Promise<Estudiante | any> {
    //Generar y cifrar clave
    let clave = this.NotificacionService.GenerarClave();
    let claveCifrada = this.NotificacionService.CifrarClave(clave);
    estudiante.Clave = claveCifrada;
    let estd = await this.estudianteRepository.create(estudiante);

    //Enviar Clave al correo
    let destino = estudiante.Correo;
    let asunto = "REGISTRO en Plataforma Escuela Deportiva"
    let contenido = `Hola, ${estudiante.Nombres} ${estudiante.Apellidos}. <br/> Le damos la bienvenida a la Escuela Deportiva <br/> ¡SU REGISTRO EN LA PLATAFORMA HA SIDO EXITOSO! <br/> Su usuario es el correo electronico registrado en la plataforma: ${estudiante.Correo} <br/> Su contraseña es: ${clave}`
    let mensaje = this.NotificacionService.MensajeClave(destino,asunto,contenido);
    if (mensaje){
      return estd; //Devuelve los datos del estudiante guardados
    }else{
      return new HttpErrors[400]("No se pudo registrar en la plataforma");
    }
  }

  @authenticate("admin","prof")
  @get('/estudiantes/count')
  @response(200, {
    description: 'Estudiante model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Estudiante) where?: Where<Estudiante>,
  ): Promise<Count> {
    return this.estudianteRepository.count(where);
  }

  @authenticate("admin","prof")
  @get('/estudiantes')
  @response(200, {
    description: 'Array of Estudiante model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Estudiante, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Estudiante) filter?: Filter<Estudiante>,
  ): Promise<Estudiante[]> {
    return this.estudianteRepository.find(filter);
  }

  @authenticate("admin","estd","prof")
  @patch('/estudiantes')
  @response(200, {
    description: 'Estudiante PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estudiante, {partial: true}),
        },
      },
    })
    estudiante: Estudiante,
    @param.where(Estudiante) where?: Where<Estudiante>,
  ): Promise<Count> {
    return this.estudianteRepository.updateAll(estudiante, where);
  }

  @authenticate("admin","prof","estd")
  @get('/estudiantes/{id}')
  @response(200, {
    description: 'Estudiante model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Estudiante, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Estudiante, {exclude: 'where'}) filter?: FilterExcludingWhere<Estudiante>
  ): Promise<Estudiante> {
    return this.estudianteRepository.findById(id, filter);
  }

  @authenticate("admin","estd","prof")
  @patch('/estudiantes/{id}')
  @response(204, {
    description: 'Estudiante PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Estudiante, {partial: true}),
        },
      },
    })
    estudiante: Estudiante,
  ): Promise<void> {
    await this.estudianteRepository.updateById(id, estudiante);
  }

  @put('/estudiantes/{id}')
  @response(204, {
    description: 'Estudiante PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() estudiante: Estudiante,
  ): Promise<void> {
    await this.estudianteRepository.replaceById(id, estudiante);
  }

  @authenticate("admin","prof")
  @del('/estudiantes/{id}')
  @response(204, {
    description: 'Estudiante DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.estudianteRepository.deleteById(id);
  }
}
