import { Repository, DataSource, QueryRunner, ObjectLiteral, FindOptionsWhere } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
  }

  async save(entity: Partial<T>): Promise<T> {
    return this.repository.save(entity as T);
  }

  async remove(entity: T): Promise<T> {
    return this.repository.remove(entity);
  }

  async withTransaction<R>(fn: (queryRunner: QueryRunner) => Promise<R>): Promise<R> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await fn(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
