import StdObject from "./base";
import { Bang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class obj extends StdObject<{}, {}, [Bang, ...any], [Record<string, any>], (string | number)[]> {
    static description = "Construct an object with various properties";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "object",
        description: "Bang to output current object and initialize a new one"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Value to set to the property"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "Created object"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        varLength: true,
        description: "Key / name of the property"
    }];
    _ = { obj: {} as Record<string, any> };
    subscribe() {
        super.subscribe();
        this.on("updateArgs", (args) => {
            this.inlets = args.length + 1;
        });
        this.on("postInit", () => {
            this.inlets = this.box.args.length + 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.outlet(0, this._.obj);
                this._.obj = {};
            } else {
                const propKey = this.box.args[inlet - 1];
                this._.obj[propKey] = data;
            }
        });
    }
}
