/* eslint-disable react/function-component-definition */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import Skeleton from '../Skeleton';

export default { title: 'Components/Skeleton' } as ComponentMeta<
  typeof Skeleton
>;

export const SkeletonLoader: ComponentStory<typeof Skeleton> = ({
  dark = false,
}) => (
  <div style={{ width: '288px', padding: '24px', boxSizing: 'border-box' }}>
    <Skeleton dark={dark} />
  </div>
);

export const DarkSkeletonLoader = SkeletonLoader.bind({});
DarkSkeletonLoader.args = {
  dark: true,
};
