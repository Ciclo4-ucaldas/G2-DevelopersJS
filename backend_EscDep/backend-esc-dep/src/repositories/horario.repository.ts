import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {EscuelaDataSource} from '../datasources';
import {Horario, HorarioRelations, Grupo} from '../models';
import {GrupoRepository} from './grupo.repository';

export class HorarioRepository extends DefaultCrudRepository<
  Horario,
  typeof Horario.prototype.Id,
  HorarioRelations
> {

  public readonly grupo: HasOneRepositoryFactory<Grupo, typeof Horario.prototype.Id>;

  constructor(
    @inject('datasources.escuela') dataSource: EscuelaDataSource, @repository.getter('GrupoRepository') protected grupoRepositoryGetter: Getter<GrupoRepository>,
  ) {
    super(Horario, dataSource);
    this.grupo = this.createHasOneRepositoryFactoryFor('grupo', grupoRepositoryGetter);
    this.registerInclusionResolver('grupo', this.grupo.inclusionResolver);
  }
}
