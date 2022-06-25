import StdObject from "./base";
import { Bang, isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";
import type AbstractProjectFile from "@jspatcher/jspatcher/src/core/file/AbstractProjectFile";
import type TemporaryProjectFile from "@jspatcher/jspatcher/src/core/file/TemporaryProjectFile";
import type { ProjectFileEventMap } from "@jspatcher/jspatcher/src/core/file/AbstractProjectFile";

type A = [string | number, any];

export default class v extends StdObject<{}, { value: any }, [Bang | any, any, string | number], [any, any], A> {
    static description = "Store anything as named sharable variable";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Bang to output stored value, anything to set the value then output it."
    }, {
        isHot: false,
        type: "anything",
        description: "Anything to set the value."
    }, {
        isHot: false,
        type: "anything",
        description: "Set variable name."
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Value"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        description: "Variable name"
    }, {
        type: "anything",
        optional: true,
        description: "Initial value"
    }];
    state = { value: this.args[1] };
    _: { key: string; sharedItem: AbstractProjectFile | TemporaryProjectFile } = { key: this.box.args[0]?.toString(), sharedItem: null };
    subscribe() {
        super.subscribe();
        const handleFilePathChanged = () => {
            this._.key = this._.sharedItem?.projectPath;
        };
        const handleSaved = (e: ProjectFileEventMap["saved"]) => {
            if (e === this) return;
            this.setState({ value: this._.sharedItem?.data });
        };
        const subscribeItem = async () => {
            const file = this._.sharedItem;
            if (!file) return;
            await file.addObserver(this.id);
            file.on("destroyed", reload);
            file.on("nameChanged", handleFilePathChanged);
            file.on("pathChanged", handleFilePathChanged);
            file.on("saved", handleSaved);
        };
        const unsubscribeItem = async () => {
            const file = this._.sharedItem;
            if (!file) return;
            file.off("destroyed", reload);
            file.off("nameChanged", handleFilePathChanged);
            file.off("pathChanged", handleFilePathChanged);
            file.off("saved", handleSaved);
            await file.removeObserver(this.id);
        };
        const reload = async () => {
            await unsubscribeItem();
            const { key } = this._;
            try {
                const { item } = await this.getSharedItem(key, "unknown", () => this.state.value);
                this._.sharedItem = item;
                this.setState({ value: item.data });
            } catch (error) {
                this.error(error);
            } finally {
                await subscribeItem();
            }
        };
        const handleArgs = async (args: Partial<A>) => {
            const key = args[0]?.toString();
            if (key !== this._.key) {
                this._.key = key;
                await reload();
            } else {
                if (typeof args[1] !== "undefined") {
                    this.setState({ value: args[1] });
                    this._.sharedItem?.save(this.state.value, this);
                }
            }
        };
        this.on("preInit", () => {
            this.inlets = 3;
            this.outlets = 1;
        });
        this.on("updateArgs", handleArgs);
        this.on("updateState", ({ state: { value }, id }) => {
            this.setState({ value }, id);
            this._.sharedItem?.save(this.state.value, this);
            this.outlet(0, this.state.value);
        });
        this.on("postInit", reload);
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    this.setState({ value: data });
                    this._.sharedItem?.save(this.state.value, this);
                }
                this.outlet(0, this.state.value);
            } else if (inlet === 1) {
                this.setState({ value: data });
                this._.sharedItem?.save(this.state.value, this);
            } else if (inlet === 2) {
                if (typeof data === "string" || typeof data === "number") {
                    const key = data.toString() || "";
                    if (key !== this._.key) {
                        this._.key = key;
                        reload();
                    }
                }
            }
        });
        this.on("destroy", unsubscribeItem);
    }
}
