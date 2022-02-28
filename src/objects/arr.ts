import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta, IPropsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class arr extends StdObject<{}, {}, [Bang, ...any], [Record<string, any>], (string | number)[], { hot: boolean }> {
    static description = "Construct an array with sufficient inlets";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "object",
        description: "Bang to output current array and initialize a new one"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Value to set to the index"
    }, {
        isHot: false,
        type: "object",
        description: "Pre-set the array"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "Created array"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        default: 1,
        description: "Array length"
    }];
    static props: IPropsMeta<{ hot: boolean }> = {
        hot: {
            type: "boolean",
            default: false,
            description: "Output the array on any index set"
        }
    };
    _ = { arr: [] as any[] };
    subscribe() {
        super.subscribe();
        this.on("updateArgs", () => {
            this.inlets = Math.max(0, ~~+this.args[0] ?? 1) + 2;
            updateInletsMeta(this.getProp("hot"));
        });
        const updateInletsMeta = (isHot: boolean) => {
            const inlet0Meta = arr.inlets[0];
            const inlet1Meta = { ...arr.inlets[1] };
            const lastInletMeta = arr.inlets[2];
            const restInletsMeta = new Array(Math.max(0, ~~+this.args[0] ?? 1)).fill(null).map((v, i) => ({ ...inlet1Meta, description: `${inlet1Meta.description}: ${i}`, isHot }))
            this.setMeta({ inlets: [inlet0Meta, ...restInletsMeta, lastInletMeta] });
        }
        this.on("postInit", () => {
            this.inlets = Math.max(0, ~~+this.args[0] ?? 1) + 2;
            this.outlets = 1;
            updateInletsMeta(this.getProp("hot"));
        });
        this.on("updateProps", (props) => {
            updateInletsMeta(props.hot);
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                const { arr } = this._;
                this._.arr = [];
                this.outlet(0, arr);
            } else if (inlet === this.inlets - 1) {
                if (!isBang(data) && Array.isArray(data)) this._.arr = data;
            } else {
                this._.arr[inlet - 1] = data;
                if (this.getProp("hot")) this.outlet(0, this._.arr);
            }
        });
    }
}
