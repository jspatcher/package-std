import * as Util from "util";
import StdObject from "./base";
import { isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class print extends StdObject<{}, {}, [any], [], [string]> {
    static description = "Print to console";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Anything to stringify"
    }];
    static args: IArgsMeta = [{
        type: "string",
        optional: true,
        default: "Print",
        description: "Title"
    }];
    get title() {
        return `${this.args[0] || "Print"}`;
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) {
                    this.patcher.newLog("none", this.title, "Bang", this.box);
                } else {
                    this.patcher.newLog("none", this.title, typeof data === "string" ? data : Util.inspect(data), this.box);
                }
            }
        });
    }
}
