import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {EscuelaDataSource} from '../datasources';
import {Grupo, GrupoRelations, Estudiante, Horario, Profesor} from '../models';
import {EstudianteRepository} from './estudiante.repository';
import {HorarioRepository} from './horario.repository';
import {ProfesorRepository} from './profesor.repository';

export class GrupoRepository extends DefaultCrudRepository<
  Grupo,
  typeof Grupo.prototype.Id,
  GrupoRelations
> {

  public readonly estudiantes: HasManyRepositoryFactory<Estudiante, typeof Grupo.prototype.Id>;

  public readonly horario: BelongsToAccessor<Horario, typeof Grupo.prototype.Id>;

  public readonly profesor: BelongsToAccessor<Profesor, typeof Grupo.prototype.Id>;

  constructor(
    @inject('datasources.escuela') dataSource: EscuelaDataSource, @repository.getter('EstudianteRepository') protected estudianteRepositoryGetter: Getter<EstudianteRepository>, @repository.getter('HorarioRepository') protected horarioRepositoryGetter: Getter<HorarioRepository>, @repository.getter('ProfesorRepository') protected profesorRepositoryGetter: Getter<ProfesorRepository>,
  ) {
    super(Grupo, dataSource);
    this.profesor = this.createBelongsToAccessorFor('profesor', profesorRepositoryGetter,);
    this.registerInclusionResolver('profesor', this.profesor.inclusionResolver);
    this.horario = this.createBelongsToAccessorFor('horario', horarioRepositoryGetter,);
    this.registerInclusionResolver('horario', this.horario.inclusionResolver);
    this.estudiantes = this.createHasManyRepositoryFactoryFor('estudiantes', estudianteRepositoryGetter,);
    this.registerInclusionResolver('estudiantes', this.estudiantes.inclusionResolver);
  }
}
