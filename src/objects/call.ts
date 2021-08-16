import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IPropsMeta, IInletsMeta, IOutletsMeta } from "jspatcher/src/core/objects/base/AbstractObject";

interface P {
    args: number;
    sync: boolean;
}

export default class call extends StdObject<{}, {}, [any | Bang, ...any[]], any[], [string, ...any[]], P, { loading: boolean }> {
    static description = "Call a method of current object";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Instance to read"
    }, {
        isHot: false,
        type: "anything",
        varLength: true,
        description: "Method argument"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Method return value"
    }, {
        type: "anything",
        description: "Instance bypass"
    }, {
        type: "anything",
        varLength: true,
        description: "Argument after method called"
    }];
    static args: IArgsMeta = [{
        type: "string",
        optional: false,
        description: "Method name"
    }, {
        type: "anything",
        optional: true,
        varLength: true,
        description: "Set arguments while loaded"
    }];
    static props: IPropsMeta<P> = {
        args: {
            type: "number",
            default: 0,
            description: "arguments count for method"
        },
        sync: {
            type: "boolean",
            default: false,
            description: "If true and in case the result is a Promise, instead of waiting for result, will output the Promise object"
        }
    };
    _: { instance: any; inputs: any[]; result: any } = { instance: undefined, inputs: [], result: null };
    initialInlets = 1;
    initialOutlets = 2;
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = this.initialInlets;
            this.outlets = this.initialOutlets;
        });
        this.on("updateArgs", (args) => {
            this._.inputs = args.slice(1);
            const argsCount = Math.max(args.length - 1, ~~+this.getProp("args"));
            this.inlets = Math.max(1, this.initialInlets + argsCount);
            this.outlets = this.initialOutlets + argsCount;
        });
        this.on("updateProps", (props) => {
            if (props.args && typeof props.args === "number" && props.args >= 0) {
                const argsCount = Math.max(this.box.args.length - 1, ~~props.args);
                this.inlets = Math.max(1, this.initialInlets + argsCount);
                this.outlets = this.initialOutlets + argsCount;
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) this._.instance = data;
                if (this.execute()) this.output();
            } else {
                this._.inputs[inlet - 1] = data;
            }
        });
    }
    execute() {
        const m = this.box.args[0];
        try {
            this._.result = this._.instance[m](...this._.inputs);
            return true;
        } catch (e) {
            this.error(e);
            return false;
        }
    }
    callback = () => this.outletAll([this._.result, this._.instance, ...this._.inputs]);
    output() {
        if (this._.result instanceof Promise && !this.getProp("sync")) {
            this.loading = true;
            this._.result.then((r) => {
                this.loading = false;
                this._.result = r;
                this.callback();
            }, (r) => {
                this.loading = false;
                this.error(r);
            });
            return this;
        }
        return this.callback();
    }
    set loading(loading: boolean) {
        this.updateUI({ loading });
    }
}
