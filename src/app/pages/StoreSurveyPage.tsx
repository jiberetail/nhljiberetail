export function StoreSurveyPage() {
  return (
    <iframe
      src="https://jiberetail.github.io/nhl-retail-survey/"
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
      }}
      allow="camera; microphone; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
      title="Store Survey"
    />
  );
}
