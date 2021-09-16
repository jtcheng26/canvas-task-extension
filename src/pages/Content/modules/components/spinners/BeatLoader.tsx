/* Credit: https://github.com/davidhu2000/react-spinners
  edited to use inline styles instead of emotion in order to minimize bundle size
 */
import React from 'react';
import styled from 'styled-components';
import { sizeMarginDefaults, cssValue } from './helpers';
import { LoaderSizeMarginProps } from './interfaces';

const Wrapper = styled.span`
  @keyframes canvas-tasks-beat {
    50% {
      transform: scale(0.75);
      opacity: 0.2;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

class Loader extends React.PureComponent<Required<LoaderSizeMarginProps>> {
  public static defaultProps = sizeMarginDefaults(15);

  public style = (i: number): { [key: string]: string | number } => {
    const { color, size, margin, speedMultiplier } = this.props;

    return {
      display: 'inline-block',
      backgroundColor: color,
      width: cssValue(size),
      height: cssValue(size),
      margin: cssValue(margin),
      borderRadius: '100%',
      animationName: 'canvas-tasks-beat',
      animationDuration: `${0.7 / speedMultiplier}s`,
      animationDelay: i % 2 ? '0s' : `${0.35 / speedMultiplier}s`,
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
      animationFillMode: 'both',
    };
  };

  public render(): JSX.Element | null {
    const { loading } = this.props;

    return loading ? (
      <Wrapper>
        <span style={this.style(1)} />
        <span style={this.style(2)} />
        <span style={this.style(3)} />
      </Wrapper>
    ) : null;
  }
}

export default Loader;
