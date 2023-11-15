import { Notifications } from './Notifications';
import { GetUser } from './GetUser';
import { Storage } from './Storage';
import { Display } from './Display';
import { Transport } from './Transport';
import { Mixer } from './Mixer';
import { Paths } from './Paths';

export const Subscriptions = () => {
  return (
    <>
      <Notifications />
      <GetUser />
      <Storage />
      <Transport />
      <Display />
      <Mixer />
      <Paths />
    </>
  );
};
