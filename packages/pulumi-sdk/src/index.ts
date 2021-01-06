import execa from "execa";
import * as path from "path";
import { merge, kebabCase, set } from "lodash";
import downloadBinaries from "./downloadBinaries";

type Command = string | string[];
type PulumiArgs = { [key: string]: string | boolean };
type ExecaArgs = { [key: string]: any };

type DefaultArgs = {
    args?: PulumiArgs;
    execa?: ExecaArgs;
    beforePulumiInstall?: () => any;
    afterPulumiInstall?: () => any;
};

type RunArgs = {
    command: Command;
    args?: PulumiArgs;
    execa?: ExecaArgs;
    beforePulumiInstall?: () => any;
    afterPulumiInstall?: () => any;
};

type InstallArgs = {
    beforePulumiInstall?: () => any;
    afterPulumiInstall?: () => any;
};

export const FLAG_NON_INTERACTIVE = "--non-interactive";
export const PULUMI_FOLDER = path.join(__dirname, "pulumi");
export const PULUMI_BINARY_PATH = path.join(PULUMI_FOLDER, "pulumi", "pulumi");

// When updating versions, make sure to update this one, the one in `downloadBinaries.ts` file, and in `package.json`.
const AWS_PLUGIN_VERSION = "3.22.0";

export class Pulumi {
    defaultArgs: DefaultArgs;
    constructor(options: DefaultArgs = {}) {
        this.defaultArgs = options;
    }

    async run(rawArgs: RunArgs) {
        const args = merge({}, this.defaultArgs, rawArgs);

        await this.install(rawArgs);

        if (!Array.isArray(args.command)) {
            args.command = [args.command];
        }

        // 1. Prepare Pulumi args.
        const finalArgs = [];
        for (const key in args.args) {
            const value = args.args[key];
            if (!value) {
                continue;
            }

            switch (typeof value) {
                case "boolean":
                    finalArgs.push(`--${kebabCase(key)}`);
                    continue;
                default:
                    finalArgs.push(`--${kebabCase(key)}`, value);
            }
        }

        // Prepare execa args.
        set(args.execa, "env.PULUMI_SKIP_UPDATE_CHECK", "true");
        set(args.execa, "env.PULUMI_HOME", PULUMI_FOLDER);

        return execa(PULUMI_BINARY_PATH, [...args.command, ...finalArgs, FLAG_NON_INTERACTIVE], {
            ...args.execa
        });
    }

    async install(rawArgs?: InstallArgs): Promise<boolean> {
        const args = merge({}, this.defaultArgs, rawArgs);

        const installed = await downloadBinaries(
            PULUMI_FOLDER,
            args.beforePulumiInstall,
            args.afterPulumiInstall
        );

        if (installed) {
            await execa(
                path.join(PULUMI_FOLDER, "pulumi", "pulumi"),
                ["plugin", "install", "resource", "aws", `v${AWS_PLUGIN_VERSION}`],
                {
                    stdio: "inherit",
                    env: {
                        PULUMI_HOME: PULUMI_FOLDER,
                        PULUMI_SKIP_UPDATE_CHECK: "true"
                    }
                }
            );
        }

        return installed;
    }
}
