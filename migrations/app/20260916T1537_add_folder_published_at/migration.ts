#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9a4940022ad9bc91f2211ba567f79e143cd626cbc44a92d3e653a7c68bbc0733/contract';
import endContract from '../../snapshots/9a4940022ad9bc91f2211ba567f79e143cd626cbc44a92d3e653a7c68bbc0733/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/daa3b56ffaf1f4e1658d505cfc87c4fd5c1c705d731c19964b593c652e93a3d0/contract';
import startContract from '../../snapshots/daa3b56ffaf1f4e1658d505cfc87c4fd5c1c705d731c19964b593c652e93a3d0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'folder',
        column: col('publishedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
