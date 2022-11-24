import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import { HttpErrors, RedirectRoute, Request } from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {ParamsDictionary} from 'express-serve-static-core';
import {request} from 'http';
import parseBearerToken from 'parse-bearer-token';
import ParseBearerToken from 'parse-bearer-token';
import {ParsedQs} from 'qs';
import { AutenticacionService } from '../services';

export class EstrategiaAdministrador implements AuthenticationStrategy{
  name:string="admin";

  constructor(@service(AutenticacionService)
  public servicioAutenticacion:AutenticacionService){

  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if(token){
      let datos = this.servicioAutenticacion.ValidarTokenJWT(token);
      if(datos.data.rol=="Administrador"){
        let perfil:UserProfile=Object.assign({
          nombre:datos.data.nombre,
          rol:datos.data.rol
        })
        return perfil;
      }else{
        throw new HttpErrors[401]("El token no es valido")
      }
    }else{
      throw new HttpErrors[401]("No se ha incluido un token valido en la solicitud")
    }
  }
}
