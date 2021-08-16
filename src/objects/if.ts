import StdObject from "./base";
import { Bang } from "../sdk";
import type { IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class If extends StdObject<{}, {}, [boolean], [Bang, Bang]> {
    static description = "Output a bang on true / false";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "boolean",
        description: "True for a bang to left outlet, false for right"
    }];
    static outlets: IOutletsMeta = [{
        type: "bang",
        description: "True?"
    }, {
        type: "bang",
        description: "False?"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 2;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) this.outlet(+!data, new Bang());
        });
    }
}
