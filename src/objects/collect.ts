import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class collect extends StdObject<{}, {}, [any, Bang], any[]> {
    static description = "Collect data in an array";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        varLength: false,
        description: "Anything to collect, Bang to output and reset"
    }, {
        isHot: false,
        type: "bang",
        varLength: false,
        description: "Reset without output"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        varLength: false,
        description: "Collected data as array"
    }];
    _ = { array: [] as any[] };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (isBang(data)) {
                    this.outlet(0, this._.array);
                    this._.array = [];
                } else {
                    this._.array.push(data);
                }
            } else if (inlet = 1) {
                if (isBang(data)) this._.array = [];
            }
        });
    }
}
