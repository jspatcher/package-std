import StdObject from "./base";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class delay extends StdObject<{}, {}, [any, number], [any], [number?]> {
    static description = "Delay an input";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Input to be delayed"
    }, {
        isHot: false,
        type: "number",
        description: "Delay time in seconds"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Delayed input"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Default delay time"
    }];
    _ = { time: +this.args[0], ref: new Set<number>() };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("updateArgs", () => {
            const { args } = this.box;
            if (typeof args[0] === "number") this._.time = +args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this._.ref.add(window.setTimeout(() => this.outlet(0, data), this._.time || 0));
            } else if (inlet === 1) {
                this._.time = +data;
            }
        });
        this.on("destroy", () => {
            this._.ref.forEach(ref => window.clearTimeout(ref));
        });
    }
}
