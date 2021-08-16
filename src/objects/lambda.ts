import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class lambda extends StdObject<{}, {}, [Bang, any], [(...args: any[]) => any, ...any[]], [number]> {
    static description = "Generate anonymous function, output args when called";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "bang",
        description: "Output anonymous function"
    }, {
        isHot: false,
        type: "anything",
        description: "Result of the anonymous function"
    }];
    static outlets: IOutletsMeta = [{
        type: "function",
        description: "Anonymous function"
    }, {
        type: "bang",
        description: "bang while lambda is called"
    }, {
        type: "anything",
        varLength: true,
        description: "If args=0, outlet args as array, else argument of current index"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Arguments count"
    }];
    _ = { argsCount: 0, result: undefined as any };
    lambda = (...args: any[]) => {
        this._.result = undefined;
        if (this._.argsCount === 0) {
            this.outletAll([, new Bang(), args]);
        } else {
            this.outletAll([, new Bang(), ...args]);
        }
        return this._.result; // After outlet, result will be received.
    };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 3;
        });
        this.on("updateArgs", () => {
            const { args } = this.box;
            if (typeof args[0] === "number" && args[0] >= 0) {
                this._.argsCount = ~~args[0];
                this.outlets = 2 + this._.argsCount;
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) this.outlet(0, this.lambda);
            } else if (inlet === 1) this._.result = data;
        });
    }
}
