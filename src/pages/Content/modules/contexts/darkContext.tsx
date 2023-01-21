import React from 'react';
import isDarkMode from '../utils/isDarkMode';

export const DarkContext = React.createContext(isDarkMode());
