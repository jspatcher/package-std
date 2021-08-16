import StdObject from "./base";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class get extends StdObject<{}, {}, [Record<string, any> | any[], ...(string | number)[]], any[], (string | number)[]> {
    static description = "Get properties of incoming object";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "object",
        description: "Object to get a property"
    }, {
        isHot: false,
        type: "string",
        varLength: true,
        description: "Key / name of the property"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        varLength: true,
        description: "Value got"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: false,
        varLength: true,
        description: "Initial key of the property"
    }];
    _ = { keys: [] as (string | number)[] };
    resetIO = () => {
        const { args } = this.box;
        this._.keys = args.slice();
        this.inlets = 1 + args.length;
        this.outlets = args.length;
    };
    subscribe() {
        super.subscribe();
        this.on("postInit", this.resetIO);
        this.on("updateArgs", this.resetIO);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                for (let i = this._.keys.length - 1; i >= 0; i--) {
                    const key = this._.keys[i];
                    if (typeof key === "string" || typeof key === "number") {
                        try {
                            this.outlet(i, (data as any)[key]);
                        } catch (e) {
                            this.error((e as Error).message);
                        }
                    }
                }
            } else {
                if (typeof data === "string" || typeof data === "number") this._.keys[inlet - 1] = data;
                else this.error("Key should be a number or a string");
            }
        });
    }
}
