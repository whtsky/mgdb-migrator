
// tslint:disable:no-console
// tslint:disable:no-empty

import { Migration } from '../';

describe('Migration', () => {

  let migrator: Migration;

  beforeAll(async () => {
    try {
      migrator = new Migration({
        log: true,
        logIfLatest: true,
        collectionName: '_migration',
        db: 'mongodb://localhost:27030/migration-test-db',
      });
      await migrator.config();
    } catch (e) {
      console.log(e);
      throw e;
    }
  });

  beforeEach(() => {
    migrator.add({
      version: 1,
      name: 'Version 1',
      up: (db) => {
      },
      down: (db) => {
      },
    });

    migrator.add({
      version: 2,
      name: 'Version 2.',
      up: (db) => {
      },
      down: (db) => {
      },
    });
  });

  afterEach(async () => {
    await migrator._reset();
  });

  describe('#migrateTo', () => {

    test('1 from 0, should migrate to v1', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo(1);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(1);
    });

    test('2 from 0, should migrate to v2', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo(2);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);
    });

    test('\'latest\' from 0, should migrate to v2', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
      await migrator.migrateTo('latest');
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);
    });

    test('from 2 to 1, should migrate to v1', async () => {
      await migrator.migrateTo('latest');
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);

      await migrator.migrateTo(1);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(1);
    });

    test('from 2 to 0, should migrate to v0', async () => {
      await migrator.migrateTo('latest');
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(2);

      await migrator.migrateTo(0);
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
    });

    test('rerun 0 to 0, should migrate to v0', async () => {
      let currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);

      await migrator.migrateTo('0,rerun');
      currentVersion = await migrator.getVersion();
      expect(currentVersion).toBe(0);
    });

  });

});
