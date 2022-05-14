import { Module } from "@nestjs/common";
import {
  AccountDatabaseRepository,
  BCryptPasswordHasher,
  FetchAuthenticationStatusDatabaseQuery,
  LoginApplicationService,
} from "authentication";
import { AUTHENTICATOR, PRISMA } from "../keys";
import { SessionAuthenticator } from "./remix/SessionAuthenticator";
import {
  FetchHomePageDatabaseQuery,
  FetchTodoListDatabaseQuery,
  TodoApplicationService,
  TodoListApplicationService,
  TodoListDatabaseRepository,
  TodoDatabaseRepository,
} from "todo-list-manager";
import {
  ACTIONS_CLASS,
  LOADERS_CLASS,
  SESSION_CONFIG,
  SessionManager,
} from "remix-nest-adapter";
import { Actions } from "./remix/Actions";
import { Loaders } from "./remix/Loaders";
import { GenerateUUID, Prisma } from "shared";
import { RealClock } from "../shared/RealClock";

const RemixSessionConfig = {
  name: "__session",
  maxAge: 60 * 60 * 24,
  httpOnly: true,
  sameSite: "strict" as const,
  secrets: [process.env.SESSION_SECRET!],
};

@Module({
  imports: [],
  providers: [
    // Authentication
    LoginApplicationService,
    AccountDatabaseRepository,
    FetchAuthenticationStatusDatabaseQuery,
    BCryptPasswordHasher,
    {
      provide: AUTHENTICATOR,
      useClass: SessionAuthenticator,
    },

    // TodoListManager
    TodoApplicationService,
    TodoListApplicationService,
    TodoDatabaseRepository,
    TodoListDatabaseRepository,
    FetchHomePageDatabaseQuery,
    FetchTodoListDatabaseQuery,

    // Remix stuff
    SessionManager,
    {
      provide: SESSION_CONFIG,
      useValue: RemixSessionConfig,
    },
    {
      provide: ACTIONS_CLASS,
      useClass: Actions,
    },
    {
      provide: LOADERS_CLASS,
      useClass: Loaders,
    },

    // Infrastructure
    GenerateUUID,
    RealClock,
    {
      provide: PRISMA,
      useClass: Prisma,
    },
  ],
  exports: [ACTIONS_CLASS, LOADERS_CLASS],
})
export class CoreModule {}
