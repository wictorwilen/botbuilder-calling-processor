// Copyright (c) Wictor Wilén. All rights reserved.
// Licensed under the MIT license.

import * as Express from "express";
import { isArray } from "util";
import { call } from "./graphDefinitions/call";
import { commsNotification } from "./graphDefinitions/commsNotification";
import { commsNotifications } from "./graphDefinitions/commsNotifications";
import { IncomingCallHandler } from "./IncomingCallHandler";
import { OperationResult } from "./OperationsResult";

/**
 * The Incoming Call Processor
 *
 * Documentation details for the flow:
 * https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/calls-and-meetings/call-notifications
 */
export class IncomingCallProcessor {

    constructor(private handler: IncomingCallHandler) { }

    /**
     * Processor for all incoming call operations
     * @param request the HTTP request
     * @param response the HTTP response
     */
    public async process(req: Express.Request, res: Express.Response): Promise<void> {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                let isValidRequest: boolean;
                if (this.handler.validateIncomingRequest) {
                    isValidRequest = await this.handler.validateIncomingRequest(authHeader);
                } else {
                    isValidRequest = await this.validateRequest(authHeader);
                }
                if (!isValidRequest) {
                    res.sendStatus(401);
                    res.end();
                    return Promise.resolve();
                }
                const notifications = req.body as commsNotifications;
                if (isArray(notifications.value)) {
                    // TODO: how to return when there are multiple notifications? Can there ever be?
                    const multiData = notifications.value.map(async (notification) => {
                        return this.processNotification(notification);
                    });
                    Promise.all(multiData).then((results) => {
                        // we're only sending back the first one...
                        res.status(results[0].status);
                        if (results[0].body) {
                            res.send(results[0].body);
                        }
                        return Promise.resolve();
                    }).catch((err) => {
                        res.status(500).send(err as string);
                        return Promise.resolve();
                    });
                } else {
                    const result = await this.processNotification(notifications.value);
                    res.status(result.status).send(result.body);
                    return Promise.resolve();
                }

            } catch (err) {
                res.status(500).send(err);
                return Promise.resolve();
            }
        } else {
            res.sendStatus(401);
            res.end();
            return Promise.resolve();
        }
    }

    /**
     * Default implemntation of header validation
     * See https://docs.microsoft.com/en-us/microsoftteams/platform/
     * concepts/calls-and-meetings/call-notifications#authenticating-the-callback
     * for more information
     * @param token the authorization token
     * @returns true if validation is successful
     */
    private validateRequest(token: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    /**
     * Handle a specific incoming call
     * @param notification the commsNotification
     */
    private async processNotification(notification: commsNotification): Promise<OperationResult> {
        return new Promise((resolve, reject) => {
            switch (notification.changeType) {
                case "created":
                    {
                        const resourceData: call = notification.resourceData;
                        if (resourceData && resourceData.state === "incoming"
                            && this.handler.onIncomingCall) {
                            this.handler.onIncomingCall(notification.resource, resourceData)
                                .then((clientContext: string) => {
                                    resolve({
                                        body: clientContext,
                                        status: 200,
                                    });
                                }).catch((err) => {
                                    reject(err);
                                });
                        }
                    }
                    break;
                case "updated":
                    {
                        const resourceData: call = notification.resourceData;
                        if (resourceData && resourceData.state === "established"
                            && this.handler.onCallEstablished) {
                            this.handler.onCallEstablished(notification.resource, resourceData).then(() => {
                                resolve({
                                    status: 200,
                                });
                            });
                        } else if (resourceData && resourceData.state === "establishing"
                            && this.handler.onCallEstablishing) {
                            this.handler.onCallEstablishing(notification.resource, resourceData).then(() => {
                                resolve({
                                    status: 200,
                                });
                            });
                        } else {
                            // gracefully just accept it if there is no handler
                            resolve({
                                status: 200,
                            });
                        }
                    }
                    break;
                case "deleted":
                    {
                        const resourceData: call = notification.resourceData;
                        if (resourceData && resourceData.state === "terminated"
                            && this.handler.onCallTerminated) {
                            this.handler.onCallTerminated(notification.resource, resourceData.resultInfo).then(() => {
                                resolve({
                                    status: 200,
                                });
                            });
                        }
                    }
                    break;
                default:
                    reject("Unknown or not specified commsNotification changeType");
                    break;
            }
        });

    }
}
