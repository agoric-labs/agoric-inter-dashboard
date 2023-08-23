const datasetId = () => process.env.DATASET_ID;

exports.datasetId = datasetId;

const suffix = (s, v) => v ? `${s}${v}` : '';

const windowMeasure = (measure, dimensions) => {
  let partition = '';

  if (dimensions.length > 0) {
    partition = `partition by ${dimensions.map(name => `sd.${name}`)}`;
  }

  return `last_value(${measure} ignore nulls) over (${partition} order by day asc) as ${measure}`;
};

// The dailySQL helper function constructs a SQL query to aggregate data daily, based on provided
// measures, dimensions, and base SQL logic. It fills day gaps from min(day) to current_date().
// baseSQL must returns height as a first column for join times + measures + dimensions
// Example:
//   select cast(height as int) as height
//        , split(path, '.')[3] as coin
//        , cast(json_value(body, '$.mintedPoolBalance.__value') as float64) / pow(10, 6) as  minted_pool_balance
//     from agoric_mainnet_own.storage
//    where path like 'published.psm.%.metrics'
exports.dailySQL = (measures, dimensions, baseSQL) => {
  const groupBy = Array.apply(null, Array(dimensions.length)).map((_, n) => `${n + 2}`).join(', ');

  return `
    with base_rows as (
      ${baseSQL}
      order by 1 desc
    ), rows_by_days as (
      select date_trunc(block_time, day) day
           ${suffix(', ', dimensions.join(', '))}
           , ${measures.map(name => `array_agg(${name} order by block_time desc)[0] as ${name}`).join('\n         , ')}
        from base_rows g
       group by 1${suffix(', ', groupBy)}
    ), start_days as (
      select min(day) as min_day
          ${suffix(', ', dimensions.join(', '))}
        from rows_by_days
       ${suffix('group by ', groupBy)}
    )
    select day
         ${suffix(', ', dimensions.map(name => `sd.${name}`).join(', '))}
         , ${measures.map(name => windowMeasure(name, dimensions)).join('\n         , ')}
      from start_days sd, unnest(generate_timestamp_array(min_day, current_timestamp(), interval 1 day)) day
      left join rows_by_days g on g.day = day ${suffix('and ', dimensions.map(name => `g.${name} = sd.${name}`).join(' and '))}
  `;
};
