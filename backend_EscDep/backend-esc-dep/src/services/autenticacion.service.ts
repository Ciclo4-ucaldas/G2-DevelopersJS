import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository, WhereBuilder} from '@loopback/repository';
import {Llaves} from '../config/Llaves';
import {Administrador, Usuario} from '../models';
import {AdministradorRepository, EstudianteRepository, ProfesorRepository, UsuarioRepository} from '../repositories';
const jwt = require("jsonwebtoken")
@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(/* Add @inject to inject parameters */) { }
  @repository("AdministradorRepository")
  public administradorRepository : AdministradorRepository
  @repository("ProfesorRepository")
  public profesorRepository : ProfesorRepository
  @repository("UsuarioRepository")
  public personaRepository:UsuarioRepository
  @repository("EstudianteRepository")
  public estudianteRepository : EstudianteRepository
  /*
   * Add service methods here
   */

  async IdentificarPersona(usuario:string, clave:string){
    try {
      let admin = await this.administradorRepository.findOne({where:{Correo:usuario,Clave:clave}})
      let profesor = await this.profesorRepository.findOne({where:{Correo:usuario,Clave:clave}})
      let estudiante = await this.estudianteRepository.findOne({where:{Correo:usuario,Clave:clave}})
      if(admin){
        return admin;
      }else if(profesor){
        return profesor;
      }else if(estudiante){
        return estudiante
      }
      return false;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async GenerarTokenJWT(persona:Usuario){
    let admin = await this.administradorRepository.findOne({where:{Correo:persona.Correo,Clave:persona.Clave}})
    let prof = await this.profesorRepository.findOne({where:{Correo:persona.Correo,Clave:persona.Clave}})
    let estd = await this.estudianteRepository.findOne({where:{Correo:persona.Correo,Clave:persona.Clave}})
    let rol;

    if(admin){
      rol=admin.constructor.name;
    }else if(prof){
      rol=prof.constructor.name;
    }else if(estd){
      rol=estd.constructor.name;
    }

    let token = jwt.sign({
      data:{
        id:persona.id,
        correo:persona.Correo,
        nombres:persona.Nombres,
        apellidos:persona.Apellidos,
        rol:rol
      }
    },Llaves.claveJWT);
    return token;
  }

  ValidarTokenJWT(token:string){
    try {
      let datos = jwt.verify(token,Llaves.claveJWT)
      return datos
    } catch (error) {
      return false;
    }
  }
}
