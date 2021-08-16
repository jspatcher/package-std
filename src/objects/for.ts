import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class For extends StdObject<{}, {}, [Bang, number, number, number], [Bang, number], [number, number, number?]> {
    static description = "Number iterator";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "bang",
        description: "Do iterations"
    }, {
        isHot: false,
        type: "number",
        description: "Set the starting point"
    }, {
        isHot: false,
        type: "number",
        description: "Set the end point (excluded)"
    }, {
        isHot: false,
        type: "number",
        description: "Set the step"
    }];
    static outlets: IOutletsMeta = [{
        type: "bang",
        description: "Bang when finished"
    }, {
        type: "number",
        description: "Output all iterations one by one"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: false,
        description: "The starting point"
    }, {
        type: "number",
        optional: false,
        description: "The end point (excluded)"
    }, {
        type: "number",
        optional: true,
        default: 1,
        description: "The step"
    }];
    _ = { start: 0, end: 0, step: 1 };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 4;
            this.outlets = 2;
        });
        this.on("updateArgs", (args) => {
            this._.start = +args[0] || 0;
            this._.end = +args[1] || 0;
            this._.step = +args[2] || 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) {
                    const { start, end, step } = this._;
                    const times = (end - start) / step;
                    if (!isFinite(times) || times < 0) {
                        this.error(`Infinite loop from ${start} to ${end} with step ${step}.`);
                        return;
                    }
                    for (let i = start; i < end; i += step) {
                        this.outlet(1, i);
                    }
                    this.outlet(0, new Bang());
                }
            } else if (inlet === 1) this._.start = +data;
            else if (inlet === 2) this._.end = +data;
            else if (inlet === 3) this._.step = +data;
        });
    }
}
