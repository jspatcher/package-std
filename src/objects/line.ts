import StdObject from "./base";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";
import { Bang, Utils } from "../sdk";
import { TBPF } from "@jspatcher/jspatcher/src/core/types";

const { decodeLine, getTimestamp } = Utils;

const toAbsoluteTimeLine = (line: number[][], rampTime?: number) => {
    let rT = rampTime;
    let t = 0;
    const out = line.slice();
    for (let i = 0; i < line.length; i++) {
        const delta = Math.max(0, +(line[i][1] ?? rT) || 0);
        rT = null;
        t += delta;
        out[i] = [line[i][0], t];
    }
    return out;
};

export default class line extends StdObject<{}, {}, [TBPF | "stop" | "pause" | "resume", number, number], [number, Bang], [number?, number?]> {
    static description = "Generate timed ramp";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "number to set the value, number[] to start ramps (target - ramp time pairs)"
    }, {
        isHot: false,
        type: "number",
        description: "Ramp time in seconds"
    }, {
        isHot: false,
        type: "number",
        description: "Time grain in seconds"
    }];
    static outlets: IOutletsMeta = [{
        type: "bang",
        description: "Ramped values"
    }, {
        type: "bang",
        description: "Bang when finished"
    }];
    static args: IArgsMeta = [{
        type: "number",
        optional: true,
        default: 0,
        description: "Initial number"
    }, {
        type: "number",
        optional: true,
        default: 0.1,
        description: "Default time grain in seconds"
    }];
    _ = {
        startedTime: 0,
        startedValue: 0,
        pausedTime: 0,
        paused: false,
        line: null as number[][],
        ref: null as number,
        $: null as number,
        value: +this.args[0] || 0,
        rampTime: null as number,
        grain: +Math.max(0, this.args[1]) || 0.1
    };
    stopCurrentLine() {
        if (this._.ref) window.clearTimeout(this._.ref);
        this._ = {
            startedTime: 0,
            startedValue: this._.value,
            pausedTime: 0,
            paused: false,
            line: null as number[][],
            ref: null as number,
            $: null as number,
            value: this._.value,
            rampTime: null,
            grain: this._.grain
        };
    }
    handleTimeout = () => {
        const { startedTime, startedValue, line, grain } = this._;
        if (!line[this._.$]) return;
        const curTime = getTimestamp();
        const elapsed = (curTime - startedTime) / 1000;
        while (elapsed >= line[this._.$][1]) {
            this._.$++;
            if (this._.$ >= line.length) {
                const value = line[line.length - 1][0];
                this.outletAll([value, new Bang()]);
                this._.value = value;
                this.stopCurrentLine();
                return;
            }
        }
        const { $ } = this._;
        const [targetValue, targetTime] = line[$];
        const prevValue = $ === 0 ? startedValue : line[$ - 1][0];
        const prevTime = $ === 0 ? 0 : line[$ - 1][1];
        const value = prevValue + (elapsed - prevTime) / (targetTime - prevTime) * (targetValue - prevValue);
        this.outlet(0, value);
        this._.value = value;
        this._.ref = window.setTimeout(this.handleTimeout, grain);
    };
    startLine(line: number[][]) {
        this._.line = line;
        this._.startedTime = getTimestamp();
        this._.$ = 0;
        this.handleTimeout();
    }
    pauseLine() {
        if (this._.ref) window.clearTimeout(this._.ref);
        this._.paused = true;
        this._.pausedTime = getTimestamp();
    }
    resumeLine() {
        const { pausedTime } = this._;
        this._.startedTime += getTimestamp() - pausedTime;
        this._.paused = true;
        this._.pausedTime = null;
        this.handleTimeout();
    }
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 2;
        });
        this.on("updateArgs", (args) => {
            if (typeof args[1] === "number") {
                this._.grain = +Math.max(0, args[0]) || 0;
            }
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (data === "stop") {
                    this.stopCurrentLine();
                } else if (data === "pause") {
                    this.pauseLine();
                } else if (data === "resume") {
                    this.resumeLine();
                } else {
                    const line = toAbsoluteTimeLine(decodeLine(data), this._.rampTime);
                    this.stopCurrentLine();
                    this.startLine(line);
                }
            } else if (inlet === 1) {
                if (typeof data === "number") this._.rampTime = +Math.max(0, data) || 0;
            } else if (inlet === 2) {
                if (typeof data === "number") this._.grain = +Math.max(0, data) || 0;
            }
        });
        this.on("destroy", () => {
            if (this._.ref) {
                window.clearTimeout(this._.ref);
            }
        });
    }
}
