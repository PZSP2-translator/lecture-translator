import React, { useState, useEffect } from 'react';

const DataComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className='Margin'>
      <table style={{ width: '100%' }}>
      <tbody>
      {data.map((course) => (
        <tr key={course.course_id}>
        <td>
          {course.name}
        </td>
        <td>
          {course.code}
        </td>
        </tr>
      ))}
      </tbody>
      </table>
    </div>
  );
};

export default DataComponent;
