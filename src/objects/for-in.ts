import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class ForIn extends StdObject<{}, {}, [any, any], [Bang, string | number | symbol, any], [Record<string, any>]> {
    static description = "Object key-value iterator";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Iterate input, bang to redo"
    }, {
        isHot: false,
        type: "object",
        description: "Set the iteration object"
    }];
    static outlets: IOutletsMeta = [{
        type: "bang",
        description: "Bang when finished"
    }, {
        type: "anything",
        description: "Key"
    }, {
        type: "anything",
        description: "Value"
    }];
    static args: IArgsMeta = [{
        type: "object",
        optional: true,
        description: "Initial object to iterate"
    }];
    _ = { buffer: this.args[0] };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 3;
        });
        this.on("updateArgs", args => this._.buffer = args[0]);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) this._.buffer = data;
                for (const key in this._.buffer) {
                    this.outletAll([, key, this._.buffer[key]]);
                }
                this.outlet(0, new Bang());
            } else if (inlet === 1) {
                this._.buffer = data;
            }
        });
    }
}
