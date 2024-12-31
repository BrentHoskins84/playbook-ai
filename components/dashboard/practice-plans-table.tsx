export function PracticePlansTable() {
  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>PAGE NAME</th>
          <th>VISITORS</th>
          <th>UNIQUE USERS</th>
          <th>BOUNCE RATE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>/argon/</td>
          <td>4,569</td>
          <td>340</td>
          <td>46.53%</td>
        </tr>
        <tr>
          <td>/argon/index.html</td>
          <td>3,985</td>
          <td>319</td>
          <td>46.53%</td>
        </tr>
        <tr>
          <td>/argon/charts.html</td>
          <td>3,513</td>
          <td>294</td>
          <td>36.49%</td>
        </tr>
        <tr>
          <td>/argon/tables.html</td>
          <td>2,050</td>
          <td>147</td>
          <td>50.87%</td>
        </tr>
        <tr>
          <td>/argon/profile.html</td>
          <td>1,795</td>
          <td>190</td>
          <td>46.53%</td>
        </tr>
      </tbody>
    </table>
  );
}
