#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6377e50a2422af260db76d72fe1b4a17d2efbe0a6baf41330a93e9f1601e8185/contract';
import startContract from '../../snapshots/6377e50a2422af260db76d72fe1b4a17d2efbe0a6baf41330a93e9f1601e8185/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/a9c4e5667ab2c6e1092ae64efde9878f707f9b1b3c053107bf3713d7f14b96bd/contract';
import endContract from '../../snapshots/a9c4e5667ab2c6e1092ae64efde9878f707f9b1b3c053107bf3713d7f14b96bd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'session', column: 'serAgent' }),
      this.addColumn({
        schema: 'public',
        table: 'session',
        column: col('userAgent', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
