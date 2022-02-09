import StdObject from "./base";
import type { IArgsMeta, IInletsMeta, IOutletsMeta, IPropsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";
import { Bang } from "../sdk";

export default class metro extends StdObject<{}, {}, [boolean, number], [any], [number?], { active: boolean }> {
    static description = "Metronome that outputs regularly Bangs";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "boolean",
        description: "Start or stop the metronome"
    }, {
        isHot: false,
        type: "number",
        description: "interval in seconds"
    }];
    static outlets: IOutletsMeta = [{
        type: "bang",
        description: "regular Bangs"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: true,
        default: 1,
        description: "Default interval time in seconds"
    }];
    static props: IPropsMeta<{ active: boolean }> = {
        active: {
            type: "boolean",
            default: false,
            description: "Set active the metronome"
        }
    };
    _ = {
        time: +this.args[0],
        active: this.getProp("active"),
        intervalRef: null as number,
        timeoutRef: null as number,
        last: performance.now()
    };
    subscribe() {
        super.subscribe();
        const activateTimer = (time: number) => {
            if (this._.timeoutRef) {
                window.clearTimeout(this._.timeoutRef);
                this._.timeoutRef = null;
            }
            if (this._.intervalRef) {
                window.clearInterval(this._.intervalRef);
                this._.intervalRef = null;
            }
            if (time && this._.active) {
                this._.timeoutRef = window.setTimeout(() => {
                    this._.last = performance.now();
                    this.outlet(0, new Bang())
                    this._.intervalRef = window.setInterval(() => {
                        this._.last = performance.now();
                        this.outlet(0, new Bang())
                    }, this._.time * 1000);
                }, Math.max(0, this._.last + this._.time * 1000 - performance.now()))
            }
            this._.time = time;
        }
        this.on("preInit", () => {
            this.inlets = 2;
            this.outlets = 1;
        });
        this.on("postInit", () => {
            activateTimer(+this.args[0]);
        })
        this.on("updateArgs", () => {
            if (typeof this.args[0] === "number") {
                activateTimer(Math.max(0, +this.args[0]));
            }
        });
        this.on("updateProps", () => {
            this._.active = this.getProp("active");
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                this._.active = !!data;
                activateTimer(this._.time);
            } else if (inlet === 1) {
                activateTimer(Math.max(0, +data));
            }
        });
        this.on("destroy", () => {
            if (this._.timeoutRef) {
                window.clearTimeout(this._.timeoutRef);
                this._.timeoutRef = null;
            }
            if (this._.intervalRef) {
                window.clearInterval(this._.intervalRef);
                this._.intervalRef = null;
            }
        });
    }
}
