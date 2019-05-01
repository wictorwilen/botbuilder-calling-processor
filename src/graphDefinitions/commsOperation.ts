// Copyright (c) Wictor Wilén. All rights reserved.
// Licensed under the MIT license.

import { resultInfo } from "./resultInfo";

/**
 * See https://docs.microsoft.com/en-us/graph/api/resources/commsoperation?view=graph-rest-beta
 */
// tslint:disable-next-line: interface-name class-name
export interface commsOperation {
    clientContext: string;
    createdDateTime: Date;
    id: string;
    lastActionDateTime: Date;
    resultInfo: resultInfo;
    status: "notStarted" | "running" | "completed" | "failed";
}
