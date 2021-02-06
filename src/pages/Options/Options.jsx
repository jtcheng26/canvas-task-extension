import React from 'react';
import styled from 'styled-components';

const OptionsDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
`

export default function Options() {
  chrome.storage.sync.get(null, function(result) {
    if (!result.startDate) {
      chrome.storage.sync.set({startDate: 1}, function () {});
    }
    if (!result.startHour) {
      chrome.storage.sync.set({startHour: 15}, function () {});
    }
    if (!result.startMinutes) {
      chrome.storage.sync.set({startMinutes: 0}, function () {});
    }
  });
  function handleClick() {
    chrome.storage.sync.set({startDate: 1}, function() {
      console.log('Value is set to ' + 1);
    });
  }
  return (
    <OptionsDiv>

    </OptionsDiv>
  )
}
