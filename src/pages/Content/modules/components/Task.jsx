import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TaskContainer = styled.div`
    width: 100%;
    height: 65px;
    margin: 5px;
    background-color: #ffffff;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    font-weight: bold;
    font-size: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    &:hover {
      a {
        text-decoration: underline;
      }
      cursor: pointer;
      box-shadow: 0 4px 7px rgba(0, 0, 0, 0.3);
    }
  `,
  TaskInfo = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 6px 8px 6px;
    box-sizing: border-box;
    width: 100%;
    font-size: 11px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--ic-brand-font-color-dark-lightened-30);
  `,
  TaskLink = styled.a`
    color: #000;
    font-weight: 700;
    font-size: 15px;
    overflow-x: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: #000;
    }
  `;

export default function Task({ assignment }) {
  /* Demo Task */
  const due_at = new Date(assignment.due_at),
    due_date = due_at.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    due_time = due_at.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }),
    TaskLeftStyle = {
      width: '40px',
      height: '100%',
      borderRadius: '4px 0px 0px 4px',
      backgroundColor: assignment.color,
      padding: '6px',
      boxSizing: 'border-box',
    },
    CourseNameStyle = {
      color: assignment.color,
      fontWeight: '700',
      marginTop: '4px',
    };
  function onClick(e) {
    e.preventDefault();
    window.location.href = assignment.html_url;
  }
  const icon = {
    assignment: (
      <svg
        style={{
          marginLeft: '3px',
          marginTop: '2px',
          fill: 'white',
          height: '22px',
          width: '22px',
        }}
        version="1.1"
        viewBox="0 0 1920 1920"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1468.2137,0 L1468.2137,564.697578 L1355.27419,564.697578 L1355.27419,112.939516 L112.939516,112.939516 L112.939516,1807.03225 L1355.27419,1807.03225 L1355.27419,1581.15322 L1468.2137,1581.15322 L1468.2137,1919.97177 L2.5243549e-29,1919.97177 L2.5243549e-29,0 L1468.2137,0 Z M1597.64239,581.310981 C1619.77853,559.174836 1655.46742,559.174836 1677.60356,581.310981 L1677.60356,581.310981 L1903.4826,807.190012 C1925.5058,829.213217 1925.5058,864.902104 1903.4826,887.038249 L1903.4826,887.038249 L1225.8455,1564.67534 C1215.22919,1575.17872 1200.88587,1581.16451 1185.86491,1581.16451 L1185.86491,1581.16451 L959.985883,1581.16451 C928.814576,1581.16451 903.516125,1555.86606 903.516125,1524.69475 L903.516125,1524.69475 L903.516125,1298.81572 C903.516125,1283.79477 909.501919,1269.45145 920.005294,1258.94807 L920.005294,1258.94807 Z M1442.35055,896.29929 L1016.45564,1322.1942 L1016.45564,1468.225 L1162.48643,1468.225 L1588.38135,1042.33008 L1442.35055,896.29929 Z M677.637094,1242.34597 L677.637094,1355.28548 L338.818547,1355.28548 L338.818547,1242.34597 L677.637094,1242.34597 Z M903.516125,1016.46693 L903.516125,1129.40645 L338.818547,1129.40645 L338.818547,1016.46693 L903.516125,1016.46693 Z M1637.62298,701.026867 L1522.19879,816.451052 L1668.22958,962.481846 L1783.65377,847.057661 L1637.62298,701.026867 Z M1129.39516,338.829841 L1129.39516,790.587903 L338.818547,790.587903 L338.818547,338.829841 L1129.39516,338.829841 Z M1016.45564,451.769356 L451.758062,451.769356 L451.758062,677.648388 L1016.45564,677.648388 L1016.45564,451.769356 Z"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="1"
        />
      </svg>
    ),
    quiz: (
      <svg
        style={{
          marginLeft: '1px',
          marginTop: '2px',
          fill: 'white',
          height: '22px',
          width: '22px',
        }}
        version="1.1"
        viewBox="0 0 1920 1920"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fillRule="evenodd" stroke="none" strokeWidth="1">
          <path d="M746.255375,1466.76417 L826.739372,1547.47616 L577.99138,1796.11015 L497.507383,1715.51216 L746.255375,1466.76417 Z M580.35118,1300.92837 L660.949178,1381.52637 L329.323189,1713.15236 L248.725192,1632.55436 L580.35118,1300.92837 Z M414.503986,1135.20658 L495.101983,1215.80457 L80.5979973,1630.30856 L0,1549.71056 L414.503986,1135.20658 Z M1119.32036,264.600006 C1475.79835,-91.8779816 1844.58834,86.3040124 1848.35034,88.1280123 L1848.35034,88.1280123 L1865.45034,96.564012 L1873.88634,113.664011 C1875.71034,117.312011 2053.89233,486.101999 1697.30034,842.693987 L1697.30034,842.693987 L1550.69635,989.297982 L1548.07435,1655.17196 L1325.43235,1877.81395 L993.806366,1546.30196 L415.712386,968.207982 L84.0863971,636.467994 L306.72839,413.826001 L972.602367,411.318001 Z M1436.24035,1103.75398 L1074.40436,1465.70397 L1325.43235,1716.61796 L1434.30235,1607.74796 L1436.24035,1103.75398 Z M1779.26634,182.406009 C1710.18234,156.41401 1457.90035,87.1020124 1199.91836,345.198004 L1199.91836,345.198004 L576.90838,968.207982 L993.806366,1385.10597 L1616.70235,762.095989 C1873.65834,505.139998 1804.68834,250.920007 1779.26634,182.406009 Z M858.146371,525.773997 L354.152388,527.597997 L245.282392,636.467994 L496.310383,887.609985 L858.146371,525.773997 Z" />
          <path d="M1534.98715,372.558003 C1483.91515,371.190003 1403.31715,385.326002 1321.69316,466.949999 L1281.22316,507.305998 L1454.61715,680.585992 L1494.97315,640.343994 C1577.16715,558.035996 1591.87315,479.033999 1589.82115,427.164001 L1587.65515,374.610003 L1534.98715,372.558003 Z" />
        </g>
      </svg>
    ),
    discussion: (
      <svg
        style={{
          marginLeft: '1px',
          marginTop: '2px',
          fill: 'white',
          height: '25px',
          width: '25px',
        }}
        version="1.1"
        viewBox="0 0 1920 1920"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M677.647059,16 L677.647059,354.936471 L790.588235,354.936471 L790.588235,129.054118 L1807.05882,129.054118 L1807.05882,919.529412 L1581.06353,919.529412 L1581.06353,1179.29412 L1321.41176,919.529412 L1242.24,919.529412 L1242.24,467.877647 L677.647059,467.877647 L0,467.877647 L0,1484.34824 L338.710588,1484.34824 L338.710588,1903.24706 L756.705882,1484.34824 L1242.24,1484.34824 L1242.24,1032.47059 L1274.99294,1032.47059 L1694.11765,1451.59529 L1694.11765,1032.47059 L1920,1032.47059 L1920,16 L677.647059,16 Z M338.789647,919.563294 L903.495529,919.563294 L903.495529,806.622118 L338.789647,806.622118 L338.789647,919.563294 Z M338.789647,1145.44565 L677.726118,1145.44565 L677.726118,1032.39153 L338.789647,1032.39153 L338.789647,1145.44565 Z M112.941176,580.705882 L1129.41176,580.705882 L1129.41176,1371.40706 L710.4,1371.40706 L451.651765,1631.05882 L451.651765,1371.40706 L112.941176,1371.40706 L112.941176,580.705882 Z"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="1"
        />
      </svg>
    ),
  };
  let assignmentIcon = icon.assignment;
  if (assignment.is_quiz_assignment) {
    assignmentIcon = icon.quiz;
  } else if ('discussion_topic' in assignment) {
    assignmentIcon = icon.discussion;
  }
  return (
    <TaskContainer onClick={onClick}>
      <div className="task-left" style={TaskLeftStyle}>
        {assignmentIcon}
      </div>
      <TaskInfo>
        <div style={CourseNameStyle}>{assignment.course_code}</div>
        <TaskLink href={assignment.html_url}>{assignment.name}</TaskLink>
        {`${parseFloat(
          assignment.points_possible
        )} points \xa0|\xa0 ${due_date} at ${due_time}`}
      </TaskInfo>
    </TaskContainer>
  );
}

TaskLink.displayName = 'TaskLink';

Task.propTypes = {
  assignment: PropTypes.shape({
    color: PropTypes.string,
    html_url: PropTypes.string,
    name: PropTypes.string,
    points_possible: PropTypes.number,
    due_at: PropTypes.string,
    course_id: PropTypes.number,
    id: PropTypes.number,
    user_submitted: PropTypes.bool,
    is_quiz_assignment: PropTypes.bool,
    course_code: PropTypes.string,
  }).isRequired,
};
