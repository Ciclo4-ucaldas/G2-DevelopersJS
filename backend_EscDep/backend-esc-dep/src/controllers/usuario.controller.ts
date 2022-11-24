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
import {Credenciales, Usuario} from '../models';
import {UsuarioRepository} from '../repositories';
import {AutenticacionService} from '../services';

export class UsuarioController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository : UsuarioRepository,
    @service(AutenticacionService)
    public servicioAutenticacion:AutenticacionService
  ) {}

  @post('/IdentificarPersona',{
    responses:{
      '200':{
        description:"Identificacion de usuarios"
      }
    }
  })
  async IdentificarPersona(@requestBody() Credenciales:Credenciales){
    let Persona = await this.servicioAutenticacion.IdentificarPersona(Credenciales.usuario,Credenciales.clave)
    if(Persona!=null){
      let token = await this.servicioAutenticacion.GenerarTokenJWT(Persona);
      return{
        datos:{
          nombres:Persona.Nombres,
          correo:Persona.Correo,
          id:Persona.id
        },
        tk:token
      }
    }else{
      throw new HttpErrors[401]("Datos invalidos")
    }
  }

}
