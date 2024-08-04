import moment from 'moment';
import { Info } from '../model/info';

export const DATE: string = moment('2024-07-17').format('YYYY-MM-DD').toString();
export const data: Info[] = [
  {
    id: 1,
    name: '최예나',
    date: '2024-07-17',
    content: [
      '오늘 말씀을 기억하며 하나님과 동행하는 취준 기간이 되도록',
      '동생이 군대에서 하나님을 만날 수 있기를',
    ],
  },
  {
    id: 2,
    name: '서지혜',
    date: '2024-07-17',
    content: [
      '알바를 시작했는데, 취준과 병행할 수 있도록 체력을 허락하시길',
      '준비할 것도 많고, 막막한 취준이지만 그렇기에 더 철저히 하나님을 붙잡고 가는 기간이 되길',
      '가족들을 위한 중보를 할 때, 무거운 마음이 아니라 맡겨드리는 마음이 되길.힘듦을 이겨낼 사랑의 마음을 부어주시길.',
    ],
  },
  {
    id: 3,
    name: '박예나',
    date: '2024-07-24',
    content: ['새로운 기도제목1', '새로운 기도제목2', '힘듦을 이겨낼 사랑의 마음을 부어주시길.'],
  },
];
