import { default as HandlerContext } from "../lib/handlerContext.js";
import { ClientOptions } from "@xmtp/mls-client";
export type AgentHandlers = {
    [key: string]: (context: HandlerContext) => Promise<void>;
};
export type MessageAbstracted = {
    id: string;
    sent: Date;
    content: any;
    sender: {
        inboxId: string;
        username: string;
        address: string;
        accountAddresses: string[];
    };
    typeId: string;
};
export type CommandHandler = (context: HandlerContext) => Promise<void>;
export type CommandHandlers = {
    [command: string]: CommandHandler;
};
export type Handler = (context: HandlerContext) => Promise<void>;
export type Config = {
    commands?: CommandGroup[];
    client?: ClientOptions;
    accessHandler?: AccessHandler;
    commandHandlers?: CommandHandlers;
    agentHandlers?: AgentHandlers;
};
export interface CommandParamConfig {
    default?: any;
    type: "number" | "string" | "username" | "quoted" | "address";
    values?: string[];
}
export interface CommandConfig {
    command: string;
    description: string;
    params: Record<string, CommandParamConfig>;
}
export interface CommandGroup {
    name: string;
    icon: string;
    description: string;
    commands: CommandConfig[];
}
export interface User {
    inboxId: string;
    username: string;
    address: string;
    accountAddresses: string[];
    installationIds: string[];
    fake?: boolean;
}
export type MetadataValue = string | number | boolean;
export type Metadata = Record<string, MetadataValue | MetadataValue[]>;
export type AccessHandler = (context: HandlerContext) => Promise<boolean>;
//# sourceMappingURL=types.d.ts.map