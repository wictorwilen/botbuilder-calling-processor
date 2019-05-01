import { call } from "./graphDefinitions/call";
import { resultInfo } from "./graphDefinitions/resultInfo";

// tslint:disable-next-line: interface-name
export interface IncomingCallHandler {
    /**
     *
     * @param resource the call resource
     * @param resourceData call information
     * @returns A string value with the client context (UUID)
     */
    onIncomingCall?(resource: string, resourceData: call): Promise<string>;
    onCallEstablishing?(resource: string, resourceData: call): Promise<void>;
    onCallEstablished?(resource: string, resourceData: call): Promise<void>;
    onCallTerminated?(resource: string, result?: resultInfo): Promise<void>;
    onMediaRecordingDone?(): void;

    validateIncomingRequest?(token: string): Promise<boolean>;
}
