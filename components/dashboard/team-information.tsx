export function TeamInformation() {
  const data = [
    { referral: "Facebook", visitors: "1,480", percentage: 60 },
    { referral: "Local", visitors: "5,480", percentage: 70 },
    { referral: "Google", visitors: "4,807", percentage: 80 },
    { referral: "Instagram", visitors: "3,678", percentage: 75 },
    { referral: "Twitter", visitors: "2,645", percentage: 30 },
  ];

  return (
    <table className="dashboard-table">
      <thead>
        <tr>
          <th>REFERRAL</th>
          <th>VISITORS</th>
          <th className="text-right">PERCENTAGE</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.referral}>
            <td>{item.referral}</td>
            <td>{item.visitors}</td>
            <td className="text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="w-24 bg-white/10 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-blue-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span>{item.percentage}%</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
