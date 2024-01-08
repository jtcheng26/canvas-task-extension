import React from 'react';
import { Options } from '../../types';
import { useOptionsStore } from '../../hooks/useOptions';
import { OptionsContext } from '../../contexts/contexts';
import ModeSelector from './components/ModeSelector';
import styled from 'styled-components';
import Checkbox from './components/Checkbox';
import { SettingsIcon } from '../../icons';

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 45rem;

  .tasks-extension-settings {
    display: inline-block;
    width: 15px;
    height: 15px;
  }
`;

const ModeSection = styled.div`
  > * + * {
    margin-top: 0.75rem;
  }
`;

const CheckboxSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > * {
    margin-right: 0.75rem;
    margin-top: 0.75rem;
  }
`;

const InfoSection = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  > * + * {
    margin-top: 0.75rem;
  }
`;

const Header = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 2rem;
  margin-bottom: 0.5rem;
`;

type Props = {
  options: Options;
};

export default function DynamicSettings({ options }: Props): JSX.Element {
  const optionsStore = useOptionsStore(options);
  function onModeSelect(id: string) {
    if (id === 'student') optionsStore.update('show_needs_grading', false);
    else if (id === 'instructor')
      optionsStore.update('show_needs_grading', true);
  }
  function onPeriodSelect(id: string) {
    optionsStore.update('period', id);
  }
  function updater(key: string, flipped: boolean) {
    return (value: boolean) =>
      optionsStore.update(key, flipped ? !value : value);
  }

  const TitleText = '⚙️ Extension Settings';
  const InfoText1 = 'Click the';
  const InfoText2 = 'icon on the sidebar to update these settings later.';
  const InfoText3 =
    '💡 Tip: Colors in the sidebar will match the colors of your dashboard cards!';

  return (
    <OptionsContext.Provider value={optionsStore}>
      <SettingsWrapper>
        <Header>{TitleText}</Header>
        <ModeSection>
          <ModeSelector
            modes={[
              {
                name: 'Student',
                id: 'student',
              },
              {
                name: 'Instructor/TA',
                id: 'instructor',
              },
            ]}
            onSelect={onModeSelect}
            selected={
              optionsStore.state.show_needs_grading ? 'instructor' : 'student'
            }
            title="Mode"
          />
          <ModeSelector
            modes={[
              {
                name: 'Day',
                id: 'Day',
              },
              {
                name: 'Week',
                id: 'Week',
              },
              {
                name: 'Month',
                id: 'Month',
              },
            ]}
            onSelect={onPeriodSelect}
            selected={optionsStore.state.period}
            title="View"
          />
        </ModeSection>
        <CheckboxSection>
          <Checkbox
            checked={!optionsStore.state.sidebar}
            onClick={updater('sidebar', true)}
            text="Hide existing To Do sidebar"
          />
          <Checkbox
            checked={optionsStore.state.due_date_headings}
            onClick={updater('due_date_headings', false)}
            text="Divide assignments by due date"
          />
          <Checkbox
            checked={optionsStore.state.dash_courses}
            onClick={updater('dash_courses', false)}
            text="Show courses that have no current assignments"
          />
        </CheckboxSection>
        <InfoSection>
          <span>
            {InfoText1} {SettingsIcon} {InfoText2}
          </span>
          <span>{InfoText3}</span>
        </InfoSection>
      </SettingsWrapper>
    </OptionsContext.Provider>
  );
}
