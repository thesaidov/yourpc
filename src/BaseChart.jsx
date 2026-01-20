import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
} from 'recharts';


export function BaseChart(props) {
  return (
    <ResponsiveContainer width={'100%'} height={'100%'} >
      <AreaChart data={props.data}>
        <CartesianGrid stroke="#3f3e3eb9" strokeDasharray="5 5" fill="#000000" />
        <Area
          fillOpacity={0.3}
          fill={props.fill}
          stroke={props.stroke}
          strokeWidth={3}
          type="monotone"
          dataKey="value"
          isAnimationActive={false}
        />
        <XAxis stroke="transparent" height={0} />
        <YAxis domain={[0, 100]} stroke="transparent" width={0} />
      </AreaChart>
    </ResponsiveContainer>
  );
}