import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta, IPropsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class obj extends StdObject<{}, {}, [Bang, ...any], [Record<string, any>], (string | number)[], { hot: boolean }> {
    static description = "Construct an object with various properties";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "object",
        description: "Bang to output current object and initialize a new one"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Value to set to the property"
    }, {
        isHot: false,
        type: "object",
        description: "Pre-set the object"
    }];
    static outlets: IOutletsMeta = [{
        type: "object",
        description: "Created object"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        varLength: true,
        description: "Key / name of the property"
    }];
    static props: IPropsMeta<{ hot: boolean }> = {
        hot: {
            type: "boolean",
            default: false,
            description: "Output the object on any property set"
        }
    };
    _ = { obj: {} as Record<string, any> };
    subscribe() {
        super.subscribe();
        this.on("updateArgs", (args) => {
            this.inlets = args.length + 2;
            updateInletsMeta(this.getProp("hot"));
        });
        const updateInletsMeta = (isHot: boolean) => {
            const inlet0Meta = obj.inlets[0];
            const inlet1Meta = { ...obj.inlets[1] };
            const lastInletMeta = obj.inlets[2];
            const restInletsMeta = this.args.map(propKey => ({ ...inlet1Meta, description: `${inlet1Meta.description}: ${propKey}`, isHot }))
            this.setMeta({ inlets: [inlet0Meta, ...restInletsMeta, lastInletMeta] });
        }
        this.on("postInit", () => {
            this.inlets = this.args.length + 2;
            this.outlets = 1;
            updateInletsMeta(this.getProp("hot"));
        });
        this.on("updateProps", (props) => {
            updateInletsMeta(props.hot);
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                const { obj } = this._;
                this._.obj = {};
                this.outlet(0, obj);
            } else if (inlet === this.inlets - 1) {
                if (!isBang(data) && typeof data === "object") this._.obj = data;
            } else {
                const propKey = this.box.args[inlet - 1];
                this._.obj[propKey] = data;
                if (this.getProp("hot")) this.outlet(0, this._.obj);
            }
        });
    }
}
