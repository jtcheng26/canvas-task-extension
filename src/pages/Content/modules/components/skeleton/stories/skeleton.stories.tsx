/* eslint-disable react/function-component-definition */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import Skeleton from '../Skeleton';

export default { title: 'Components/Skeleton' } as ComponentMeta<
  typeof Skeleton
>;

export const SkeletonLoader: ComponentStory<typeof Skeleton> = () => (
  <div style={{ width: '288px', padding: '24px', boxSizing: 'border-box' }}>
    <Skeleton />
  </div>
);
