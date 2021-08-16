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
import { BaseObject, generateDefaultObject } from "./sdk";

export default async () => {
    return {
        print: generateDefaultObject(print as typeof BaseObject),
        for: generateDefaultObject(For as typeof BaseObject),
        "for-in": generateDefaultObject(ForIn as typeof BaseObject),
        if: generateDefaultObject(If as typeof BaseObject),
        gate: generateDefaultObject(gate as typeof BaseObject),
        sel: generateDefaultObject(sel as typeof BaseObject),
        obj: generateDefaultObject(obj as typeof BaseObject),
        set: generateDefaultObject(set as typeof BaseObject),
        get: generateDefaultObject(get as typeof BaseObject),
        dget: generateDefaultObject(dget as typeof BaseObject),
        call: generateDefaultObject(call as typeof BaseObject),
        v: generateDefaultObject(v as typeof BaseObject),
        lambda: generateDefaultObject(lambda as typeof BaseObject),
        bang: generateDefaultObject(bang as typeof BaseObject),
        loadbang: generateDefaultObject(loadbang as typeof BaseObject),
        unloadbang: generateDefaultObject(unloadbang as typeof BaseObject),
        delay: generateDefaultObject(delay as typeof BaseObject),
        thispatcher: generateDefaultObject(thispatcher as typeof BaseObject)
    }
};