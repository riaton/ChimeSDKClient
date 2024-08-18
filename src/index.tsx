import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import {
  MeetingProvider,
  lightTheme
} from 'amazon-chime-sdk-component-library-react';
import Meeting from './components/Meeting';
import MeetingForm from './components/MeetingForm';


const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        <MeetingForm />
        <Meeting />
      </MeetingProvider>
    </ThemeProvider>
  );
}
