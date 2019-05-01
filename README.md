# Calling processor for Bot Framework incoming calling webhook

[![npm version](https://badge.fury.io/js/botbuilder-calling-processors.svg)](https://badge.fury.io/js/botbuilder-calling-processors)

 | @master | @preview |
 :--------:|:---------:
 [![Build Status](https://travis-ci.org/wictorwilen/botbuilder-calling-processors.svg?branch=master)](https://travis-ci.org/wictorwilen/botbuilder-calling-processors)|[![Build Status](https://travis-ci.org/wictorwilen/botbuilder-calling-processors.svg?branch=preview)](https://travis-ci.org/wictorwilen/botbuilder-calling-processors)


## Sample usage

``` TypeScript
import * as _Request from "request";
import uuidv1 = require("uuid/v1");
import { IncomingCallProcessor, IncomingCallProcessorConfig, IncomingCallHandler, call, resultInfo } from "botbuilder-calling-processor";
import express = require("express");

private callProcessor: IncomingCallProcessor;
@BotCallingWebhook("/api/calling")
public async onIncomingCall(req: express.Request, res: express.Response, next: express.NextFunction) {
    log("/api/calling ping");
    if (!this.callProcessor) {
        const handler: IncomingCallHandler = {
            onIncomingCall: async (resource: string, resourceData: call): Promise<string> => {
                log("Incoming call");
                return new Promise<string>(async (resolve, reject) => {
                    const token = await getAuthToken();
                    const clientContext = uuidv1();
                    _Request({
                        method: "POST",
                        uri: `https://graph.microsoft.com/beta${resource}/answer`,
                        headers: {
                            "content-type": "application/json",
                            "authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            callbackUri: `https://${process.env.HOSTNAME}/api/calling`,
                            acceptedModalities: ["audio", "video"],
                            mediaConfig: {
                                "@odata.type": "#microsoft.graph.serviceHostedMediaConfig",
                                "preFetchMedia": [
                                    {
                                        uri: `https://${process.env.HOSTNAME}/assets/audio1.wav`,
                                        resourceId: "1D6DE2D4-CD51-4309-8DAA-70768651088E"
                                    }
                                ] 
                            }
                        })
                    }, async (error: any, response: any, body: any) => {
                        if (response.statusCode === 202) {
                            log(`Call answered!`);
                            resolve(clientContext); 
                        } else {
                            reject(`Invalid response from Microsoft Graph: ${response.status}`);
                        }
                    });
                });
            },
            onCallTerminated: (resource: string, result: resultInfo): Promise<void> => {
                log("Call termindated");
                return Promise.resolve();
            }
        };
        this.callProcessor = new IncomingCallProcessor(handler);
    }
    this.callProcessor.process(req, res);
}

## License

Copyright (c) Wictor Wilén. All rights reserved.

Licensed under the MIT license.