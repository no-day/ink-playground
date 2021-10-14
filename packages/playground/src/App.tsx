import { Layout, Header, Editor, Console } from '~/components';
import { AppProvider } from '~/context';
import { ReactElement } from 'react';

const App = (): ReactElement => {
  return (
    <AppProvider>
      <Layout>
        <Header />
        <Editor />
        <Console />
      </Layout>
    </AppProvider>
  );
};

export default App;
