import { HOME_WEBSITE } from '../constants';
import baseURL from './baseURL';

export default function isDemo(): boolean {
  return !!process.env.DEMO || baseURL() == HOME_WEBSITE;
}
