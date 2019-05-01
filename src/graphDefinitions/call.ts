import { resultInfo } from "./resultInfo";

// Copyright (c) Wictor Wilén. All rights reserved.
// Licensed under the MIT license.

/**
 * See https://docs.microsoft.com/en-us/graph/api/resources/call?view=graph-rest-beta
 */
// tslint:disable-next-line: interface-name class-name
export interface call {
    state: "incoming" | "establishing" | "ringing" |
    "established" | "hold" | "transferring" |
    "transferAccepted" | "redirecting" | "terminating" |
    "terminated";
    resultInfo?: resultInfo;

}
