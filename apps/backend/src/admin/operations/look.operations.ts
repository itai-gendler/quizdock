import { Injectable } from '@nestjs/common';
import { interfaceLookSchema } from '@quiz-dock/contracts';
import { z } from 'zod';
import { LookService } from '../../look/look.service';
import { type AdminOperation, defineOperation, done } from './operation';

/** The instance's look (THEMING lot 2) as operations: read, set, back to QuizDock's. */
@Injectable()
export class LookOperations {
  constructor(private readonly look: LookService) {}

  list(): AdminOperation[] {
    return [
      defineOperation({
        id: 'look.get',
        domain: 'instance',
        category: 'look',
        effect: 'read',
        summary: "The interface's look: its colours, font, corners and showcase backgrounds.",
        params: z.object({}),
        run: async () => done(await this.look.get()),
      }),
      defineOperation({
        id: 'look.set',
        domain: 'instance',
        category: 'look',
        effect: 'write',
        summary: "Sets the interface's look; every visitor sees it from the next page they open.",
        params: interfaceLookSchema,
        run: async (ctx, look) => done(await this.look.set(ctx.actor, look)),
      }),
      defineOperation({
        id: 'look.reset',
        domain: 'instance',
        category: 'look',
        effect: 'write',
        summary: "Back to QuizDock's own look.",
        params: z.object({}),
        run: async () => done(await this.look.reset()),
      }),
    ];
  }
}
