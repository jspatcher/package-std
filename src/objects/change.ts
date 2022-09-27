import StdObject from "./base";
import type { IArgsMeta, IInletsMeta, IOutletsMeta, IPropsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";

export default class change extends StdObject<{}, {}, [any], [any], [any], { mode: "==" | "===" }> {
    static description = "Filter out undesirable repetitions";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Anything to be compared with the previous input"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Output if changed"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        description: "Initial state",
        default: undefined,
        optional: true
    }];
    static props: IPropsMeta<{ mode: "==" | "===" }> = {
        mode: {
            type: "enum",
            enums: ["==", "==="],
            default: "===",
            description: "Comparison algorithm"
        }
    };
    _ = { prev: undefined as any };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", ({ inlet, data }) => {
            const result = this.getProp("mode") === "==" ? this._.prev == data : this._.prev === data;
            if (!result) this.outlet(0, data);
            this._.prev = data;
        });
    }
}
