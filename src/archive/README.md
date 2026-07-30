This folder contains files that were intentionally moved out of active use during the recording architecture refactor.

- hooks/useAudioRecorder.ts was archived because the new recording lifecycle now lives in hooks/useRecordingEngine.ts and the old hook was unused.
- lib/analytics-old.ts was archived because it is an older analytics experiment and no active imports remain.
