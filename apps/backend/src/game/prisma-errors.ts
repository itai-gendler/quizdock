/** Prisma's foreign-key violation (P2003), e.g. archiving a session whose quiz was deleted. */
export function isForeignKeyViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === 'P2003';
}
