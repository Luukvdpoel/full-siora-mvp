import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@creator/server/router';

export const trpc = createTRPCReact<AppRouter>();
