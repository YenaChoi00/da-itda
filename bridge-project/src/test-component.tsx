import { useEffect } from 'react';
import { getTest } from './lib/firestore'; // Adjust the path based on your project structure

const TestComponent = () => {
  useEffect(() => {
    // Call the getTest function when the component mounts
    getTest()
      .then(() => {
        console.log('데이터 fetch 성공');
      })
      .catch((error) => {
        console.error('데이터 fetching 오류 발생: ', error);
      });
  }, []); // The empty array ensures this runs once when the component mounts

  return <div>Check the console for Firestore data</div>;
};

export default TestComponent;
