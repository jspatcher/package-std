import StdObject from "./base";
import { Bang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class sel extends StdObject<{}, {}, any[], (Bang | any)[], any[]> {
    static description = "Output a bang on a matched inlet";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        varLength: false,
        description: "Test for match"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Set value for match"
    }];
    static outlets: IOutletsMeta = [{
        type: "bang",
        varLength: false,
        description: "Bang if match"
    }, {
        type: "anything",
        varLength: false,
        description: "Bypass if not matched"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: false,
        varLength: true,
        description: "Initial value for match"
    }];
    _ = { array: [] as any[] };
    resetIO = () => {
        const { args } = this.box;
        const testsCount = args.length;
        const [inletMeta0, inletMeta1] = sel.meta.inlets;
        const [outletMeta0, outletMeta1] = sel.meta.outlets;
        const { meta } = this;
        meta.inlets = [inletMeta0];
        meta.outlets = [];
        for (let i = 0; i < testsCount; i++) {
            meta.outlets[i] = { ...outletMeta0 };
            meta.outlets[i].description += ` index ${i}`;
            meta.inlets[i + 1] = { ...inletMeta1 };
            meta.inlets[i + 1].description += ` index ${i}`;
        }
        meta.outlets[testsCount] = outletMeta1;
        this.setMeta(meta);
        this._.array = args.slice();
        this.inlets = 1 + testsCount;
        this.outlets = testsCount + 1;
    };
    subscribe() {
        super.subscribe();
        this.on("postInit", this.resetIO);
        this.on("updateArgs", this.resetIO);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                const foundIndex = this._.array.indexOf(data);
                if (foundIndex === -1) this.outlet(this.outlets - 1, data);
                else this.outlet(foundIndex, new Bang());
            } else {
                this._.array[inlet - 1] = data;
            }
        });
    }
}
