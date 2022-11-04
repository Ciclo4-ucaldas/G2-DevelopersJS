import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {EscuelaDataSource} from '../datasources';
import {Estudiante, EstudianteRelations, Grupo} from '../models';
import {GrupoRepository} from './grupo.repository';

export class EstudianteRepository extends DefaultCrudRepository<
  Estudiante,
  typeof Estudiante.prototype.Id,
  EstudianteRelations
> {

  public readonly grupo: BelongsToAccessor<Grupo, typeof Estudiante.prototype.Id>;

  constructor(
    @inject('datasources.escuela') dataSource: EscuelaDataSource, @repository.getter('GrupoRepository') protected grupoRepositoryGetter: Getter<GrupoRepository>,
  ) {
    super(Estudiante, dataSource);
    this.grupo = this.createBelongsToAccessorFor('grupo', grupoRepositoryGetter,);
    this.registerInclusionResolver('grupo', this.grupo.inclusionResolver);
  }
}
