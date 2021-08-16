import StdObject from "./base";
import { Bang, Patcher } from "../sdk";
import type { IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

interface P {
    args: number;
    sync: boolean;
}

export default class thispatcher extends StdObject<{}, {}, [Bang], [Patcher]> {
    static description = "Current patcher instance";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "bang",
        description: "Bang to output patcher instance"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "Patcher instance"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this.outlet(0, this.patcher);
            }
        });
    }
}
