import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {EscuelaDataSource} from '../datasources';
import {Administrador, AdministradorRelations} from '../models';

export class AdministradorRepository extends DefaultCrudRepository<
  Administrador,
  typeof Administrador.prototype.id,
  AdministradorRelations
> {
  constructor(
    @inject('datasources.escuela') dataSource: EscuelaDataSource,
  ) {
    super(Administrador, dataSource);
  }
}
