// Copyright (c) Wictor Wilén. All rights reserved.
// Licensed under the MIT license.

/**
 * See https://docs.microsoft.com/en-us/graph/api/resources/commsNotification?view=graph-rest-beta
 */
// tslint:disable-next-line: interface-name class-name
export interface commsNotification {
    changeType: "created" | "updated" | "deleted";
    resource: string;
    resourceData?: any;
}
