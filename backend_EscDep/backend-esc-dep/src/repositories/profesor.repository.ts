import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {EscuelaDataSource} from '../datasources';
import {Profesor, ProfesorRelations, Grupo} from '../models';
import {GrupoRepository} from './grupo.repository';

export class ProfesorRepository extends DefaultCrudRepository<
  Profesor,
  typeof Profesor.prototype.Id,
  ProfesorRelations
> {

  public readonly grupos: HasManyRepositoryFactory<Grupo, typeof Profesor.prototype.Id>;

  constructor(
    @inject('datasources.escuela') dataSource: EscuelaDataSource, @repository.getter('GrupoRepository') protected grupoRepositoryGetter: Getter<GrupoRepository>,
  ) {
    super(Profesor, dataSource);
    this.grupos = this.createHasManyRepositoryFactoryFor('grupos', grupoRepositoryGetter,);
    this.registerInclusionResolver('grupos', this.grupos.inclusionResolver);
  }
}
