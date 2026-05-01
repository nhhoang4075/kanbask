function replaceQueryParams(query, values) {
  let replacedQuery = query;
  values.forEach((tmpParameter) => {
    if (typeof tmpParameter === "string") {
      replacedQuery = replacedQuery.replace("?", `'${tmpParameter}'`);
    } else {
      replacedQuery = replacedQuery.replace("?", tmpParameter);
    }
  });
  return replacedQuery;
}

// async function executeQuery(text, values, normalize = false) {
//   if (normalize) return await db.raw(replaceQueryParams(text, values));
//   return await db.raw(text, values);
// }

// await db.raw("SELECT 1");

// let s = performance.now();

// const query_1 = await executeQuery("SELECT * from users LIMIT ?", [5]);

// console.log(performance.now() - s);

// s = performance.now();

// const query_2 = await executeQuery("SELECT * from users LIMIT ?", [5], true);

// console.log(performance.now() - s);
