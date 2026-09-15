#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/515aa6e3deee0120fa5f17e44210d022428115ebafa8eb377aa595373698227e/contract';
import endContract from '../../snapshots/515aa6e3deee0120fa5f17e44210d022428115ebafa8eb377aa595373698227e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'bookmark',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('noteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['userId', 'noteId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'folder',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('parentFolderId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'note',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('folderId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('publishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'reading_progress',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('noteId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('progress', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('scrollPosition', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('sectionName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['userId', 'noteId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('USER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('user', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('user_role_check_1954e8c0', "\"role\" IN ('USER', 'ADMIN')"),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'note',
        constraint: 'note_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_username_key',
        columns: ['username'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookmark',
        index: 'bookmark_noteId_idx_0612c5b1',
        columns: ['noteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'bookmark',
        index: 'bookmark_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'folder',
        index: 'folder_parentFolderId_idx_66fef1f5',
        columns: ['parentFolderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'note',
        index: 'note_folderId_idx_5985e562',
        columns: ['folderId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reading_progress',
        index: 'reading_progress_noteId_idx_0612c5b1',
        columns: ['noteId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'reading_progress',
        index: 'reading_progress_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bookmark',
        foreignKey: {
          name: 'bookmark_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'bookmark',
        foreignKey: {
          name: 'bookmark_noteId_fkey',
          columns: ['noteId'],
          references: { schema: 'public', table: 'note', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'folder',
        foreignKey: {
          name: 'folder_parentFolderId_fkey',
          columns: ['parentFolderId'],
          references: { schema: 'public', table: 'folder', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'note',
        foreignKey: {
          name: 'note_folderId_fkey',
          columns: ['folderId'],
          references: { schema: 'public', table: 'folder', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reading_progress',
        foreignKey: {
          name: 'reading_progress_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'reading_progress',
        foreignKey: {
          name: 'reading_progress_noteId_fkey',
          columns: ['noteId'],
          references: { schema: 'public', table: 'note', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
