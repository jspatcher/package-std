import { React, DefaultUI, Bang } from "../sdk";
import type { bang } from "../index.jspatpkg";

export default class BangUI extends DefaultUI<bang> {
    handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.editor.state.locked) this.object.outlet(0, new Bang());
    }
    render() {
        return (
            <DefaultUI {...this.props} containerProps={{ ...this.props.containerProps, onDoubleClick: this.handleDoubleClick }} />
        )
    }
}
