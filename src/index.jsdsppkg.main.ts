import For from "./objects/for";
import ForIn from "./objects/for-in";
import If from "./objects/if";
import _bang from "./objects/bang";
import call from "./objects/call";
// import delay from "./objects/delay";
import dget from "./objects/dget";
import gate from "./objects/gate";
import get from "./objects/get";
import lambda from "./objects/lambda";
import loadbang from "./objects/loadbang";
import obj from "./objects/obj";
import print from "./objects/print";
import sel from "./objects/sel";
import set from "./objects/set";
import thispatcher from "./objects/thispatcher";
import v from "./objects/v";
import unloadbang from "./objects/unloadbang";
import BangUI from "./ui/bang";
import { BaseObject, generateRemoteObject } from "./sdk";

export class bang extends generateRemoteObject(_bang as typeof BaseObject) {
    static UI = BangUI;
}

export default async () => {
    return {
        print: generateRemoteObject(print as typeof BaseObject),
        for: generateRemoteObject(For as typeof BaseObject),
        "for-in": generateRemoteObject(ForIn as typeof BaseObject),
        if: generateRemoteObject(If as typeof BaseObject),
        gate: generateRemoteObject(gate as typeof BaseObject),
        sel: generateRemoteObject(sel as typeof BaseObject),
        obj: generateRemoteObject(obj as typeof BaseObject),
        set: generateRemoteObject(set as typeof BaseObject),
        get: generateRemoteObject(get as typeof BaseObject),
        dget: generateRemoteObject(dget as typeof BaseObject),
        call: generateRemoteObject(call as typeof BaseObject),
        v: generateRemoteObject(v as typeof BaseObject),
        lambda: generateRemoteObject(lambda as typeof BaseObject),
        bang: generateRemoteObject(bang as typeof BaseObject),
        loadbang: generateRemoteObject(loadbang as typeof BaseObject),
        unloadbang: generateRemoteObject(unloadbang as typeof BaseObject),
        // delay: generateRemoteObject(delay as typeof BaseObject),
        thispatcher: generateRemoteObject(thispatcher as typeof BaseObject)
    }
};