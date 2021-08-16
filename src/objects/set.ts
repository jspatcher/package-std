import StdObject from "./base";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class set extends StdObject<{}, {}, [Record<string, any> | any[], string | number, any], [Record<string, any> | any[]], [string | number, any]> {
    static description = "Set a property of incoming object";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "object",
        description: "Object to set a property"
    }, {
        isHot: false,
        type: "string",
        description: "Key / name of the property"
    }, {
        isHot: false,
        type: "anything",
        description: "Value to set to the property"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Object bypass"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: false,
        description: "Initial key of the property"
    }, {
        type: "anything",
        optional: true,
        default: undefined,
        description: "Initial value of the property"
    }];
    _ = { key: undefined as string | number, value: undefined as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[0] === "string" || typeof args[0] === "number") this._.key = args[0];
            if (typeof args[1] !== "undefined") this._.value = args[1];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (typeof this._.key === "string" || typeof this._.key === "number") {
                    try {
                        data[this._.key] = this._.value;
                        this.outlet(0, data);
                    } catch (e) {
                        this.error((e as Error).message);
                    }
                } else {
                    this.error("Key not defined");
                }
            } else if (inlet === 1) {
                if (typeof data === "string" || typeof data === "number") this._.key = data;
                else this.error("Key should be a number or a string");
            } else if (inlet === 2) {
                this._.value = data;
            }
        });
    }
}
