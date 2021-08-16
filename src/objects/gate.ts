import StdObject from "./base";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "jspatcher/src/core/objects/base/AbstractObject";

export default class gate extends StdObject<{}, {}, [any, any], [any], [any]> {
    static description = "Bypass or block incoming data";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Anything to bypass"
    }, {
        isHot: false,
        type: "anything",
        description: "Test, falsable to block"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Anything bypass"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        default: true,
        description: "default state"
    }];
    _ = { pass: true };
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("updateArgs", (args) => {
            this._.pass = args[0] === "undefined" || args[0] === "" || !!args[0];
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (this._.pass) this.outlet(0, data);
            } else if (inlet === 1) {
                this._.pass = !!data;
            }
        });
    }
}
