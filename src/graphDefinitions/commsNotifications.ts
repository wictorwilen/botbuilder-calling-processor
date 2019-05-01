// Copyright (c) Wictor Wilén. All rights reserved.
// Licensed under the MIT license.

import { commsNotification } from "./commsNotification";

/**
 * See https://docs.microsoft.com/en-us/graph/api/resources/commsNotifications?view=graph-rest-beta
 */
// tslint:disable-next-line: interface-name class-name
export interface commsNotifications {
    value: commsNotification;
}
