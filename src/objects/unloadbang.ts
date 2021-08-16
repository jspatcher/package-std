import StdObject from "./base";
import { Bang } from "../sdk";
import type { IInletsMeta, IOutletsMeta } from "jspatcher/src/core/objects/base/AbstractObject";

export default class unloadbang extends StdObject<{}, {}, [Bang], [Bang]> {
    static description = "Bang when patcher will be unloaded";
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
            this.patcher.on("unload", () => this.outlet(0, new Bang()));
        });
        this.on("inlet", ({ inlet }) => {
            if (inlet === 0) this.outlet(0, new Bang());
        });
    }
}
