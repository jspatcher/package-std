import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

type A = [string | number, number];

export default class _ extends StdObject<{}, { value: any }, [Bang | any, any], any[], A> {
    static description = "Store anything";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Bang to output stored value, anything to set the value then output it."
    }, {
        isHot: false,
        type: "anything",
        description: "Anything to set the value."
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Value",
        varLength: true
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        description: "Initial value"
    }, {
        type: "number",
        optional: true,
        description: "Number of Outlets",
        default: 1
    }];
    state: { value: any } = { value: undefined };
    subscribe() {
        super.subscribe();
        const handleArgs = (args: Partial<A>) => {
            this.setState({ value: args[0] });
            this.outlets = Math.max(1, ~~+args[1] || 1);
        };
        this.on("preInit", () => {
            this.inlets = 2;
        });
        this.on("updateArgs", handleArgs);
        this.on("updateState", ({ state: { value }, id }) => {
            this.setState({ value }, id);
            this.outletAll(new Array(this.outlets).fill(this.state.value));
        });
        this.on("postInit", () => {
            handleArgs(this.args);
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    this.setState({ value: data });
                }
                this.outletAll(new Array(this.outlets).fill(this.state.value));
            } else if (inlet === 1) {
                this.setState({ value: data });
            }
        });
    }
}
