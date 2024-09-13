import moment from 'moment';
import { Fam } from '../model/fam';
import { Info } from '../model/info';

export const DATE: string = moment('2024-07-17').format('YYYY-MM-DD').toString();
export const YebinFam: Fam = {
  id: '1',
  name: '예빈팸',
  cellArr: ['11', '12'],
};

export const total: Info[] = [
  {
    id: '1',
    famId: '1',
    famName: '예빈팸',
    cellId: '11',
    cellName: '예나셀',
    name: '최예나',
    date: '2024-07-17',
    content: [
      '오늘 말씀을 기억하며 하나님과 동행하는 취준 기간이 되도록',
      '동생이 군대에서 하나님을 만날 수 있기를',
    ],
  },
  {
    id: '2',
    name: '김예진',
    famId: '1',
    famName: '예빈팸',
    cellId: '11',
    cellName: '예나셀',
    date: '2024-07-17',
    content: [
      '알바를 시작했는데, 취준과 병행할 수 있도록 체력을 허락하시길',
      '인턴십 결과가 어떻든 모든 과정을 지혜롭게 기도로 준비하길',
      '동생이 7월에 태국 선교를 가는데, 여러 일이 겹쳐 교회에 회의감이 생기는 중임. 마음 어렵지 않고 잘 준비해서 주어진 사역을 잘 마무리하길. ',
    ],
  },
  {
    id: '3',
    name: '이하형',
    famId: '1',
    famName: '예빈팸',
    cellName: '하형셀',
    cellId: '12',
    date: '2024-07-17',
    content: [
      '아버지 가게 일을 돕고있는데, 가게의 모든 상황과 체력 지켜주시기를',
      '대학원과 취업을 고민하는 과정 중에 있어요. 다음주에 교수님과 면담을 하게되는데, 지혜 허락해주시기를',
    ],
  },
  {
    id: '4',
    name: '서지혜',
    famId: '1',
    famName: '예빈팸',
    cellId: '12',
    cellName: '하형셀',
    date: '2024-07-17',
    content: [
      '일본 전공연수를 앞두고 지진으로 인한 우려가 많은데, 모든 상황과 결과 맡겨드리기를. 무엇보다도 그 땅을 위해 기도하는 마음 허락하시기를',
      '이번주 있을 모든 만남 가운데 이웃을 섬길 수 있는 에너지 허락하시기를',
    ],
  },
  {
    id: '5',
    name: '박예나',
    famId: '1',
    famName: '예빈팸',
    cellId: '11',
    cellName: '예나셀',
    date: '2024-07-24',
    content: [
      '새로운 기도제목1',
      '말씀울 읽어야겠다는 생각을 하는데, 개인신앙 생활도 잘 챙길 수 있길. 특히 큐티 !',
      '고민(걱정)하고 있는 것들이 하나님 안에서 잘 해결되고 순종할 수 있길.',
    ],
  },
  {
    id: '6',
    name: '이은결',
    famId: '1',
    famName: '예빈팸',
    cellId: '12',
    cellName: '하형셀',
    date: '2024-07-24',
    content: ['새로운1 기도제목1', '새로운2 기도제목2', '힘듦을 이겨낼 사랑의 마음을 부어주시길.'],
  },
];
