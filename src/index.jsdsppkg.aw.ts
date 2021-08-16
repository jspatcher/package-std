import For from "./objects/for";
import ForIn from "./objects/for-in";
import If from "./objects/if";
import bang from "./objects/bang";
import call from "./objects/call";
import delay from "./objects/delay";
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
import { BaseObject, generateRemotedObject } from "./sdk";

export default async () => {
    return {
        print: generateRemotedObject(print as typeof BaseObject),
        for: generateRemotedObject(For as typeof BaseObject),
        "for-in": generateRemotedObject(ForIn as typeof BaseObject),
        if: generateRemotedObject(If as typeof BaseObject),
        gate: generateRemotedObject(gate as typeof BaseObject),
        sel: generateRemotedObject(sel as typeof BaseObject),
        obj: generateRemotedObject(obj as typeof BaseObject),
        set: generateRemotedObject(set as typeof BaseObject),
        get: generateRemotedObject(get as typeof BaseObject),
        dget: generateRemotedObject(dget as typeof BaseObject),
        call: generateRemotedObject(call as typeof BaseObject),
        v: generateRemotedObject(v as typeof BaseObject),
        lambda: generateRemotedObject(lambda as typeof BaseObject),
        bang: generateRemotedObject(bang as typeof BaseObject),
        loadbang: generateRemotedObject(loadbang as typeof BaseObject),
        unloadbang: generateRemotedObject(unloadbang as typeof BaseObject),
        delay: generateRemotedObject(delay as typeof BaseObject),
        thispatcher: generateRemotedObject(thispatcher as typeof BaseObject)
    }
};