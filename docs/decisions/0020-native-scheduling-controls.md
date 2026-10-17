# 0020 — Native scheduling controls with existing local-time contract

Date:2026-10-15. Status: accepted for the owner's authorized picker refinement.

## Decision

Use @react-native-community/datetimepicker9.1.0, matching the installed Expo57.0.24
bundledNativeModules.json, for this screen's mobile controls. This necessary package
implements the explicitly requested native iOS/Android UI; React Native core has no
such cross-platform picker. Do not add a second modal-picker/date/timezone library.
Expo install auto-added an optional config plugin; it was removed because no native
custom-theme/locale configuration is needed. app.json remains unchanged.
Use platform files so web renders HTML date/time controls and never loads native code.
The package is MIT licensed and documented as included in Expo Go.

Preserve existing local wall-clock draft and validateSessionDraft ISO serialization.
Read/write Date through local components, never new Date('YYYY-MM-DD'), UTC slices,
fixed GMT offsets or forcing America/Montevideo on a travelling device. Display
Spanish date text and device timezone. DST gap normalization is rejected; repeated
DST wall times retain the existing JavaScript/contract interpretation (earlier
occurrence). If the native picker supplies the second occurrence, reject it with
an explicit message rather than silently shifting the selected instant. A second
occurrence needs an offset-aware future contract, outside this UX change. Native/browser input is an
adapter, not a replacement for existing validation/server enforcement.

Android date dialog supports minimum date; time dialog does not. Reject invalid/
past time on callback, with inline error, preserving old value. Date=today with an
old hour requires explicitly choosing a future hour; existing submit validation
remains final authority. iOS uses a native spinner inside a cancel/confirm modal,
with no mutation on cancellation. Saved uncertain inputs stay locked and retry
retains original command/UUID, even if schedule has elapsed while awaiting recovery.

## Keyboard policy

Use Expo Router header height (expo-router/react-navigation) instead of a hardcoded96 offset.
iOS KeyboardAvoidingView owns adjustment; disable automatic keyboard inset adjustment
on its child ScrollView to avoid double compensation. Android retains default window
resize behavior (no manifest/config change). Respect bottom safe area and support
scrolling/dismissing keyboard without accidental submission. Physical device checks
are mandatory before claiming native keyboard or screen-reader correctness.

## Sources and limits

- https://docs.expo.dev/versions/latest/sdk/date-time-picker/
- https://github.com/react-native-datetimepicker/datetimepicker
- node_modules/expo/bundledNativeModules.json (installed SDK map).

Online latest docs recommend a newer package; the installed SDK compatibility map
is used instead. No app release, native permission or backend change is authorized.
Native display language on Android follows OS locale; app labels/readable dates stay
Spanish. Device testing remains required, especially Dynamic Type, dismissal/focus,
DST/travel and Android's time-limit behavior.

