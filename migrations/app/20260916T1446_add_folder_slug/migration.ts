#!/usr/bin/env -S node

import type { Contract as Start } from '../../snapshots/515aa6e3deee0120fa5f17e44210d022428115ebafa8eb377aa595373698227e/contract';
import startContractJson from '../../snapshots/515aa6e3deee0120fa5f17e44210d022428115ebafa8eb377aa595373698227e/contract.json' with { type: 'json' };

import type { Contract as End } from '../../snapshots/daa3b56ffaf1f4e1658d505cfc87c4fd5c1c705d731c19964b593c652e93a3d0/contract';
import endContractJson from '../../snapshots/daa3b56ffaf1f4e1658d505cfc87c4fd5c1c705d731c19964b593c652e93a3d0/contract.json' with { type: 'json' };

import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';
import postgresAdapter from '@prisma/orm-postgres/adapter/runtime';
import { sql } from '@prisma/orm-postgres/builder/runtime';
import {
  createExecutionContext,
  createSqlExecutionStack,
} from '@prisma/orm-postgres/family-runtime';
import postgresTarget, {
  PostgresContractSerializer,
} from '@prisma/orm-postgres/target/runtime';

const endContract =
  new PostgresContractSerializer().deserializeContract<End>(endContractJson);

const stack = createSqlExecutionStack({
  target: postgresTarget,
  adapter: postgresAdapter,
});

const db = sql<End>({
  context: createExecutionContext<End>({
    contract: endContract,
    stack,
  }),
  rawCodecInferer: stack.adapter.rawCodecInferer,
});

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContractJson;
  override readonly endContractJson = endContractJson;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'folder',
        column: col('slug', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.dataTransform(endContract, 'backfill-folder-slug', {
        check: () =>
          db.public.folder
            .select('id')
            .where((f, fns) => fns.eq(f.slug, null))
            .limit(1),

        run: () =>
          db.public.folder
            .update((f, fns) => ({
              slug: fns.raw`
                LOWER(
                  REGEXP_REPLACE(
                    TRIM(${f.name}),
                    '[^a-zA-Z0-9]+',
                    '-',
                    'g'
                  )
                )
              `.returns('pg/text@1'),
              updatedAt: fns.raw`CURRENT_TIMESTAMP`.returns(
                'pg/timestamptz-string@1',
              ),
            }))
            .where((f, fns) => fns.eq(f.slug, null)),
      }),

      this.setNotNull({
        schema: 'public',
        table: 'folder',
        column: 'slug',
      }),

      this.addUnique({
        schema: 'public',
        table: 'folder',
        constraint: 'folder_slug_key',
        columns: ['slug'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);