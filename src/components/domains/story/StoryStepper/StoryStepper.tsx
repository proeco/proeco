import React, { ComponentProps, VFC } from 'react';
import { Stepper } from '~/components/parts/commons';

type Props = Omit<ComponentProps<typeof Stepper>, 'steps'>;

const steps = ['ストーリーを作る', 'ゴールを決める', 'ポストを作る'];

export const StoryStepper: VFC<Props> = ({ ...rest }) => {
  return <Stepper {...rest} steps={steps}></Stepper>;
};