// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// LIB > TYPES > TRY-CATCH-TYPES.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
import type {
	FailureHttpStatus,
	SuccessHttpStatus,
} from './HttpStatusTypes';
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export interface AsyncActionParams<TResult> {
	callback: () => Promise<TResult>;
	errorContext: string;
	successStatusCode?: SuccessHttpStatus;
	failureStatusCode?: FailureHttpStatus;
}

export interface SyncActionParams<TResult> {
	callback: () => TResult;
	errorContext: string;
	successStatusCode?: SuccessHttpStatus;
	failureStatusCode?: FailureHttpStatus;
}

export type Results<TResult> =
	| {
			statusCode: SuccessHttpStatus;
			result: TResult;
			error?: never;
	  }
	| {
			statusCode: FailureHttpStatus;
			result?: never;
			error: Error;
	  };
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
