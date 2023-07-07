export interface CommandError extends Error {
  name: "CommandError";
  code: number;
  args?: CommandErrorArgs;
}

export type CommandErrorArgs = {
  id: number;
  method: string;
  params: Object;
  pauseId: string | undefined;
  sessionId: string | undefined;
};

export enum ProtocolError {
  InternalError = 1,
  UnsupportedRecording = 31,
  UnknownBuild = 32,
  CommandFailed = 33,
  RecordingUnloaded = 38,
  DocumentIsUnavailable = 45,
  TimedOut = 46,
  LinkerDoesNotSupportAction = 48,
  InvalidRecording = 50,
  ServiceUnavailable = 51,
  TooManyPoints = 55,
  UnknownSession = 59,
  GraphicsUnavailableAtPoint = 65,
  SessionDestroyed = 66,
  TooManyGeneratedLocations = 61,
  TooManyLocations = 67,
  SessionCreationFailure = 72,
  FocusWindowChange = 76,
}

export const commandError = (
  message: string,
  code: number,
  args?: CommandErrorArgs
): CommandError => {
  const error = new Error(message) as CommandError;
  error.name = "CommandError";
  error.code = code;
  error.message = message;
  error.args = args;
  return error;
};

export function isCommandError(error: unknown, code?: number): error is CommandError {
  if (error instanceof Error) {
    if (error.name === "CommandError") {
      if (code === undefined) {
        return true;
      } else {
        return (error as CommandError).code === code;
      }
    }
  } else if (typeof error === "string") {
    console.error("Unexpected error type encountered (string):\n", error);

    switch (code) {
      case ProtocolError.TooManyPoints:
        // TODO [BAC-2330] The Analysis endpoint returns an error string instead of an error object.
        // TODO [FE-938] The error string may contain information about the analysis; it may not be an exact match.
        return error.startsWith("There are too many points to complete this operation");
      case ProtocolError.LinkerDoesNotSupportAction:
        return (
          error === "The linker version used to make this recording does not support this action"
        );
    }
  }

  return false;
}
