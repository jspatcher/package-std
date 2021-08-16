import StdObject from "./base";
import { Bang } from "../sdk";
import type { IInletsMeta, IOutletsMeta } from "jspatcher/src/core/objects/base/AbstractObject";

export default class bang extends StdObject<{}, {}, [any], [Bang], []> {
    static description = "Transform to bang";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Anything to transform to a bang"
    }];
    static outlets: IOutletsMeta = [{
        type: "bang",
        description: "Bang when inlet"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ inlet }) => {
            if (inlet === 0) this.outlet(0, new Bang());
        });
    }
}
