import React from 'react';

import styles from './App.module.less';
import { Amethyst } from './components/Amethyst';

function App() {
  return (
    <div className={styles.app}>
      <Amethyst />
    </div>
  );
}

export default App;
